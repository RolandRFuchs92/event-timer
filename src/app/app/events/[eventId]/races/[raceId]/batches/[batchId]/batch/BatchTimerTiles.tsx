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
import TwDialog from "@/components/Dialog/Dialog";

interface BatchTimerTile {
  batch?: batch;
}

export function BatchTimerTile({ batch }: BatchTimerTile) {
  const [batchTime, setBatchTime] = React.useState(batch?.start_on ?? null);

  const handleStartBatch = async () => {
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
  };

  return (
    <div className="flex flex-col gap-2">
      <TimerDisplay
        label="Time"
        time={<CurrentTime />}
        color="bg-blue-400 text-white"
      />
      <TimerDisplay
        label="Batch Start"
        time={<Time dateTime={batchTime} format={"dd MMM yyyy HH:mm:ss"} />}
        color="bg-green-400 text-white"
      />
      <TimerDisplay
        label="Batch Elapsed"
        time={<BatchElapsedTime startTime={batchTime} />}
        color="bg-orange-300 text-white"
      />
      <TwDialog<batch>
        body="Are you sure you really want to restart this batch?"
        title="Really restart?"
        onYes={async (t) => {
          handleStartBatch();
        }}
      >
        {(setBatch, toggle) => {
          return (
            <Button
              label="Start"
              type="button"
              onClick={async () => {
                if (!batchTime) {
                  await handleStartBatch();
                  return;
                }
                setBatch(batch as any);
                toggle();
              }}
            />
          );
        }}
      </TwDialog>
    </div>
  );
}
