import React, { ComponentProps } from "react";
import { mdiOpenInNew } from "@mdi/js";
import Icon from "@mdi/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import styles from "./ViewEmailLink.module.scss";
import { toastType } from "../../lib/utils";

type Props = {
  messageId: string;
} & Omit<ComponentProps<typeof CommonLink>, "isExternal" | "href">;

// TODO(ecarrel): this functionality only worked for ElasticEmail and is broken
//  in AWS. Re-implement it.
export const ViewEmailLink: React.FunctionComponent<Props> = (props) => {
  const { messageId, children, ...otherProps } = props;
  const { addToast } = useToasts();
  // AWS message IDs are 60 characters long whereas ElasticEmail message IDs are
  // 23 characters long.
  // TODO(ecarrel): this is an obviously hacky way to figure out if the email
  //  was sent through ElasticEmail or AWS. We should instead track that as a
  //  first-order field in the database.
  const isElasticEmail = messageId.length && messageId.length < 30;
  return (
    <CommonLink
      {...otherProps}
      href={
        isElasticEmail
          ? `https://api.elasticemail.com/view?notracking=true&msgid=${messageId}`
          : undefined
      }
      onClick={
        isElasticEmail
          ? undefined
          : () => addToast("Error viewing email in browser.", toastType.error)
      }
      isExternal
    >
      <>
        {children}
        <Icon
          path={mdiOpenInNew}
          size={1}
          className={styles.externalLinkIcon}
        />
      </>
    </CommonLink>
  );
};
