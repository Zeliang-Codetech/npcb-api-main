import slugify from "slugify";
// import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import mongoose, { ObjectId } from "mongoose";
import crypto from "crypto";
import axios from "axios";
const options = {
  replacement: "-", // replace spaces with replacement character, defaults to `-`
  remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  strict: false, // strip special characters except replacement, defaults to `false`
  locale: "vi", // language code of the locale to use
  trim: true, // trim leading and trailing replacement chars, defaults to `true`
};
const toSlug = (value) => slugify(value, options);
const RandomNumber = (min = 10000, max = 99999) => {
  return Math.floor(Math.random() * (min - max + 1));
};
function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const ParseFloat = (number, digits = 2) => {
  return parseFloat(number.toFixed(digits));
};

function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}
function validateObjectId(id) {
  if (ObjectId.isValid(id)) {
    const obj = new ObjectId(id);
    if (obj == id) {
      return true;
    }
  }
  return false;
}
// function buildInFilter(field, values) {
//   if (Array.isArray(values) && values.length > 0) {
//     return {
//       [field]: {
//         $in: values.map((value) => value.toObjectId()),
//       },
//     };
//   }
//   return {};
// }
// function buildInFilter(field, values) {
//   if (Array.isArray(values) && values.length > 0) {
//     // Check if all values are valid ObjectId strings
//     if (values.every(value => isValidObjectId(value))) {
//       return {
//         [field]: {
//           $in: values.map(value => value.toObjectId()),
//         },
//       };
//     } else {
//       throw new Error(`Invalid ${field} value`);
//     }
//   }
//   return {};
// }
function buildInFilter(field, values) {
  if (Array.isArray(values) && values.length > 0) {
    const validValues = values.filter((value) => isValidObjectId(value));
    if (validValues.length > 0) {
      return {
        [field]: {
          $in: validValues.map((value) => value.toObjectId()),
        },
      };
    }
  }
  return {};
}

function isValidObjectId(str) {
  return mongoose.Types.ObjectId.isValid(str);
}
function stringToObjectId(id) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    console.log("error", error);
    // Handle invalid ObjectId conversion
    throw new Error("Invalid ObjectId");
  }
}
String.prototype.toObjectId = function () {
  try {
    // mongoose.Types.ObjectId.createFromHexString(id)
    return new mongoose.Types.ObjectId(this.toString());
  } catch (error) {
    throw new Error("Invalid ObjectId");
  }
};
Number.prototype.kgToGram = function () {
  return this * 1000;
};

// Extension function to convert grams to kilograms
Number.prototype.gramToKg = function () {
  return this / 1000;
};

function kgToGram(kg) {
  return kg * 1000;
}

// Utility function to convert grams to kilograms
function gramToKg(g) {
  return g / 1000;
}
function convertToObjectIdArray(idString) {
  try {
    const idArray = idString.split(",");
    const objectIdArray = idArray.map((id) => id.toObjectId());
    return objectIdArray;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error converting IDs to ObjectId values");
  }
}

// function getFilenameFromS3Url(s3Url) {
//   const segments = s3Url.split("/");
//   const filenameWithExtension = segments.pop(); // Get the last segment
//   const filenameParts = filenameWithExtension.split(".");
//   const extension = filenameParts.pop(); // Get the extension
//   const filename = filenameParts.join("."); // Rejoin the filename without the extension
//   return { filename, extension };
// }
// const { filename, extension } = getFilenameFromS3Url(s3Url);
function getFilenameFromS3Url(s3Url) {
  try {
    const segments = s3Url.split("/");
    const filenameWithExtension = segments.pop(); // Get the last segment
    return filenameWithExtension;
  } catch (error) {
    console.error("Error extracting filename from S3 URL:", error);
    return null;
  }
}

// function isValidObjectId(id) {
//   try {
//     // MongoDB ObjectId consists of 24 hexadecimal characters
//     const objectIdPattern = /^[0-9a-fA-F]{24}$/;
//     if (!objectIdPattern.test(id)) {
//       throw new Error("Invalid ObjectId format");
//     }
//     return true;
//   } catch (error) {
//     console.error("Validation error:", error.message);
//     return false;
//   }
// }

const sendResponse = async (to, message) => {
  let responseMessage = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: {
      body: message,
    },
  };

  try {
    const result = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      responseMessage,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response sent successfully", result);
  } catch (error) {
    console.error("Error sending response:", error.response.data);
  }
};
function encodePayloadToBase64(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64"
  );
  return encodedPayload;
}
function decodeBase64Payload(encodedPayload) {
  const decodedPayload = atob(encodedPayload);
  return decodedPayload;
}
function calculateChecksum(payloadBase64, saltKey, saltIndex) {
  const concatenatedString = payloadBase64 + "/pg/v1/pay" + saltKey;
  const hash = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");
  const checksum = hash + "###" + saltIndex;
  return checksum;
}
export {
  toSlug,
  generateOTP,
  ParseFloat,
  isValidJSON,
  stringToObjectId,
  convertToObjectIdArray,
  getFilenameFromS3Url,
  isValidObjectId,
  buildInFilter,
  sendResponse,
  encodePayloadToBase64,
  calculateChecksum,
  decodeBase64Payload,
};
