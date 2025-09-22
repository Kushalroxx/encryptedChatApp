import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req:Request, res:Response, next:NextFunction)=>{
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken ||!refreshToken) {
        res.status(401).json({message:"unautharised",success:false})
    }
    // middleware logic
}