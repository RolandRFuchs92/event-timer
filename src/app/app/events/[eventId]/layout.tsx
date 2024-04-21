import { CalendarIcon } from "@/components/Icons/CalendarIcon";
import { FinishersIcon } from "@/components/Icons/FinisherIcon";
import { PeopleIcon } from "@/components/Icons/PeopleIcon";
import { RaceIcon } from "@/components/Icons/RaceIcon";
import { Tabs } from "@/components/Tabs/Tabs";
import {
  ClipboardIcon,
  HomeIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

interface EventHomeLayoutProps {
  children: React.ReactNode;
  params: {
    eventId: string;
  };
}

export default function EventHomeLayout({
  children,
  params,
}: EventHomeLayoutProps) {
  const eventId = params.eventId;
  return (
    <div className="flex flex-col">
      <Tabs
        options={[
          {
            Icon: <HomeIcon className="h-4 w-4" />,
            text: "Home",
            linkProps: {
              href: `/app/events/${eventId}`,
            },
          },
          {
            Icon: <RaceIcon className="h-4 w-4" />,
            text: "Races",
            linkProps: {
              href: `/app/events/${eventId}/races`,
            },
          },
          {
            Icon: <ClipboardIcon className="h-4 w-4" />,
            text: "Registration",
            linkProps: {
              href: `/app/events/${eventId}/registration`,
            },
          },
          {
            Icon: <PeopleIcon />,
            text: "Participants",
            linkProps: {
              href: `/app/events/${eventId}/participants`,
            },
          },
          {
            Icon: <FinishersIcon />,
            text: "Finishers",
            linkProps: {
              href: `/app/events/${eventId}/finishers`,
            },
          },
          {
            Icon: <TrophyIcon className="h-4 w-4" />,
            text: "Results",
            linkProps: {
              href: `/app/events/${eventId}/results`,
            },
          },
        ]}
      />
      <div className="bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 w-full rounded-lg p-6">
        {children}
      </div>
    </div>
  );
}
