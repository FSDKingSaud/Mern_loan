// import ReactDOMServer from "react-dom/server";
// import sendEmail from "./sendEmail";
// import EmailTemplate from "../src/components/shared/EmailTemplate";



// const handleSendEmail = ({headline, firstName, content, buttonText, cta, closingRemark, email, subject}) => {
//     const emailTemplateHtml = ReactDOMServer.renderToString(
//       EmailTemplate
//         headline={headline}
//         firstName={firstName}
//         content={content}
//         buttonText={buttonText}
//         cta={cta}
//         closingRemarks={closingRemark}
      
//     );
//     const options = {
//       email: email,
//       subject: subject,
//       html: emailTemplateHtml,
//     };
//     sendEmail(options);
// };
  
// export default handleSendEmail;