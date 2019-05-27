import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";

const comicsEasyQuery = gql`
  query comics {
    comics {
      title
    }
  }
`;

interface Data {
  comics: Array<{ title: string }>;
}

// @ts-ignore
export const ComicsList = () => {
  return (
    // @ts-ignore
    <Query<Data> query={comicsEasyQuery}>
      {({ loading, error, data }) => {
        if (error) {
          throw new Error("Error loading posts: " + error.message);
        }
        if (loading) {
          return <div>Loading</div>;
        }
        // @ts-ignore
        if (!data || !data.comics) {
          return <div>Failed to load</div>;
        }
        return (
          <ul>
            {data.comics.map(({ title }) => (<li>{ title }</li>))}
          </ul>
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
