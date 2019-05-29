import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";
import { Comic } from "../Comic/Comic";
import styles from "./ComicGrid.module.scss";

const comicsEasyQuery = gql`
  query comics {
    comics {
      title
      identifier
    }
  }
`;

interface ComicsResponse {
  comics: Array<{
    title: string;
    identifier: string;
  }>;
}

// @ts-ignore
export const ComicGrid = () => {
  return (
    // @ts-ignore
    <Query<ComicsResponse> query={comicsEasyQuery}>
      {({ loading, error, data }) => {
        if (error) {
          throw new Error("Error loading comics: " + error.message);
        }
        if (loading) {
          return <div>Loading</div>;
        }
        // @ts-ignore
        if (!data || !data.comics) {
          return <div>Failed to load</div>;
        }
        return (
          <div className={styles.comicGridContainer}>
            {data.comics.map(({ title, identifier }, i) => (
              <Comic
                title={title}
                identifier={identifier}
                classes={{
                  comicContainer: styles.comicContainer,
                }}
                isSelected={i % 4 === 0}
              />
            ))}
          </div>
        );
      }}
    </Query>
  );
};
//
// const comicsQuery = gql`
//   query comics($first: Int!, $skip: Int!) {
//     comics(first: $first, skip: $skip) {
//       title
//     }
//   }
// `;
