console.log("Contact form script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const form = document.getElementById("contact-form");
  if (form) {
    console.log("Form found");
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
      credentials: "include",
    });

    console.log("Response received:", response);

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      alert("Email sent successfully");
      form.reset();
    } else {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error;
      } catch (e) {
        errorMessage = await response.text();
      }
      console.error("Error data:", errorMessage);
      alert(`Failed to send email: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Catch block error:", error);
    alert("Error: " + error.message);
  }
}
