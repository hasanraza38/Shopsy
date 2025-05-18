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
            from: `"HASAN RAZA" <${process.env.EMAIL}>`,
            to: `${email}, 92hasanraza689@gmail.com`,
            subject: "Welcome to Shopsy 🎉",
            text: `Hi ${username},
          
          Welcome to Shopsy! We're excited to have you on board.
          
          Start exploring amazing products today.
          
          — Team Shopsy`
          });
          
        // console.log("Email sent: %s", info.messageId);

    } catch (error) {
        console.log(error);
    }





}



export default sendEmail;

