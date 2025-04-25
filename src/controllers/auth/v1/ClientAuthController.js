import createHttpError from "http-errors";
import JWT from "../../../helpers/jwt.js";
import Client from "../../../models/Client.js";
import { generateOTP } from "../../../utils/Helpers.js";
import { sendOTPEmail } from "../../../utils/EmailService.js";
import { sendOTPSMS } from "../../../utils/SmsService.js";

const signAccessToken = JWT.signClientAccessToken;

export default {
  sentOtp: async (req, res) => {
    try {
      const { email, phone } = req.body;
      
      if (!email && !phone) {
        throw createHttpError.BadRequest("Email or phone number is required");
      }

      const otp = generateOTP();
      let client;
      
      if (email) {
        // Find existing email user
        client = await Client.findOne({ email, login_type: 'email' });
        
        if (!client) {
          // Create new email user
          client = await Client.create({
            email,
            otp,
            login_type: 'email',
            status: 1,
            otp_expires_at: new Date(Date.now() + 5 * 60 * 1000)
          });
        } else {
          // Update existing email user
          await Client.updateOne(
            { _id: client._id },
            {
              $set: {
                otp,
                otp_expires_at: new Date(Date.now() + 5 * 60 * 1000)
              }
            }
          );
        }
        
        await sendOTPEmail(email, otp);
      } else if (phone) {
        // For phone users, we'll handle creation in verifyOtp
        // Just update OTP if user exists
        await Client.findOneAndUpdate(
          { phone, login_type: 'phone' },
          { 
            $set: { 
              otp,
              otp_expires_at: new Date(Date.now() + 5 * 60 * 1000)
            }
          },
          { upsert: true }
        );
        
        await sendOTPSMS(phone, otp);
      }

      res.status(200).send({
        status: true,
        message: "OTP sent successfully",
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      let { email, phone, otp } = req.body;

      // Handle case where phone number is sent in email field
      if (email && !isNaN(email)) {
        phone = parseInt(email);
        email = null;
      }

      if (!email && !phone) {
        throw createHttpError.BadRequest("Email or phone number is required");
      }

      if (!otp) {
        throw createHttpError.BadRequest("OTP is required");
      }

      // Find client based on login method AND login_type to ensure separation
      const searchQuery = email 
        ? { email, login_type: 'email' } 
        : { phone, login_type: 'phone' };
      
      let client = await Client.findOne(searchQuery);

      // Handle user creation/verification differently for email and phone
      if (!client) {
        if (phone) {
          // For phone login, create new user if doesn't exist
          client = await Client.create({
            phone,
            otp,
            login_type: 'phone',
            status: 1,
            otp_expires_at: new Date(Date.now() + 5 * 60 * 1000)
          });
        } else if (email) {
          // For email login, user must exist
          throw createHttpError.BadRequest("Email user not found. Please register first.");
        }
      } else {
        // Verify OTP
        if (client.otp !== otp) {
          throw createHttpError.BadRequest("Invalid OTP");
        }

        // Check OTP expiration
        if (client.otp_expires_at < new Date()) {
          throw createHttpError.BadRequest("OTP has expired");
        }
      }

      // Clear OTP after successful verification
      await Client.updateOne(
        { _id: client._id },
        { 
          $unset: { 
            otp: 1,
            otp_expires_at: 1
          },
          $set: {
            last_login_at: new Date()
          }
        }
      );

      // Generate access token
      const accessToken = await signAccessToken(client._id);

      // Return user data based on login type
      const userData = {
        _id: client._id,
        name: client.name,
        login_type: client.login_type
      };

      if (client.login_type === 'email') {
        userData.email = client.email;
      } else {
        userData.phone = client.phone;
      }

      // In the verifyOtp method, modify the response:
      res.status(200).send({
        status: true,
        message: "OTP verified successfully",
        data: {
          token: accessToken, // Changed from accessToken to token for consistency
          user: userData
        }
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const client_id = req.payload._id;
      
      const client = await Client.findById(client_id)
        .select('_id name email phone login_type status')  // Added status to selection
        .lean();

      if (!client) {
        throw createHttpError.NotFound('Client not found');
      }

      // Return user details based on login type
      const userData = {
        _id: client._id,
        name: client.name,
        login_type: client.login_type,
        status: client.status
      };

      // Only include email or phone based on login type
      if (client.login_type === 'email') {
        userData.email = client.email;
      } else {
        userData.phone = client.phone;
      }

      res.status(200).send({
        status: true,
        data: userData
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('token').status(200).send({ 
        status: true,
        message: 'Logged out successfully'
      });
    } catch (err) {
      res.status(500).send({ 
        status: false,
        message: err.message
      });
    }
  }
};
