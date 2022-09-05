import { logger } from "../config";


const send = async (res, func ,id, timer,DELAY,STOP,log) => {
    try {
        timer = timer + DELAY;
         const data = await func(id)
         
        if (data) {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            
            

            if (data.status === "Registered") {
                timer = 0;
                logger.info(`===========${log} SSE:: Ends================`)
                return


            }
            if ((timer > STOP) || (timer === STOP)) {
                if (data.status !== "Registered") {
                    logger.info(`===========${log} SSE:: Ends================`)
                    data.status = "Failed"
                    res.write(`data: ${JSON.stringify(data)}\n\n`);
                    return
                }


            }
            setTimeout(() => { send(res, func,id, timer,DELAY,STOP,log) }, DELAY)

            return
        }
    } catch (error) {
        logger.error(`===========${log} SSE:: Ends================`)

        return res.end();
    }
}

export {
    send
}