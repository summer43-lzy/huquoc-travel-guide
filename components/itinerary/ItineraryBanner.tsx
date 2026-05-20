export default function ItineraryBanner() {
  return (
    <div className="relative h-44 sm:h-64 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80"
        alt="富国岛海滩"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 via-ocean-900/50 to-ocean-900/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <p className="text-ocean-200 text-xs font-medium tracking-widest uppercase mb-1.5">Itinerary & Attractions</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold mb-1">行程攻略</h1>
        <p className="text-white/70 text-xs sm:text-sm">精选景点、餐厅、活动，每一处都值得期待</p>
      </div>
    </div>
  )
}
