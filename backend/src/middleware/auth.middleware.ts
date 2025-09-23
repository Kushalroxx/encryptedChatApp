import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";

export const authMiddleware = async(req:Request, res:Response, next:NextFunction)=>{
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken ||!refreshToken) {
        res.status(401).json({message:"unautharised",success:false})
        return
    }
    try {
        const payload = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET||"your secret access key") as any
        req.user = payload
        next()
        return
    } catch (error) {
        try {
            const payload = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET||"your secret refresh key") as any
            req.user = payload
            const newAccessToken = jwt.sign({id:payload.id},process.env.JWT_ACCESS_SECRET||"your secret access key",{expiresIn:"15m"})
            const newRefreshToken = jwt.sign({id:payload.id},process.env.JWT_REFRESH_SECRET||"your secret refresh key",{expiresIn:"30d"})
            await prisma.user.update({
                where:{id:payload.id},
                data:{refreshToken:newRefreshToken}
            })
            res.cookie("accessToken",newAccessToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:15*60*1000,
                domain:process.env.DOMAIN
            })
            res.cookie("refreshToken",newRefreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:30*24*60*60*1000,
                domain:process.env.DOMAIN
            })
            next()
            return
        } catch (error) {
            res.status(401).json({message:"unautharised",success:false})
        }
    }
}