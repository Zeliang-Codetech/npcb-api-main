import Joi from "joi";

const AdminAuthSchema = Joi.object().keys({
  phone: Joi.string().required(),
  password: Joi.string().required(),
  fcm_token: Joi.string(),
});

const AuthSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fcm_token: Joi.string(),
});

const AuthRegisterSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  .unknown(true);

export { AuthSchema, AuthRegisterSchema, AdminAuthSchema };
