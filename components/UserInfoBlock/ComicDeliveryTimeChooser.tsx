import React from "react";
import Timekeeper from "react-timekeeper";
import styles from "./ComicDeliveryTimeChooser.module.scss";

type Props = {
  comicDeliveryHours: number;
  comicDeliveryMinutes: number;
  onSetTime: (comicDeliveryHours: number, comicDeliveryMinutes: number) => void;
  onSubmit: () => void;
};

export const ComicDeliveryTimeChooser = (props: Props) => {
  const {
    comicDeliveryHours,
    comicDeliveryMinutes,
    onSetTime,
    onSubmit,
  } = props;
  return (
    <div className={styles.comicDeliveryTimeChooser}>
      <Timekeeper
        time={`${comicDeliveryHours}:${String(comicDeliveryMinutes).padStart(
          2,
          "0",
        )}`}
        switchToMinuteOnHourSelect
        onChange={(timeOutput) => {
          onSetTime(timeOutput.hour, timeOutput.minute);
        }}
        onDoneClick={() => onSubmit()}
        css={{
          margin: "20px",
        }}
      />
    </div>
  );
};
