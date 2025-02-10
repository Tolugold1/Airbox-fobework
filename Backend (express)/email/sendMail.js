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
            to: payload.to,
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
