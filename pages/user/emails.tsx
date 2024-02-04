import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { format } from "date-fns/format";
import { orderBy } from "lodash";
import { Layout } from "../../common-components/Layout/Layout";
import { Paginate } from "../../common-components/Paginate/Paginate";
import { stringifyGraphQlError, useUrlQuery } from "../../lib/utils";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { UserByEmailResponse } from "./index";
import { ViewEmailLink } from "../../components/ViewEmailLink/ViewEmailLink";

const numEmailsPerPage = 20;

const EmailsPage: React.FunctionComponent = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email || ""}`;
  const title = email ? `Past emails for ${email}` : "Past emails";

  const userByEmailQuery = gql`
        query userByEmail {
            userByEmail(email: "${email}") {
                email
                publicId
                emails {
                    messageId
                    sendTime
                }
            }
        }
    `;

  const getUserResponse = useQuery<UserByEmailResponse>(userByEmailQuery, {
    skip: !urlQueryIsReady,
  });
  const { data, error, loading } = getUserResponse;
  if (error) {
    return <Layout title={title} error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || !data.userByEmail) {
    return <Layout title={title} isLoading />;
  }
  const emails = data.userByEmail?.emails || [];
  const sortedEmails = orderBy(emails, "sendTime", ["desc"]);
  const offset = pageNumber * numEmailsPerPage;
  const numPages = Math.ceil(sortedEmails.length / numEmailsPerPage);
  const visibleEmails = sortedEmails.slice(offset, offset + numEmailsPerPage);
  const uriEncodedEmail = encodeURIComponent(email);

  return (
    <Layout title={title}>
      <CommonLink href={`/user?email=${uriEncodedEmail}`}>
        &lt;&lt; Back to My Account
      </CommonLink>
      <ul>
        {visibleEmails.map(({ messageId, sendTime }) => (
          <li key={messageId}>
            <ViewEmailLink messageId={messageId}>
              {format(sendTime, "EEEE, LLLL do, yyyy, h:mm a")}
            </ViewEmailLink>
          </li>
        ))}
      </ul>
      <Paginate numPages={numPages} onPageChange={setPageNumber} />
    </Layout>
  );
};

export default EmailsPage;
