import axios from 'axios';

const API_KEY = '3b3627c3-5a10-11ef-8b60-0200cd936042';

export const sendOTPSMS = async (phone, otp) => {
  try {
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/${otp}/OTP1`;
    
    const response = await axios.get(url);
    
    if (response.data.Status === 'Success') {
      return true;
    }
    
    throw new Error('Failed to send OTP');
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send OTP SMS');
  }
};