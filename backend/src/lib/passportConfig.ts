import passport from "passport"; 
import google from "passport-google-oauth20"; 
import prisma from "../../prisma"; 
import "dotenv/config"; 
import RedisStore from "./oAuthStateStore";

const GoogleStrategy = google.Strategy; 

passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID || "", 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", 
    callbackURL: `${process.env.HOST_URL}/api/auth/callback/google`,
    state: true,
    store:RedisStore,
     passReqToCallback: true 
    }, async function (request, accessToken, refreshToken, profile, done) { 
        if (!profile.emails) { 
            return done(null, false); 
        } 
        try {
            const existedUser = await prisma.user.findFirst({ 
                where: { 
                    email: profile.emails[0].value 
                } 
            }); 
            if (existedUser) { 
                return done(null, existedUser); 
            } 
            
            const user = await prisma.user.create({ 
                data: { 
                    email: profile.emails[0].value, 
                    name: profile.displayName, 
                    image: profile.photos && profile.photos[0].value 
                } 
            }); 
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));