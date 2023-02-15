import mailer from 'nodemailer'

const emailRegister = async (dataMail) => {
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
    from: 'API Service - Administrador de Usuarios',
    to: email,
    subject: 'Comprueba tu cuenta ',
    text: 'Comprueba tu cuenta ',
    html: `<p>Hola: ${name} ${surname}, comprueba tu cuenta.</p>
          <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
          <a href="${process.env.FRONTEND_URL}/confirmed/${token}">Comprobar Cuenta</a> </p>
  
          <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
  })

  console.log('Mensaje enviado: %s', info.messageId)
}

export default emailRegister
