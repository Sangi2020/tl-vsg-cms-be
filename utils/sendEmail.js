import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Send contact form submission email
 * @param {Object} enquiryData - The contact form data
 * @returns {Promise} - Email sending result
 */
export const sendContactFormEmail = async (enquiryData) => {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      // For example, using Gmail:
      service: 'gmail',
      auth: {
        user: process.env.FROM_MAIL_ID ,
        pass: process.env.FROM_MAIL_PASSWORD,
      },
      // Or using SMTP:
      // host: process.env.SMTP_HOST,
      // port: process.env.SMTP_PORT,
      // secure: true,
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASSWORD,
      // },
    });

    // Read email template
    const templatePath = path.join(__dirname, '../templates/contactFormEmailTemplate.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    template = template
      .replace('{{name}}', enquiryData.name)
      .replace('{{email}}', enquiryData.email)
      .replace('{{phoneNumber}}', enquiryData.phoneNumber)
      .replace('{{subject}}', enquiryData.subject || 'No Subject')
      .replace('{{message}}', enquiryData.message);

    // Email options
    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'venkatesan@vsgenxsolutions.com',
      subject: 'New Contact Form Submission',
      html: template,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};