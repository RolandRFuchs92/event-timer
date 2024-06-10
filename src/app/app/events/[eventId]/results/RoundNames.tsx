import { ParticipantHeatStatusEnum } from "@prisma/client";
import { getLaneRaceResults } from "./action";

type RoundNamesType = {
  data: NonNullable<
    Awaited<ReturnType<typeof getLaneRaceResults>>["data"]
  >[0][0];
};

export function RoundNames({ data }: RoundNamesType) {
  if (!data) return <div>No Result Data</div>;

  return (
    <div className="w-full gap-4 rounded-md bg-white p-2 text-black lg:w-[50rem] lg:p-4">
      <p className="text-md text-slate-400 ">Round Name: {data?.roundName}</p>
      {(!!data?.heats?.length ?? 0) &&
        data?.heats?.map((heats) => {
          const reshuffleParticipantsdOrder = [
            ...heats?.participants?.filter((i) => i?.status == "Winner"),
            ...heats?.participants?.filter((i) => i?.status == "RunnerUp"),
            ...heats?.participants?.filter(
              (i) => i?.status != "Winner" && i?.status != "RunnerUp",
            ),
          ];

          return (
            <div key={heats?.heatNumber} className="flex flex-col gap-0 p-1">
              <h1 className="font-semibold underline">
                Heat Number: {heats?.heatNumber}
              </h1>
              <p>{`Is finished: ${heats?.isClosed}`}</p>
              <p>Participants:</p>
              <div
                id="participant"
                className="flex flex-col gap-2 rounded-md border-[1px] border-slate-300"
              >
                {(heats?.participants?.length ?? 0) &&
                  reshuffleParticipantsdOrder?.map((participant) => {
                    const winnerHighlightClassname =
                      participant?.status == ParticipantHeatStatusEnum.Winner
                        ? "bg-green-400"
                        : ParticipantHeatStatusEnum.RunnerUp ==
                            participant?.status
                          ? "bg-orange-300"
                          : ParticipantHeatStatusEnum.NotStarted ==
                              participant?.status
                            ? "bg-slate-300"
                            : "";
                    return (
                      <div
                        key={participant?.name}
                        className=" flex   grow flex-col  p-2 "
                      >
                        <p>{`Name: ${participant?.name}`}</p>
                        <p
                          className={winnerHighlightClassname}
                        >{`Status: ${participant?.status}`}</p>
                        <p>{`Time Taken: ${participant?.timeTaken}`}</p>
                      </div>
                    );
                  })}
                <div></div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
