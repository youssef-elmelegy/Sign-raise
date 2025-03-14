import transporter from "../config/nodeMailer.config.js";

export const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP code for password reset is: ${otp}. This code will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to our platform",
    text: `Welcome to our platform. We are glad to have you on board. ${name}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Link",
    text: `Click on the link to reset your password: ${link}`,
  };

  await transporter.sendMail(mailOptions);
};
