import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function convertImage(inputPath, outputFormat) {
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

    // Add white background for formats that don't support transparency
    if (outputFormat.toLowerCase() === 'jpg' || outputFormat.toLowerCase() === 'jpeg') {
      sharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
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