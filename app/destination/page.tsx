import PhuQuocMaps from '@/components/destination/PhuQuocMaps'

const infoCards = [
  {
    emoji: '🌍',
    title: '地理位置',
    content: '富国岛（Phú Quốc）位于越南西南端，坐落于泰国湾，是越南面积最大的岛屿，面积约574平方公里。距胡志明市约400公里，与柬埔寨隔海相望。',
  },
  {
    emoji: '🌿',
    title: '自然生态',
    content: '岛上拥有大片原始热带雨林，富国国家公园被联合国教科文组织列为世界生物圈保护区。北部山区、中部低地和南部礁石海岸构成多样的地貌。',
  },
  {
    emoji: '🏛',
    title: '历史人文',
    content: '富国岛历史悠久，曾是高棉王国的一部分，后成为越南领土。法国殖民时期在岛上留下了大量建筑和历史遗迹，当地独特的融合文化由此形成。',
  },
  {
    emoji: '🎎',
    title: '风俗习惯',
    content: '当地居民主要信仰佛教，寺庙在日常生活中扮演重要角色。参观寺庙时需脱鞋，穿着需保守。越南人重视礼节，见面时微笑点头表示尊重。',
  },
  {
    emoji: '🗣',
    title: '语言',
    content: '官方语言为越南语（Tiếng Việt），共6个声调。旅游区英语普及程度较高，部分商家提供中文服务。常用词：Xin chào（你好）、Cảm ơn（谢谢）。',
  },
  {
    emoji: '🍜',
    title: '饮食文化',
    content: '富国岛以新鲜海鲜著称，螃蟹、虾、鱿鱼等是餐桌常客。本地特产包括：富国鱼露（全越最佳）、富国胡椒（享誉国际）和珍珠（淡水珍珠养殖业兴盛）。',
  },
  {
    emoji: '💎',
    title: '经济产业',
    content: '旅游业是支柱产业，近年来快速发展为东南亚热门度假地。传统产业包括渔业、鱼露和胡椒种植。Vinpearl 集团在岛上有大规模投资，建有动物园、水上乐园等设施。',
  },
  {
    emoji: '📅',
    title: '最佳旅游时间',
    content: '11月至4月为旱季，天气晴朗，是最佳旅游季节。5月至10月为雨季，降水较多但价格实惠。全年气温25–35℃，阳光充足，适合海滩度假。',
  },
]

export default function DestinationPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1600&q=80"
          alt="富国岛全景"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 to-ocean-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-ocean-200 text-sm font-medium tracking-widest uppercase mb-3">Destination Guide</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">地域介绍</h1>
          <p className="text-white/80 max-w-lg">地理 · 人文 · 风俗 · 语言，出发前深入了解这片热带天堂</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-14">
          <p className="text-ocean-600 font-semibold text-sm tracking-widest uppercase mb-3">About Phu Quoc</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-4">珍珠岛</h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            富国岛被誉为"东南亚的马尔代夫"，拥有绵延数十公里的白色沙滩、清澈见底的翡翠色海水，
            以及覆盖全岛三分之二面积的原始热带雨林。近年来大力发展旅游业，
            已成为东南亚最受欢迎的度假目的地之一。
          </p>
        </div>

        {/* Stats banner — above map */}
        <section className="mb-12 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-3xl p-8 text-white">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold mb-1">富国岛数字</h2>
            <p className="text-ocean-200 text-sm">一眼了解这座岛屿的规模</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { number: '574', unit: 'km²', label: '岛屿面积' },
              { number: '150+', unit: 'km', label: '海岸线长度' },
              { number: '31,000+', unit: '公顷', label: '国家公园面积' },
              { number: '150+', unit: '种', label: '动物园物种数' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-sand-300">
                  {stat.number}<span className="text-base ml-0.5">{stat.unit}</span>
                </div>
                <div className="text-ocean-100 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section — static, no interaction */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-ocean-600 font-semibold text-xs tracking-widest uppercase mb-1">Map</p>
            <h2 className="font-display text-2xl font-bold text-stone-900">地图</h2>
            <p className="text-stone-400 text-sm mt-1">富国岛在越南的位置 · 岛屿详细地图</p>
          </div>

          <PhuQuocMaps />

          {/* Key locations reference */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: '迪淘 Dương Đông', desc: '主城区，夜市·餐厅集中地' },
              { name: '长滩南段 Long Beach', desc: '拉菲斯塔酒店所在，南部海岸' },
              { name: '星海滩 Bãi Sao', desc: '南部最美白沙滩，能见度极高' },
              { name: '安泰岛 An Thới', desc: '南端渡口·缆车出发点' },
            ].map(loc => (
              <div key={loc.name} className="bg-white rounded-xl border border-stone-100 shadow-sm p-3">
                <p className="font-semibold text-stone-800 text-xs">{loc.name}</p>
                <p className="text-stone-400 text-xs mt-0.5">{loc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info grid */}
        <section>
          <div className="text-center mb-10">
            <p className="text-ocean-600 font-semibold text-sm tracking-widest uppercase mb-3">Island Info</p>
            <h2 className="font-display text-3xl font-bold text-stone-900">全方位了解</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoCards.map(card => (
              <div
                key={card.title}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 card-hover"
              >
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="font-display font-bold text-stone-900 mb-2">{card.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{card.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
