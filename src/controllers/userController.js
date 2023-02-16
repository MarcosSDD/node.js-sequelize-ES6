import { User } from '../models/'
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
		console.log(error)
	}
}
//New user is confirmed by email
const confirmUser = async (req, res) => {
	const { token } = req.params

	const userConfirm = await User.findOne({ where: { token } })

	if (!userConfirm) {
		const error = new Error('Invalid Token')
		return res.status(401).json({ msg: error.message })
	}
	try {
		userConfirm.token = null
		userConfirm.confirmed = true
		await userConfirm.save()
		res.status(200).json({
			msg: ' User confirmed and created successfully',
		})
	} catch (error) {
		console.log(error)
	}
}

const loginUser = async (req, res) => {
	const { email, password } = req.body

	// Validate User Exists
	const userLogin = await User.findOne({ where: { email } })
	if (!userLogin) {
		const error = new Error('Unregistered user')
		return res.status(404).json({ msg: error.message })
	}

	// Confirmed account
	if (!userLogin.confirmed) {
		const error = new Error('Your account has not been confirmed')
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
		return res.status(403).json({ msg: error.message })
	}
}

const forgetPassword = async (req, res) => {
	const { email } = req.body

	//Validate User Exists
	const userLost = await User.findOne({ where: { email } })
	if (!userLost) {
		const error = new Error('Unregistered user')
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
		console.log(error)
	}
}
//Token verification for lost password
const checkTokenForPassword = async (req, res) => {
	const { token } = req.params

	const tokenConfirm = await User.findOne({ where: { token } })

	if (tokenConfirm) {
		res.json({ msg: 'Valid token and user exists' })
	} else {
		const error = new Error('Invalid Token')
		return res.status(401).json({ msg: error.message })
	}
}

module.exports = {
	registerUser,
	confirmUser,
	loginUser,
	forgetPassword,
	checkTokenForPassword,
}
