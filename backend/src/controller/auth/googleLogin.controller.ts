import { Request, Response } from "express";
import prisma from "../../../prisma";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export async function googleLoginController(req:Request, res:Response) {
  if (!req.user) {
    res.status(500).json({message:"something went wrong",success:false})
    return
  }  
  const accessToken = jwt.sign(
      {
        id: req.user.id ,
        email: req.user.email,
        name: req.user.name,
      },
      process.env.JWT_ACCESS_SECRET||"your secret access key",
      {
        expiresIn: "15m"
      }
    );
    const refreshToken = jwt.sign(
      {
        id: req.user.id ,
        email: req.user.email,
        name: req.user.name,
      },
      process.env.JWT_REFRESH_SECRET||"your secret refresh key",
      {
        expiresIn: "30d"
      }
    )
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    try {
      prisma.user.update({
        where: {
          id: req.user.id
        },
        data: {
          refreshToken: hashedRefreshToken
        }
      })
    res.cookie("accessToken", accessToken, {
    httpOnly: true,
      secure: process.env.ENV === "production",
      domain: process.env.DOMAIN
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.ENV === "production",
      domain: process.env.DOMAIN
    }); 
    res.redirect(process.env.CLIENT_URL!)
    return 
    } catch (error) {
     res.status(500).json({
        message:"something went wrong", success:false, error})
        return 
    }
  }