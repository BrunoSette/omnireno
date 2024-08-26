import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  console.log("Received POST request to /api/sendemail");

  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return res.status(500).json({ error: "SENDGRID_API_KEY is not set" });
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    let data;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    console.log("Received data:", data);

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
      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      console.error("SendGrid API Error:", response.body);
      return res
        .status(500)
        .json({ error: `SendGrid API Error: ${response.statusCode}` });
    }
  } catch (error) {
    console.error("Error in sendemail API route:", error);
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
}
