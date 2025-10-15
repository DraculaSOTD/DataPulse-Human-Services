module.exports = {
  apps: [
    {
      // Backend API Server
      name: 'datapulseai-backend',
      script: './server/index.js',
      cwd: '/srv/http/datapulseai',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Use PM2 default log locations (~/.pm2/logs/)
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Restart strategy
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
