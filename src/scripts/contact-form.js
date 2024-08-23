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

    if (response.ok) {
      try {
        const result = await response.json();
        console.log("Success:", result);
        alert("Email sent successfully");
        form.reset();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        alert("Email sent, but could not parse response.");
      }
    } else {
      let errorMessage = "Failed to send email";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Error parsing JSON:", e);
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
