const registerUser = async (req, res) => {
  res.send('from Controller')
}

const loginUser = async (req, res) => {
  res.send('from login controller')
}

module.exports = {
  registerUser,
  loginUser,
}
