#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { convertImage } from '../lib/commands/convert-img.js';
import { checkDpi } from '../lib/commands/check-dpi.js';
import { changeDpi } from '../lib/commands/change-dpi.js';
import { scaleImage } from '../lib/commands/scale-img.js';
import { formalImage } from '../lib/commands/formal-img.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('chon')
  .description('CHON-CLI tool')
  .version(packageJson.version);

program
  .command('convert-img <input> <format>')
  .description('Convert image to another format')
  .option('-b, --background <color>', 'Background color for transparent areas (hex format, e.g. 0xffffff)', '0xffffff')
  .action((input, format, options) => {
    convertImage(input, format, options.background);
  });

program
  .command('check-dpi')
  .description('Check DPI and image information')
  .argument('<input>', 'input image file path')
  .action(checkDpi);

program
  .command('change-dpi')
  .description('Change image DPI value')
  .argument('<input>', 'input image file path')
  .argument('<dpi>', 'new DPI value (e.g., 300)')
  .action(changeDpi);

program
  .command('scale-img')
  .description('Scale all images in a directory')
  .argument('<directory>', 'directory containing images')
  .argument('<size>', 'size pattern (e.g., 400-x, x-600, 400-600)')
  .action(scaleImage);

program
  .command('formal-img')
  .description('Check and fix image requirements')
  .requiredOption('-dpi <number>', 'Minimum DPI required')
  .requiredOption('-mm <number>', 'Minimum size in millimeters')
  .argument('<images...>', 'Image files to process')
  .action((images, options) => {
    console.log('\n=== Raw Parameters ===');
    console.log('options:', options);
    console.log('options.Dpi:', options.Dpi, 'Type:', typeof options.Dpi);
    console.log('options.Mm:', options.Mm, 'Type:', typeof options.Mm);
    console.log('images:', images, 'Type:', typeof images);
    console.log('Number of images:', images.length);
    
    const minDpi = parseInt(options.Dpi, 10);
    const minSizeMm = parseFloat(options.Mm);
    
    console.log('\n=== Parsed Parameters ===');
    console.log('minDpi:', minDpi, 'Type:', typeof minDpi);
    console.log('minSizeMm:', minSizeMm, 'Type:', typeof minSizeMm);
    console.log('=====================\n');
    
    if (isNaN(minDpi) || isNaN(minSizeMm)) {
      console.error(chalk.red('Error: DPI and size must be valid numbers'));
      process.exit(1);
    }
    
    formalImage(minDpi, minSizeMm, images);
  });

program.parse(); 