import { User } from '../../models'

const newUser = {
	name: 'John',
	surname: 'Doe',
	username: 'john_d',
	email: 'john_doe@gmail.com',
	password: '123456Secret',
	token: 'wvUEnisIDRAMM0Iw',
}

const defaultUser = {
	name: 'User',
	surname: 'Default',
	username: 'user_d',
	email: 'user@gmail.com',
	confirmed: true,
	password: '123456Secret',
}

const fakeId = 'XXXXXXXXXXXX001'

const fakeToken = 'XXXXXXXXXXXX001'

const modifiedUser = { ...defaultUser, email: 'modifiedUser@gmail.com' }

const cleanDataBase = async () => {
	await User.destroy({
		where: {},
		truncate: true,
	})
}

const createUser = async (user) => {
	await User.create(user)
}

const findUserByMail = async () => {
	return await User.findOne({ where: { email: defaultUser.email } })
}

const findUserByToken = async () => {
	return await User.findOne({ where: { email: newUser.token } })
}

export {
	newUser,
	defaultUser,
	fakeId,
	fakeToken,
	modifiedUser,
	cleanDataBase,
	createUser,
	findUserByMail,
	findUserByToken,
}
