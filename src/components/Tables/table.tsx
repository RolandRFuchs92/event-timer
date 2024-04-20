"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, LinkButton } from "../FormElements/button";

interface TableProps<T extends object> {
  tableProps: Omit<Parameters<typeof useReactTable<T>>[0], "getCoreRowModel">;
  heading: string;
  href: string;
}

export function Table<T extends object>({
  tableProps,
  href,
  heading,
}: TableProps<T>) {
  const table = useReactTable({
    ...tableProps,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-2 flex flex-row justify-between justify-items-center">
          <div>{heading}</div>
          <LinkButton label="Add" href={href} />
        </div>
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr
                  key={headerGroup.id}
                  className={"bg-gray-2 text-left dark:bg-meta-4"}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="min-w-[220px] p-4 font-medium text-black dark:text-white xl:pl-11"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="tr" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
