'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING(100),
				notEmpty: true,
				allowNull: false,
			},
			surname: {
				type: Sequelize.STRING(100),
				notEmpty: true,
				allowNull: false,
			},
			birthday: {
				type: Sequelize.DATE,
			},
			gender: {
				type: Sequelize.ENUM('male', 'female'),
				allowNull: true,
				defaultValue: 'male',
				validate: {
					isIn: [['male', 'female']],
				},
			},
			email: {
				type: Sequelize.STRING,
				notEmpty: true,
				allowNull: false,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			password: {
				type: Sequelize.STRING,
				notEmpty: true,
				allowNull: false,
			},
			token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			confirmed: {
				type: Sequelize.BOOLEAN,
				notEmpty: true,
				allowNull: false,
				defaultValue: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Users')
	},
}
