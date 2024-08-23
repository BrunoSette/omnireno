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
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const responseText = await response.text();
    console.log("Response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
    }

    if (response.ok) {
      console.log("Success:", result);
      alert("Email sent successfully");
      form.reset();
    } else {
      console.error("Error data:", result);
      alert(`Failed to send email: ${result?.error || responseText}`);
    }
  } catch (error) {
    console.error("Catch block error:", error);
    alert("Error: " + error.message);
  }
}
