import winston from 'winston';
import { config } from '../config/index';

const formats = [
  winston.format.timestamp(),
  config.env === 'development' ? winston.format.simple() : winston.format.json()
];

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(...formats),
  transports: [
    new winston.transports.Console()
  ]
});
