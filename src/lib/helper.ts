import { EnumValues } from "zod";

export function enumToOptions(enumerable: object) {
  return Object.keys(enumerable).map((i) => ({
    value: i.toString(),
    label: i.toString(),
  }));
}

export function mongoEnumToOptions(enumerable: string[]) {
  return enumerable.map((i) => ({ value: i, label: i }));
}
