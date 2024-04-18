"use client";
import TwDialog from "@/components/Dialog/Dialog";
import { EditIcon } from "@/components/Icons/EditIcon";
import { Table } from "@/components/Tables/table";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import { getClients } from "./action";

type ClientTableProps = {
  data: Awaited<ReturnType<typeof getClients>>;
};

export function ClientTable({ data }: ClientTableProps) {
  const { push } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete ${i?.name}'s account?`}
      title={"Really delete"}
      onYes={async (i) => {
        alert("Beep");
        // await deleteAccount(i.id);
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            tableProps={{
              data: data,
              enableHiding: true,
              initialState: {
                columnVisibility: {
                  id: false,
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
                  accessorKey: "account_id",
                  header: "account_id",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "account",
                  header: "Account Owner",
                  cell: (p) => p.getValue().firstName,
                },
                {
                  accessorKey: "credits",
                  header: "Credits",
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
