import { Moment } from "moment-timezone";
import uuid from "uuid";
import { sendEmail } from "../send-email";

export interface ComicForEmail {
  syndicationName: string;
  wasUpdated: boolean;
  imageUrl: string | null;
  imageCaption: string | null;
}

export interface SendComicEmailOptions {
  // Send all comics, regardless of if they were updated. Default: false.
  sendAllComics?: boolean;
  // Mention comics that were not updated (as opposed to just omitting them from the email entirely). Default: true.
  mentionNotUpdatedComics?: boolean;
}

// TODO(ecarrel): clean this up a ton (or scrap it entirely).
const generateHtmlForComic = (comic: ComicForEmail, options: SendComicEmailOptions) => {
  const { imageUrl, syndicationName, wasUpdated, imageCaption } = comic;
  const imageCaptionToDisplay = (imageCaption) ? `<br /> ${imageCaption}` : "";
  const { sendAllComics = false, mentionNotUpdatedComics = true } = options;
  if (wasUpdated) {
    return `
    	<h3 style="border-bottom: 1px solid #ddd; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
    	 serif; color: #000000 !important; text-decoration:none !important;">
    	 ${syndicationName}
       <a href="${imageUrl}" style="color: rgb(186,1,6); font-weight: bold; font-family: Palatino, 'Palatino Linotype',
        'Book Antiqua', Georgia, serif;">
          <img src="${process.env.domain}/static/images/external-link-icon.png" style="width:16px;">
        </a>
      </h3>
		  <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
        <img src="${imageUrl}" style="height:auto; max-width:100%;" />
        ${imageCaptionToDisplay}
		  </p>
`;
  } else if (imageUrl == null) {
    // This only happens when the syndication has never, ever been updated.
    return `
    	<h3 style="border-bottom: 1px solid #ddd; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
    	 serif; color: #000000 !important; text-decoration:none !important;">
    	 ${syndicationName}
      </h3>
		  <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
		    ${syndicationName} wasn't updated today.
		  </p>
`;
  } else if (sendAllComics) {
    return `
    	<h3 style="border-bottom: 1px solid #ddd; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
    	 serif; color: #000000 !important; text-decoration:none !important;">
    	 ${syndicationName}
       <a href="${imageUrl}" style="color: rgb(186,1,6); font-weight: bold; font-family: Palatino, 'Palatino Linotype',
        'Book Antiqua', Georgia, serif;">
          <img src="${process.env.domain}/static/images/external-link-icon.png" style="width:16px;">
        </a>
      </h3>
		  <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
		    ${syndicationName} wasn't updated today, but here's the most recent comic.
        <img src="${imageUrl}" style="height:auto; max-width:100%;" />
        ${imageCaptionToDisplay}
		  </p>
`;
  } else if (mentionNotUpdatedComics) {
    return `
    	<h3 style="border-bottom: 1px solid #ddd; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
    	 serif; color: #000000 !important; text-decoration:none !important;">
    	 ${syndicationName}
      </h3>
		  <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
		    ${syndicationName} wasn't updated today.
        <a href="${imageUrl}" style="color: rgb(186,1,6); font-weight: bold; font-family: Palatino, 'Palatino Linotype',
         'Book Antiqua', Georgia, serif;">See the most recent comic.
        </a>
      </p>
`;
  }
};

export const sendComicEmail = async (
  email: string,
  comics: ComicForEmail[],
  options: SendComicEmailOptions = {},
  date: Moment,
  googleAnalyticsHash: string = uuid.v4(),
) => {
  // tslint:disable-next-line max-line-length
  const updateSubscriptionsUrl = `${process.env.domain}/user?email=${encodeURIComponent(email)}&utm_source=dailycomics&utm_medium=email&utm_term=$dateanalytics&utm_campaign=dailycomics`;
  // tslint:disable-next-line max-line-length
  const subject = `Inbox Comics for ${date.format("MMMM Do, YYYY")}`;
  const googleAnalyticsUrl = `https://www.google-analytics.com/collect?v=1&tid=UA-75894353-1&cid=${googleAnalyticsHash}&t=event&ec=email&ea=open&dp=/email/dailycomics&dt=${subject}&cn=dailycomics&cm=email`;
  const body = `<html>
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
          <a href="${process.env.domain}/">
          	<div style="border-bottom: 2px solid rgb(186,1,6); position:relative;">
	          	<a href="${process.env.domain}/">
                <img src="${process.env.domain}/static/images/stamp-and-text-transparent.png"
                  srcset="${process.env.domain}/static/images/stamp-and-text-transparent@2x.png 2x"
                  style="padding-bottom:0px; width:350px; margin-bottom:0px;
                  margin-left:-1px; font-weight:bold; font-size: 1.2em;
                  font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; color: #000000;"
                  alt="Inbox Comics" />
	            </a>
	            <br>
            </div>
          </a>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
            Good morning! Here are today's comics.
          </p>
          ${comics.map((comic) => generateHtmlForComic(comic, options)).join("")}
          <h3 style="border-bottom: 1px solid #ddd; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia,
           serif;" class="appleLinksBlack">That's all for today!</h3>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">If you would rather get
           more comics, less comics, different comics, or none at all, you can
          <a href="${updateSubscriptionsUrl}"
          style="color: rgb(186,1,6); font-weight: bold; font-family: Palatino, 'Palatino Linotype', 'Book Antiqua',
          Georgia, serif;">change your subscription settings</a> at any time.
          If you have any other questions, hit the reply button and let us know!</p>
          <p style="color: #AAAAAA; font-style: italic; font-style: italic; font-family: Palatino,
          'Palatino Linotype', 'Book Antiqua', Georgia, serif;">Brought to you with ♥ from Team Inbox Comics.</p>
          <p style="color: #AAAAAA; font-style: italic; font-style: italic; font-family: Palatino,
          'Palatino Linotype', 'Book Antiqua', Georgia, serif;">{accountaddress}</p>
        </div>
      </td>
    </tr>
  </table>
  <img src="${googleAnalyticsUrl}"/>
</body>
</html>
`;
  return await sendEmail(email, subject, body);
};
