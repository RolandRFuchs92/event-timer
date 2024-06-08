import { ParticipantHeatStatusEnum } from "@prisma/client";

type RoundNamesType = {
  data: {
    roundName: string;
    heats: {
      heatNumber: number;
      isClosed: boolean;
      participants: {
        name: string;
        status: ParticipantHeatStatusEnum | null;
        timeTakedMs: string | null;
      }[];
    }[];
  };
};

export function RoundNames({ data }: RoundNamesType) {
  if (!data) return <div>No Result Data</div>;

  return (
    <div className="w-[50rem] gap-4 rounded-md bg-white p-4 text-black">
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
            <div className="flex flex-col gap-2 p-2">
              <h1 className="font-semibold underline">
                Heat Number: {heats?.heatNumber}
              </h1>
              <p>{`Is finished: ${heats?.isClosed}`}</p>
              <p>Participants:</p>
              <div id="participant" className="flex flex-col gap-2">
                {(heats?.participants?.length ?? 0) &&
                  reshuffleParticipantsdOrder?.map((participant) => {
                    const winnerHighlightClassname =
                      participant?.status == "Winner"
                        ? "bg-yellow-400"
                        : participant?.status == "RunnerUp"
                          ? "bg-orange-300"
                          : "";
                    return (
                      //   <div className=" border-gray-300 h-20 w-24 border-[.05rem]"></div>
                      <div className=" outline-gray-300  flex grow flex-col  rounded-md p-2 outline-dashed outline-[1px]">
                        <p>{`Name: ${participant?.name}`}</p>
                        <p
                          className={winnerHighlightClassname}
                        >{`Status: ${participant?.status}`}</p>
                        <p>{`Time: ${participant?.timeTakedMs}`}</p>
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
