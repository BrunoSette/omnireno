import { APIRoute } from 'astro';
import sgMail from "@sendgrid/mail";

export const prerender = false;

export const POST: APIRoute = async ({params, request}): Promise<Response> => {
  console.log("Received POST request to /api/sendemail");

  // Enable CORS
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  // );
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  // );

  try {
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return new Response(JSON.stringify({
        error: "SENDGRID_API_KEY is not set"
      }), { status: 400 });
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    let data = Object.fromEntries((await request.formData()).entries());

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

    const msg = {
      to: "brunosette@gmail.com",
      from: "marketing@omnireno.ca",
      cc: "omnireno@robot.zapier.com",
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Services: ${services}
        Budget: ${budget}
        Notes: ${notes}
        UTM Source: ${utm_source}
        UTM Medium: ${utm_medium}
        UTM Campaign: ${utm_campaign}
      `,
    };

    console.log("Attempting to send email with data:", msg);

    const [response] = await sgMail.send(msg);
    console.log("SendGrid API Response:", response);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log("Email sent successfully");
      return new Response(JSON.stringify({
        message: "Email sent successfully",
      }), { status: 200 });
    } else {
      console.error("SendGrid API Error:", response.body);
      return new Response(JSON.stringify({
        error: `SendGrid API Error: ${response.statusCode}`,
      }), { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in sendemail API route:", error);
    return new Response(JSON.stringify({
      error: "Server error",
      details: error.message
    }), { status: 500 });
  }
}
