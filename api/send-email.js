const nodemailer = require('nodemailer');
const formidable = require('formidable-serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing the form:', err);
            return res.status(500).send('Error parsing the form');
        }

        // Extract data
        const title = fields.pageTitle;
        const htmlFile = files.fileUpload;

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'gabrieloncoffee@outlook.com',
            subject: `New Submission: ${title}`,
            text: `A new submission has been received with the title: ${title}`,
            attachments: [{
                filename: htmlFile.name,
                path: htmlFile.path
            }]
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    });
};
