import { setApiKey, send } from "@sendgrid/mail";

setApiKey(process.env.SENDGRID_API_KEY);

export async function post({ request }) {
  try {
    const { name, email, phone, services, budget, notes } =
      await request.json();

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

    await send(msg);

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
