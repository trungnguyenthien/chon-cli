import sharp from 'sharp';
import fs from 'fs';
import Table from 'cli-table3';
import chalk from 'chalk';

export async function checkDpi(inputPath) {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(chalk.red('Error: Input file does not exist'));
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
    
    // Create table
    const table = new Table({
      head: [chalk.cyan('Property'), chalk.cyan('Value')],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    // Add rows to table
    table.push(
      [chalk.yellow('File'), inputPath],
      [chalk.yellow('Dimensions'), `${width}x${height} pixels`],
      [chalk.yellow('DPI'), `${dpiX}x${dpiY}`],
      [chalk.yellow('Format'), metadata.format.toUpperCase()]
    );
    
    // Print table
    console.log('\n' + table.toString());
    
    if (dpiX === 'Not specified') {
      console.log(chalk.yellow('\nNote: DPI information is not available in this image file.'));
    }
  } catch (error) {
    console.error(chalk.red('Error checking DPI:'), error.message);
    process.exit(1);
  }
} 