import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'npcb25zc@gmail.com',
    pass: 'jziy layw wtgt jebl' 
  }
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: 'npcb25zc@gmail.com',
      to: email,
      subject: 'OTP Verification - NPCB',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px;">
            <tr>
              <td style="padding: 40px 30px;">
                <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; border-bottom: 2px solid #f0f0f0;">
                  <h1 style="color: #333333; font-size: 24px; margin: 0 0 15px 0;">Verify Your Email</h1>
                  <p style="color: #666666; font-size: 16px; margin: 0 0 20px 0;">Please use the following OTP to complete your verification</p>
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2c5282;">${otp}</span>
                  </div>
                  <p style="color: #666666; font-size: 14px; margin: 20px 0 0 0;">This OTP will expire in 5 minutes</p>
                </div>
                <div style="margin-top: 30px; text-align: center; color: #999999; font-size: 13px;">
                  <p>If you didn't request this verification, please ignore this email.</p>
                  <p style="margin-top: 15px;">© ${new Date().getFullYear()} NPCB. All rights reserved.</p>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};