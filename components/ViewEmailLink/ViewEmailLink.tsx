import React, { ComponentProps } from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { mdiOpenInNew } from "@mdi/js";
import Icon from "@mdi/react";
import styles from "./ViewEmailLink.module.scss";

type Props = {
  messageId: string;
} & Omit<ComponentProps<typeof CommonLink>, "isExternal" | "href">

export const ViewEmailLink: React.FunctionComponent<Props> = (props) => {
  const { messageId, children, ...otherProps } = props;
  return (
    <CommonLink
      {...otherProps}
      href={`https://api.elasticemail.com/view?notracking=true&msgid=${messageId}`}
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
}