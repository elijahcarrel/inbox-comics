import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import { CommonLink } from "../CommonLink/CommonLink";
import { LinkList } from "../LinkList/LinkList";
import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

interface Props {
  onClickSignUpLink: () => any;
  onFinishLoadingSignUpLink: () => any;
}

export const Header = (props: Props) => {
  const { onClickSignUpLink, onFinishLoadingSignUpLink } = props;
  const { addToast } = useToasts();
  const mutation = gql`
      mutation createUserWithoutEmail {
          createUserWithoutEmail {
              publicId
          }
      }
  `;
  interface CreateUserResponse {
    createUserWithoutEmail: {
      publicId: string;
    };
  }
  const [createUserWithoutEmailMutation] = useMutation<CreateUserResponse>(mutation);
  return (
    <div className={styles.topBar}>
      <div className={styles.logoContainer}>
        <CommonLink
          href="/"
          underline={false}
          lowercase
          className={styles.logoLink}
        >
          <Logo className={styles.logo} />
        </CommonLink>
      </div>
      <div className={styles.spacerElement}>{}</div>
      <div className={styles.menuContainer}>
        <header>
          <nav>
            <LinkList
              elements={[
                // Old sign up page.
                // {
                //   href: "/user/new",
                //   key: "sign-up",
                //   content: "Sign Up",
                // },
                {
                  key: "sign-up",
                  content: "Sign Up",
                  onClick: async () => {
                    onClickSignUpLink();
                    const result = await handleGraphQlResponse(createUserWithoutEmailMutation());
                    const { success, combinedErrorMessage } = result;
                    if (success) {
                      await Router.push({
                        pathname: "/user/comics",
                        query: {
                          publicId: result.result.data.createUserWithoutEmail.publicId,
                          new: true,
                        },
                      });
                    } else {
                      addToast(combinedErrorMessage, toastType.error);
                    }
                    onFinishLoadingSignUpLink();
                  },
                },
                {
                  href: "/user/edit",
                  key: "edit-subscriptions",
                  content: "Edit Subscriptions",
                },
              ]}
              classes={{
                element: styles.linkListElement,
              }}
              wrapWidth="medium"
            />
          </nav>
        </header>
      </div>
    </div>
  );
};
