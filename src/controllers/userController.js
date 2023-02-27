import { User } from '../models/'
import logger from '../../logger'
import emailRegister from '../helpers/emailRegister.js'
import emailLostPassword from '../helpers/emailLostPassword.js'
import generateJWT from '../helpers/generateJWT.js'
import generateToken from '../helpers/generateToken'

const registerUser = async (req, res) => {
	const { name, surname, email, password } = req.body

	// Validate User Exists
	const userExists = await User.findOne({ where: { email } })
	if (userExists) {
		const error = new Error('User already exists')
		logger.error(error)
		return res.status(400).json({ msg: error.message })
	}
	try {
		const saveUser = await User.create({
			name,
			surname,
			email,
			password,
		})

		//enviar E-mail confirmación
		emailRegister({
			email,
			name,
			surname,
			token: saveUser.token,
		})

		res.status(201).json({
			id: saveUser.id,
			name: saveUser.name,
			surname: saveUser.surname,
			email: saveUser.email,
			createdAt: saveUser.createdAt,
			updatedAt: saveUser.updatedAt,
		})
	} catch (error) {
		logger.error(error.errors)
		return res.status(500).json({ error: error.message })
	}
}
//New user is confirmed by email
const confirmUser = async (req, res) => {
	const { token } = req.params

	const userConfirm = await User.findOne({ where: { token } })

	if (!userConfirm) {
		const error = new Error('Invalid Token')
		logger.error(error)
		return res.status(401).json({ msg: error.message })
	}
	try {
		userConfirm.token = null
		userConfirm.confirmed = true
		await userConfirm.save()
		res.status(200).json({
			msg: 'User confirmed and created successfully',
		})
	} catch (error) {
		logger.error(error.errors)
		return res.status(500).json({ error: error.message })
	}
}

const loginUser = async (req, res) => {
	const { email, password } = req.body

	// Validate User Exists
	const userLogin = await User.findOne({ where: { email } })
	if (!userLogin) {
		const error = new Error('Unregistered user')
		logger.error(error)
		return res.status(404).json({ msg: error.message })
	}

	// Confirmed account
	if (!userLogin.confirmed) {
		const error = new Error('Your account has not been confirmed')
		logger.error(error)
		return res.status(401).json({ msg: error.message })
	}

	// Validation Pass
	if (await userLogin.validPassword(password)) {
		res.status(200).json({
			id: userLogin.id,
			name: userLogin.name,
			surname: userLogin.surname,
			token: generateJWT(userLogin.id),
		})
	} else {
		const error = new Error('Invalid password')
		logger.error(error)
		return res.status(403).json({ msg: error.message })
	}
}

const forgetPassword = async (req, res) => {
	const { email } = req.body

	//Validate User Exists
	const userLost = await User.findOne({ where: { email } })
	if (!userLost) {
		const error = new Error('Unregistered user')
		logger.error(error)
		return res.status(404).json({ msg: error.message })
	}

	try {
		userLost.token = generateToken()
		await userLost.save()

		//Send mail confirm user
		emailLostPassword({
			email,
			name: userLost.name,
			surname: userLost.surname,
			token: userLost.token,
		})

		res.status(200).json({
			msg: 'Instructions have been sent to your email',
		})
	} catch (error) {
		logger.error(error.errors)
		return res.status(500).json({ error: error.message })
	}
}
//Token verification for lost password
const checkTokenForPassword = async (req, res) => {
	const { token } = req.params

	const tokenConfirm = await User.findOne({ where: { token } })

	if (tokenConfirm) {
		res.status(200).json({ msg: 'Valid token and user exists' })
	} else {
		const error = new Error('Invalid Token')
		logger.error(error)
		return res.status(401).json({ msg: error.message })
	}
}

const newPassword = async (req, res) => {
	const { token } = req.params
	const { password } = req.body

	const userConfirm = await User.findOne({ where: { token } })

	if (!userConfirm) {
		const error = new Error('Invalid Token')
		logger.error(error)
		return res.status(401).json({ msg: error.message })
	}

	try {
		userConfirm.token = null
		userConfirm.password = password
		await userConfirm.save()
		res.status(200).json({ msg: 'Password changed successfully' })
	} catch (error) {
		logger.error(error.errors)
		return res.status(500).json({ error: error.message })
	}
}

const profileUser = async (req, res) => {
	const { id } = req.params

	const userProfile = await User.scope('sendDataUser').findByPk(id)
	if (!userProfile) {
		const error = new Error('No user found')
		logger.error(error)
		return res.status(404).json({ msg: error.message })
	}

	const { user } = req
	res.status(200).json(user)
}

const updateUser = async (req, res) => {
	const { id } = req.params
	const { email } = req.body

	const userToUp = await User.scope('sendDataUser').findByPk(id)
	if (!userToUp) {
		const error = new Error('No user found')
		logger.error(error)
		return res.status(404).json({ msg: error.message })
	}

	if (userToUp.email !== email) {
		const emailExists = await User.findOne({ where: { email } })

		if (emailExists) {
			const error = new Error('That email is already in use')
			logger.error(error)
			return res.status(400).json({ msg: error.message })
		}
	}

	try {
		userToUp.name = req.body.name
		userToUp.surname = req.body.surname
		userToUp.birthday = req.body.birthday
		userToUp.gender = req.body.gender
		userToUp.email = req.body.email
		userToUp.username = req.body.username

		const userUp = await userToUp.save()
		res.status(200).json(userUp)
	} catch (error) {
		logger.error(error.errors)
		return res.status(500).json({ error: error.message })
	}
}

const updatePassword = async (req, res) => {
	const { oldPassword, password } = req.body
	const { id } = req.user

	const userChanged = await User.findByPk(id)
	if (!userChanged) {
		const error = new Error('Unregistered user')
		logger.error(error)
		return res.status(404).json({ msg: error.message })
	}

	if (await userChanged.validPassword(oldPassword)) {
		// Store the new password
		userChanged.password = password
		await userChanged.save()
		res.status(200).json({ msg: 'Password Updated Successfully' })
	} else {
		const error = new Error('Invalid password')
		logger.error(error)
		return res.status(400).json({ msg: error.message })
	}
}

export {
	registerUser,
	confirmUser,
	loginUser,
	forgetPassword,
	checkTokenForPassword,
	newPassword,
	profileUser,
	updateUser,
	updatePassword,
}
