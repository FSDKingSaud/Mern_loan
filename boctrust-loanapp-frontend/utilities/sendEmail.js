const sendEmail = async (options) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const { email, subject, html } = options;


  const response = await fetch(`${apiUrl}/api/email/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      subject: subject,
      html: html,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data;
};

export default sendEmail;
