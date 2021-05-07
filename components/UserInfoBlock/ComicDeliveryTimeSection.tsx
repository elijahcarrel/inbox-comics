import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import { FormikConfig, FormikHelpers, useFormik, FormikErrors } from "formik";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import {
  comicDeliveryTimeInLocalTimeZoneToNewYork,
  comicDeliveryTimeInNewYorkToLocalTimeZone,
  getFormattedComicDeliveryTime,
} from "../../lib/time-utils";
import { ComicDeliveryTimeChooser } from "./ComicDeliveryTimeChooser";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";
import styles from "./ComicDeliveryTimeSection.module.scss";

interface Props {
  comicDeliveryHoursInNewYork: number;
  comicDeliveryMinutesInNewYork: number;
  email: string;
  publicId: string;
  onSetNewDeliveryTime: (
    comicDeliveryHoursInNewYork: number,
    comicDeliveryMinutesInNewYork: number,
  ) => void;
}

type PutUserResult = {
  comicDeliveryHoursInNewYork: number;
  comicDeliveryMinutesInNewYork: number;
};

interface ComicDeliveryTimeFormValues {
  comicDeliveryHoursInLocalTimeZone: number;
  comicDeliveryMinutesInLocalTimeZone: number;
}

export const ComicDeliveryTimeSection = (props: Props) => {
  const {
    comicDeliveryHoursInNewYork,
    comicDeliveryMinutesInNewYork,
    publicId,
    onSetNewDeliveryTime,
    email,
  } = props;
  const { addToast } = useToasts();
  const [timeChooserIsVisible, setTimeChooserIsVisible] = useState(false);
  const formattedComicDeliveryTime = getFormattedComicDeliveryTime(
    comicDeliveryHoursInNewYork,
    comicDeliveryMinutesInNewYork,
  );

  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        comicDeliveryHoursInNewYork
        comicDeliveryMinutesInNewYork
      }
    }
  `;
  const [putUserMutation] = useMutation<PutUserResult>(mutation);
  const updateComicDeliveryTime = async (
    newHoursInNewYorkValue: number,
    newMinutesInNewYorkValue: number,
  ) => {
    return handleGraphQlResponse(
      putUserMutation({
        variables: {
          publicId,
          user: {
            email,
            publicId,
            comicDeliveryHoursInNewYork: newHoursInNewYorkValue,
            comicDeliveryMinutesInNewYork: newMinutesInNewYorkValue,
          },
        },
      }),
    );
  };

  const [
    comicDeliveryHoursInLocalTimeZone,
    comicDeliveryMinutesInLocalTimeZone,
  ] = comicDeliveryTimeInNewYorkToLocalTimeZone(
    comicDeliveryHoursInNewYork,
    comicDeliveryMinutesInNewYork,
  );
  const formikConfig: FormikConfig<ComicDeliveryTimeFormValues> = {
    initialValues: {
      comicDeliveryHoursInLocalTimeZone,
      comicDeliveryMinutesInLocalTimeZone,
    },
    validationSchema: yup.object().shape({
      comicDeliveryHoursInLocalTimeZone: yup
        .number()
        .required("Hour is required."),
      comicDeliveryMinutesInLocalTimeZone: yup
        .number()
        .required("Minutes is required."),
    }),
    validate: (
      values: ComicDeliveryTimeFormValues,
      // eslint-disable-next-line consistent-return
    ): void | Promise<FormikErrors<ComicDeliveryTimeFormValues>> => {
      const [
        newHoursInNewYorkValue,
        newMinutesInNewYorkValue,
      ] = comicDeliveryTimeInLocalTimeZoneToNewYork(
        values.comicDeliveryHoursInLocalTimeZone,
        values.comicDeliveryMinutesInLocalTimeZone,
      );
      if (newHoursInNewYorkValue >= 0 && newHoursInNewYorkValue < 6) {
        const newFormattedComicDeliveryTime = getFormattedComicDeliveryTime(
          newHoursInNewYorkValue,
          newMinutesInNewYorkValue,
        );
        const errorMessage = `Cannot set comic delivery time to ${newFormattedComicDeliveryTime} because the hours between ${getFormattedComicDeliveryTime(
          0,
          0,
        )} and ${getFormattedComicDeliveryTime(
          6,
          0,
        )} are reserved for comic collection and email generation.`;
        addToast(errorMessage, toastType.error);
        return Promise.resolve({
          comicDeliveryHoursInLocalTimeZone: errorMessage,
        });
      }
    },
    onSubmit: async (
      values: ComicDeliveryTimeFormValues,
      { setSubmitting }: FormikHelpers<ComicDeliveryTimeFormValues>,
    ) => {
      setTimeChooserIsVisible(false);
      const [
        newHoursInNewYorkValue,
        newMinutesInNewYorkValue,
      ] = comicDeliveryTimeInLocalTimeZoneToNewYork(
        values.comicDeliveryHoursInLocalTimeZone,
        values.comicDeliveryMinutesInLocalTimeZone,
      );
      const result = await updateComicDeliveryTime(
        newHoursInNewYorkValue,
        newMinutesInNewYorkValue,
      );
      if (result.success) {
        onSetNewDeliveryTime(newHoursInNewYorkValue, newMinutesInNewYorkValue);
        const newFormattedComicDeliveryTime = getFormattedComicDeliveryTime(
          newHoursInNewYorkValue,
          newMinutesInNewYorkValue,
        );
        addToast(
          `You'll now get emails at ${newFormattedComicDeliveryTime}.`,
          toastType.success,
        );
      } else {
        addToast(
          `Could not change comic delivery time: ${result.combinedErrorMessage}`,
          toastType.error,
        );
      }
      setSubmitting(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  };

  const { handleSubmit, values, setFieldValue, isSubmitting } = useFormik(
    formikConfig,
  );

  if (isSubmitting) {
    return <LoadingOverlay className={styles.loadingOverlay} />;
  }

  return (
    <H3>
      You will get an email at{" "}
      <DynamicText>{formattedComicDeliveryTime}</DynamicText> every day.{" "}
      <CommonLink onClick={() => setTimeChooserIsVisible(true)}>
        Pick a different time.
      </CommonLink>
      {timeChooserIsVisible && (
        <ComicDeliveryTimeChooser
          comicDeliveryHours={values.comicDeliveryHoursInLocalTimeZone}
          comicDeliveryMinutes={values.comicDeliveryMinutesInLocalTimeZone}
          onSetTime={(comicDeliveryHours, comicDeliveryMinutes) => {
            setFieldValue(
              "comicDeliveryHoursInLocalTimeZone",
              comicDeliveryHours,
            );
            setFieldValue(
              "comicDeliveryMinutesInLocalTimeZone",
              comicDeliveryMinutes,
            );
          }}
          onSubmit={() => handleSubmit()}
        />
      )}
    </H3>
  );
};
