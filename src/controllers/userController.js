import { User } from '../models/'
import emailRegister from '../helpers/emailRegister.js'
import generateJWT from '../helpers/generateJWT.js'

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

const confirmUser = async (req,res) => {
  const { token } = req.params;

  const userConfirm = await User.findOne({ where :{ token } });
  
  if (!userConfirm){
      const error = new Error("Invalid Token");
      return res.status(401).json({ msg: error.message });
  }
  try {
      userConfirm.token = null;
      userConfirm.confirmed = true;
      await userConfirm.save();
      res.status(200).json({msg:" User confirmed and created successfully"})
  } catch (error) {
      console.log(error)
  }

}

const loginUser = async (req, res) => {
  const { email, password } = req.body

    // Validate User Exists
    const userLogin = await User.findOne({ where :{ email } });
    if (!userLogin){
        const error = new Error("Unregistered user");
        return res.status(404).json({ msg: error.message });
    }
    
    // Confirmed account
    if (!userLogin.confirmed) {
        const error = new Error("Your account has not been confirmed");
        return res.status(401).json({ msg: error.message });
    }

    // Validation Pass
    if( await userLogin.validPassword(password) ){
        res.status(200).json({
            id:userLogin.id,
            name: userLogin.name,
            surname: userLogin.surname,
            token: generateJWT(userLogin.id),
        })
    } else {
        const error = new Error("Invalid password");
        return res.status(403).json({ msg: error.message });
    }
}

module.exports = {
  registerUser,
  confirmUser,
  loginUser,
}
