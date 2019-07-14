import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./TextInput.module.scss";

interface Props {
  name: string;
}

export const TextInput: React.FunctionComponent<Props> = (props: Props) => {
  const { name } = props;
  return (
    <input type="text" name={name} className={styles.textInput} />
  );
};
