import mailer from 'nodemailer'

const emailLostPassword = async (dataMail) => {
	const transporter = mailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	const { email, name, surname, token } = dataMail

	//Enviar el email
	const info = await transporter.sendMail({
		from: 'Administrador de Usuarios',
		to: email,
		subject: 'Reestablecer tu Password',
		text: 'Reestablece tu Password',
		html: `<p>Hola: ${name} ${surname}, has solicitado reeestablecer tu password para tener acceso a tu cuenta.</p>
          <p>Has click en el siguiente enlace para generar un nuevo password::
          <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer Password</a> </p>
  
          <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
	})

	console.log('Mensaje enviado: %s', info.messageId)
}

export default emailLostPassword
