import express from "express";
import passport from "passport";
import "./lib/passportConfig";
import cookieParser from "cookie-parser";
import { googleLoginController } from "./controller/googleLogin.controller";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());


app.get('/api/auth/google',
  passport.authenticate('google', { scope: ["email",'profile'] }));

app.get('/api/auth/callback/google', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),googleLoginController);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
 
export default app