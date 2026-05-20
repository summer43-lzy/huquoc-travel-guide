import HeroSection from '@/components/home/HeroSection'
import CountdownWidget from '@/components/home/CountdownWidget'
import TripStatusBar from '@/components/home/TripStatusBar'
import OverviewSection from '@/components/home/OverviewSection'
import DailyItinerary from '@/components/home/DailyItinerary'
import { tripData } from '@/data/itinerary'

export default function HomePage() {
  return (
    <>
      <HeroSection trip={tripData} />
      <CountdownWidget />
      <TripStatusBar />
      <OverviewSection trip={tripData} />
      <DailyItinerary trip={tripData} />
    </>
  )
}
