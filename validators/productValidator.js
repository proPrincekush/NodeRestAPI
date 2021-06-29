const joi = require("joi")
module.exports = joi.object({
  name: joi.string().min(5).max(30).required(),
  price: joi.number().required(),
  size: joi.string().required(),
  image:joi.string()
});
