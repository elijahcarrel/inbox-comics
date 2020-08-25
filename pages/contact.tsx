import { useMutation } from "@apollo/client";
import { FormikHelpers, useFormik } from "formik";
import gql from "graphql-tag";
import Router from "next/router";
import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import Reaptcha from "reaptcha";
import * as yup from "yup";
import { Button } from "../common-components/Button/Button";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { TextInput } from "../common-components/TextInput/TextInput";
import { handleGraphQlResponse, toastType } from "../lib/utils";
import styles from "./contact.module.scss";
import { H3 } from "../common-components/H3/H3";

interface ContactFormValues {
  email: string;
  name: string;
  subject: string;
  message: string;
  recaptchaIsVerified: boolean;
}

const ContactPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  // TODO(ecarrel): put this in environment variables and secrets. Tried but couldn't get it to work.
  const recaptchaSiteKey =
    process.env.NODE_ENV === "production"
      ? "6Lf-IbYUAAAAACsBvqBlI2EPp3dRfGOtGmki0LVf"
      : "6LdAIbYUAAAAAJSiFXndt3k3qFw83Jm7w7HnfP3A";

  const mutation = gql`
    mutation submitContactForm(
      $email: String!
      $name: String!
      $subject: String!
      $message: String!
    ) {
      submitContactForm(
        email: $email
        name: $name
        subject: $subject
        message: $message
      )
    }
  `;
  const [submitContactFormMutation] = useMutation(mutation);
  const formikConfig = {
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      recaptchaIsVerified: false,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required."),
      email: yup
        .string()
        .email("Must provide a valid email.")
        .required("Email is required."),
      subject: yup.string().required("Subject is required."),
      message: yup.string().required("Message is required."),
      recaptchaIsVerified: yup
        .boolean()
        .oneOf([true], "Please verify that you're not a robot."),
    }),
    onSubmit: async (
      contactFormValues: ContactFormValues,
      { setSubmitting }: FormikHelpers<ContactFormValues>,
    ) => {
      const {
        // We have varsIgnorePattern set correctly but for some reason it's still throwing an error.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        recaptchaIsVerified: __recaptchaIsVerified,
        ...relevantValues
      } = contactFormValues;
      const result = await handleGraphQlResponse<void>(
        submitContactFormMutation({ variables: relevantValues }),
      );
      const { success, combinedErrorMessage } = result;
      if (success) {
        addToast(
          "Thank you! We'll get back to you in a jiffy.",
          toastType.success,
        );
        await Router.push({
          pathname: "/",
          query: {},
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
    handleChange,
  } = useFormik(formikConfig);

  return (
    <Layout title="Contact" isLoading={isSubmitting}>
      <H3>We&apos;d love to hear from you!</H3>
      <H3>
        You can also reach us by replying to any of your daily comic emails, or
        by emailing us at{" "}
        <CommonLink href="mailto:hello@inboxcomics.com" isExternal>
          hello@inboxcomics.com
        </CommonLink>
        .
      </H3>
      <div className={styles.contactForm}>
        <TextInput
          name="name"
          placeholder="Name"
          value={values.name}
          hasError={!!(touched.name && errors.name)}
          helperText={touched.name ? errors.name : undefined}
          onChangeInternal={handleChange}
          className={styles.textInput}
        />
        <TextInput
          name="email"
          placeholder="Email"
          value={values.email}
          hasError={!!(touched.email && errors.email)}
          helperText={touched.email ? errors.email : undefined}
          onChangeInternal={handleChange}
          className={styles.textInput}
        />
        <TextInput
          name="subject"
          placeholder="Subject"
          value={values.subject}
          hasError={!!(touched.subject && errors.subject)}
          helperText={touched.subject ? errors.subject : undefined}
          onChangeInternal={handleChange}
          className={styles.textInput}
        />
        <TextInput
          name="message"
          placeholder="Message"
          value={values.message}
          hasError={!!(touched.message && errors.message)}
          helperText={touched.message ? errors.message : undefined}
          onChangeInternal={handleChange}
          className={styles.textInput}
          multiline
        />
        <Reaptcha
          sitekey={recaptchaSiteKey}
          onVerify={() => setFieldValue("recaptchaIsVerified", true)}
          className={styles.recaptcha}
        />
        {touched.recaptchaIsVerified && errors.recaptchaIsVerified && (
          <div className={styles.recaptchaErrorText}>
            {errors.recaptchaIsVerified}
          </div>
        )}
        <Button onClick={() => handleSubmit()}>Go</Button>
      </div>
    </Layout>
  );
};

export default ContactPage;
