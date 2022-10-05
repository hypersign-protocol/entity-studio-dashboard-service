import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';
import ApiResponse from "../response/apiResponse";

export function validateRequestSchema(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(ApiResponse.badRequest(null, errors.array()))
    }
    next();
}