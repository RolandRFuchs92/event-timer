"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import TwDialog from "@/components/Dialog/Dialog";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import { Table } from "@/components/Tables/table";
import { deleteEvent, getEvents } from "./action";

interface EventTable {
  data: Awaited<ReturnType<typeof getEvents>>;
}

export function EventTable({ data }: EventTable) {
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete event - ${i?.name}`}
      title={"Really delete"}
      onYes={async (i) => {
        const result = await deleteEvent(i.id);
        toast.success(result.message);
        replace("");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading="Events Table"
            href={"/app/events/null"}
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
                  accessorKey: "client_id",
                  header: "client_id",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "client",
                  header: "Client",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "event_type",
                  header: "Type",
                  cell: (p) => p.getValue().join(", "),
                },
                {
                  accessorKey: "start_on",
                  header: "Start",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "end_on",
                  header: "End",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "actions",
                  header: "Actions",
                  cell: (stuff) => (
                    <div className="flex items-center space-x-3.5">
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
                        onClick={() =>
                          push(`/app/clients/${stuff.row.original.id}`)
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
