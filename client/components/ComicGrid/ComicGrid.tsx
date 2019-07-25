import gql from "graphql-tag";
import React, { useState } from "react";
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

interface Comic {
  title: string;
  identifier: string;
}

interface ComicsResponse {
  comics: Comic[];
}

interface Props {
  initialSelectedComics: {
    [identifier: string]: Comic;
  };
}

export const ComicGrid = (props: Props) => {
  const { initialSelectedComics } = props;
  const [selectedComics, setSelectedComics] = useState(initialSelectedComics);
  return (
    <Query<ComicsResponse> query={comicsEasyQuery}>
      {({ loading, error, data }) => {
        if (error) {
          throw new Error("Error loading comics: " + error.message);
        }
        if (loading) {
          return <div>Loading</div>;
        }
        if (!data || !data.comics) {
          return <div>Failed to load</div>;
        }
        return (
          <div className={styles.comicGridContainer}>
            {data.comics.map((comic) => {
              const { title, identifier } = comic;
              const isSelected = !!selectedComics[identifier];
              return (
                <Comic
                  title={title}
                  identifier={identifier}
                  classes={{
                    comicContainer: styles.comicContainer,
                  }}
                  isSelected={isSelected}
                  onClick={() => {
                    const { [identifier]: _, ...otherComics } = selectedComics;
                    setSelectedComics({
                      ...otherComics,
                      ...(isSelected ? {} : { [identifier]: comic }),
                    });
                  }}
                />
              );
            })}
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
