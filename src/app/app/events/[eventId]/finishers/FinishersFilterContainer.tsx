import { FinishersFilter } from "./FinishersFilter";
import { getRaces } from "./action";

export async function FinishersFilterContainer() {
  const races = await getRaces();
  return <FinishersFilter races={races} />;
}
