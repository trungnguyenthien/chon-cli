import sharp from 'sharp';
import fs from 'fs';

export async function checkDpi(inputPath) {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Error: Input file does not exist');
      process.exit(1);
    }

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Extract DPI information
    const dpiX = metadata.density || 'Not specified';
    const dpiY = metadata.density || 'Not specified';
    
    // Get image dimensions
    const width = metadata.width;
    const height = metadata.height;
    
    // Print information
    console.log('\nImage Information:');
    console.log('-----------------');
    console.log(`File: ${inputPath}`);
    console.log(`Dimensions: ${width}x${height} pixels`);
    console.log(`DPI: ${dpiX}x${dpiY}`);
    console.log(`Format: ${metadata.format}`);
    
    if (dpiX === 'Not specified') {
      console.log('\nNote: DPI information is not available in this image file.');
    }
  } catch (error) {
    console.error('Error checking DPI:', error.message);
    process.exit(1);
  }
} 