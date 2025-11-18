// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   });
// };


import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MyApp Support" <${process.env.EMAIL_USER}>`,   // 🔥 MAGIC LINE
    to,
    subject,
    text,
  });
};
