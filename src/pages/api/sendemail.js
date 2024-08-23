import sgMail from "@sendgrid/mail";

export const POST = async ({ request }) => {
  console.log("Received POST request to /api/sendemail");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    if (!import.meta.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      throw new Error("SENDGRID_API_KEY is not set");
    }

    sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

    const data = await request.json();
    console.log("Received data:", data);

    const { name, email, phone, services, budget, notes } = data;

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

    console.log("Attempting to send email with data:", msg);
    const [response] = await sgMail.send(msg);
    console.log("SendGrid API Response:", response);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log("Email sent successfully");
      return new Response(
        JSON.stringify({ message: "Email sent successfully" }),
        {
          status: 200,
          headers,
        },
      );
    } else {
      console.error("SendGrid API Error:", response.body);
      throw new Error(`SendGrid API Error: ${response.statusCode}`);
    }
  } catch (error) {
    console.error("Error in sendemail API route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers,
      },
    );
  }
};
