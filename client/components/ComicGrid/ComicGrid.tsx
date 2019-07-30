import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { ComicCard } from "../Comic/ComicCard";
import styles from "./ComicGrid.module.scss";

const comicsQuery = gql`
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
  selectedComics: Set<string>;
  onChange: (selectedComics: Set<string>) => any;
}

export const ComicGrid = (props: Props) => {
  const { selectedComics, onChange } = props;
  const { data, error, loading } = useQuery<ComicsResponse>(comicsQuery);
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
        const isSelected = selectedComics.has(identifier);
        return (
          <ComicCard
            title={title}
            identifier={identifier}
            classes={{
              comicContainer: styles.comicContainer,
            }}
            isSelected={isSelected}
            onClick={() => {
              if (isSelected) {
                selectedComics.delete(identifier);
              } else {
                selectedComics.add(identifier);
              }
              onChange(selectedComics);
            }}
            key={identifier}
          />
        );
      })}
    </div>
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
