const EmailTemplate = require("../utils/emailTemp");
const sendEmail = require("../utils/sendEmail");
const { saveAndSendNotification, getUsersToSendNotificationFromTarget } = require("./notification.service");

const sendJobApplicationNotification = async ({name, id, email, vacancy }) => {
    const emailTemp = EmailTemplate({
      buttonText: "",
      buttonLink: "",
      firstName: name,
      headline: "Application Received - Next Steps",
      cta: `<p>If you have any questions, contact our support team at <a href="mailto:support@boctrustmfb.com">support@boctrustmfb.com</a> or call <strong>08177773196</strong>.</p> `,
      content: `
      <p>Thank you for applying for the ${vacancy.jobtitle} position at Boctrust MFB. We have successfully received your application and appreciate your interest in joining our team.</p>
      
      <p>Our hiring team will carefully review your application, and if your qualifications align with our requirements, we will reach out to you for the next steps.</p>
      
      <p>Thank you again for your interest in [Company Name]. We appreciate your time and effort and will update you as soon as possible.</p>
      `,
    });
  
    await sendEmail({
      email: email,
      html: emailTemp,
      subject: "Application Received - Next Steps",
    });
  
   
    const usersToSend = await getUsersToSendNotificationFromTarget("admins");

    await saveAndSendNotification({
      targetUsers: usersToSend,
      message: `New job application by ${name} for ${vacancy.jobtitle} `,
      type: "jobApplication",
      metadata: id,
    });
  };


  module.exports = {
    sendJobApplicationNotification
  }