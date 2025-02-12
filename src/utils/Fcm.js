import fetch from "cross-fetch";
import createHttpError from "http-errors";
import User from "./../models/User.js";
const topic = "/topics/admin";
import FCM from "fcm-node";
import otpGenerator from "otp-generator";
import { generateOTP } from "./Helpers.js";
const SendNotification = async (to, title = "", body = "", callback) => {
  try {
    const notification = {
      title: title,
      body: body,
      image: "",
      sound: "default",
    };
    const data = {
      title: title,
      message: body,
      redirect: "",
    };
    const message = {
      notification,
      data,
      priority: "high",
      sound: "default",
      type: 1,
      icon: "",
      color: "#203E78",
      tag: "",
      alert: "",
    };
    if (Array.isArray(to) && to.length) {
      message.registration_ids = to;
    } else if (!Array.isArray(to) && to) {
      message.to = to;
    } else {
      throw new Error("Inavlid Token");
    }
    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: "key=" + process.env.FCM_SERVER_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        console.error("error : ", error);
      });
  } catch (e) {
    callback(e.message, null);
  }
};

const NotifyUser = async (user_id, title = "", message = "") => {
  try {
    const user = await User.findOne({ _id: user_id }, "name phone fcm_token");
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.fcm_token) {
      throw new Error("Token not found");
    }
    SendNotification(
      user.fcm_token,
      `${title}`,
      `${message}`,
      (err, response) => {
        if (err) {
          console.log("Error ", err);
        } else {
          console.log("Response ", response);
        }
      }
    );
  } catch (e) {
    console.log("Error : ", e.message);
  }
};

export { SendNotification, NotifyUser };
