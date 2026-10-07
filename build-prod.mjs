import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

console.log(chalk.blue('Starting production build process...'));

// Step 1: Build the main Vite application
console.log(chalk.yellow('Building Vite application...'));
const viteResult = spawnSync('npm', ['run', 'build-no-errors'], { 
  stdio: 'inherit',
  shell: true 
});

if (viteResult.status !== 0) {
  console.error(chalk.red('Vite build failed'));
  process.exit(1);
}

console.log(chalk.green('Vite build completed successfully'));

// Step 2: Build the Webpack booking application
console.log(chalk.yellow('Building Webpack booking application...'));
const webpackResult = spawnSync('npm', ['run', 'build:booking'], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'production' }
});

if (webpackResult.status !== 0) {
  console.error(chalk.red('Webpack build failed'));
  process.exit(1);
}

console.log(chalk.green('Webpack build completed successfully'));

// Step 3: Copy Webpack build output to Vite dist folder
console.log(chalk.yellow('Copying Webpack build to Vite dist folder...'));

// Create the booking directory in the Vite dist folder
const bookingDistDir = path.join('dist', 'booking');
if (!fs.existsSync(bookingDistDir)) {
  fs.mkdirSync(bookingDistDir, { recursive: true });
}

// Copy files from Webpack dist to Vite dist
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(chalk.red(`Source directory not found: ${src}`));
    return false;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(chalk.gray(`Copied: ${destPath}`));
    }
  }
  
  return true;
}

if (copyDir(path.join('dist', 'booking'), bookingDistDir)) {
  console.log(chalk.green('All files copied successfully'));
} else {
  console.error(chalk.red('Failed to copy some files'));
  process.exit(1);
}

console.log(chalk.blue('Production build completed!'));
console.log(chalk.green('The complete application is available in the dist folder.'));
