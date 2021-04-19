import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useToasts } from "react-toast-notifications";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";

interface Props {
  enabled: boolean;
  email: string;
  publicId: string;
  onSetNewEnabledValue: (newEnabledValue: boolean) => void;
}

type PutUserResult = {
  enabled: boolean;
};

export const AccountEnabledSection = (props: Props) => {
  const { enabled, publicId, onSetNewEnabledValue, email } = props;
  const { addToast } = useToasts();

  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        enabled
      }
    }
  `;
  const [putUserMutation] = useMutation<PutUserResult>(mutation);
  const updatedEnabledStatus = async (newEnabledValue: boolean) => {
    return handleGraphQlResponse(
      putUserMutation({
        variables: {
          publicId,
          user: {
            email,
            publicId,
            enabled: newEnabledValue,
          },
        },
      }),
    );
  };

  if (!enabled) {
    return (
      <H3>
        However, your account is <DynamicText>disabled</DynamicText>, so you
        won&apos;t receive any more emails from us.{" "}
        <CommonLink
          onClick={async () => {
            // Because this shouldn't fail, we optimistically call
            // onSetNewEnabledValue before awaiting the result.
            onSetNewEnabledValue(true);
            const result = await updatedEnabledStatus(true);
            if (result.success) {
              addToast(`Account is now enabled.`, toastType.success);
            } else {
              addToast(
                `Could not enable account: ${result.combinedErrorMessage}`,
                toastType.error,
              );
            }
          }}
        >
          Re-enable it.
        </CommonLink>
      </H3>
    );
  }
  return (
    <H3>
      Your account is <DynamicText>enabled</DynamicText>.{" "}
      <CommonLink
        onClick={async () => {
          // Because this shouldn't fail, we optimistically call
          // onSetNewEnabledValue before awaiting the result.
          onSetNewEnabledValue(false);
          const result = await updatedEnabledStatus(false);
          if (result.success) {
            addToast(`Account is now disabled.`, toastType.success);
          } else {
            addToast(
              `Could not disable account: ${result.combinedErrorMessage}`,
              toastType.error,
            );
          }
        }}
      >
        Disable it.
      </CommonLink>
    </H3>
  );
};
