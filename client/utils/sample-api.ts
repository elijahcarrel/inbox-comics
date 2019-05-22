import IDataObject from "../interfaces";

/** Dummy user data. */
export const dataArray: IDataObject[] = [
  { id: 101, name: "Alice" },
  { id: 102, name: "Bob" },
  { id: 103, name: "Caroline" },
  { id: 104, name: "Dave" },
];

/**
 * Calls a mock API which finds a user by ID from the list above.
 *
 * Throws an error if not found.
 */
export const findData = async (id: number | string) => {
  const selected = dataArray.find((data) => data.id === Number(id));

  if (!selected) {
    throw new Error("Cannot find user");
  }

  return selected;
};

/** Calls a mock API which returns the above array to simulate "get all". */
export const findAll = async () => {
  // Throw an error, just for example.
  if (!Array.isArray(dataArray)) {
    throw new Error("Cannot find users");
  }

  return dataArray;
};
