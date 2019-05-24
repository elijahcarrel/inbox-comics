import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";

export const getComicsQueryVars = {
  skip: 0,
  first: 10,
};

// @ts-ignore
export const ComicsList = () => {
  return (
    // @ts-ignore
    <Query query={getComicsQuery} variables={getComicsQueryVars}>
      {({ loading, error, data }) => {
        if (error) {
          throw new Error("Error loading posts.");
        }
        if (loading) {
          return <div>Loading</div>;
        }
        // @ts-ignore
        return (
          <div>
            {data.comics.map(({ name }) => (<span>{ name }</span>))}
          </div>
        );
      }}
    </Query>
  );
};

const getComicsQuery = gql`
  query getComics($first: Int!, $skip: Int!) {
    getComics(first: $first, skip: $skip) {
      title
    }
  }
`;
