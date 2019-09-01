import React, { Fragment } from "react";
import { Subtitle } from "../../common-components/Subtitle/Subtitle";
import { SyndicationCard } from "../SyndicationCard/SyndicationCard";
import styles from "./SyndicationGrid.scss";

// TODO(ecarrel): consolidate into common types file (perhaps shared client/server?)
interface Syndication {
  title: string;
  identifier: string;
}

interface Props {
  syndications: Syndication[];
  selectedSyndicationIdentifiers: Set<string>;
  onChange: (selectedSyndicationIdentifiers: Set<string>) => any;
}

export const SyndicationGrid = (props: Props) => {
  const { syndications, selectedSyndicationIdentifiers, onChange } = props;
  const selectedSyndications = syndications.filter(({ identifier }) =>
    selectedSyndicationIdentifiers.has(identifier));
  const unselectedSyndications = syndications.filter(({ identifier }) =>
    !selectedSyndicationIdentifiers.has(identifier));
  return (
    <Fragment>
      {selectedSyndications.length > 0 && (
        <Subtitle className={styles.subtitle}>Selected Comics</Subtitle>
      )}
      <div className={styles.syndicationGridContainer}>
        {selectedSyndications.map((syndication) => {
          const { title, identifier } = syndication;
          return (
            <SyndicationCard
              title={title}
              identifier={identifier}
              classes={{
                syndicationContainer: styles.syndicationContainer,
              }}
              isSelected={true}
              onClick={() => {
                const newSelectedSyndications = new Set(selectedSyndicationIdentifiers);
                newSelectedSyndications.delete(identifier);
                onChange(newSelectedSyndications);
              }}
              key={identifier}
            />
          );
        })}
      </div>
      <Subtitle className={styles.subtitle}>Available Comics</Subtitle>
      <div className={styles.syndicationGridContainer}>
        {unselectedSyndications.map((syndication) => {
          const { title, identifier } = syndication;
          return (
            <SyndicationCard
              title={title}
              identifier={identifier}
              classes={{
                syndicationContainer: styles.syndicationContainer,
              }}
              isSelected={false}
              onClick={() => {
                const newSelectedSyndications = new Set(selectedSyndicationIdentifiers);
                newSelectedSyndications.add(identifier);
                onChange(newSelectedSyndications);
              }}
              key={identifier}
            />
          );
        })}
      </div>
    </Fragment>
  );
};
