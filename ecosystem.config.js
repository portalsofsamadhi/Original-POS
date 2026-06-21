module.exports = {
  apps: [
    {
      name: 'pos-website',
      script: 'npm',
      args: 'run preview',
      cwd: './dist',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4173
      },
      error_file: './logs/pos-website-error.log',
      out_file: './logs/pos-website-out.log',
      log_file: './logs/pos-website-combined.log',
      time: true
    },
    {
      name: 'newsletter-api',
      script: 'newsletter-server.ts',
      interpreter: 'npx',
      interpreter_args: 'ts-node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/newsletter-error.log',
      out_file: './logs/newsletter-out.log',
      log_file: './logs/newsletter-combined.log',
      time: true
    }
  ]
};
