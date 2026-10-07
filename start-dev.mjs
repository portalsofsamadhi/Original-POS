import { spawn } from 'child_process';
import chalk from 'chalk';

// Start Vite dev server
const viteProcess = spawn('npm', ['run', 'dev'], { shell: true });
const webpackProcess = spawn('npm', ['run', 'dev:booking'], { shell: true });

console.log(chalk.blue('Starting Vite and Webpack dev servers...'));

function setupProcessLogging(process, name, color) {
  process.stdout.on('data', (data) => {
    console.log(color(`[${name}] ${data}`));
  });
  
  process.stderr.on('data', (data) => {
    console.error(chalk.red(`[${name} ERROR] ${data}`));
  });
  
  process.on('close', (code) => {
    console.log(color(`[${name}] process exited with code ${code}`));
    // Exit if either process exits
    process.exit(code);
  });
}

setupProcessLogging(viteProcess, 'VITE', chalk.green);
setupProcessLogging(webpackProcess, 'WEBPACK', chalk.blue);

// Handle termination signals
process.on('SIGINT', () => {
  console.log(chalk.yellow('Terminating Vite and Webpack processes...'));
  viteProcess.kill();
  webpackProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('Terminating Vite and Webpack processes...'));
  viteProcess.kill();
  webpackProcess.kill();
  process.exit(0);
});
