import { User } from '../models/'
import emailRegister from '../helpers/emailRegister.js'

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

const loginUser = async (req, res) => {
  const { email, password } = req.body

  // Validate User Exists
  const userLogin = await User.findOne({ where: { email } })
  if (!userLogin) {
    const error = new Error('User not found')
    return res.status(404).json({ msg: error.message })
  }

  res.status(200).json({
    id: userLogin.id,
    name: userLogin.name,
    surname: userLogin.surname,
  })
}

module.exports = {
  registerUser,
  loginUser,
}
