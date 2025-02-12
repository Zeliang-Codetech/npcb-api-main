import Joi from "joi";
const AuthSchema = Joi.object().keys({
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().required(),
  fcm_token: Joi.string(),
});
const AuthRegisterSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    // email: Joi.string().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string().required(),
    // fcmToken: Joi.string(),
  })
  .unknown(true);
export { AuthSchema, AuthRegisterSchema };
