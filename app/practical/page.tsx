import { Plane, Hotel, CreditCard, Globe, Phone, Syringe, AlertCircle, Info } from 'lucide-react'
import CurrencyConverter from '@/components/practical/CurrencyConverter'
import PackingChecklist from '@/components/practical/PackingChecklist'
import PhrasesCard from '@/components/practical/PhrasesCard'
import WeatherWidget from '@/components/practical/WeatherWidget'

// ─── Section 1: 入境关注 ─────────────────────────────────────────────────────
const entrySection = [
  {
    id: 'visa',
    icon: <Globe className="w-5 h-5" />,
    title: '签证信息',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    items: [
      {
        title: '中国大陆公民 · 免签',
        content: '持中国大陆居民护照（PRC护照）可享受30天免签入境越南（含富国岛），自2023年8月起正式实施，无需提前申请，直接持有效护照登机即可。富国岛适用越南全国统一签证政策，与大陆地区完全相同。',
        tip: '护照有效期需在出入境日期后至少6个月；不适用于港澳台地区护照',
      },
      {
        title: '中国台湾公民 · 富国岛免签 / 大陆需签证',
        content: '① 直飞富国岛（PQC机场）：根据越南富国岛经济特区免签政策，持台湾护照可免签入境并停留最长30天，无需提前申请。② 经胡志明市、河内等越南大陆城市中转或游览：需提前申请越南电子签证（E-Visa），费用约25美元，最长停留90天，3个工作日审批。',
        tip: '⚠️ 政策可能随时调整，出发前建议通过越南驻台湾办事处或官方渠道再次核实最新规定',
      },
      {
        title: '入境须知（所有人）',
        content: '富国岛入境口岸为富国国际机场（PQC）。需准备：有效护照（有效期需超过出入境日期至少6个月）、往返机票、酒店预订确认单（偶有查验）。全程在机场办理，无需额外预约。',
        tip: '建议保存酒店预订截图和返程机票截图，入境时备查',
      },
    ],
  },
  {
    id: 'health',
    icon: <Syringe className="w-5 h-5" />,
    title: '健康与安全',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    items: [
      {
        title: '疫苗建议',
        content: '无强制疫苗要求，建议提前接种甲肝、乙肝疫苗（如未接种）。前往丛林区域建议确认破伤风疫苗有效期。出发前30天咨询医生。',
        tip: '出发前30天咨询医生，了解个人健康需求',
      },
      {
        title: '饮食卫生',
        content: '只喝瓶装水或煮沸的水，避免直接饮用自来水或加冰饮料（除正规餐厅）。路边摊热食通常安全，避免生冷食物和未削皮的水果。',
        tip: '随身携带肠胃药和止泻药以备不时之需',
      },
      {
        title: '旅行保险',
        content: '强烈建议购买涵盖医疗和紧急撤离的旅行保险。富国岛主要医院：An Thới区医院，大型度假村有驻场医护。',
        tip: '10人团队建议团体保险，费用更低，出险处理更便捷',
      },
    ],
  },
  {
    id: 'language',
    icon: <Phone className="w-5 h-5" />,
    title: '语言与通讯',
    color: 'bg-stone-100 text-stone-600 border-stone-200',
    items: [
      {
        title: '语言',
        content: '越南语是官方语言。旅游区英语交流基本通畅。面向中国游客的景区、餐厅通常有中文服务或中文菜单，沟通无大障碍。',
        tip: '常用越语：Xin chào（你好）、Cảm ơn（谢谢）、Bao nhiêu?（多少钱？）',
      },
      {
        title: '手机网络',
        content: '建议购买越南本地SIM卡（Viettel 或 Vietnamobile），机场、便利店均可购买，约100,000 VND起，含7天不限流量。酒店和餐厅普遍提供免费WiFi。',
        tip: '中国移动/联通/电信国际漫游费用较高，建议换本地卡',
      },
      {
        title: '实用 App',
        content: 'Grab（打车/外卖）、Google Maps（离线导航）、Google翻译（相机实时翻译菜单）、Agoda（订房）。建议提前下载好离线地图，景区信号可能较弱。',
        tip: '在国内提前下载好，到越南后部分谷歌服务需VPN',
      },
    ],
  },
]

// ─── Section 2: 其他实用信息 ──────────────────────────────────────────────────
const otherSections = [
  {
    id: 'transport',
    icon: <Plane className="w-5 h-5" />,
    title: '交通方式',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    items: [
      {
        title: '飞往富国岛',
        content: '富国岛国际机场（PQC）提供来自胡志明市、河内、新加坡等城市的直航。从胡志明市飞行约1小时，从河内约2小时。建议提前1–2个月购票获得最佳价格。',
        tip: '越捷航空（VietJet）和越南航空均有直航，越捷价格通常更实惠',
      },
      {
        title: '岛内交通',
        content: '打车使用 Grab App（类似滴滴），方便快捷。租摩托车约200,000–300,000 VND/天，最灵活。希尔顿到主城区约20km，打车约100,000 VND。',
        tip: '骑摩托车需有驾照，建议佩戴头盔，山路较多注意安全',
      },
      {
        title: '去小南岛（安泰岛）',
        content: '从 An Thới 码头乘坐渡船约15分钟，100,000–150,000 VND/人。缆车终点即在小南岛，可配合缆车游览。',
        tip: '渡船班次频繁，无需提前预订',
      },
    ],
  },
  {
    id: 'accommodation',
    icon: <Hotel className="w-5 h-5" />,
    title: '住宿参考',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    items: [
      {
        title: '本次住宿：拉菲斯塔·希尔顿格芮精选',
        content: '坐落于南部长滩（Bãi Trường / Long Beach）海岸，拥有无边际泳池、私人沙滩和多家餐厅。地理位置优越，距缆车出发点（安泰港）约12km，距迪淘主城区约10km，岛上南北均可兼顾。建议要求高层海景房，视野最佳。',
        tip: '提前告知是团队出行，可能获得升房或团体服务优惠；酒店提供付费接机服务，10人建议预约',
      },
      {
        title: '退房与行李',
        content: '标准退房时间12:00。最后一天若航班较晚，可提前办理行李寄存，在酒店泳池或海滩享受最后时光。',
        tip: '提前与酒店确认晚退房是否可行（可能需额外费用）',
      },
    ],
  },
  {
    id: 'money',
    icon: <CreditCard className="w-5 h-5" />,
    title: '货币与消费',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    items: [
      {
        title: '货币',
        content: '越南盾（VND）是法定货币。当前参考汇率：1人民币 ≈ 3,400 VND（请出发前查询实时汇率）。当地ATM可取款，手续费约50,000–70,000 VND/次。',
        tip: '建议提前在国内换一些越南盾应急，机场汇率较差',
      },
      {
        title: '消费水平',
        content: '路边小吃：30,000–80,000 VND；普通餐厅：150,000–400,000 VND/人；高档餐厅：500,000+ VND/人；超市饮料：20,000–40,000 VND。',
        tip: '夜市和街边摊可以砍价，大型度假村价格固定',
      },
      {
        title: '支付方式',
        content: '度假村、高档餐厅普遍接受信用卡（Visa/Mastercard）。街边摊、夜市通常只收现金。微信支付和支付宝在部分面向中国游客的商家可用。',
        tip: '随身携带适量现金，100万VND（约300元人民币）基本够一天使用',
      },
    ],
  },
]

function SectionBlock({ section }: { section: typeof otherSections[0] }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${section.color}`}>
          {section.icon}
        </div>
        <h3 className="font-display text-xl font-bold text-stone-900">{section.title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.items.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h4 className="font-semibold text-stone-800 mb-2">{item.title}</h4>
            <p className="text-stone-600 text-sm leading-relaxed mb-3">{item.content}</p>
            <div className="flex items-start gap-2 bg-sand-50 rounded-xl p-3">
              <Info className="w-4 h-4 text-sand-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-stone-600">{item.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function PracticalPage() {
  const allSections = [...entrySection, ...otherSections]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="relative h-60 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="富国岛"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/50 to-ocean-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-ocean-200 text-sm font-medium tracking-widest uppercase mb-3">Pre-Trip Guide</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">出发前关注</h1>
          <p className="text-white/80 max-w-md">签证 · 健康 · 通讯 · 工具，出发前把这页看完</p>
        </div>
      </div>

      {/* Mobile-only quick tool shortcuts (3 tiles) */}
      <div className="md:hidden bg-white border-b border-stone-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: '#currency', emoji: '💱', label: '货币换算' },
            { href: '#packing', emoji: '🧳', label: '行李清单' },
            { href: '#phrases', emoji: '🗣️', label: '越南语速查' },
          ].map(tool => (
            <a
              key={tool.href}
              href={tool.href}
              className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-ocean-50 hover:bg-ocean-100 transition-colors"
            >
              <span className="text-xl">{tool.emoji}</span>
              <span className="text-xs font-medium text-ocean-700 text-center">{tool.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {allSections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-stone-600 hover:bg-ocean-50 hover:text-ocean-700 transition-colors"
              >
                {s.icon}
                {s.title}
              </a>
            ))}
            <a href="#tools" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-stone-600 hover:bg-ocean-50 hover:text-ocean-700 transition-colors">
              🛠️ 旅行工具
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-10 sm:space-y-16">

        {/* ── Part 1: 入境关注 ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">入境关注</h2>
              <p className="text-stone-400 text-sm">出行前必须了解的证件、健康、通讯事项</p>
            </div>
          </div>
          <div className="space-y-10 pl-0 sm:pl-11">
            {entrySection.map(s => (
              <SectionBlock key={s.id} section={s} />
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200" />

        {/* ── Part 2: 其他实用信息 ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">其他实用信息</h2>
              <p className="text-stone-400 text-sm">天气、交通、住宿、货币，让行程更顺畅</p>
            </div>
          </div>
          <div className="space-y-10 pl-0 sm:pl-11">
            {/* Weather first */}
            <section id="weather" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl border bg-cyan-50 text-cyan-600 border-cyan-100 flex items-center justify-center text-lg">
                  🌤️
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900">气候与天气</h3>
              </div>
              <WeatherWidget />
            </section>

            {otherSections.map(s => (
              <SectionBlock key={s.id} section={s} />
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200" />

        {/* ── 旅行工具箱 ── */}
        <section id="tools" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">🛠</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">旅行工具箱</h2>
              <p className="text-stone-400 text-sm">行前准备 · 旅途中使用的实用工具</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="currency" className="scroll-mt-28"><CurrencyConverter /></div>
            <div id="packing" className="scroll-mt-28"><PackingChecklist /></div>
            <div id="phrases" className="scroll-mt-28"><PhrasesCard /></div>
            {/* Offline map tip */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-stone-900">离线地图提醒</h3>
                  <p className="text-xs text-stone-400 mt-0.5">景区信号差，提前下载备用</p>
                </div>
                <span className="text-2xl">🗺️</span>
              </div>
              <div className="space-y-3">
                {[
                  { app: 'Google Maps', tip: '搜索"Phu Quoc"→下载离线地图，覆盖整个岛', emoji: '📍' },
                  { app: 'Maps.me', tip: '免费离线地图App，富国岛细节更完整，推荐备用', emoji: '🗺' },
                  { app: 'Grab', tip: '东南亚打车/外卖App，类似滴滴，提前注册好账号', emoji: '🚕' },
                  { app: 'Google翻译', tip: '下载越南语离线包，相机实时翻译菜单非常实用', emoji: '🔤' },
                ].map(item => (
                  <div key={item.app} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{item.app}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{item.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency contacts */}
        <section className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h2 className="font-display text-xl font-bold text-rose-800">紧急联系</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '警察', number: '113' },
              { label: '消防', number: '114' },
              { label: '急救', number: '115' },
              { label: '中国驻越大使馆', number: '+84 24 3845 3736' },
            ].map(c => (
              <a
                key={c.label}
                href={`tel:${c.number}`}
                className="text-center bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-rose-700 font-bold text-lg">{c.number}</div>
                <div className="text-rose-600 text-sm">{c.label}</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
