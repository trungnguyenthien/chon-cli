import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import chalk from 'chalk';

export async function changeDpi(inputPath, newDpi) {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(chalk.red('Error: Input file does not exist'));
      process.exit(1);
    }

    // Validate DPI value
    const dpi = parseInt(newDpi);
    if (isNaN(dpi) || dpi <= 0) {
      console.error(chalk.red('Error: DPI must be a positive number'));
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
      [chalk.yellow('Input file'), inputPath],
      [chalk.yellow('Original DPI'), originalDpi],
      [chalk.yellow('New DPI'), dpi],
      [chalk.yellow('Output file'), outputPath]
    );

    // Print table
    console.log('\n' + table.toString());
    console.log(chalk.yellow('\nNote: The image dimensions remain unchanged. Only the DPI metadata has been modified.'));

  } catch (error) {
    console.error(chalk.red('Error changing DPI:'), error.message);
    process.exit(1);
  }
} 