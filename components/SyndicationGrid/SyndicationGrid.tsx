import { mdiSortAscending, mdiSortAlphabeticalAscending } from "@mdi/js";
import Icon from "@mdi/react";
import Fuse from "fuse.js";
import orderBy from "lodash/orderBy";
import React, { useCallback, useEffect, useState } from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Paginate } from "../../common-components/Paginate/Paginate";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { SyndicationCard } from "../SyndicationCard/SyndicationCard";
import styles from "./SyndicationGrid.module.scss";
import { useUrlQuery } from "../../lib/utils";

const defaultNumComicsPerPage = 24;

// TODO(ecarrel): consolidate into common types file (perhaps shared client/server?)
interface Syndication {
  title: string;
  identifier: string;
  numSubscribers: number;
}

interface AugmentedSyndication extends Syndication {
  isSelected: boolean;
  selectedIndex: number;
}

interface Props {
  syndications: Syndication[];
  selectedSyndicationIdentifiers: string[];
  onChange: (selectedSyndicationIdentifiers: string[]) => void;
}

export const SyndicationGrid = (props: Props) => {
  const { syndications, selectedSyndicationIdentifiers, onChange } = props;
  // tempSelectedSyndicationIdentifiers are the same as
  // selectedSyndicationIdentifiers except that
  // tempSelectedSyndicationIdentifiers change mid-drag-and-drop, but only get
  // committed to selectedSyndicationIdentifiers upon a successful drop.
  const [
    tempSelectedSyndicationIdentifiers,
    setTempSelectedSyndicationIdentifiers,
  ] = useState(selectedSyndicationIdentifiers);
  useEffect(() => {
    setTempSelectedSyndicationIdentifiers(selectedSyndicationIdentifiers);
  }, [setTempSelectedSyndicationIdentifiers, selectedSyndicationIdentifiers]);
  const [sortField, setSortField] = useState<"title" | "numSubscribers">(
    "numSubscribers",
  );
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const numComicsPerPageParam = urlQueryIsReady
    ? parseInt(`${urlQuery?.numComicsPerPage || ""}`, 10)
    : NaN;
  const numComicsPerPage =
    Number.isNaN(numComicsPerPageParam) ||
    numComicsPerPageParam < 1 ||
    numComicsPerPageParam > 100
      ? defaultNumComicsPerPage
      : numComicsPerPageParam;
  const [sortFieldOrder, setSortFieldOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState("");
  // TODO(ecarrel): callers should do this, not me. (I think.)
  const augmentedSyndications = syndications.map((syndication) => {
    const selectedSyndicationIndex =
      tempSelectedSyndicationIdentifiers.findIndex(
        (selectedSyndicationIdentifier) =>
          selectedSyndicationIdentifier === syndication.identifier,
      );
    return {
      ...syndication,
      isSelected: selectedSyndicationIndex !== -1,
      selectedIndex: selectedSyndicationIndex,
    };
  });
  const [pageNumber, setPageNumber] = useState(0);
  const onMoveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragIdentifier = tempSelectedSyndicationIdentifiers[dragIndex];
      const newTempSelectedSyndicationIdentifiers = [
        ...tempSelectedSyndicationIdentifiers,
      ];
      newTempSelectedSyndicationIdentifiers.splice(dragIndex, 1);
      newTempSelectedSyndicationIdentifiers.splice(
        hoverIndex,
        0,
        dragIdentifier,
      );
      setTempSelectedSyndicationIdentifiers(
        newTempSelectedSyndicationIdentifiers,
      );
    },
    [setTempSelectedSyndicationIdentifiers, tempSelectedSyndicationIdentifiers],
  );
  const onDropCard = useCallback(
    (didDrop: boolean) => {
      if (didDrop) {
        // Commit the changes.
        onChange(tempSelectedSyndicationIdentifiers);
      } else {
        // Revert tempSelectedSyndicationIdentifiers back to
        // selectedSyndicationIdentifiers.
        setTempSelectedSyndicationIdentifiers(selectedSyndicationIdentifiers);
      }
    },
    [
      onChange,
      selectedSyndicationIdentifiers,
      tempSelectedSyndicationIdentifiers,
    ],
  );
  // TODO(ecarrel): paginate server-side? Probably not necessary, number of comics
  //  and size of server-side blob per comic are both pretty small.
  // All selected comics should go on the first page, otherwise dragging
  // doesn't work and some interactions get weird.
  const numComicsOnFirstPage = Math.max(
    numComicsPerPage,
    selectedSyndicationIdentifiers.length,
  );
  const isOnFirstPage = pageNumber === 0;
  const offset = isOnFirstPage
    ? 0
    : numComicsOnFirstPage + (pageNumber - 1) * numComicsPerPage;
  let filteredSyndications = orderBy(
    augmentedSyndications,
    ["isSelected", "selectedIndex", sortField, "title"],
    ["desc", "asc", sortFieldOrder, "asc"],
  );
  if (searchText !== "") {
    const fuse = new Fuse<AugmentedSyndication>(filteredSyndications, {
      keys: ["title"],
      threshold: 0.2,
    });
    filteredSyndications = fuse
      .search(searchText)
      .map((fuseResult) => fuseResult.item);
  }
  const filteredSyndicationsOnThisPage = filteredSyndications.slice(
    offset,
    offset + (isOnFirstPage ? numComicsOnFirstPage : numComicsPerPage),
  );
  const numExtraComicsOnFirstPage = numComicsOnFirstPage - numComicsPerPage;
  const numPages = Math.ceil(
    (filteredSyndications.length - numExtraComicsOnFirstPage) /
      numComicsPerPage,
  );

  return (
    <>
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
        {filteredSyndicationsOnThisPage.map((syndication, index) => {
          const { title, identifier, isSelected } = syndication;
          return (
            <SyndicationCard
              title={title}
              identifier={identifier}
              classes={{
                syndicationContainer: styles.syndicationContainer,
              }}
              isSelected={isSelected}
              onMoveCard={onMoveCard}
              onDropCard={onDropCard}
              onClick={() => {
                if (isSelected) {
                  // Delete it.
                  onChange(
                    tempSelectedSyndicationIdentifiers.filter(
                      (otherIdentifier) => otherIdentifier !== identifier,
                    ),
                  );
                } else {
                  // Add it.
                  onChange([...tempSelectedSyndicationIdentifiers, identifier]);
                }
              }}
              key={identifier}
              index={index}
            />
          );
        })}
      </div>
      <Paginate numPages={numPages} onPageChange={setPageNumber} />
    </>
  );
};
