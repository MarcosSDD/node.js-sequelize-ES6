import jwt from 'jsonwebtoken'

const generateJWT = (id) => {
	return jwt.sign({ id }, process.env.SECRET_JWT, {
		expiresIn: '1d',
	})
}

export default generateJWT
