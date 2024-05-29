export function toMongoEpoch(date: Date | null) {
  if (date === null) return null;

  return {
    $date: date.toISOString(),
  };
}
