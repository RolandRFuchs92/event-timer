"use client";
import { LinkButton } from "@/components/FormElements/button";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    event_id: string;
    raceId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  const pathname = usePathname();
  const baseUrl = `/app/events/${params.event_id}/laneRace/${params.raceId}`;

  const splitPath = pathname.split("/");
  splitPath.reverse();
  const lastPart = splitPath[0];

  return (
    <div>
      <div className="flex flex-row gap-2">
        <LinkButton
          href={`${baseUrl}/top`}
          label="Transfer Top Participants"
          className={lastPart === "top" ? "bg-secondary" : ""}
        />
        <LinkButton
          href={`${baseUrl}/all`}
          label="Transfer All Participants"
          className={lastPart === "all" ? "bg-secondary" : ""}
        />
        <LinkButton
          href={`${baseUrl}/winners`}
          label="Transfer Winners"
          className={lastPart === "winners" ? "bg-secondary" : ""}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
