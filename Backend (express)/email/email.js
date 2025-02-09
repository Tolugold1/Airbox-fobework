const { sendMail } = require("./sendMail");
require("dotenv").config();

exports.sendVerificationMail = async (payload) => {
    try {
        let subject = "Verify Your Email.";
        let url = `${process.env.CURRENT_URL}/${payload.token}`
    } catch (error) {
        throw new Error("Error sending mail", error);
    }
}