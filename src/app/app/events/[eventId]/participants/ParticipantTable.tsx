"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import TwDialog from "@/components/Dialog/Dialog";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import { Table } from "@/components/Tables/table";
import { getParticipants, deleteParticipant } from "./action";
import { defaultDateString, fullDateFormat } from "@/lib/DateTimeUtils";
import { VisibleIcon } from "@/components/Icons/VisibleIcon";
import { useEventId } from "../eventUtils";
import { MONGO_UPSERT_HACK } from "@/lib/db";
import { differenceInYears } from "date-fns";

interface ParticpantTableProps {
  data: Awaited<ReturnType<typeof getParticipants>>;
}

export function ParticipantTable({ data }: ParticpantTableProps) {
  const eventId = useEventId();
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete ${i?.first_name}`}
      title={"Really delete"}
      onYes={async (i) => {
        const result = await deleteParticipant(i.id);
        toast.success(result.message);
        replace("");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading="Participant Table"
            href={`/app/events/${eventId}/registration/${MONGO_UPSERT_HACK}`}
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
                  accessorKey: "first_name",
                  header: "Name",
                  cell: (p) => {
                    const fname = p.row.original.first_name;
                    const lname = p.row.original.last_name;
                    const name = `${fname} ${lname}`;
                    return name;
                  },
                },
                {
                  accessorKey: "race_number",
                  header: "Race no.",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "birthdate",
                  header: "Age",
                  cell: (p) => differenceInYears(new Date(), p.getValue()),
                },
                {
                  accessorKey: "batches",
                  header: "Race[Batch]",
                  cell: (p) => {
                    const batches = p.row.original.batches;
                    const batchResult = batches.map((i) => {
                      return `${i.race_name}[${i.batch_name}]`;
                    });

                    const laneRaces = p.row.original.races.map(
                      (i) => i.race_name,
                    );

                    const result = [...batchResult, ...laneRaces].join(", ");
                    return result;
                  },
                },
                {
                  accessorKey: "actions",
                  header: "Actions",
                  cell: (stuff) => (
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <VisibleIcon
                          onClick={() => {
                            replace(
                              `/app/events/${eventId}/registration/${stuff.row.original.id}`,
                            );
                          }}
                        />
                      </button>
                      <button className="hover:text-primary">
                        <TrashIcon
                          onClick={() => {
                            setData(stuff.row.original);
                            toggle();
                          }}
                        />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => {
                          replace(
                            `/app/events/${eventId}/registration/${stuff.row.original.id}`,
                          );
                        }}
                      >
                        <EditIcon />
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
