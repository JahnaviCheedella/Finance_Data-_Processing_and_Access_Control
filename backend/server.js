import app from './src/app.js';
import { ENV } from './src/config/env.js';

const startServer = async () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
