
const nodemailer = require("nodemailer");
const { format } = require("date-fns");
const senderEmail = process.env.EMAIL_ADDRESS_OWNER;
const senderPassword = process.env.EMAIL_ADDRESS_PW;

import { formatAmount } from "./../../plugins/filters"
// Send email notification
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderEmail,
        pass: senderPassword,
    },
});

const sendTicketInfo = (ticket) => {
    const total_amount = formatAmount(ticket.total_amount);
    const dateString = ticket.date.toISOString().slice(0, 10);
    const date = new Date(dateString);
    const formattedDate = format(date, "EEEE, MMMM do yyyy");
    const emailTemplate = `
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Bus Ticket Booking Details</title>
      <style>
        /* Include the Montserrat font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

        /* Apply the font to the <body> element */
        body {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }

        /* Apply additional styles as needed */
        table {
          border-collapse: collapse;
          max-width: 500px;
          width: 100%;
          margin-bottom: 1em;
        }

        td {
          padding: 0.5em;
          border: 2px solid #ccc;
        }

        /* Add more styles here... */
      </style>
    </head>
    <body>
      <p>Dear ${ticket.cust_name},</p>
      <p>Thank you for choosing our bus ticketing app for your upcoming trip. We are excited to provide you with a hassle-free experience and look forward to serving you.</p>
      <p>Your booking details are as follows:</p>
      <table>
        <tr>
            <td>Date:</td>
            <td>${formattedDate}</td>
        </tr>
        <tr>
            <td>Ticket ID:</td>
            <td>${ticket.ticket_id}</td>
        </tr>
        <tr>
          <td>Pickup Location:</td>
          <td>${ticket.pickup}</td>
        </tr>
        <tr>
          <td>Destination:</td>
          <td>${ticket.destination}</td>
        </tr>
        <tr>
          <td>Seats:</td>
          <td>${ticket.seats}</td>
        </tr>
        <tr>
          <td>Amount Payable:</td>
          <td>${total_amount}</td>
        </tr>
      </table>
      <p>PLEASE MAKE PAYMENTS AT THE TERMINAL AT LEAST 1 HOUR BEFORE DEPATURE TO AVOID LOOSING YOUR SEAT RESERVATION.</p>
      <p>We appreciate your patronage, and want to ensure that your travel experience is as smooth as possible. Please double-check your booking details to ensure that all details are correct.</p>
      <p>If you have any questions or concerns, please do not hesitate to contact us via email: nmb.bus.solutions@gmail.com or Phone: +234 80 980 0000. We are always here to help.</p>
      <p>For cancellation, refunds, and rescheduling, please ensure to reach out 3 hours before departure to avoid penalties.</p>
      <p>Thank you for choosing our service and we wish you a safe and enjoyable journey!</p>
    </body>
  </html>
`;

    transporter.sendMail({
        to: ticket.cust_email, // temporary
        from: senderEmail,
        subject: "NMBBS Ticket Information",
        html: emailTemplate,
    });
};

const sendPaymentUpdateInfo = (ticket) => {
  const total_amount = formatAmount(ticket.total_amount);
  const status = ticket.status ? "Paid" : "Unpaid";
  const emailTemplate = `
<html>
<head>
    <meta charset="UTF-8">
    <title>Bus Ticket Booking Details - ID: ${ticket.ticket_id}</title>
    <style>
      /* Include the Montserrat font from Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

      /* Apply the font to the <body> element */
      body {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }

      /* Apply additional styles as needed */
      table {
        border-collapse: collapse;
        max-width: 500px;
        width: 100%;
        margin-bottom: 1em;
      }

      td {
        padding: 0.5em;
        border: 2px solid #ccc;
      }

      /* Add more styles here... */
    </style>
  </head>
  <body>
    <p>The payment for the booking below has been confirmed.</p>
    <p>Booking summary:</p>
    <table>
      <tr>
          <td>Ticket ID:</td>
          <td>${ticket.ticket_id}</td>
      </tr>
      <tr>
        <td>Pickup Location:</td>
        <td>${ticket.pickup}</td>
      </tr>
      <tr>
        <td>Destination:</td>
        <td>${ticket.destination}</td>
      </tr>
      <tr>
        <td>Status:</td>
        <td>${status}</td>
      </tr>
      <tr>
        <td>Amount Paid:</td>
        <td>${total_amount}</td>
      </tr>
    </table>
  </body>
</html>
`;

  transporter.sendMail({
      to: ticket.cust_email, // temporary
      from: senderEmail,
      subject: "NMBBS Payment Confirmation",
      html: emailTemplate,
  });
};

module.exports = {
    sendTicketInfo,
    sendPaymentUpdateInfo
};
