export interface Attraction {
  id: string
  name: string
  category: 'scenic' | 'beach' | 'activity' | 'restaurant' | 'accommodation' | 'shopping'
  description: string
  image: string
  location: { lng: number; lat: number }
  address: string
  rating: number
  tips?: string[]
  price?: string
  openHours?: string
  tags: string[]
  distanceFromHotel?: string
}

export interface DayItinerary {
  day: number
  date: string
  title: string
  description: string
  attractions: Attraction[]
}

export interface TripOverview {
  destination: string
  startDate: string
  endDate: string
  totalDays: number
  groupSize: number
  hotel?: string
  highlights: string[]
  days: DayItinerary[]
}

export interface UserFavorite {
  id: string
  userId: string
  attractionId: string
  scheduledDate?: string
  createdAt: string
}

export interface MapMarker {
  id: string
  name: string
  category: Attraction['category']
  location: { lng: number; lat: number }
  attractionId: string
}
