import Joi from 'joi';

const schema = Joi.object().keys({
  username: Joi.string().min(4).max(24).alphanum().required(),
  password: Joi.string().min(4).max(64).required(),
});

export default schema;
