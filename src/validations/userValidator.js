import { check, validationResult } from 'express-validator'
import logger from '../../logger'

const validUser = async (req, res, next) => {
    await check('name')
      .notEmpty()
      .trim()
      .withMessage('The name cannot be empty')
      .run(req)
    await check('surname')
      .notEmpty()
      .trim()
      .withMessage('The surname cannot be empty')
      .run(req)
    await check('email')
      .isEmail()
      .trim()
      .withMessage('Add valid email')
      .run(req)
    await check('password')
      .isLength({ min: 8 })
      .trim()
      .withMessage('The password is too short')
      .run(req)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.error(errors.array())
      return res.status(400).json({ error: errors.array() })
    }
    return next()
}
export default validUser