const mongoose = require('mongoose'); // Fixed typo: moongose -> mongoose
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const getAccessToken = require('../utils/getAccessToken')
const { sendSuccess, sendError } = require('../utils/responseUtil');
const constants = require('../utils/constants').default
const { USER_MSG, STATUS_CODES, ERROR_MESSAGES, PRODUCT_MSG,SUCCESS_MESSAGES} = require('../utils/constants')
const bcrypt = require('bcrypt')
   
   
    


exports.register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        const existinfuser = await User.findOne({ email: email });
        console.log("existing user",existinfuser);
        if (existinfuser){
            return res.status(400).json({error:USER_MSG.ALREADY_EXISTS,user:{email}});
        }else{
            const user = new User({ name, email, password, age });
            await user.save();
            res.status(201).json({ message:USER_MSG.CREATED, user });
        }
    } catch (error) {
        console.log("Error in userController.register-------", error);
        res.status(400).json({ error: error.message });
    };
};

exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const  user = await User.findOne({email},{savedProducts:0,isAdmin:0,__v:0});
        if(user && await user.comparePassword(password)){ 
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;
            const token =  await getAccessToken({userId: user._id ,time:"24h"})
            res.status(200).json({message:USER_MSG.LOGGED_IN,user:userWithoutPassword,token:token});
        }else{
            res.status(400).json({error:USER_MSG.INVALID_CREDENTIALS});
        }
    } catch (error) {
        console.log("Error in userController.login-------", error);
        res.status(400).json({ error: error.message });
    }
};

exports.allUsers = async(req,res)=>{
    // console.log(req.ip);
    try {
        const users = await User.find();
        if(!users){
            return res.status(400).json({message:USER_MSG.NOT_FOUND});
        }else{
            res.status(200).json({AllUsers : users});
        }  
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

exports.updateUser = async(req,res)=>{
    try {
        const {email,name,age} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:USER_MSG.NOT_FOUND});} 
        else{
           const updatedUser = await User.findOneAndUpdate({email:email},{name:name,age:age},{new:true});
           res.status(200).json({message:USER_MSG.UPDATED,updatedUser}); 
        }    
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};  

exports.updatePassword = async (req,res) =>{
    try {
      const {email,password} = req.body;
      const user = await User.findOneAndUpdate({email},{password});
      if(!user) return res.status(404).json({error:USER_MSG.NOT_FOUND});
      res.status(200).json({message:USER_MSG.PASSWORD_UPDATED});
    } catch (error) {
      res.status(400).json({error:error.message});
    }
  };

exports.deleteUser = async(req,res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:USER_MSG.NOT_FOUND});
        }
         else{
            await User.findOneAndDelete({email:email});
            res.status(200).json({message:USER_MSG.DELETED});
         }   
    } catch (error) {
        
    }
} ;

exports.sendEmailOTP = async (req, res) => {
 
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpDataStoredinDB = await OTP.findOneAndUpdate({ email: req.body.email }, { otp: otp }, { new: true, upsert: true });

    if(!otpDataStoredinDB){
        return res.status(400).json({error:USER_MSG.OTP_DATABASE_ERROR});  
    }else{
        try {
            let transporter = nodemailer.createTransport({ service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_PASSWORD
                }
              });

              let info = await transporter.sendMail({
                from: `"OTP Test" <${process.env.EMAIL}>`,
                to: req.body.email,
                subject: 'Your OTP Code',
                text: `Your OTP is: ${otp}`
              });
    
              if(!info){
                return res.status(400).json({error:"Email not sent"});
              }
            
              res.status(200).json({ message: "Email sent successfully", info });
              console.log('Email sent:', info.messageId);  
        } catch (error) {
            console.log("Error in userController.sendEmailOTP-------", error);
            res.status(400).json({ error: error.message });
        }
    }   
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await OTP.findOne({ email: email, otp: otp });
        if (!otpData) {
            return res.status(400).json({ error: "Invalid OTP" });
        } else {
           return res.status(200).json({ message: "OTP verified successfully" });
        }   
    } catch (error) {
        console.log("Error in userController.verifyOTP-------", error);
           return  res.status(400).json({ error: error.message });
    }
};


