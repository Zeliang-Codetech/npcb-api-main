import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
export default {
  signAdminAccessToken: (id, bid) => {
    return new Promise((resolve, reject) => {
      const payload = {
        _id: id,
        bid: bid,
      };
      const secret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "",
        audience: "",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  signAdminRefreshToken: (id) => {
    return new Promise((resolve, reject) => {
      const payload = { _id: id };
      const secret = process.env.ADMIN_REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "",
        audience: "",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          // return reject(err);
          console.log(err.message);
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  signOtpToken: (otpId) => {
    return new Promise((resolve, reject) => {
      const payload = { id: otpId };
      const secret = process.env.OTP_TOKEN;
      const options = {
        expiresIn: "5m",
        issuer: "",
        audience: "",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.InternalServerError());
        }

        resolve(token);
      });
    });
  },
  verifyOtpToken: (req, res, next) => {
    if (!req.body.token) return next(createHttpError.Unauthorized());
    const token = req.body.token;
    JWT.verify(token, process.env.OTP_TOKEN, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  verifyAdminAccessToken: (req, res, next) => {
    let token;
    if (req.headers["authorization"]) {
      const authHeader = req.headers["authorization"];
      const bearerToken = authHeader.split(" ");
      token = bearerToken[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return next(createHttpError.Unauthorized());
    }
    JWT.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signClientAccessToken: (id, cid) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id: id,
        cid: cid,
      };
      const secret = process.env.CLIENT_TOKEN;
      const options = {
        expiresIn: "1y",
        issuer: "",
        audience: "",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyClientAccessToken: (req, res, next) => {
    if (!req.cookies.token) return next(createHttpError.Unauthorized());
    const token = req.cookies.token;
    JWT.verify(token, process.env.CLIENT_TOKEN, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
};
