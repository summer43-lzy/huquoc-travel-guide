'use client'

// Left: live OSM iframe; Right: static SVG regional map

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

      {/* Cambodia */}
      <path filter="url(#countryShadow)"
        d="M 80,160 L 115,145 L 140,148 L 155,162 L 160,185 L 162,210 L 155,235 L 140,250 L 118,258 L 95,255 L 78,240 L 72,218 L 72,192 Z"
        fill="#d4d8e4" stroke="#b8bece" strokeWidth="1" />
      <text x="116" y="205" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui, sans-serif">柬埔寨</text>
      <text x="116" y="216" textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontFamily="system-ui, sans-serif">Cambodia</text>

      {/* Vietnam silhouette */}
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

      <text x="200" y="185" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" fontFamily="system-ui, sans-serif">越南</text>
      <text x="200" y="198" textAnchor="middle" fontSize="8.5" fill="#b45309" fontFamily="system-ui, sans-serif">Vietnam</text>

      {/* Phu Quoc island */}
      <ellipse cx="80" cy="318" rx="10" ry="18" fill="#f43f5e" stroke="white" strokeWidth="2" opacity="0.9" />
      <circle cx="80" cy="318" r="22" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
      <line x1="90" y1="312" x2="112" y2="300" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3,2" />
      <rect x="112" y="285" width="88" height="32" rx="8" fill="white" opacity="0.95" />
      <text x="120" y="298" fontSize="10" fontWeight="700" fill="#be123c" fontFamily="system-ui, sans-serif">富国岛</text>
      <text x="120" y="310" fontSize="8" fill="#64748b" fontFamily="system-ui, sans-serif">Phú Quốc</text>

      {/* City markers */}
      <circle cx="205" cy="55" r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
      <text x="213" y="58" fontSize="8" fill="#78350f" fontFamily="system-ui, sans-serif">河内 Hà Nội</text>
      <circle cx="168" cy="320" r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
      <text x="176" y="324" fontSize="8" fill="#78350f" fontFamily="system-ui, sans-serif">胡志明市</text>

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
      {/* Left: interactive OSM map */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-3 pb-2">
          <p className="font-semibold text-stone-700 text-sm">富国岛交互地图</p>
          <p className="text-xs text-stone-400 mt-0.5">可缩放 · 可拖动 · OpenStreetMap</p>
        </div>
        <div className="h-52 md:h-64">
          <iframe
            title="富国岛地图"
            src="https://www.openstreetmap.org/export/embed.html?bbox=103.83%2C9.99%2C104.15%2C10.52&layer=mapnik&marker=10.37%2C103.99"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
        <div className="px-4 py-2">
          <a
            href="https://www.openstreetmap.org/#map=11/10.2896/103.9840"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ocean-600 hover:underline"
          >
            在 OpenStreetMap 中查看大图 →
          </a>
        </div>
      </div>

      {/* Right: static SVG regional context */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-3 pb-2">
          <p className="font-semibold text-stone-700 text-sm">富国岛在越南的位置</p>
          <p className="text-xs text-stone-400 mt-0.5">越南西南端 · 泰国湾 · 毗邻柬埔寨</p>
        </div>
        <div className="h-52 md:h-64 px-2 pb-2">
          <RegionalMap />
        </div>
      </div>
    </div>
  )
}
