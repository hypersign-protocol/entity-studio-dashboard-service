import { NextFunction, Request, Response } from "express";
import { logger } from "../config"
import { validationResult } from 'express-validator';
import ApiResponse from "../response/apiResponse";

export function validateRequestSchema(req: Request, res: Response, next: NextFunction){
logger.info('validateRequestSchema middleware starts...')
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(ApiResponse.badRequest(null, errors.array()))
    }
    next();
}