import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import Timekeeper from "react-timekeeper";
import * as yup from "yup";
import { FormikConfig, FormikHelpers, useFormik } from "formik";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import {
  getFormattedComicDeliveryTime,
  handleGraphQlResponse,
  toastType,
} from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";

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
  hoursInLocalTimeZone: number;
  minutesInLocalTimeZone: number;
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

  const formikConfig: FormikConfig<ComicDeliveryTimeFormValues> = {
    initialValues: {
      // TODO(ecarrel): reformat based on time zone.
      hoursInLocalTimeZone: comicDeliveryHoursInNewYork,
      minutesInLocalTimeZone: comicDeliveryMinutesInNewYork,
    },
    validationSchema: yup.object().shape({
      hoursInLocalTimeZone: yup.number().required("Hour is required."),
      minutesInLocalTimeZone: yup.number().required("Minutes is required."),
    }),
    onSubmit: async (
      newValues: ComicDeliveryTimeFormValues,
      { setSubmitting }: FormikHelpers<ComicDeliveryTimeFormValues>,
    ) => {
      // TODO(ecarrel): reformat based on time zone.
      const newHoursInNewYorkValue = newValues.hoursInLocalTimeZone;
      const newMinutesInNewYorkValue = newValues.minutesInLocalTimeZone;
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
        setTimeChooserIsVisible(false);
      } else {
        addToast(
          `Could not change comic delivery time: ${result.combinedErrorMessage}`,
          toastType.error,
        );
      }
      setSubmitting(false);
    },
  };

  const { handleSubmit, values, setFieldValue } = useFormik(formikConfig);
  console.log("values", values);

  return (
    <H3>
      You will get an email at{" "}
      <DynamicText>{formattedComicDeliveryTime}</DynamicText> every day.{" "}
      <CommonLink onClick={() => setTimeChooserIsVisible(true)}>
        Pick a different time.
      </CommonLink>
      {timeChooserIsVisible && (
        <Timekeeper
          time={`${values.hoursInLocalTimeZone}:${String(
            values.minutesInLocalTimeZone,
          ).padStart(2, "0")}`}
          switchToMinuteOnHourSelect
          closeOnMinuteSelect
          onChange={(timeOutput) => {
            setFieldValue("hoursInLocalTimeZone", timeOutput.hour);
            setFieldValue("minutesInLocalTimeZone", timeOutput.minute);
          }}
          onDoneClick={() => handleSubmit()}
        />
      )}
    </H3>
  );
};
