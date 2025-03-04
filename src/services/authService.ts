import User from "../models/User";
const jwt = require('jsonwebtoken');

type Auth = {
    email: string;
    password: string;
}


const authService = async ({email,password}:Auth)=>{
           try {   
                   const  user = await User.findOne({email,password},{savedProducts:0,isAdmin:0,__v:0,password:0});
                   console.log(user);
                   if(user){
                     const token = await  jwt.sign({userId: user._id },process.env.JWT_SECRET,{   expiresIn: '24h'}); 
                        return {token, user};
                   }else{
                          throw new Error("Invalid email or password");
                   }
               } catch (error) {
                   console.log("Error in userController.login-------", error);
                     throw error;
               }
};


export default authService;
      