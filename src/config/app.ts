import dotenv from 'dotenv';
dotenv.config();
const config = {
  debug: process.env.DEBUG === 'true',
  port: Number(process.env.PORT) || 8000,
  saltRound: Number(process.env.SALT_ROUND) || 10,
  jwtSecret: process.env.JWT_SECRET || 'secret-key',
  secretKey: process.env.SECRET_KEY,
};

export default config;
