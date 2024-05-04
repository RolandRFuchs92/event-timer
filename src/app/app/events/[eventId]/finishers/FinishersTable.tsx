"use client";

import TwDialog from "@/components/Dialog/Dialog";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { Table } from "@/components/Tables/table";
import { EditIcon } from "@/components/Icons/EditIcon";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEventId, useRaceIds } from "../eventUtils";
import { BatchIcon } from "@/components/Icons/BatchIcon";
import { deleteFinisher, getFinishers } from "./action";
import { LinkButton } from "@/components/FormElements/button";
import { RecycleIcon } from "@/components/Icons/RecycleIcon";
import { ChangeFinisherStatusForm } from "./ChangeFinisherStatusForm";
import { FinishersIcon } from "@/components/Icons/FinisherIcon";
import { FinishStatusEnum } from "@prisma/client";
import { enumToOptions } from "@/lib/helper";

interface FinishersTableProps {
  data: Awaited<ReturnType<typeof getFinishers>>;
  finisherStatusOptions: ReturnType<typeof enumToOptions>;
}

export function FinishersTable({
  data,
  finisherStatusOptions,
}: FinishersTableProps) {
  const raceIds = useRaceIds();
  const pathname = usePathname();

  async function handleDeleteFinisher(participantId: string) {
    const result = await deleteFinisher({
      participantId,
      race_ids: raceIds,
    });
    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }
    toast.success(result.data!.message);
  }

  return (
    <TwDialog<Awaited<ReturnType<typeof getFinishers>>[0]>
      disableButtons
      body={(i, toggle) => (
        <ChangeFinisherStatusForm
          participant={i}
          finisherStatusOptions={finisherStatusOptions}
          toggle={toggle}
        />
      )}
      title={(i) => `Change ${i.first_name} finish status`}
      onYes={async (i) => {
        handleDeleteFinisher(i.id);
      }}
    >
      {(setStatusChangeData, toggleStatusChange) => {
        return (
          <TwDialog<Awaited<ReturnType<typeof getFinishers>>[0]>
            body={(i) =>
              `You sure you want to reset ${i.first_name} finish status?`
            }
            title={"Really Reset?"}
            onYes={async (i) => {
              handleDeleteFinisher(i.id);
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
                        accessorKey: "time_taken",
                        header: "Race:time:status",
                        cell: (p) => {
                          const batches = p.row.original.batches;
                          return (
                            <ul>
                              {batches.map((i) => (
                                <li key={i.batch_id}>
                                  {i.race_name}: {i.time_taken}:{" "}
                                  {i.finish_status}
                                </li>
                              ))}
                            </ul>
                          );
                        },
                      },
                      {
                        accessorKey: "race_number",
                        header: "Race #",
                      },
                      {
                        accessorKey: "actions",
                        header: "Actions",
                        cell: (i) => (
                          <div className="flex flex-row items-center space-x-3.5">
                            <button className="hover:text-primary">
                              <RecycleIcon
                                className="h-4 w-4"
                                onClick={() => {
                                  setData(i.row.original);
                                  toggle();
                                }}
                              />
                            </button>
                            <button className="hover:text-primary">
                              <FinishersIcon
                                className="h-4 w-4"
                                onClick={() => {
                                  setStatusChangeData(i.row.original);
                                  toggleStatusChange();
                                }}
                              />
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
      }}
    </TwDialog>
  );
}
