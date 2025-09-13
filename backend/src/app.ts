import express from "express";
import passport from "passport";
import "./lib/passportConfig";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import prisma from "../prisma";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());



app.get('/api/auth/google',
  passport.authenticate('google', { scope: ["email",'profile'] }));

app.get('/api/auth/callback/google', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    const accessToken = jwt.sign(
      {
        id: req.user?.id ,
        email: req.user?.email,
        name: req.user?.name,
      },
      process.env.JWT_ACCESS_SECRET||"your secret access key",
      {
        expiresIn: "1d"
      }
    );
    const refreshToken = jwt.sign(
      {
        id: req.user?.id ,
        email: req.user?.email,
        name: req.user?.name,
      },
      process.env.JWT_REFRESH_SECRET||"your secret refresh key",
      {
        expiresIn: "30d"
      }
    )
    try {
      prisma.user.update({
        where: {
          id: req.user?.id
        },
        data: {
          refreshToken
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
    } catch (error) {
      
    }
    

  });

app.get("/", (req, res) => {
    res.send("Hello World!");
});
 
export default app