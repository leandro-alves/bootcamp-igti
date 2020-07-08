import express from 'express';
import fs from 'fs';
import { promisify } from 'util';
import winston from 'winston';
import gradesRouter from './routes/grades.js';

const app = express();
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.fileName = 'grades.json';

app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/grade', gradesRouter);

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-control-api.log' }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

app.listen(3000, async () => {
  try {
    const fileExists = await exists(global.fileName);
    if (!fileExists) {
      const initialJson = {
        nextId: 1,
        grades: [],
      };
      await writeFile(global.fileName, JSON.stringify(initialJson));
    }
  } catch (err) {
    log.error(err);
  }
  log.info('API started!');
});
