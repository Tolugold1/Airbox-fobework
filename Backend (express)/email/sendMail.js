const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
    rateLimit: 10
});

// verify transporter
transporter.verify((err, success) => {
    if (err) console.log("Error creating email transporter, ", err);
    console.log("Email transporter created successfully!!!.");
});

exports.sendMail = async (payload) => {
    try {
        let mailOption = {
            from: process.env.EMAIL,
            to: payload.recipient,
            subject: payload.subject,
            html: payload.html
        }
        await transporter.sendMail(mailOption);
        return { message: "Mail sent.", success: true };
    } catch (error) {
        throw new Error(`Email not sent due to error: ${error.message}`);
    }
}

// `                
//  <div style="font-family: Arial, sans-serif; padding: 10px; text-align: center;">
//                     <h2>Verify Your Email</h2>
//                     <p>Click the button below to verify your email address:</p>
//                     <a href="${payload.uniqueString}" 
//                         style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
//                         Verify Email
//                     </a>
//                     <p>If the button above does not work, copy and paste the following URL into your browser:</p>
//                     <p><a href="${payload.uniqueString}">${payload.uniqueString}</a></p>
//                 </div>`