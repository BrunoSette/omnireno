document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  } else {
    console.error("Form not found");
  }
});

async function handleSubmit(event) {
  event.preventDefault();
  console.log("Form submission started");

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log("Form data:", data);

  try {
    console.log("Sending request to /api/sendemail");
    const response = await fetch("/api/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response received:", response);
    console.log("Response status:", response.status);

    const responseText = await response.text();
    console.log("Response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      result = { error: "Invalid response from server" };
    }

    if (response.ok) {
      console.log("Success:", result);
      alert(result.message || "Email sent successfully");
      form.reset();
    } else {
      console.error("Error data:", result);
      alert(
        `Failed to send email: ${result.error || "Unknown error occurred"}`,
      );
    }
  } catch (error) {
    console.error("Catch block error:", error);
    alert("Error: " + error.message);
  }
}
