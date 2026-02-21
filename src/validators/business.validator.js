import Joi from "joi";

const businessSchema = Joi.object({
  business_type: Joi.string().required(),
  days_to_sell_stock: Joi.number().required(),
  operating_profit: Joi.number().required(),
  days_to_pay_staff: Joi.number().required(),
  credit_payment_terms: Joi.number().required(),
  total_assets: Joi.number().required(),
  total_debt: Joi.number().required()
});

export default businessSchema;