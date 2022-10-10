import { whitelistedCors, logger } from '../config';
export function corsOptionsDelegate(req, callback) {
  let corsOptions;
  let message;
  if (whitelistedCors.indexOf(req.header('Origin')) !== -1) {
    message = null;
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    message = new Error('This is CORS-enabled for a whitelisted domain.');
    corsOptions = { origin: false }; // disable CORS for this request
  }
  logger.info(req.header('Origin'));
  callback(message, corsOptions); // callback expects two parameters: error and options
}
