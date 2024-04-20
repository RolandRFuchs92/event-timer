"use client";
import TwDialog from "@/components/Dialog/Dialog";
import { EditIcon } from "@/components/Icons/EditIcon";
import { Table } from "@/components/Tables/table";
import { useRouter } from "next/navigation";
import React from "react";
import { deleteClient, getClients } from "./action";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import toast from "react-hot-toast";

type ClientTableProps = {
  data: Awaited<ReturnType<typeof getClients>>;
};

export function ClientTable({ data }: ClientTableProps) {
  const { push } = useRouter();
  const { replace } = useRouter();

  return (
    <TwDialog<(typeof data)[0]>
      body={(i) => `You sure you wana delete ${i?.name}'s account?`}
      title={"Really delete"}
      onYes={async (i) => {
        const result = await deleteClient(i.id);
        toast.success(result.message);
        replace("");
      }}
    >
      {(setData, toggle) => {
        return (
          <Table
            heading="Client Table"
            href={"/app/clients/null"}
            tableProps={{
              data: data,
              enableHiding: true,
              initialState: {
                columnVisibility: {
                  id: false,
                  account_id: false,
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
                  cell: (p) =>
                    `${p.getValue().firstName} ${p.getValue().lastName}`,
                },
                {
                  accessorKey: "credits",
                  header: "Credits",
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
