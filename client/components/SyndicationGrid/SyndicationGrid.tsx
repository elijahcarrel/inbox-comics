import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";
import { SyndicationCard } from "../SyndicationCard/SyndicationCard";
import styles from "./SyndicationGrid.scss";

const syndicationsQuery = gql`
  query syndications {
    syndications {
      title
      identifier
    }
  }
`;

interface Syndication {
  title: string;
  identifier: string;
}

interface SyndicationsResponse {
  syndications: Syndication[];
}

interface Props {
  selectedSyndications: Set<string>;
  onChange: (selectedSyndications: Set<string>) => any;
}

export const SyndicationGrid = (props: Props) => {
  const { selectedSyndications, onChange } = props;
  const { data, error, loading } = useQuery<SyndicationsResponse>(syndicationsQuery);
  if (error) {
    throw new Error("Error loading syndications: " + error.message);
  }
  if (loading) {
    return <LoadingOverlay />;
  }
  if (!data || !data.syndications) {
    return <div>Failed to load</div>;
  }
  return (
    <div className={styles.syndicationGridContainer}>
      {data.syndications.map((syndication) => {
        const { title, identifier } = syndication;
        const isSelected = selectedSyndications.has(identifier);
        return (
          <SyndicationCard
            title={title}
            identifier={identifier}
            classes={{
              syndicationContainer: styles.syndicationContainer,
            }}
            isSelected={isSelected}
            onClick={() => {
              if (isSelected) {
                selectedSyndications.delete(identifier);
              } else {
                selectedSyndications.add(identifier);
              }
              onChange(selectedSyndications);
            }}
            key={identifier}
          />
        );
      })}
    </div>
  );
};
//
// const syndicationsQuery = gql`
//   query syndications($first: Int!, $skip: Int!) {
//     syndications(first: $first, skip: $skip) {
//       title
//     }
//   }
// `;
