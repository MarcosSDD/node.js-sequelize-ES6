import supertest from 'supertest'

import { app } from '../../app.js'
import server from '../../server.js'
import { sequelize } from '../../models/index.js'
import generateJWT from '../../helpers/generateJWT'
import { testHelp } from '../helpers'

const api = supertest(app)

beforeEach(async () => {
	await testHelp.cleanDataBase()

	await testHelp.createUser(testHelp.defaultUser)
})

afterEach(async () => {
	await testHelp.cleanDataBase()
})

afterAll((done) => {
	server.close()
	sequelize.close()
	done()
})

describe('# POST create new user', () => {
	it('should create a user', async () => {
		await api
			.post('/api/user/')
			.send(testHelp.newUser)
			.expect(201)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body).toHaveProperty('id')
				expect(res.body.email).toBe('john_doe@gmail.com')
			})
	})
	it('should not create a user by "User exist" error', async () => {
		await api
			.post('/api/user/')
			.send(testHelp.defaultUser)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('User already exists')
			})
	})
})

describe('# POST login user ', () => {
	it('should must provide login user data', async () => {
		const loginUser = {
			email: 'user@gmail.com',
			password: '123456Secret',
		}
		await api
			.post('/api/user/login')
			.send(loginUser)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body).toHaveProperty('id')
			})
	})

	it('should must provide User not found', async () => {
		const fakeUser = {
			email: 'failUser@gmail.com',
			password: '123456Secret',
		}
		await api
			.post('/api/user/login')
			.send(fakeUser)
			.expect(404)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Unregistered user')
			})
	})

	it('should must provide password does not match', async () => {
		const fakePassUser = {
			email: 'user@gmail.com',
			password: '123456FailSecret',
		}
		await api
			.post('/api/user/login')
			.send(fakePassUser)
			.expect(403)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid password')
			})
	})

	it('should must provide unconfirmed user', async () => {
		await testHelp.createUser(testHelp.newUser)
		const User = {
			email: 'john_doe@gmail.com',
			password: '123456Secret',
		}
		await api
			.post('/api/user/login')
			.send(User)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Your account has not been confirmed')
			})
	})
})

describe('# GET confirmed user', () => {
	it('should return confirmed user', async () => {
		await testHelp.createUser(testHelp.newUser)

		await api
			.get(`/api/user/confirmed/${testHelp.newUser.token}`)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe(
					'User confirmed and created successfully'
				)
			})
	})

	it('should must provide Invalid Token', async () => {
		await api
			.get(`/api/user/confirmed/${testHelp.fakeToken}`)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Token')
			})
	})
})

describe('# POST forget password ', () => {
	it('should must provide password recovery instructions', async () => {
		const loginUser = {
			email: 'user@gmail.com',
			password: '123456Secret',
		}
		await api
			.post('/api/user/forget-password')
			.send(loginUser)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe(
					'Instructions have been sent to your email'
				)
			})
	})

	it('should must provide Unregistered user', async () => {
		const fakeUser = {
			email: 'failUser@gmail.com',
			password: '123456Secret',
		}
		await api
			.post('/api/user/login')
			.send(fakeUser)
			.expect(404)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Unregistered user')
			})
	})
})

describe('# GET Check token for password', () => {
	it('should return Valid token and user exists', async () => {
		await testHelp.createUser(testHelp.newUser)

		await api
			.get(`/api/user/forget-password/${testHelp.newUser.token}`)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Valid token and user exists')
			})
	})

	it('should must provide Invalid Token', async () => {
		await api
			.get(`/api/user/forget-password/${testHelp.fakeToken}`)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Token')
			})
	})
})

describe('# POST Create new password', () => {
	it('should return Password changed successfully', async () => {
		await testHelp.createUser(testHelp.newUser)
		const userPass = {
			password: '123456NewSecret',
		}
		await api
			.post(`/api/user/forget-password/${testHelp.newUser.token}`)
			.send(userPass)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Password changed successfully')
			})
	})

	it('should must provide Invalid Token', async () => {
		await api
			.post(`/api/user/forget-password/${testHelp.fakeToken}`)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Token')
			})
	})
})

describe('# GET profile user', () => {
	it('should return confirmed user', async () => {
		const userFound = await testHelp.findUserByMail()
		const jwt = await generateJWT(userFound.id)
		await api
			.get(`/api/user/${userFound.id}`)
			.set('Authorization', `Bearer ${jwt}`)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body).toHaveProperty('id')
			})
	})

	it('should must provide non-existent web token', async () => {
		await api
			.get(`/api/user/${testHelp.fakeId}`)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid or non-existent web token')
			})
	})

	it('should must provide Invalid JWT', async () => {
		await api
			.get(`/api/user/${testHelp.fakeId}`)
			.set('Authorization', `Bearer ${testHelp.fakeToken}`)
			.expect(403)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Web Token')
			})
	})
})

describe('# PUT Update user', () => {
	it('should return update user', async () => {
		const userFound = await testHelp.findUserByMail()
		const jwt = await generateJWT(userFound.id)

		await api
			.put(`/api/user/${userFound.id}`)
			.set('Authorization', `Bearer ${jwt}`)
			.send(testHelp.modifiedUser)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body).toHaveProperty('id')
				expect(res.body.email).toBe('modifiedUser@gmail.com')
			})
	})

	it('should must provide non-existent web token', async () => {
		await api
			.get(`/api/user/${testHelp.fakeId}`)
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid or non-existent web token')
			})
	})

	it('should must provide Invalid JWT', async () => {
		await api
			.get(`/api/user/${testHelp.fakeId}`)
			.set('Authorization', `Bearer ${testHelp.fakeToken}`)
			.expect(403)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Web Token')
			})
	})

	it('should return Email is already in use', async () => {
		await testHelp.createUser(testHelp.newUser)
		const userFound = await testHelp.findUserByMail()
		const jwt = await generateJWT(userFound.id)
		const existUser = {
			...testHelp.defaultUser,
			email: 'john_doe@gmail.com',
		}

		await api
			.put(`/api/user/${userFound.id}`)
			.set('Authorization', `Bearer ${jwt}`)
			.send(existUser)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('That email is already in use')
			})
	})
})

describe('# PATCH Update password', () => {
	it('should return update password successfully', async () => {
		const userFound = await testHelp.findUserByMail()
		const jwt = await generateJWT(userFound.id)
		const changePass = {
			oldPassword: testHelp.defaultUser.password,
			password: '123456NewPassword',
		}

		await api
			.patch('/api/user/update-password')
			.set('Authorization', `Bearer ${jwt}`)
			.send(changePass)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Password Updated Successfully')
			})
	})

	it('should must provide non-existent web token', async () => {
		await api
			.patch('/api/user/update-password')
			.expect(401)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid or non-existent web token')
			})
	})

	it('should must provide Invalid JWT', async () => {
		await api
			.patch('/api/user/update-password')
			.set('Authorization', `Bearer ${testHelp.fakeToken}`)
			.expect(403)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid Web Token')
			})
	})

	it('should return Invalid password', async () => {
		const userFound = await testHelp.findUserByMail()
		const jwt = await generateJWT(userFound.id)
		const changePass = {
			oldPassword: '123456FakePassword',
			password: '123456NewPassword',
		}

		await api
			.patch('/api/user/update-password')
			.set('Authorization', `Bearer ${jwt}`)
			.send(changePass)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect((res) => {
				expect(res.body.msg).toBe('Invalid password')
			})
	})
})
