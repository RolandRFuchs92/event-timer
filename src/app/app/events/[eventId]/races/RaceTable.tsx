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
        toast.success(result.message);
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
                  accessorKey: "batches",
                  header: "Batches",
                  cell: (p) =>
                    p
                      .getValue()
                      .map((i) => i.name)
                      .join(", "),
                },
                {
                  accessorKey: "actions",
                  header: "Actions",
                  cell: (stuff) => (
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <TrashIcon
                          className="h-4 w-4"
                          onClick={() => {
                            setData(stuff.row.original);
                            toggle();
                          }}
                        />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          push(`/app/events/edit/${stuff.row.original.id}`)
                        }
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
