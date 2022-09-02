import winston from 'winston';
import { format, transports } from 'winston';

export const logger = winston.createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
});
