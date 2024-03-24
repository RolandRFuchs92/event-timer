import React from 'react';


export function FormTitle({ label }: { label: string }) {
  return <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
    <h3 className="font-medium text-black dark:text-white">{label}</h3>
  </div>
}
