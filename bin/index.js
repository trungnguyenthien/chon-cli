#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { convertImage } from '../lib/commands/convert-img.js';
import { checkDpi } from '../lib/commands/check-dpi.js';
import { changeDpi } from '../lib/commands/change-dpi.js';
import { scaleImage } from '../lib/commands/scale-img.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('chon')
  .description('CHON-CLI tool')
  .version(packageJson.version);

program
  .command('convert-img')
  .description('Convert image to different format')
  .argument('<input>', 'input image file path')
  .argument('<format>', 'output format (png, jpg, gif, tiff, etc.)')
  .action(convertImage);

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

program.parse(); 