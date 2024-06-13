"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: any) {

  useEffect(() => {
    // Here you could log the error or perform other error handling steps
    alert(JSON.stringify(error));
  }, [error]);

  return (
    <div>
      <h1>An unexpected error occurred</h1>
      <p>
        We&apos;re sorry for the inconvenience. Please try again or contact
        support if the problem persists.
      </p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
