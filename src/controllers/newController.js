const crypto = require("crypto");
const express = require("express");
const app = express();

const DISCOURSE_SECRET = "abcd123456789"; // Set this in Discourse settings



exports.discourseSSO = async (req,res)=>{
        const { sso, sig } = req.query;
    
        console.log("sso-request:",sso);
        console.log("=====================================================")
        console.log("sig-request:",sig);

        // Validate the signature
        const hmac = crypto.createHmac("sha256", DISCOURSE_SECRET);
        hmac.update(sso);
        const calculatedSig = hmac.digest("hex");
    
        if (calculatedSig !== sig) {
            return res.status(400).send("Invalid SSO signature");
        }
    
        // Decode the SSO payload
        const decoded = Buffer.from(sso, "base64").toString();
        const params = new URLSearchParams(decoded);
    
        // Get the nonce
        const nonce = params.get("nonce");
    
        // User info from your authentication system
        const user = {
            id: "1122", // Your user ID
            email: "hammad@example.com",
            username: "hammad"
        };
    
        // Create the response payload
        const returnPayload = new URLSearchParams({
            nonce: nonce,
            email: user.email,
            external_id: user.id,
            username: user.username
        }).toString();
    
        // Encode and sign the response
        const returnPayloadBase64 = Buffer.from(returnPayload).toString("base64");
        const responseHmac = crypto.createHmac("sha256", DISCOURSE_SECRET);
        responseHmac.update(returnPayloadBase64);
        const returnSig = responseHmac.digest("hex");
    
        // Redirect back to Discourse
        res.redirect(`https://healthquest.discourse.group/session/sso_login?sso=${returnPayloadBase64}&sig=${returnSig}`);
}