"use client";

import TwDialog from "@/components/Dialog/Dialog";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { deleteRace } from "./action";
import { Table } from "@/components/Tables/table";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@heroicons/react/24/outline";
import { fullDateFormat } from "@/lib/DateTimeUtils";

interface RaceTableProps {
  data: any[];
}

export function RaceTable({ data }: RaceTableProps) {
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete event - ${i?.name}`}
      title={"Really delete"}
      onYes={async (i) => {
        const result = await deleteRace(i.id);
        toast.success(result.message);
        replace("./");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading="Races in this event"
            href={"/app/events/home/race/null"}
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
                  cell: (p) => p.getValue().name,
                },
                {
                  accessorKey: "event_type",
                  header: "Type",
                  cell: (p) => p.getValue().join(", "),
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
