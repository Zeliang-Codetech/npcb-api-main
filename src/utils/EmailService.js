import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'npcb25zc@gmail.com',
    pass: 'npcp.2025.//zc@123'
  }
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: 'npcb25zc@gmail.com',
      to: email,
      subject: 'OTP Verification',
      html: `
        <h1>OTP Verification</h1>
        <p>Your OTP for verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};