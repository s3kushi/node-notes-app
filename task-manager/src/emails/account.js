const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.duarte@compasso.com.br',
        subject: 'Welcome',
        text: `Welcome, ${name}. Enjoy.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.duarte@compasso.com.br',
        subject: 'Account deletion',
        text: `Hello, ${name}. Your account has been deleted.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}