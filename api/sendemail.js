const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (event) {
  try {
    // Log the incoming event body for debugging
    console.log("Event Body:", event.body);

    // Check if the event body is present and in JSON format
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No data provided" }),
      };
    }

    // Parse the JSON body from the request
    const data = JSON.parse(event.body);

    // Destructure the data to extract the required fields
    const { name, email, phone, services, budget, notes } = data;

    // Ensure all required fields are present
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Create the email message
    const msg = {
      to: "brunosette@gmail.com",
      from: "marketing@omnireno.ca",
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Services: ${services}
        Budget: ${budget}
        Notes: ${notes}
      `,
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent");

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
