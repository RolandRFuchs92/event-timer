"use client";

import TwDialog from "@/components/Dialog/Dialog";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { Table } from "@/components/Tables/table";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEventId } from "../eventUtils";
import { BatchIcon } from "@/components/Icons/BatchIcon";
import { deleteFinisher, getFinishers } from "./action";
import { LinkButton } from "@/components/FormElements/button";

interface FinishersTableProps {
  data: Awaited<ReturnType<typeof getFinishers>>;
}

export function FinishersTable({ data }: FinishersTableProps) {
  const eventId = useEventId();
  const pathname = usePathname();
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<Awaited<ReturnType<typeof getFinishers>>[0]>
      body={(i) => `You sure you want to delete ${i.first_name}?`}
      title={"Really delete"}
      onYes={async (i) => {
        // const result = await deleteFinisher(i.id);
        // toast.success(result.message);
        replace("");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading={
              <div className="flex w-full grow flex-row items-center justify-between">
                <p>Finishers so far</p>
                <LinkButton href={pathname} label="Back" />
              </div>
            }
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
                    const original = p.row.original;
                    return `${original.first_name} ${original.last_name}`;
                  },
                },
                {
                  accessorKey: "batches",
                  header: "Start time",
                  cell: (p) => {
                    const original = p.row.original;
                    return `${original.first_name} ${original.last_name}`;
                  },
                },
                {
                  accessorKey: "actions",
                  header: "Actions",
                  cell: (i) => (
                    <div className="flex flex-row items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <TrashIcon
                          className="h-4 w-4"
                          onClick={() => {
                            setData(i.row.original);
                            toggle();
                          }}
                        />
                      </button>
                      <p>Reset Finishing Time</p>
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
