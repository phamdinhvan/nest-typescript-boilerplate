module.exports = {
  apps: [
    {
      name: 'nest-boilerplate-gateway',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 4,
      autorestart: true,
      time: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
