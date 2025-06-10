import { mdiSortAscending, mdiSortAlphabeticalAscending } from "@mdi/js";
import Icon from "@mdi/react";
import Fuse from "fuse.js";
import orderBy from "lodash/orderBy";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { get } from "lodash";
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
  const [sortFieldOrder, setSortFieldOrder] = useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = useState("");
  // TODO(ecarrel): callers should do this, not me. (I think.)
  const augmentedSyndications = syndications.map((syndication) => {
    const selectedSyndicationIndex = selectedSyndicationIdentifiers.findIndex(
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = selectedSyndicationIdentifiers.indexOf(
        String(active.id),
      );
      const newIndex = selectedSyndicationIdentifiers.indexOf(String(over.id));

      const newSelectedSyndicationIdentifiers = arrayMove(
        selectedSyndicationIdentifiers,
        oldIndex,
        newIndex,
      );
      onChange(newSelectedSyndicationIdentifiers);
    }
  };

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
    (syndication) => [
      syndication.isSelected,
      syndication.selectedIndex,
      get(syndication, sortField) || 0, // numSubscribers might be null instead of 0 if this the syndication was just added to the database.
      syndication.title,
    ],
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.filteringSection}>
        <div className={styles.sortButtons}>
          <CommonLink
            onClick={() => {
              setSortField("title");
              setSortFieldOrder("desc");
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
              setSortFieldOrder("asc");
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
      <SortableContext
        items={selectedSyndicationIdentifiers}
        strategy={rectSortingStrategy}
      >
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
                onClick={() => {
                  if (isSelected) {
                    // Delete it.
                    onChange(
                      selectedSyndicationIdentifiers.filter(
                        (otherIdentifier) => otherIdentifier !== identifier,
                      ),
                    );
                  } else {
                    // Add it.
                    onChange([...selectedSyndicationIdentifiers, identifier]);
                  }
                }}
                key={identifier}
                index={index}
              />
            );
          })}
        </div>
      </SortableContext>
      <Paginate numPages={numPages} onPageChange={setPageNumber} />
    </DndContext>
  );
};
