import { Moment } from "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import { sendElasticEmail } from "../send-elastic-email";
import { now } from "../../../util/date";

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
const generateHtmlForComic = (
  comic: ComicForEmail,
  options: SendComicEmailOptions,
) => {
  const { imageUrl, syndicationName, wasUpdated, imageCaption } = comic;
  const imageCaptionToDisplay = imageCaption ? `<br /> ${imageCaption}` : "";
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
  }
  if (imageUrl == null) {
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
  }
  if (sendAllComics) {
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
  }
  if (mentionNotUpdatedComics) {
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
  return null;
};

// TODO(ecarrel): this is the worst. Replace this with a data-driven model,
// connected to the "newsitems" table we already have.
const customMessages: Record<string, string> = {
  "May 27th, 2020": `
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hi everyone,
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Thanks to those who wrote in to note that your comics weren't coming through yesterday or today! As comic fans ourselves, we recognize the small but substantial benefits a bit of humor can have first thing in the morning, especially considering these crazy times.
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    So, good news! We've found and fixed the problem (as you can see!). Note that the comics you're receiving in this email might be a couple days old while our system is still recuperating, but you should resume getting your comics as usual first thing tomorrow morning.
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    We greatly appreciated your patience as we figured this out. Your kind messages and thoughtful notes are inspiring, and remind us why we run this service, completely free and ad-free, in the first place!
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hope everyone is staying safe. Remember to wash your hands often, wear masks, and practice good social-distancing habits— it could save lives!
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    All the best,<br />
    Gabe and Elijah<br />
    Team Inbox Comics
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Without further ado, here are today's comics.
</p>
`,
  "March 23rd, 2021": `
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hi everyone,
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    As many of you noted, several of our most popular comics (including Zits, Hagar the Horrible, Beetle Bailey, and others) weren't updating since last Wednesday. We have now fixed the issue and comics should be coming through as normal. 
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Enjoy your comics, stay safe, and (if and when it is available to you) be sure to get vaccinated!
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    All the best,<br />
    Gabe and Elijah<br />
    Team Inbox Comics
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Without further ado, here are today's comics.
</p>
`,
  "May 25th, 2021": `
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hi everyone,
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    As many of you noted, several of our most popular comics (including Dilbert, Mutts, and others) weren't updating correctly since last Wednesday. Sorry about this! We have now fixed the issue and comics should be coming through as normal.
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Cheers,<br />
    Gabe and Elijah<br />
    Team Inbox Comics
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Without further ado, here are today's comics.
</p>
`,
  "August 9th, 2022": `
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hi all,
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    It’s been a while since we shared an Inbox Comics update with you all— or more accurately, a while since we’ve had an issue to write about!
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    We wanted to send a quick note to say that we know some of you received multiple (or 113…) emails from us yesterday, but the problem has been identified and should now be fixed. One of the services we use to send emails apparently failed to report the messages as “sent,” so our other service just kept them coming. But don’t worry, this should be the only email you receive from us today!! 😊
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Thanks to everyone who wrote us about the problem. For our newer subscribers, we’re a two-person team who work on Inbox Comics in our spare time, and fund the service and email delivery out of pocket (and we promise never to sell your data or put ads in our emails!).
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    We don’t have any other updates to share at this time, except to say that we’re still excited about this passion project and will continue running the site for as long as we can! Thanks for your patience with us and for your continued support.
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Please let us know if you continue to have issues.
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    All the best,<br />
    Elijah and Gabe,<br />
    Team Inbox Comics
</p>
`,
  "February 29th, 2023": `
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Hi all,
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    We wanted to let you know that in light of deeply offensive comments recently made by Dilbert creator Scott Adams, we have decided to remove Dilbert from the Inbox Comics platform. We know Dilbert is a favorite comic for many of you as well as for us, and we do not make this decision lightly. We reached this decision with input from the Inbox Comics community, and we welcome all thoughts and concerns moving forward as well. Here's to hoping that the gap some of you will see in your morning emails makes way for a new favorite comic strip you can enjoy!
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    All the best,<br />
    Elijah and Gabe,<br />
    Team Inbox Comics
</p>
<p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Without further ado, here are today's comics.
</p>
`,
};

export const sendComicEmail = async (
  email: string,
  comics: ComicForEmail[],
  options: SendComicEmailOptions = {},
  date: Moment = now(),
  googleAnalyticsHash: string = uuidv4(),
) => {
  // eslint-disable-next-line  max-len
  const updateSubscriptionsUrl = `${
    process.env.domain
  }/user?email=${encodeURIComponent(
    email,
  )}&utm_source=dailycomics&utm_medium=email&utm_term=$dateanalytics&utm_campaign=dailycomics`;
  // eslint-disable-next-line  max-len
  const formattedDate = date.format("MMMM Do, YYYY");
  const subject = `Inbox Comics for ${formattedDate}`;
  const googleAnalyticsUrl = `https://www.google-analytics.com/collect?v=1&tid=UA-75894353-1&cid=${googleAnalyticsHash}&t=event&ec=email&ea=open&dp=/email/dailycomics&dt=${subject}&cn=dailycomics&cm=email`;
  let message = `
  <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
    Good morning! Here are today's comics.
  </p>`;
  if (customMessages[formattedDate] != null) {
    message = customMessages[formattedDate];
  }
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
                <img src="${
                  process.env.domain
                }/static/images/stamp-and-text-transparent.png"
                  srcset="${
                    process.env.domain
                  }/static/images/stamp-and-text-transparent@2x.png 2x"
                  style="padding-bottom:0px; width:350px; margin-bottom:0px;
                  margin-left:-1px; font-weight:bold; font-size: 1.2em;
                  font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; color: #000000;"
                  alt="Inbox Comics" />
	            </a>
	            <br>
            </div>
          </a>
          <p style="font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif;">
            ${message}
          </p>
          ${comics
            .map((comic) => generateHtmlForComic(comic, options))
            .join("")}
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
  try {
    return await sendElasticEmail(email, subject, body);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
};
