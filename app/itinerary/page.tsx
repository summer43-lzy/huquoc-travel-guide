import { Clock, DollarSign, Navigation, ExternalLink } from 'lucide-react'
import { tripData } from '@/data/itinerary'
import FavoriteButton from '@/components/ui/FavoriteButton'
import CategoryBadge from '@/components/ui/CategoryBadge'
import StarRating from '@/components/ui/StarRating'
import AttractionRating from '@/components/ui/AttractionRating'
import RestaurantSection from '@/components/itinerary/RestaurantSection'
import DayOverviewCard from '@/components/itinerary/DayOverviewCard'
import TripWeatherForecast from '@/components/itinerary/TripWeatherForecast'
import CopyAddressButton from '@/components/ui/CopyAddressButton'
import BookingSummaryCard from '@/components/home/BookingSummaryCard'
import ItineraryBanner from '@/components/itinerary/ItineraryBanner'
import ItineraryAnchorNav from '@/components/itinerary/ItineraryAnchorNav'

export default function ItineraryPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Banner image — pure display */}
      <ItineraryBanner />

      {/* Sticky anchor nav — below banner, sticks to top on scroll */}
      <ItineraryAnchorNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 4-day weather forecast */}
        <TripWeatherForecast />

        {/* Booking progress */}
        <BookingSummaryCard className="mb-8" />

        {/* Top Restaurants — anchored */}
        <div id="restaurants" className="scroll-mt-6">
          <RestaurantSection />
        </div>

        {/* Day sections */}
        {tripData.days.map(day => (
          <section key={day.day} id={`day-${day.day}`} className="mb-16 scroll-mt-20">
            {/* Day header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-ocean-600 flex flex-col items-center justify-center text-white flex-shrink-0">
                <span className="text-xs font-medium">Day</span>
                <span className="text-xl font-bold leading-none">{day.day}</span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-stone-900">{day.title}</h2>
                <p className="text-stone-400 text-sm mt-0.5">{day.date}</p>
                {/* Bullet points if available, else paragraph */}
                {day.bullets && day.bullets.length > 0 ? (
                  <ul className="mt-2.5 space-y-1.5 max-w-2xl">
                    {day.bullets.map((bullet, i) => (
                      <li key={i} className="text-stone-600 text-sm leading-snug flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5 text-base leading-none">
                          {bullet.split(' ')[0]}
                        </span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: bullet
                              .replace(/^[^\s]+\s/, '')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-600 text-sm mt-2 max-w-2xl">{day.description}</p>
                )}
                {/* Essentials strip */}
                {day.essentials && day.essentials.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider self-center mr-1">必带</span>
                    {day.essentials.map((e, i) => (
                      <span key={i} className="bg-amber-50 border border-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 text-xs">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DayOverviewCard day={day} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {day.attractions.map(attraction => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-100 card-hover shadow-sm flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-52 overflow-hidden flex-shrink-0">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 image-overlay" />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge category={attraction.category} />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={attraction.rating} />
                      </div>
                      <h3 className="font-display font-bold text-white text-lg leading-tight">{attraction.name}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-stone-500 text-sm leading-relaxed mb-3">{attraction.description}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 mb-3">
                      {attraction.price && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          {attraction.price}
                        </div>
                      )}
                      {attraction.openHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-ocean-500" />
                          {attraction.openHours}
                        </div>
                      )}
                      {attraction.distanceFromHotel && (
                        <div className="flex items-center gap-1 text-ocean-700 font-medium">
                          <Navigation className="w-3.5 h-3.5 text-ocean-400" />
                          {attraction.distanceFromHotel}
                        </div>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {attraction.location && (
                        <a
                          href={`https://maps.google.com/?q=${attraction.location.lat},${attraction.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-ocean-50 hover:bg-ocean-100 border border-ocean-200 text-ocean-700 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          导航
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                      {attraction.address && (
                        <CopyAddressButton address={attraction.address} />
                      )}
                      <FavoriteButton attractionId={attraction.id} className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors" />
                    </div>

                    {attraction.tips && attraction.tips.length > 0 && (
                      <div className="bg-sand-50 rounded-xl p-3 mb-3">
                        <p className="text-xs font-semibold text-sand-700 mb-1.5">💡 旅行小贴士</p>
                        <ul className="space-y-1">
                          {attraction.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                              <span className="text-sand-500 flex-shrink-0">·</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {attraction.tags.map(tag => (
                        <span key={tag} className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-stone-50 pt-2.5 mt-auto">
                      <AttractionRating attractionId={attraction.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
