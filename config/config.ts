import { AppConfig } from './config.interface';

export const appConfiguration = (): AppConfig => ({
  port: parseInt(process.env.CRM_PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  frontend: process.env.FRONTEND_HOST,
  fileServer: process.env.FILE_SERVER,
  mode: process.env.MODE || 'PROD',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  meili: {
    host: process.env.MEILI_HOST,
    key: process.env.MEILI_MASTER_KEY,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_APP,
  },
});
