require('dotenv').config();

const app = require('./src/app');
const db = require('./src/config/db');

const startServer = async () => {
  try {
    await db();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
