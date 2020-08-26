import Joi from '@hapi/joi';

export const schema = Joi.object().keys({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),

  password: Joi.string()
    .min(5)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),

  username: Joi.string().alphanum().min(2).max(30).required(),
});

export const schemaLogin = Joi.object().keys({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),

  password: Joi.string()
    .min(5)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),
});
