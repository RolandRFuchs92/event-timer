import { Suspense } from "react"
import { BatchList } from "./BatchList"

interface RaceBatchLayout {
  children: React.ReactNode,
  params: {
    raceId: string,
    eventId: string
  }
}

export default async function RaceBatchLayout({ children, params }: RaceBatchLayout) {
  return <div>
    <h3>Batches</h3>
    <Suspense fallback={<h1>LOADING</h1>}>
      <BatchList
        raceId={params.raceId}
        eventId={params.eventId}
      />
    </Suspense>
    {children}
  </div>
}
