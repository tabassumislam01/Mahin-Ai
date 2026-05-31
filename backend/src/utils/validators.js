import Joi from 'joi';

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    'string.min': 'Password must be at least 8 characters'
  });

export const registerValidator = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema,
  name: Joi.string().min(2).max(100).required(),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const messageValidator = Joi.object({
  message: Joi.string().min(1).max(5000).required(),
  conversationId: Joi.string().optional(),
});

export const profileUpdateValidator = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().optional(),
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.validatedBody = value;
    next();
  };
};
