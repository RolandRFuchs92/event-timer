"use client";

import { Table } from "@/components/Tables/table";
import React from "react";
import { deleteAccount, getAccounts } from "./action";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import { EditIcon } from "@/components/Icons/EditIcon";
import { useRouter } from "next/navigation";
import TwDialog from "@/components/Dialog/Dialog";

type AccountsTableProps = {
  data: Awaited<ReturnType<typeof getAccounts>>;
};

export function AccountsTable({ data }: AccountsTableProps) {
  const { push } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete ${i?.firstName}'s account?`}
      title={"Really delete"}
      onYes={async (i) => {
        await deleteAccount(i.id);
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
                  header: "beep",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "firstName",
                  header: "First Name",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "lastName",
                  header: "Last Name",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "email",
                  header: "Email",
                  cell: (p) => p.getValue(),
                },
                {
                  accessorKey: "roles",
                  header: "roles",
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
                          push(`/app/accounts/${stuff.row.original.id}`)
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
