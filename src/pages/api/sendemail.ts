import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  console.log("Received POST request to /api/sendemail");

  try {
    // Ensure SendGrid API key is available
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "SENDGRID_API_KEY is not set",
        }),
        { status: 400 },
      );
    }

    // Set SendGrid API key
    sgMail.setApiKey(SENDGRID_API_KEY);

    // Extract form data
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Destructure form data
    const {
      name,
      email,
      phone,
      services,
      budget,
      notes,
      utm_source,
      utm_medium,
      utm_campaign,
    } = data;

    // Prepare email message
    const msg = {
      to: "brunosette@gmail.com", // Your email address
      from: "marketing@omnireno.ca", // Verified sender
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Services: ${services}
        Budget: ${budget}
        Notes: ${notes}
        UTM Source: ${utm_source || "N/A"}
        UTM Medium: ${utm_medium || "N/A"}
        UTM Campaign: ${utm_campaign || "N/A"}
      `,
    };

    console.log("Attempting to send email with data:", msg);

    // Send email using SendGrid
    const [response] = await sgMail.send(msg);
    console.log("SendGrid API Response:", response);

    // Check response status
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log("Email sent successfully");

      return new Response(
        JSON.stringify({
          message: "Email sent successfully",
        }),
        { status: 200 },
      );
    } else {
      console.error("SendGrid API Error:", response.body);
      return new Response(
        JSON.stringify({
          error: `SendGrid API Error: ${response.statusCode}`,
        }),
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in sendemail API route:", error);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
      { status: 500 },
    );
  }
};
