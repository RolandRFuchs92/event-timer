"use client";

import TwDialog from "@/components/Dialog/Dialog";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { deleteRace, getEventRaces } from "./action";
import { Table } from "@/components/Tables/table";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEventId } from "../eventUtils";
import { BatchIcon } from "@/components/Icons/BatchIcon";
import { startCase } from "lodash";
import { batch } from "@prisma/client";

interface RaceTableProps {
  data: Awaited<ReturnType<typeof getEventRaces>>;
}

export function RaceTable({ data }: RaceTableProps) {
  const eventId = useEventId();
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you want to delete ${i.name}?`}
      title={"Really delete"}
      onYes={async (i) => {
        const result = await deleteRace(i.id);
        if (result.serverError) {
          toast.error(result.serverError!);
          return;
        }

        toast.success(result.data!.message);
        replace("");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading="Races in this event"
            href={`/app/events/${eventId}/races/null`}
            tableProps={{
              data: data,
              enableHiding: true,
              initialState: {
                columnVisibility: {
                  id: false,
                  client_id: false,
                },
              },
              columns: [
                {
                  accessorKey: "id",
                  header: "id",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "name",
                  header: "Name",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "race_type",
                  header: "Type",
                  cell: (p) => startCase(p.getValue()),
                },
                {
                  accessorKey: "race_type",
                  header: "Count",
                  cell: (p) => {
                    const row = p.row.original;
                    const isLaneRace = row.race_type === "LaneRace";
                    if (isLaneRace) {
                      const participantCount =
                        row.rounds[0]?.all_participant_ids.length ?? 0;
                      return participantCount;
                    }

                    return row.batches.flatMap((b) => b.participants).length;
                  },
                },
                {
                  accessorKey: "batches",
                  header: "Batches",
                  cell: (p) =>
                    p
                      .getValue()
                      .map((i: batch) => i.name)
                      .join(", "),
                },
                {
                  accessorKey: "actions",
                  header: "Actions",
                  cell: (i) => (
                    <div className="flex flex-col items-center space-y-2 lg:flex-row lg:space-x-3.5">
                      <button className="hover:text-primary">
                        <BatchIcon
                          className="h-7 w-7 lg:h-4 lg:w-4"
                          onClick={() => {
                            if (i.row.original.race_type === "LaneRace") {
                              push(
                                `/app/events/${eventId}/laneRace?raceId=${i.row.original.id}&roundIndex=0`,
                              );
                              return;
                            }
                            push(
                              `/app/events/${eventId}/races/${i.row.original.id}/batches`,
                            );
                          }}
                        />
                      </button>
                      <button className="hover:text-primary">
                        <TrashIcon
                          className="h-7 w-7 lg:h-4 lg:w-4"
                          onClick={() => {
                            setData(i.row.original);
                            toggle();
                          }}
                        />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          push(
                            `/app/events/${i.row.original.event_id}/races/${i.row.original.id}`,
                          )
                        }
                      >
                        <div className=" h-7 w-7 lg:h-4 lg:w-4">
                          <EditIcon removeDimensions />
                        </div>
                      </button>
                    </div>
                  ),
                },
              ],
            }}
          />
        );
      }}
    </TwDialog>
  );
}
