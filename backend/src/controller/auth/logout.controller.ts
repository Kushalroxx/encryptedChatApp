import { Request, Response } from "express";

export const logoutController = async(req:Request,res:Response)=>{
    res.clearCookie("accessToken",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",domain:process.env.DOMAIN})
    res.clearCookie("refreshToken",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",domain:process.env.DOMAIN})
    res.status(200).json({message:"logged out successfully",success:true})
}