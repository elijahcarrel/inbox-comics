import { useMutation, useQuery } from "@apollo/client";
import { FormikHelpers, useFormik } from "formik";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import { Button } from "../../common-components/Button/Button";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { H3 } from "../../common-components/H3/H3";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import {
  handleGraphQlResponse,
  stringifyGraphQlError,
  toastType,
  useUrlQuery,
} from "../../lib/utils";
import styles from "./subscribe.module.scss";

interface SubscribeFormValues {
  email: string;
}

// TODO(ecarrel): share type with server API models.
interface User {
  publicId: string;
  email: string;
  syndications: string[];
}

const NewUserPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicId = `${urlQuery.publicId || ""}`;
  const [user, setUser] = useState<User | null>(null);
  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        syndications {
          identifier
        }
      }
    }
  `;
  const [putUserMutation] = useMutation(mutation);

  interface UserQueryResponse {
    userByPublicId: {
      email: string;
      syndications: {
        identifier: string;
      }[];
    };
  }

  const userQuery = gql`
      query userByPublicId {
          userByPublicId(publicId: "${publicId}") {
              email
              publicId
              syndications {
                  identifier
              }
          }
      }
  `;
  const userQueryResponse = useQuery<UserQueryResponse>(userQuery, {
    skip: !urlQueryIsReady,
  });

  const formikConfig = {
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Must provide a valid email.")
        .required("Email is required."),
    }),
    onSubmit: async (
      _: SubscribeFormValues,
      { setSubmitting }: FormikHelpers<SubscribeFormValues>,
    ) => {
      const result = await handleGraphQlResponse<void>(
        putUserMutation({
          variables: {
            user,
            publicId,
          },
        }),
      );
      const { success, combinedErrorMessage } = result;
      if (success) {
        await Router.push({
          pathname: "/user",
          query: {
            publicId: (user || {}).publicId,
            new: true,
          },
        });
      } else {
        addToast(combinedErrorMessage, toastType.error);
      }
      setSubmitting(false);
    },
  };
  const {
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
  } = useFormik(formikConfig);

  useEffect(() => {
    if (
      !userQueryResponse.loading &&
      userQueryResponse.data &&
      userQueryResponse.data.userByPublicId
    ) {
      const {
        userByPublicId: { email, syndications },
      } = userQueryResponse.data;
      setUser({
        email,
        publicId,
        syndications: syndications.map(({ identifier }) => identifier),
      });
    }
  }, [publicId, userQueryResponse.data, userQueryResponse.loading]);
  if (userQueryResponse.error) {
    return <Layout error={stringifyGraphQlError(userQueryResponse.error)} />;
  }
  const title = "One Last Step";
  if (
    userQueryResponse.loading ||
    !userQueryResponse.data ||
    !userQueryResponse.data.userByPublicId ||
    user == null ||
    isSubmitting
  ) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title} isLoading={isSubmitting}>
      <H3>
        {user.syndications.length === 0 ? (
          "Enter your email."
        ) : (
          <>
            Enter your email to get
            {user.syndications.length === 1 ? " this " : " these "}
            <DynamicText>{user.syndications.length}</DynamicText>
            {user.syndications.length === 1 ? " comic" : " comics"} emailed to
            you every morning.
          </>
        )}
      </H3>
      <form
        className={styles.container}
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <TextInput
          name="email"
          value={values.email}
          hasError={!!(touched.email && errors.email)}
          helperText={touched.email ? errors.email : undefined}
          onChange={(email: string) => {
            setUser({
              ...user,
              email,
            });
            setFieldValue("email", email);
          }}
          type="email"
          placeholder="Email"
        />
        <br />
        <Button type="submit" className={styles.button} disabled={isSubmitting}>
          Go
        </Button>
      </form>
    </Layout>
  );
};

export default NewUserPage;
