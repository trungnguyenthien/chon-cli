import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function changeDpi(inputPath, newDpi) {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Error: Input file does not exist');
      process.exit(1);
    }

    // Validate DPI value
    const dpi = parseInt(newDpi);
    if (isNaN(dpi) || dpi <= 0) {
      console.error('Error: DPI must be a positive number');
      process.exit(1);
    }

    // Get original metadata
    const metadata = await sharp(inputPath).metadata();
    const originalDpi = metadata.density || 'Not specified';

    // Get the directory and filename of input
    const inputDir = path.dirname(inputPath);
    const inputFileName = path.parse(inputPath).name;
    const inputExt = path.extname(inputPath);
    
    // Create output path in the same directory
    const outputPath = path.join(inputDir, `${inputFileName}_${dpi}dpi${inputExt}`);

    // Change DPI and save the image
    await sharp(inputPath)
      .withMetadata({ density: dpi })
      .toFile(outputPath);

    // Print information
    console.log('\nDPI Change Information:');
    console.log('----------------------');
    console.log(`Input file: ${inputPath}`);
    console.log(`Original DPI: ${originalDpi}`);
    console.log(`New DPI: ${dpi}`);
    console.log(`Output file: ${outputPath}`);
    console.log('\nNote: The image dimensions remain unchanged. Only the DPI metadata has been modified.');

  } catch (error) {
    console.error('Error changing DPI:', error.message);
    process.exit(1);
  }
} 