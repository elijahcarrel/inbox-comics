import { mdiSortAscending, mdiSortAlphabeticalAscending } from "@mdi/js";
import Icon from "@mdi/react";
import Fuse from "fuse.js";
import orderBy from "lodash/orderBy";
import React, { Fragment, useState } from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Paginate } from "../../common-components/Paginate/Paginate";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { SyndicationCard } from "../SyndicationCard/SyndicationCard";
import styles from "./SyndicationGrid.module.scss";

const numComicsPerPage = 24;

// TODO(ecarrel): consolidate into common types file (perhaps shared client/server?)
interface Syndication {
  title: string;
  identifier: string;
  numSubscribers: number;
}

interface AugmentedSyndication extends Syndication {
  isSelected: boolean;
}

interface Props {
  syndications: Syndication[];
  selectedSyndicationIdentifiers: Set<string>;
  onChange: (selectedSyndicationIdentifiers: Set<string>) => any;
}

export const SyndicationGrid = (props: Props) => {
  const { syndications, selectedSyndicationIdentifiers, onChange } = props;
  const [sortField, setSortField] = useState<"title" | "numSubscribers">("numSubscribers");
  const [sortFieldOrder, setSortFieldOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState("");
  // TODO(ecarrel): callers should do this, not me. (I think.)
  const augmentedSyndications = syndications.map((syndication) => {
    return {
      ...syndication,
      isSelected: selectedSyndicationIdentifiers.has(syndication.identifier),
    };
  });
  const [pageNumber, setPageNumber] = useState(0);
  const offset = pageNumber * numComicsPerPage;
  // TODO(ecarrel): paginate server-side? Probably not necessary, number of comics
  //  and size of server-side blob per comic are both pretty small.
  let filteredSyndications = orderBy(augmentedSyndications, ["isSelected", sortField, "title"], ["desc", sortFieldOrder, "asc"]);
  if (searchText !== "") {
    const fuse = new Fuse<AugmentedSyndication, Fuse.IFuseOptions<AugmentedSyndication>>(filteredSyndications, {
      keys: ["title"],
      threshold: 0.2,
    });
    filteredSyndications = fuse.search(searchText).map((fuseResult) => fuseResult.item);
  }
  const filteredSyndicationsOnThisPage = filteredSyndications
    .slice(offset, offset + numComicsPerPage);
  const numPages = Math.ceil(filteredSyndications.length / numComicsPerPage);

  return (
    <Fragment>
      <div className={styles.filteringSection}>
        <div className={styles.sortButtons}>
          <CommonLink
            onClick={() => {
              setSortField("title");
              setSortFieldOrder("asc");
            }}
            isLink={sortField !== "title"}
            className={styles.sortButton}

          >
            Sort Alphabetically
            <Icon
              path={mdiSortAlphabeticalAscending}
              size={1}
              className={styles.sortButtonIcon}
            />
          </CommonLink>
          <CommonLink
            onClick={() => {
              setSortField("numSubscribers");
              setSortFieldOrder("desc");
            }}
            isLink={sortField !== "numSubscribers"}
            className={styles.sortButton}

          >
            Sort by Popularity
            <Icon
              path={mdiSortAscending}
              size={1}
              className={styles.sortButtonIcon}
            />
          </CommonLink>
        </div>
        <div className={styles.searchFieldContainer}>
          <TextInput
            name="searchField"
            placeholder="Search..."
            value={searchText}
            onChange={(value) => {
              setSearchText(value);
              // If the text is changing, reset the page to 0.
              // TODO(ecarrel): this doesn't work because Paginate
              //  maintains its own state.
              setPageNumber(0);
            }}
            className={styles.searchField}
            type="search"
          />
        </div>
      </div>
      <div className={styles.syndicationGridContainer}>
        {filteredSyndicationsOnThisPage.map((syndication) => {
          const { title, identifier, isSelected } = syndication;
          return (
            <SyndicationCard
              title={title}
              identifier={identifier}
              classes={{
                syndicationContainer: styles.syndicationContainer,
              }}
              isSelected={isSelected}
              onClick={() => {
                const newSelectedSyndications = new Set(selectedSyndicationIdentifiers);
                if (isSelected) {
                  newSelectedSyndications.delete(identifier);
                } else {
                  newSelectedSyndications.add(identifier);
                }
                onChange(newSelectedSyndications);
              }}
              key={identifier}
            />
          );
        })}
      </div>
      <Paginate
        numPages={numPages}
        onPageChange={setPageNumber}
      />
    </Fragment>
  );
};
