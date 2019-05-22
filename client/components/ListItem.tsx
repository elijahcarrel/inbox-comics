import Link from "next/link";
import * as React from "react";

import IDataObject from "../interfaces";

interface Props {
  data: IDataObject;
}

const ListItem: React.FunctionComponent<Props> = ({ data }) => (
  <Link href={`/detail?id=${data.id}`}>
    <a>{data.id}: {data.name}</a>
  </Link>
);

export default ListItem;
