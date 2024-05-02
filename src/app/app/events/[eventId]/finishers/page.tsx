import { Suspense } from "react";
import { FinishersFilterContainer } from "./FinishersFilterContainer";
import { FinishersTableContainer } from "./FinishersTableContainer";

interface FinishersPageProps {
  searchParams: {
    races: string;
  };
}

export default async function FinishersPage({
  searchParams,
}: FinishersPageProps) {
  const raceIds = searchParams.races
    ? decodeURIComponent(searchParams.races).split(",")
    : null;

  return (
    <div>
      {!raceIds ? (
        <Suspense fallback="Loading...">
          <FinishersFilterContainer />
        </Suspense>
      ) : (
        <Suspense fallback="Also Loading...">
          <FinishersTableContainer raceIds={raceIds} />
        </Suspense>
      )}
    </div>
  );
}
