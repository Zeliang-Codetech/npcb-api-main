import Joi from "joi";

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

export { AuthSchema, AuthRegisterSchema };
