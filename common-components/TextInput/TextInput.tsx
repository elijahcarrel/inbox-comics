import classNames from "classnames";
import * as React from "react";
import styles from "./TextInput.module.scss";

interface Props {
  name: string;
  value: string;
  onChange?: (value: string) => any;
  onChangeInternal?: (e: React.FormEvent<HTMLInputElement>) => any;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  hasError?: boolean;
  helperText?: string;
  isClearable?: boolean;
}

export const TextInput: React.FunctionComponent<Props> = (props: Props) => {
  const {
    name,
    value,
    onChange,
    onChangeInternal,
    className,
    multiline = false,
    helperText,
    hasError = false,
    isClearable = false,
    ...otherProps
  } = props;
  // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
  let handleChange: (e: React.FormEvent<HTMLInputElement>) => any = () => {};
  if (onChangeInternal) {
    handleChange = onChangeInternal;
  } else if (onChange) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handleChange = ({ target: { value: newValue } }) => onChange(newValue);
  }
  const innerElement = multiline ? (
    <textarea
      name={name}
      value={value}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore technically not the right type for textarea.
      onChange={handleChange}
      className={classNames(styles.textInput, {
        [styles.hasError]: hasError,
      })}
      defaultValue={value}
      {...otherProps}
    />
  ) : (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      className={classNames(styles.textInput, {
        [styles.hasError]: hasError,
      })}
      {...otherProps}
    />
  );
  return (
    <div className={classNames(styles.textInputContainer, className)}>
      {innerElement}
      {isClearable && value.length > 0 && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <span
          // TODO(ecarrel): make this look good.
          title="Clear"
          className={styles.clearButton}
          onClick={(e) => {
            e.preventDefault();
            if (onChangeInternal) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore technically not the right type for textarea.
              onChangeInternal({ target: { value: "" } });
            } else if (onChange) {
              onChange("");
            }
          }}
        >
          &times;
        </span>
      )}
      {helperText && (
        <div
          className={classNames(styles.helperText, {
            [styles.hasError]: hasError,
          })}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};
