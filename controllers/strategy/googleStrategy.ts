import passport from 'passport';
import {Strategy as GoogleStrategy, Profile} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { Request, request } from 'express';
import User, { IUSER } from '../../models/User';



dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID : process.env.GOOGLE_CLIENT_ID || '',
    clientSecret : process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL : process.env.GOOGLE_CALLBACK_URL || '',
    passReqToCallback: true
    },
    
    async(req: Request,
        accessToken,
        refreshToken,   // refreshToken use when we want to use only google auth then no need of jwt 
        profile,
        callback:(error:any,  user?:IUSER | false)=>void
    )=>{
        const {emails, name, photos} = profile;
        console.log("Google profile information:", profile);

        try {
                let user = await User.findOne({ email: emails && emails[0].value });
                if(user){
                    if(!user.profilePicture && photos?.[0]?.value){
                        user.profilePicture = photos?.[0]?.value;
                        await user.save();
                    }
                    return callback(null, user);
                }

                user = await User.create({
                    googleId: profile.id,
                    email: emails?.[0]?.value,
                    name: name,
                    profilePicture: photos?.[0]?.value,
                    isVerified: true,
                    agreeToTerms: true,

                })
                callback(null, user);
        } catch (error) {
            callback(error);
            
        }



    }
));