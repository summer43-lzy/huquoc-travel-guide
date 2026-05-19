// SVG-based static maps — no external dependency, works offline

function IslandMap() {
  const locations = [
    { x: 92,  y: 108, color: '#f43f5e', label: '拉菲斯塔酒店', sub: 'Bai Dai', anchor: 'right' },
    { x: 168, y: 112, color: '#8b5cf6', label: '珍珠野生动物园', sub: '', anchor: 'right' },
    { x: 102, y: 218, color: '#f59e0b', label: '迪淘主城区', sub: 'Dương Đông', anchor: 'right' },
    { x: 100, y: 270, color: '#0ea5e9', label: '长滩', sub: 'Bãi Trường', anchor: 'right' },
    { x: 255, y: 368, color: '#06b6d4', label: '星海滩', sub: 'Bãi Sao', anchor: 'left' },
    { x: 180, y: 448, color: '#6366f1', label: '缆车·安泰岛', sub: 'An Thới', anchor: 'right' },
  ]

  return (
    <svg viewBox="0 0 360 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="ocean1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="island1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9f99d" />
          <stop offset="60%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id="islandShadow">
          <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="#0369a1" floodOpacity="0.18" />
        </filter>
        <pattern id="wavePattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M0 15 Q7.5 8 15 15 Q22.5 22 30 15" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5"/>
        </pattern>
      </defs>

      {/* Ocean background */}
      <rect width="360" height="500" fill="url(#ocean1)" />
      <rect width="360" height="500" fill="url(#wavePattern)" />

      {/* National Park overlay (green tint) */}
      <path d="M 118,62 C 145,50 175,55 195,72 C 210,85 215,105 210,130 C 205,155 195,175 180,190 C 165,205 145,210 128,200 C 110,190 100,170 98,148 C 95,125 100,100 110,82 Z"
        fill="#86efac" opacity="0.45" />
      <text x="150" y="145" textAnchor="middle" fontSize="8.5" fill="#15803d" fontFamily="system-ui, sans-serif" fontWeight="600" opacity="0.85">国家公园</text>

      {/* Island body */}
      <path filter="url(#islandShadow)"
        d="M 178,36
           C 195,38 220,52 238,75
           C 255,98 262,130 260,165
           C 258,200 250,232 242,262
           C 234,292 226,320 215,348
           C 204,375 194,400 184,425
           C 180,438 176,450 172,460
           C 168,450 164,438 160,425
           C 150,400 140,375 129,348
           C 118,320 110,292 102,262
           C 94,232 86,200 84,165
           C 82,130 89,98 106,75
           C 123,52 148,38 165,36
           C 170,35 174,35 178,36 Z
           M 178,36 C 162,34 130,48 112,72
           C 94,96 85,128 84,165"
        fill="url(#island1)" stroke="#d4a851" strokeWidth="1.5" />

      {/* Coastline highlight */}
      <path d="M 178,36 C 195,38 220,52 238,75 C 255,98 262,130 260,165 C 258,200 250,232 242,262 C 234,292 226,320 215,348 C 204,375 194,400 184,425 C 180,438 176,450 172,460"
        fill="none" stroke="white" strokeWidth="1" opacity="0.6" />

      {/* Roads (dashed lines) */}
      <line x1="172" y1="460" x2="172" y2="60" stroke="#d97706" strokeWidth="1.2" strokeDasharray="4,5" opacity="0.5"/>

      {/* Location pins */}
      {locations.map((loc) => (
        <g key={loc.label}>
          <circle cx={loc.x} cy={loc.y} r="7" fill={loc.color} stroke="white" strokeWidth="2" />
          <circle cx={loc.x} cy={loc.y} r="3" fill="white" />
          {/* Label */}
          {loc.anchor === 'right' ? (
            <>
              <line x1={loc.x + 7} y1={loc.y} x2={loc.x + 14} y2={loc.y} stroke={loc.color} strokeWidth="1" />
              <rect x={loc.x + 14} y={loc.y - 11} width={loc.sub ? 72 : 60} height={loc.sub ? 20 : 14} rx="4" fill="white" opacity="0.9" />
              <text x={loc.x + 18} y={loc.y - 2} fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="700" fill="#1c1917">{loc.label}</text>
              {loc.sub && <text x={loc.x + 18} y={loc.y + 7} fontSize="7" fontFamily="system-ui, sans-serif" fill="#78716c">{loc.sub}</text>}
            </>
          ) : (
            <>
              <line x1={loc.x - 7} y1={loc.y} x2={loc.x - 14} y2={loc.y} stroke={loc.color} strokeWidth="1" />
              <rect x={loc.x - 86} y={loc.y - 11} width={loc.sub ? 72 : 60} height={loc.sub ? 20 : 14} rx="4" fill="white" opacity="0.9" />
              <text x={loc.x - 82} y={loc.y - 2} fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="700" fill="#1c1917">{loc.label}</text>
              {loc.sub && <text x={loc.x - 82} y={loc.y + 7} fontSize="7" fontFamily="system-ui, sans-serif" fill="#78716c">{loc.sub}</text>}
            </>
          )}
        </g>
      ))}

      {/* Compass */}
      <g transform="translate(320, 52)">
        <circle cx="0" cy="0" r="16" fill="white" opacity="0.9" />
        <text x="0" y="-6" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1" fontFamily="system-ui">N</text>
        <polygon points="0,-4 -2,4 0,2 2,4" fill="#0369a1" />
        <text x="0" y="13" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="system-ui">S</text>
      </g>

      {/* Title */}
      <rect x="12" y="12" width="105" height="28" rx="8" fill="white" opacity="0.9" />
      <text x="20" y="24" fontSize="9" fontWeight="700" fill="#0c4a6e" fontFamily="system-ui, sans-serif">富国岛详细地图</text>
      <text x="20" y="34" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Phú Quốc Island</text>

      {/* Scale */}
      <line x1="18" y1="480" x2="68" y2="480" stroke="#64748b" strokeWidth="1.5" />
      <line x1="18" y1="475" x2="18" y2="485" stroke="#64748b" strokeWidth="1.5" />
      <line x1="68" y1="475" x2="68" y2="485" stroke="#64748b" strokeWidth="1.5" />
      <text x="43" y="495" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="system-ui">≈ 25 km</text>
    </svg>
  )
}

function RegionalMap() {
  return (
    <svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="ocean2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <filter id="countryShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#0369a1" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ocean */}
      <rect width="320" height="400" fill="url(#ocean2)" />

      {/* Gulf of Thailand label */}
      <text x="68" y="295" textAnchor="middle" fontSize="9" fill="#7dd3fc" fontFamily="system-ui, sans-serif" fontStyle="italic" transform="rotate(-15, 68, 295)">泰国湾</text>
      <text x="68" y="307" textAnchor="middle" fontSize="7" fill="#93c5fd" fontFamily="system-ui, sans-serif" fontStyle="italic" transform="rotate(-15, 68, 307)">Gulf of Thailand</text>

      {/* Cambodia (behind Vietnam) */}
      <path filter="url(#countryShadow)"
        d="M 80,160 L 115,145 L 140,148 L 155,162 L 160,185 L 162,210 L 155,235 L 140,250 L 118,258 L 95,255 L 78,240 L 72,218 L 72,192 Z"
        fill="#d4d8e4" stroke="#b8bece" strokeWidth="1" />
      <text x="116" y="205" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui, sans-serif">柬埔寨</text>
      <text x="116" y="216" textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontFamily="system-ui, sans-serif">Cambodia</text>

      {/* Vietnam silhouette (simplified S-shape) */}
      <path filter="url(#countryShadow)"
        d="M 175,28
           C 190,28 215,32 235,42
           C 252,52 260,68 258,85
           C 256,102 245,114 230,122
           C 215,130 200,130 188,138
           C 175,146 168,158 165,172
           C 162,186 163,200 168,213
           C 173,226 182,235 190,247
           C 198,259 204,272 204,286
           C 204,300 198,313 188,322
           C 178,331 165,336 152,338
           C 138,340 124,338 114,330
           C 104,322 98,310 96,298
           L 100,258
           C 118,258 140,250 155,235
           C 162,210 162,185 155,162
           C 148,148 140,148 130,148
           C 128,140 132,130 140,120
           C 148,110 158,102 165,90
           C 172,78 172,60 170,45
           C 171,36 173,28 175,28 Z"
        fill="#fef3c7" stroke="#d4a851" strokeWidth="1.2" />

      {/* Vietnam label */}
      <text x="200" y="185" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" fontFamily="system-ui, sans-serif">越南</text>
      <text x="200" y="198" textAnchor="middle" fontSize="8.5" fill="#b45309" fontFamily="system-ui, sans-serif">Vietnam</text>

      {/* Phu Quoc island (highlighted) */}
      <ellipse cx="80" cy="318" rx="10" ry="18" fill="#f43f5e" stroke="white" strokeWidth="2" opacity="0.9" />

      {/* Phu Quoc pulse ring */}
      <circle cx="80" cy="318" r="22" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />

      {/* Connector line to label */}
      <line x1="90" y1="312" x2="112" y2="300" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3,2" />

      {/* Phu Quoc label box */}
      <rect x="112" y="285" width="88" height="32" rx="8" fill="white" opacity="0.95" />
      <text x="120" y="298" fontSize="10" fontWeight="700" fill="#be123c" fontFamily="system-ui, sans-serif">富国岛</text>
      <text x="120" y="310" fontSize="8" fill="#64748b" fontFamily="system-ui, sans-serif">Phú Quốc</text>

      {/* Hanoi marker */}
      <circle cx="205" cy="55" r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
      <text x="213" y="58" fontSize="8" fill="#78350f" fontFamily="system-ui, sans-serif">河内 Hà Nội</text>

      {/* Ho Chi Minh marker */}
      <circle cx="168" cy="320" r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
      <text x="176" y="324" fontSize="8" fill="#78350f" fontFamily="system-ui, sans-serif">胡志明市</text>

      {/* Distance annotation */}
      <line x1="80" y1="300" x2="162" y2="308" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="108" y="302" fontSize="7.5" fill="#94a3b8" fontFamily="system-ui, sans-serif">≈ 115 km</text>

      {/* Title */}
      <rect x="12" y="12" width="118" height="28" rx="8" fill="white" opacity="0.9" />
      <text x="20" y="24" fontSize="9" fontWeight="700" fill="#0c4a6e" fontFamily="system-ui, sans-serif">富国岛区域位置</text>
      <text x="20" y="34" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Regional Location</text>

      {/* Compass */}
      <g transform="translate(288, 52)">
        <circle cx="0" cy="0" r="16" fill="white" opacity="0.9" />
        <text x="0" y="-6" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1" fontFamily="system-ui">N</text>
        <polygon points="0,-4 -2,4 0,2 2,4" fill="#0369a1" />
        <text x="0" y="13" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="system-ui">S</text>
      </g>
    </svg>
  )
}

export default function PhuQuocMaps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Island detail */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="font-semibold text-stone-700 text-sm">富国岛详细地图</p>
          <p className="text-xs text-stone-400 mt-0.5">景点 · 酒店 · 海滩 · 主城区分布</p>
        </div>
        <div className="px-2 pb-2">
          <IslandMap />
        </div>
        {/* Legend */}
        <div className="px-4 pb-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { color: '#f43f5e', label: '酒店' },
            { color: '#8b5cf6', label: '景区' },
            { color: '#f59e0b', label: '主城区' },
            { color: '#0ea5e9', label: '海滩' },
            { color: '#6366f1', label: '活动' },
            { color: '#86efac', label: '国家公园' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-stone-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regional context */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="font-semibold text-stone-700 text-sm">富国岛在越南的位置</p>
          <p className="text-xs text-stone-400 mt-0.5">越南西南端 · 泰国湾 · 毗邻柬埔寨</p>
        </div>
        <div className="px-2 pb-4">
          <RegionalMap />
        </div>
      </div>
    </div>
  )
}
