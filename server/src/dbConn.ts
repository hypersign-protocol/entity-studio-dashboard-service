import mongoose from 'mongoose';
import { dbConnUrl, logger } from './config';

function closeConnection() {
  return mongoose.connection.close();
}

function openConnection() {
  return new Promise((resolve, reject) => {
    logger.info('Trying to connect to db server url ' + dbConnUrl);
    if (dbConnUrl) {
      mongoose.connect(dbConnUrl, (err) => {
        if (err) {
          reject('Error: could not connect to mongo database. Conn URL = ' + dbConnUrl);
        } else {
          resolve('Successfully opened connection to mongo database');
        }
      });
    } else {
      reject('dbConnUrl is null or empty');
    }
  });
}

export default {
  openConnection,
  closeConnection,
};
