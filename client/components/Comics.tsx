import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";

// export const getComicsQueryVars = {
//   skip: 0,
//   first: 10,
// };

const getComicsEasyQuery = gql`
  query getComics {
    getComics {
      title
    }
  }
`;

// @ts-ignore
export const ComicsList = () => {
  return (
    // @ts-ignore
    <Query query={getComicsEasyQuery}>
      {({ loading, error, data }) => {
        if (error) {
          console.error("Error loading posts: ", error);
        }
        if (loading) {
          return <div>Loading</div>;
        }
        // @ts-ignore
        if (!data || !data.getComics) {
          return <div>Failed to load</div>;
        }
        console.log("data:", data);
        return (
          <div>
            {data.getComics.map(({ title }) => (<span>{ title }</span>))}
          </div>
        );
      }}
    </Query>
  );
};
//
// const getComicsQuery = gql`
//   query getComics($first: Int!, $skip: Int!) {
//     getComics(first: $first, skip: $skip) {
//       title
//     }
//   }
// `;
