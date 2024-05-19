'use client';

import { ObjectId } from "bson";
import { snakeCase, startCase } from "lodash";

export function enumToOptions(enumerable: object) {
  console.log(enumerable);
  if (!enumerable) return [];

  return Object.keys(enumerable).map((i) => ({
    value: i.toString(),
    label: startCase(i.toString()),
  }));
}

export function mongoEnumToOptions(enumerable: string[]) {
  return enumerable.map((i) => ({
    value: i,
    label: startCase(snakeCase(i)),
    disabled: false,
  }));
}

export function optionsToStringArray(
  option: ReturnType<typeof mongoEnumToOptions>[0],
) {
  return option.value;
}

export function newObjectId() {
  const id = new ObjectId();
  return id;
}
