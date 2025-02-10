const { sendMail } = require("./sendMail");
require("dotenv").config();

exports.sendVerificationMail = async ({ recipient, token, route }) => {
    try {
        let subject = "Verify Your Email.";
        let url = `${process.env.CURRENT_URL}/api/auth/${route}/${token}`;
        let payload = {
            subject: subject,
            to: recipient,
            html: `<div style="font-family: Arial, sans-serif; padding: 10px; text-align: center;">
                    <h2>Verify Your Email</h2>
                    <p>Click the button below to verify your email address:</p>
                    <a href="${url}" 
                        style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
                        Verify Email
                    </a>
                    <p>If the button above does not work, copy and paste the following URL into your browser:</p>
                    <p><a href="${url}">${url}</a></p>
                </div>`
        }
        await sendMail(payload);
    } catch (error) {
        console.log("error", error);
        throw new Error("Error sending mail", error);
    }
}