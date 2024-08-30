import { body } from "express-validator";

// The image can have the prefix "data:image/...;base64," or it can be just the base64 string
const base64ImageRegex = /^(data:image\/(bmp|gif|ico|jpg|jpeg|png|svg|webp|x-icon|svg\+xml);base64,)?[a-zA-Z0-9+/]+={0,2}$/;

const uploadValidations = [
  body('image').matches(base64ImageRegex).withMessage("image precisa ser do tipo base64"),
  body('customer_code').isString().notEmpty().withMessage("customer_code precisa ser uma string não vazia"),
  body('measure_datetime').custom((value) => {
    return isValidDateTime(value);
  }).withMessage("measure_datetime precisa ser do tipo datetime"),
  body('measure_type').isIn(['WATER', 'GAS']).withMessage("measure_type precisa ser 'WATER' ou 'GAS'")
];

const confirmValidations = [
  body('measure_uuid').isString().notEmpty().withMessage("measure_uuid precisa ser uma string não vazia"),
  body('confirmed_value').isInt().withMessage("confirmed_value precisa ser um número inteiro")
]

function isValidDateTime(dateTimeString: string): boolean {
  const date = new Date(dateTimeString);
  return !isNaN(date.getTime()) && dateTimeString === date.toISOString();
}

export { uploadValidations, confirmValidations };