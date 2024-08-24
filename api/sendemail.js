import sgMail from "@sendgrid/mail";

export const POST = async ({ request }) => {
  console.log("Received POST request to /api/sendemail");
  console.log("Request headers:", Object.fromEntries(request.headers));

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    // Log the request body
    const requestBody = await request.text();
    console.log("Raw request body:", requestBody);

    // Parse the JSON manually to catch any JSON parsing errors
    let data;
    try {
      data = JSON.parse(requestBody);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details: error.message,
        }),
        {
          status: 400,
          headers,
        },
      );
    }

    console.log("Parsed data:", data);

    if (!import.meta.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "SENDGRID_API_KEY is not set" }),
        {
          status: 500,
          headers,
        },
      );
    }

    sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

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

    try {
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
        return new Response(
          JSON.stringify({
            error: `SendGrid API Error: ${response.statusCode}`,
          }),
          {
            status: 500,
            headers,
          },
        );
      }
    } catch (sendGridError) {
      console.error("SendGrid send error:", sendGridError);
      return new Response(
        JSON.stringify({
          error: sendGridError.message || "Failed to send email via SendGrid",
        }),
        {
          status: 500,
          headers,
        },
      );
    }
  } catch (error) {
    console.error("Unexpected error in sendemail API route:", error);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers,
    });
  }
};
