import jwt from 'jsonwebtoken'
import { User } from '../models/'
import logger from '../../logger'

const checkAuth = async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(token, process.env.SECRET_JWT)
			//This generates a user session
			req.user = await User.scope('sendDataUser').findByPk(decoded.id)
			return next()
		} catch (error) {
			const errorMsg = new Error('Invalid Token')
			logger.error(error)
			return res.status(403).json({ msg: errorMsg.message })
		}
	}

	if (!token) {
		const error = new Error('Invalid or non-existent token')
		logger.error(error)
		res.status(403).json({ msg: error.message })
	}

	next()
}

export default checkAuth
