import React from "react";

export function FormTitle({
  label,
  stateButton,
}: {
  label: string;
  stateButton: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">{label}</h3>
      {stateButton}
    </div>
  );
}
