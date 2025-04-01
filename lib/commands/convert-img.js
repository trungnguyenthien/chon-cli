import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

function parseHexColor(hexColor) {
  // Remove 0x prefix if present and ensure 6 digits
  const hex = hexColor.replace('0x', '').padStart(6, '0');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Validate RGB values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid hex color format. Use format: 0xRRGGBB');
  }
  
  return { r, g, b };
}

export async function convertImage(inputPath, outputFormat, backgroundColor = '0xffffff') {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Error: Input file does not exist');
      process.exit(1);
    }

    // Get the directory and filename of input
    const inputDir = path.dirname(inputPath);
    const inputFileName = path.parse(inputPath).name;
    
    // Create output path in the same directory
    const outputPath = path.join(inputDir, `${inputFileName}.${outputFormat}`);

    // Get original metadata including DPI
    const metadata = await sharp(inputPath).metadata();
    const originalDpi = metadata.density;

    // Convert the image while preserving DPI
    const sharpInstance = sharp(inputPath);
    
    // If original DPI exists, preserve it
    if (originalDpi) {
      sharpInstance.withMetadata({ density: originalDpi });
    }

    try {
      // Parse and validate background color
      const bgColor = parseHexColor(backgroundColor);
      
      // Add background color for formats that don't support transparency
      if (outputFormat.toLowerCase() === 'jpg' || outputFormat.toLowerCase() === 'jpeg') {
        sharpInstance.flatten({ background: bgColor });
      }
    } catch (colorError) {
      console.error('Warning:', colorError.message);
      console.log('Using default white background (0xffffff)');
      // Use default white background
      if (outputFormat.toLowerCase() === 'jpg' || outputFormat.toLowerCase() === 'jpeg') {
        sharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
      }
    }

    // Convert to new format
    await sharpInstance
      .toFormat(outputFormat)
      .toFile(outputPath);

    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
    if (originalDpi) {
      console.log(`Preserved original DPI: ${originalDpi}`);
    } else {
      console.log('Note: Original image did not have DPI information');
    }
  } catch (error) {
    console.error('Error converting image:', error.message);
    process.exit(1);
  }
} 