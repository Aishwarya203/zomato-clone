import googleoAuth from  "passport-google-oauth2";
import passport from "passport";

import {UserModel, userModel} from "../database/allModels";

const GoogleStrategy = googleoAuth.Strategy;

export default (passport)=> {
    passport.use(
        new GoogleStrategy(
            {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback"
        },
        async(accessToken, refreshToken, profile, done)=>{
            const newUser ={
                fullName:profile.displayName,
                email:profile.emails[0],
                profilepic:profile.photo[0].value,
            };
            try{
                const user = await UserModel.findOne({email:newUser.email});
                if(user){
                 const token = user.generateJwtToken();
                 done(null, {user, token})
            }else{
                const user = await UserModel.create(newUser);
                const token = user.generateJwtToken();
                done(null, {user,token})
            }
         } catch(error){
                done(error,{user, token})
            }  
        }  
        )
    );
    passport.serializeUser((userData, done) => done(null,{...userData }));
    passport.deserializeUser((id, user) => done(null,id));
};
        
