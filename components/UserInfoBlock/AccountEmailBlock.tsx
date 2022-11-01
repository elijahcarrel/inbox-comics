import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import * as yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import Router from "next/router";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { Button } from "../../common-components/Button/Button";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";
import styles from "./AccountEmailBlock.module.scss";
import toast from "react-hot-toast";

interface Props {
  email: string;
  publicId: string;
}

interface UpdateUserFormValues {
  email: string;
}

type PutUserResult = {
  email: string;
};

export const AccountEmailBlock = (props: Props) => {
  const { publicId, email } = props;
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        email
      }
    }
  `;
  const [putUserMutation, { loading }] = useMutation<PutUserResult>(mutation);

  const formikConfig = {
    initialValues: {
      email,
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Must provide a valid email.")
        .required("Email is required."),
    }),
    onSubmit: async (
      newValues: UpdateUserFormValues,
      { setSubmitting }: FormikHelpers<UpdateUserFormValues>,
    ) => {
      const result = await handleGraphQlResponse(
        putUserMutation({
          variables: {
            publicId,
            user: {
              email: newValues.email,
              publicId,
            },
          },
        }),
      );
      const { success, combinedErrorMessage } = result;
      if (success) {
        toast.success(
          `Successfully updated email to ${newValues.email}.`,
        );
        await Router.push({
          pathname: "/user",
          query: {
            email: newValues.email,
            oldEmail: email,
          },
        });
      } else {
        toast.success(combinedErrorMessage);
      }
      setSubmitting(false);
    },
  };
  const {
    handleSubmit,
    handleReset,
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
  } = useFormik(formikConfig);

  if (isEditingEmail) {
    return (
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (values.email === email) {
            setIsEditingEmail(false);
            return;
          }
          handleSubmit(e);
        }}
        className={styles.form}
      >
        <H3 className={styles.yourEmailIsText}>Your email is:</H3>
        <TextInput
          name="email"
          value={values.email}
          hasError={!!(touched.email && errors.email)}
          helperText={touched.email ? errors.email : undefined}
          onChange={(newEmail: string) => setFieldValue("email", newEmail)}
          type="email"
          placeholder="Email"
          className={styles.emailInput}
        />
        <Button type="submit" disabled={isSubmitting || loading}>
          Update
        </Button>
        <H3 className={styles.cancelLink}>
          <CommonLink
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore type for handleReset is wrong?
              handleReset();
              setIsEditingEmail(false);
            }}
          >
            {" "}
            Cancel Edit.
          </CommonLink>
        </H3>
        {(isSubmitting || loading) && <LoadingOverlay />}
      </form>
    );
  }
  return (
    <H3>
      Your email is <DynamicText>{email}</DynamicText>.{" "}
      <CommonLink onClick={() => setIsEditingEmail(true)}>Edit it.</CommonLink>
    </H3>
  );
};
