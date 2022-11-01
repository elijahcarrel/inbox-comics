import React from "react";
import { Toaster } from "react-hot-toast";
import styles from "./Toast.module.scss";

export const ToasterContainer = () => {
  return (
    <div className={styles.toastContainer}>
      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        position='top-right'
        containerClassName={styles.toast}
        toastOptions={{
          className: styles.innerToast,
          success: {
            className: styles.successToast,
            iconTheme: {
              primary: 'green',
              secondary: 'white',
            },
          },
          error: {
            className: styles.errorToast,
            iconTheme: {
              primary: 'white',
              secondary: '#980106',
            },
          },
        }} 
       />
    </div>
  );
};
