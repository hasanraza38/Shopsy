import nodemailer from "nodemailer";


const sendEmail = async (email, username) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });


        const info = await transporter.sendMail({
            from:  `"HASAN RAZA" <${process.env.EMAIL}>`,
            to: `${email}, 92hasanraza689@gmail.com`,
            subject: "WElCOME🎉",
            text: `Welcome to Shopsy, ${username}`,
        });

        // console.log("Email sent: %s", info.messageId);

    } catch (error) {
        console.log(error);
    }





}



export default sendEmail;

