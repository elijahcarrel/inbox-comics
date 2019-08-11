import { sendEmail } from "./send-email";

export const sendVerificationEmail = async (email: string, verificationHash: string) => {

  const uriEncodedEmail = encodeURIComponent(email);
  const verificationLink =
    `${process.env.domain}/user/verify?email=${uriEncodedEmail}&verificationHash=${verificationHash}`;
  const body = `<html>
<head>
  <title>$subject</title>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="font-size:1.2em;">
        <div id="email" style="padding-left: 10px; padding-right: 10px; text-align: left; max-width: 650px;
        line-height: 1.5; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; color: #000000;">
          <a href="${process.env.domain}"><div style="border-bottom: 2px solid rgb(186,1,6); position:relative;"><img
          src="
          "
              style="padding-bottom:0px; width:420px; margin-bottom:0px;
              margin-left:-1px; font-weight:bold; font-size: 1.2em;"
              alt="Inbox Comics" /><br></div></a>
              <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; font-weight: 400;
            color: #000000 !important; text-decoration:none !important;">
          Hey there! Thanks for subscribing to Inbox Comics!</p>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; font-weight: 400;
            color: #000000 !important; text-decoration:none !important;">Before we can send you daily comics, we
            need you to <a href="${verificationLink}"
          style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
          color: rgb(186,1,6); font-weight: bold; text-decoration: underline;">click here to
          verify your email</a>.</p>
          <p>
         </p>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
          serif;">If you're having trouble, copy and paste the link below into your browser.
          <br><a href="${verificationLink}"
          style="color: rgb(186,1,6) !important; text-decoration: underline !important;">
          ${verificationLink}</a></p>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; font-weight: 400;
            color: #000000 !important; text-decoration:none !important;"> If you have any other questions,
            hit the reply button and let us know!</p>
          <p style="color: #AAAAAA; font-style: italic; font-style: italic; font-family: Palatino,
          'Palatino Linotype', 'Book Antiqua', Georgia, serif;">Brought to you with ♥ from Team Inbox Comics.</p>
          <p style="color: #AAAAAA; font-style: italic; font-style: italic; font-family: Palatino,
          'Palatino Linotype', 'Book Antiqua', Georgia, serif;">{accountaddress}</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return await sendEmail(email, "Verify your Inbox Comics Subscription", body);
};
