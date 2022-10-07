import { logger } from '../config';

const send = async (res, func, id, timer, DELAY, STOP, log, func2?) => {
  try {
    timer = timer + DELAY;
    const data = await func(id);

    if (data) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);

      if (data.status === 'Registered') {
        timer = 0;
        logger.info(`===========${log} SSE:: Ends================`);
        return;
      }
      if (timer > STOP || timer === STOP) {
        logger.info('timer', timer);

        if (data.status !== 'Registered') {
          logger.info(`===========${log} SSE:: Ends================`);
          data.status = 'Failed';

          if (typeof func2 === 'function') {
            const data2 = await func2(id);

            res.write(`data: ${JSON.stringify(data2)}\n\n`);
            return;
          } else {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            return;
          }
        }
      }
      setTimeout(() => {
        send(res, func, id, timer, DELAY, STOP, log, func2);
      }, DELAY);

      return;
    }
  } catch (error) {
    logger.error(`===========${log} SSE:: Ends================`);

    return res.end();
  }
};

export { send };
