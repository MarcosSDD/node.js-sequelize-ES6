import pkg from 'rand-token'

const generateToken = () => {
  const { uid } = pkg
  return uid(16)
}

export default generateToken
