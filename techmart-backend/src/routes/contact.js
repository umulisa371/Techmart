const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. EMAIL TO YOU (ADMIN)
    await transporter.sendMail({
      from: `"TechMart Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    // 2. AUTO CONFIRMATION EMAIL TO CLIENT
    await transporter.sendMail({
      from: `"S&VMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message ✔",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for contacting us. We have received your message and will reply soon.</p>
        <hr/>
        <p><b>Your message:</b></p>
        <p>${message}</p>
        <br/>
        <p>Best regards,<br/>S&VMart  Team</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
};

module.exports = sendContactEmail;