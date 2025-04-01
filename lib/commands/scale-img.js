import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff', 'webp'];

function parseSizePattern(pattern) {
  const [width, height] = pattern.split('-').map(part => {
    if (part === 'x') return null;
    const num = parseInt(part);
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid size pattern. Numbers must be positive.');
    }
    return num;
  });

  if (width === null && height === null) {
    throw new Error('Invalid size pattern. At least one dimension must be specified.');
  }

  return { width, height };
}

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  return SUPPORTED_FORMATS.includes(ext);
}

export async function scaleImage(dirPath, sizePattern) {
  try {
    // Validate directory exists
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.error('Error: Directory does not exist');
      process.exit(1);
    }

    // Parse size pattern
    const { width, height } = parseSizePattern(sizePattern);

    // Get all files in directory
    const files = fs.readdirSync(dirPath);
    let processedCount = 0;

    // Process each file
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      // Skip if not a file or not an image
      if (!fs.statSync(filePath).isFile() || !isImageFile(filePath)) {
        continue;
      }

      try {
        // Get original metadata
        const metadata = await sharp(filePath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;

        // Calculate new dimensions while maintaining aspect ratio
        let newWidth = width;
        let newHeight = height;

        if (width && height) {
          // Fit within bounds while maintaining aspect ratio
          const ratio = Math.min(width / originalWidth, height / originalHeight);
          newWidth = Math.round(originalWidth * ratio);
          newHeight = Math.round(originalHeight * ratio);
        } else if (width) {
          // Scale by width
          newHeight = Math.round((originalHeight * width) / originalWidth);
        } else if (height) {
          // Scale by height
          newWidth = Math.round((originalWidth * height) / originalHeight);
        }

        // Create output filename
        const ext = path.extname(file);
        const name = path.parse(file).name;
        const outputPath = path.join(dirPath, `${name}_${newWidth}x${newHeight}${ext}`);

        // Resize image
        await sharp(filePath)
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFile(outputPath);

        console.log(`Scaled ${file}: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
        processedCount++;
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    if (processedCount === 0) {
      console.log('No image files found in the specified directory.');
    } else {
      console.log(`\nSuccessfully processed ${processedCount} image(s).`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
} 