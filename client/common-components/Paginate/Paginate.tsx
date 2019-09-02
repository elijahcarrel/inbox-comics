import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "./Paginate.module.scss";

interface Props {
  onPageChange?: (pageNumber: number) => any;
  numPages: number;
}

export const Paginate = (props: Props) => {
  const { onPageChange, numPages } = props;
  const [pageNumber, setPageNumber] = useState(0);
  return (
    <ReactPaginate
      pageCount={numPages}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => {
        setPageNumber(selected);
        if (onPageChange) {
          onPageChange(selected);
        }
      }}
      previousLabel={pageNumber === 0 ? "" : "← Previous"}
      nextLabel={pageNumber === numPages - 1 ? "" : "→ Next"}
      pageClassName={styles.paginationElement}
      previousClassName={styles.paginationElement}
      nextClassName={styles.paginationElement}
      pageLinkClassName={styles.paginationLink}
      previousLinkClassName={styles.paginationLink}
      nextLinkClassName={styles.paginationLink}
      activeLinkClassName={styles.activeLink}
      containerClassName={styles.paginationContainer}
    />
  );
};
