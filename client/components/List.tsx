import * as React from "react";
import IDataObject from "../interfaces";
import ListItem from "./ListItem";

interface Props {
  items: IDataObject[];
}

const List: React.FunctionComponent<Props> = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
