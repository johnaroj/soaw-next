
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendNodemailerEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: process.env.STMP_FROM_EMAIL,
        to: options.to ? `${options.to},${process.env.STMP_FROM_EMAIL}` : process.env.STMP_FROM_EMAIL,
        subject: options.subject,
        text: options.message,
        html: options.message
    }

    await transporter.sendMail(message)

}

export const sendSendGridEmail = async options => {
    let message = null;

    if (options.templateId) {
        message = {
            from: process.env.STMP_FROM_EMAIL,
            to: [options.email, process.env.STMP_FROM_EMAIL],
            subject: options.subject,
            templateId: options.templateId,
            dynamic_template_data: options.data
        }
    } else {
        message = {
            from: process.env.STMP_FROM_EMAIL,
            to: [options.email, process.env.STMP_FROM_EMAIL],
            subject: options.subject,
            html: options.html,
            text: options.text,
        }
    }
    await sgMail.send(message).then(() => { }, console.error)
}
