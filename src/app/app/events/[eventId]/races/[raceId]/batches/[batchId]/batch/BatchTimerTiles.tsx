"use client";
import React from "react";

import { Button } from "@/components/FormElements/button";
import { Time } from "@/components/time/Time";
import { BatchElapsedTime } from "@/components/time/TimeElapsed";
import { CurrentTime } from "@/components/time/Timer";
import { TimerDisplay } from "@/components/time/TimerTile";
import { batch } from "@prisma/client";
import { startBatchTimer } from "./action";
import toast from "react-hot-toast";

interface BatchTimerTile {
  batch?: batch;
}

export function BatchTimerTile({ batch }: BatchTimerTile) {
  const [batchTime, setBatchTime] = React.useState(batch?.start_on ?? null);

  return (
    <div className="flex flex-col gap-2">
      <TimerDisplay label="Time" time={<CurrentTime />} color="bg-blue-400" />
      <TimerDisplay
        label="Batch Start"
        time={<Time dateTime={batchTime} format={"dd MMM yyyy HH:mm:ss"} />}
        color="bg-green-400"
      />
      <TimerDisplay
        label="Batch Elapsed"
        time={<BatchElapsedTime startTime={batchTime} />}
        color="bg-red-300"
      />
      <Button
        label="Start"
        type="button"
        onClick={async () => {
          const startTime = new Date();
          setBatchTime(startTime);
          try {
            const result = await startBatchTimer({
              batchId: batch?.batch_id!,
              startTime,
            });
            toast.success(result.data!.message);
          } catch (e: any) {
            toast.error(e.message);
          }
        }}
      />
    </div>
  );
}
