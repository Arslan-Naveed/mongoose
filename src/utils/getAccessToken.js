const jwt = require('jsonwebtoken');
require('dotenv').config();


const getAccessToken = async ({userId,time}) => {
    try {
        const token = await  jwt.sign({userId:userId },process.env.JWT_SECRET,{   expiresIn: time}); 
        return token;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Failed to generate access token');
    }
}

module.exports = getAccessToken