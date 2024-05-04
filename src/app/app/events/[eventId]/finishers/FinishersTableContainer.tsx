import { enumToOptions } from "@/lib/helper";
import { FinishersForm } from "./FinisherForm";
import { FinishersTable } from "./FinishersTable";
import { getFinishers } from "./action";
import { FinishStatusEnum } from "@prisma/client";

interface FinishersTableContainerProps {
  raceIds: string[];
}

export async function FinishersTableContainer({
  raceIds,
}: FinishersTableContainerProps) {
  const finishers = await getFinishers(raceIds);
  const finishStatusOptions = enumToOptions(FinishStatusEnum);

  return (
    <div>
      <FinishersForm FinisherStatusOptions={finishStatusOptions} />
      <FinishersTable
        data={finishers}
        finisherStatusOptions={finishStatusOptions}
      />
    </div>
  );
}
