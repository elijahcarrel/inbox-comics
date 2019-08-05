import moment from "moment";
import { sendEmail } from "./main";

export const sendContactEmail = async (name: string, fromEmail: string, subject: string, message: string) => {
  const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  const body = `
<html>
<head>
  <title>${subject}</title>
  <style>
	  .appleLinksBlack a {color: #000000 !important; text-decoration: none;}
  </style>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="font-size:1.2em;">
        <div id="email" style="padding-left: 10px; padding-right: 10px; text-align: left; max-width: 650px;
        line-height: 1.5; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; color: #000000;">
          <a href="${process.env.domain}">
          	<div style="border-bottom: 2px solid rgb(186,1,6); position:relative;">
	          	<a href="${process.env.domain}">
	          	<img src="http://www.inboxcomics.com/images/stampandtext.png"
	              srcset="http://www.inboxcomics.com/images/stampandtext@2x.png 2x"
	              style="padding-bottom:0px; width:350px; margin-bottom:0px;
	              margin-left:-1px; font-weight:bold; font-size: 1.2em;
	              font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; color: #000000;"
	              alt="Inbox Comics" /></a><br>
            </div>
          </a>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; font-weight: 400;
          color: #000000 !important; text-decoration:none !important;">
            <b>${name}</b> <span style="text-decoration: none; color: black;">&lt;${fromEmail}&gt;</span><br>
            <span style="color: grey; font-style: italic;">${date}</span><br>
          </p>
          <h3 style="border-bottom: 1px solid #ddd;
           font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;"
          class="appleLinksBlack">
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; font-weight: 400;
          color: #000000 !important; text-decoration:none !important;">
            ${message}
          </p>
          <p style="color: grey; font-style: italic;
           font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
          {accountaddress}
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return await sendEmail("support@inboxcomics.com", subject, body, fromEmail);
};
