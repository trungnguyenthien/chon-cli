import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import chalk from 'chalk';

const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'tiff'];

/**
 * Chuyển đổi số pixels sang millimeters dựa trên DPI (Dots Per Inch)
 * 
 * Công thức: mm = (pixels * 25.4) / dpi
 * 
 * Giải thích:
 * 1. 1 inch = 25.4 millimeters (hằng số chuyển đổi)
 * 2. DPI (Dots Per Inch) là số pixels trên mỗi inch
 * 3. Để chuyển từ pixels sang mm:
 *    - Đầu tiên chuyển pixels sang inches: pixels / dpi
 *    - Sau đó chuyển inches sang mm: (pixels / dpi) * 25.4
 *    - Gộp lại thành: (pixels * 25.4) / dpi
 * 
 * Ví dụ:
 * - Nếu ảnh có 300 pixels và DPI = 300
 * - mm = (300 * 25.4) / 300 = 25.4mm
 * 
 * @param {number} pixels - Số pixels cần chuyển đổi
 * @param {number} dpi - Dots Per Inch của ảnh
 * @returns {number} Kích thước tương đương theo millimeters
 */
function pixelsToMm(pixels, dpi) {
  if (!pixels || !dpi) return 0;
  return (pixels * 25.4) / dpi; // Convert pixels to mm using DPI
}

function isImageValid(metadata, minDpi, minSizeMm) {
  const format = metadata.format.toLowerCase();
  const dpi = metadata.density || 72;
  const widthMm = pixelsToMm(metadata.width, dpi);
  const heightMm = pixelsToMm(metadata.height, dpi);

  const isValid = dpi >= minDpi && 
                 SUPPORTED_FORMATS.includes(format) && 
                 widthMm >= minSizeMm && 
                 heightMm >= minSizeMm;

  return {
    isValid,
    format,
    dpi,
    widthMm,
    heightMm
  };
}

async function processImage(imagePath, minDpi, minSizeMm) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const format = metadata.format.toLowerCase();
    const currentDpi = metadata.density || 72;
    const widthMm = pixelsToMm(metadata.width, currentDpi);
    const heightMm = pixelsToMm(metadata.height, currentDpi);
    const isValid = isImageValid(metadata, minDpi, minSizeMm);

    if (isValid.isValid) {
      return {
        status: 'OK',
        message: 'Đã đáp ứng yêu cầu',
        metadata: { ...metadata, widthMm, heightMm }
      };
    }

    let image = sharp(imagePath);
    let changes = [];
    let outputFormat = format;

    // Tăng DPI nếu cần
    if (currentDpi < minDpi) {
      const scaleFactor = minDpi / currentDpi;
      image = image.resize({
        width: Math.round(metadata.width * scaleFactor),
        height: Math.round(metadata.height * scaleFactor),
        fit: 'fill'
      }).withMetadata({ density: minDpi });
      changes.push(`Tăng DPI từ ${currentDpi} lên ${minDpi}`);
    }

    // Chuyển đổi định dạng nếu cần
    if (!SUPPORTED_FORMATS.includes(format)) {
      image = image.png();
      outputFormat = 'png';
      changes.push(`Chuyển đổi từ ${format.toUpperCase()} sang PNG`);
    }

    // Scale ảnh nếu cần
    const newMetadata = await image.metadata();
    const newWidthMm = pixelsToMm(newMetadata.width, minDpi);
    const newHeightMm = pixelsToMm(newMetadata.height, minDpi);
    
    if (newWidthMm < minSizeMm || newHeightMm < minSizeMm) {
      const scaleFactor = Math.max(minSizeMm / newWidthMm, minSizeMm / newHeightMm);
      image = image.resize({
        width: Math.round(newMetadata.width * scaleFactor),
        height: Math.round(newMetadata.height * scaleFactor),
        fit: 'fill'
      }).withMetadata({ density: minDpi });
      changes.push(`Scale ảnh để đạt kích thước tối thiểu ${minSizeMm}mm`);
    }

    // Tạo tên file mới với hậu tố "_fixed"
    const parsedPath = path.parse(imagePath);
    const outputPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}_fixed${outputFormat === format ? parsedPath.ext : '.png'}`
    );

    // Lưu file mới với metadata DPI
    await image.withMetadata({ density: minDpi }).toFile(outputPath);
    
    const finalMetadata = await sharp(outputPath).metadata();
    const finalWidthMm = pixelsToMm(finalMetadata.width, minDpi);
    const finalHeightMm = pixelsToMm(finalMetadata.height, minDpi);

    return {
      status: 'OK',
      message: changes.join(', '),
      metadata: { 
        ...finalMetadata, 
        widthMm: finalWidthMm, 
        heightMm: finalHeightMm,
        dpi: minDpi // Thêm DPI vào metadata trả về
      },
      outputPath
    };
  } catch (error) {
    return {
      status: 'NG',
      message: error.message,
      metadata: null
    };
  }
}

export async function formalImage(minDpi, minSizeMm, imagePaths) {
  // Then validate parameters
  if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) {
    console.error(chalk.red('Error: No image files provided'));
    process.exit(1);
  }

  if (typeof minDpi !== 'number' || typeof minSizeMm !== 'number' || isNaN(minDpi) || isNaN(minSizeMm)) {
    console.error(chalk.red('Error: DPI and size must be valid numbers'));
    process.exit(1);
  }

  const initialTable = new Table({
    head: [
      chalk.cyan('File'),
      chalk.cyan('Format'),
      chalk.cyan('DPI'),
      chalk.cyan('Width (mm)'),
      chalk.cyan('Height (mm)'),
      chalk.cyan('Status'),
      chalk.cyan('Note')
    ],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  const finalTable = new Table({
    head: [
      chalk.cyan('File'),
      chalk.cyan('Format'),
      chalk.cyan('DPI'),
      chalk.cyan('Width (mm)'),
      chalk.cyan('Height (mm)'),
      chalk.cyan('Status'),
      chalk.cyan('Note')
    ],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  let processedCount = 0;
  let successCount = 0;

  for (const imagePath of imagePaths) {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error('File does not exist');
      }

      const metadata = await sharp(imagePath).metadata();
      if (!metadata) {
        throw new Error('Could not read image metadata');
      }

      const format = metadata.format?.toLowerCase() || 'unknown';
      const currentDpi = metadata.density || 72;
      const widthMm = pixelsToMm(metadata.width, currentDpi);
      const heightMm = pixelsToMm(metadata.height, currentDpi);
      const isValid = isImageValid(metadata, minDpi, minSizeMm);
      
      // Add to initial table with color-coded values
      initialTable.push([
        chalk.yellow(imagePath),
        SUPPORTED_FORMATS.includes(format) ? chalk.green(format.toUpperCase()) : chalk.red(format.toUpperCase()),
        currentDpi >= minDpi ? chalk.green(currentDpi.toString()) : chalk.red(currentDpi.toString()),
        widthMm >= minSizeMm ? chalk.green(widthMm.toFixed(2)) : chalk.red(widthMm.toFixed(2)),
        heightMm >= minSizeMm ? chalk.green(heightMm.toFixed(2)) : chalk.red(heightMm.toFixed(2)),
        isValid.isValid ? chalk.green('OK') : chalk.red('NG'),
        isValid.isValid ? '' : getValidationNote(isValid, minDpi, minSizeMm)
      ]);

      if (!isValid.isValid) {
        processedCount++;
        const result = await processImage(imagePath, minDpi, minSizeMm);
        
        if (result.status === 'OK' && result.metadata) {
          successCount++;
          // Add original image status
          finalTable.push([
            chalk.yellow(imagePath),
            SUPPORTED_FORMATS.includes(format) ? chalk.green(format.toUpperCase()) : chalk.red(format.toUpperCase()),
            currentDpi >= minDpi ? chalk.green(currentDpi.toString()) : chalk.red(currentDpi.toString()),
            widthMm >= minSizeMm ? chalk.green(widthMm.toFixed(2)) : chalk.red(widthMm.toFixed(2)),
            heightMm >= minSizeMm ? chalk.green(heightMm.toFixed(2)) : chalk.red(heightMm.toFixed(2)),
            chalk.red('NG'),
            getValidationNote(isValid, minDpi, minSizeMm)
          ]);
          // Add processed image status
          finalTable.push([
            chalk.yellow(result.outputPath),
            chalk.green(result.metadata.format?.toUpperCase() || 'N/A'),
            chalk.green(result.metadata.dpi?.toString() || 'N/A'),
            chalk.green(result.metadata.widthMm?.toFixed(2) || 'N/A'),
            chalk.green(result.metadata.heightMm?.toFixed(2) || 'N/A'),
            chalk.green('OK'),
            result.message
          ]);
        } else {
          finalTable.push([
            chalk.yellow(imagePath),
            chalk.red('N/A'),
            chalk.red('N/A'),
            chalk.red('N/A'),
            chalk.red('N/A'),
            chalk.red('NG'),
            result.message || 'Failed to process image'
          ]);
        }
      } else {
        finalTable.push([
          chalk.yellow(imagePath),
          chalk.green(format.toUpperCase()),
          chalk.green(currentDpi.toString()),
          chalk.green(widthMm.toFixed(2)),
          chalk.green(heightMm.toFixed(2)),
          chalk.green('OK'),
          ''
        ]);
      }
    } catch (error) {
      initialTable.push([
        chalk.yellow(imagePath),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('NG'),
        error.message || 'Unknown error'
      ]);
      finalTable.push([
        chalk.yellow(imagePath),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('N/A'),
        chalk.red('NG'),
        error.message || 'Unknown error'
      ]);
    }
  }

  console.log('\nInitial Status:');
  console.log(initialTable.toString());
  
  if (processedCount > 0) {
    console.log('\nFinal Status:');
    console.log(finalTable.toString());
    console.log(chalk.green(`\nSuccessfully processed ${successCount} out of ${processedCount} images`));
  }
}

function getValidationNote(validation, minDpi, minSizeMm) {
  const notes = [];
  
  if (validation.dpi < minDpi) {
    notes.push(`DPI thấp (${validation.dpi} < ${minDpi})`);
  }
  
  if (!SUPPORTED_FORMATS.includes(validation.format)) {
    notes.push(`Định dạng không hỗ trợ (${validation.format.toUpperCase()})`);
  }
  
  if (validation.widthMm < minSizeMm && validation.heightMm < minSizeMm) {
    notes.push(`Kích thước nhỏ (${validation.widthMm.toFixed(2)}x${validation.heightMm.toFixed(2)}mm < ${minSizeMm}mm)`);
  }
  
  return notes.join(', ');
} 