import HeroSection from '@/components/home/HeroSection'
import OverviewSection from '@/components/home/OverviewSection'
import DailyItinerary from '@/components/home/DailyItinerary'
import { tripData } from '@/data/itinerary'

export default function HomePage() {
  return (
    <>
      <HeroSection trip={tripData} />
      <OverviewSection trip={tripData} />
      <DailyItinerary trip={tripData} />
    </>
  )
}
