'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert(  
			'Users',
			[
				{
				id : '69a6d512-03fa-4f73-854d-56b6aab14c45',
				name: 'Demo',
				surname: 'Demo',
				username: 'demo_d',
				email: 'demo@gmail.com',
				password: '$2b$10$eWBn1ykJ7sD4SJytJm5Jd.WxCoHT60ZdcQ1UtIK4Q.2shBiFuWr0m',
				confirmed: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				},
				{
				id : '4bd69f8-350c-44db-a435-a41dcb90c9b3',
				name: 'User',
				surname: 'User',
				username: 'user_d',
				email: 'user@gmail.com',
				password: '$2b$10$LfpYHJBrnOwQ2Lku3MVixO.eagVEio0OnDfs7C9I3SDdS6JNhYWLW',
				confirmed: true,				
				createdAt: new Date(),
				updatedAt: new Date(),
				},
			],
			{},
    );
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('Users', null, {});
	},
}
