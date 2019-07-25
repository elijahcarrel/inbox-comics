import classNames from "classnames";
import * as React from "react";
import styles from "./TextInput.module.scss";

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => any;
  className?: string;
  multiline?: boolean;
}

export const TextInput: React.FunctionComponent<Props> = (props: Props) => {
  const { name, value, onChange, className, multiline = false, ...otherProps } = props;
  if (multiline) {
    return (
      <textarea
        name={name}
        value={value}
        onChange={({ target: { value: newValue }}) => onChange(newValue)}
        className={classNames(styles.textInput, className)}
        {...otherProps}
      >
        {value}
      </textarea>
    );
  }
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={({ target: { value: newValue }}) => onChange(newValue)}
      className={classNames(styles.textInput, className)}
      {...otherProps}
    />
  );
};
