import { Plane, Hotel, Cloud, CreditCard, Globe, Phone, Syringe, AlertCircle, Info } from 'lucide-react'

const sections = [
  {
    id: 'transport',
    icon: <Plane className="w-5 h-5" />,
    title: '交通方式',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    items: [
      {
        title: '飞往富国岛',
        content: '富国岛国际机场（PQC）提供来自胡志明市、河内、新加坡等城市的直航。从胡志明市飞行约1小时，从河内约2小时。建议提前1-2个月购票以获得最佳价格。',
        tip: '越捷航空（VietJet）和越南航空（Vietnam Airlines）均有直航，越捷价格通常更实惠',
      },
      {
        title: '岛内交通',
        content: '租摩托车是探索岛屿最灵活的方式，约200,000-300,000 VND/天。打车可使用Grab App（类似滴滴），方便快捷。部分景区之间有免费班车。',
        tip: '骑摩托车需有驾照，建议佩戴头盔，山路较多注意安全',
      },
      {
        title: '去小南岛',
        content: '从An Thới码头乘坐渡船约15分钟，100,000-150,000 VND/人。也可配合缆车游览（缆车终点在小南岛，配有主题乐园）。',
        tip: '渡船班次频繁，无需提前预订',
      },
    ],
  },
  {
    id: 'accommodation',
    icon: <Hotel className="w-5 h-5" />,
    title: '住宿推荐',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    items: [
      {
        title: '奢华度假区',
        content: 'JW Marriott Phu Quoc、Premier Village Phu Quoc 等五星级度假村，通常位于私人海滩，提供全方位服务。价格约5,000,000-15,000,000 VND/晚。',
        tip: '旺季（12月-4月）需提前2-3个月预订',
      },
      {
        title: '中档酒店',
        content: 'Lahana Resort、Bamboo Cottages 等品质中档酒店，性价比较高，价格约1,500,000-3,000,000 VND/晚，多位于长滩附近。',
        tip: '选择长滩（Bãi Trường）附近住宿，交通便利，餐饮选择多',
      },
      {
        title: '精品民宿',
        content: '遍布全岛的精品民宿和 Airbnb，氛围独特，价格600,000-1,500,000 VND/晚，适合追求个性体验的旅行者。',
        tip: '提前查看评分和位置，部分民宿交通不便',
      },
    ],
  },
  {
    id: 'weather',
    icon: <Cloud className="w-5 h-5" />,
    title: '气候与天气',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    items: [
      {
        title: '旱季（11月 - 4月）',
        content: '最佳旅游季节，天气晴朗，海风清爽，海水能见度高，适合浮潜和各类水上活动。气温约25-32℃。',
        tip: '12月到2月是旺季，人多但天气最好',
      },
      {
        title: '雨季（5月 - 10月）',
        content: '可能出现强降雨，但通常不持续全天。雨季游客少，酒店价格便宜20-40%。偶有台风，需关注天气预报。',
        tip: '出行时间为8月，属雨季，建议携带雨衣，户外活动安排在上午',
      },
      {
        title: '穿衣建议',
        content: '全年炎热潮湿，以轻薄透气的夏装为主。参观寺庙需遮盖肩膀和膝盖。室内空调开很足，建议带一件薄外套。',
        tip: '防晒霜必备，建议SPF 50+，每2小时补擦一次',
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
        content: '越南盾（VND）是法定货币。当前汇率约1人民币 ≈ 3,400 VND（请出发前查询最新汇率）。当地ATM可取款，手续费约50,000-70,000 VND/次。',
        tip: '建议提前在国内换一些越南盾应急，机场汇率较差',
      },
      {
        title: '消费水平',
        content: '路边小吃：30,000-80,000 VND；普通餐厅：150,000-400,000 VND/人；高档餐厅：500,000+ VND/人；超市饮料：20,000-40,000 VND',
        tip: '夜市和街边摊可以砍价，大型超市和度假村内价格固定',
      },
      {
        title: '支付方式',
        content: '度假村、高档餐厅普遍接受信用卡（Visa/Mastercard）。街边摊、夜市、小商铺通常只收现金。建议随身携带适量现金。',
        tip: '微信支付和支付宝在部分面向中国游客的商家可用',
      },
    ],
  },
  {
    id: 'visa',
    icon: <Globe className="w-5 h-5" />,
    title: '签证信息',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    items: [
      {
        title: '中国公民免签',
        content: '自2023年8月起，越南对中国公民实行15天免签政策（后延长至30天，请出发前确认最新政策）。持有效中国护照，无需提前申请签证。',
        tip: '护照有效期需在出入境日期后至少6个月',
      },
      {
        title: '入境注意',
        content: '准备好往返机票证明、住宿预订确认单备查。入境卡已取消，在海关填写健康申报即可。全程无需额外签证费。',
        tip: '建议保存酒店预订截图，偶有海关要求查验',
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
        content: '无强制疫苗要求，建议提前接种甲肝、乙肝疫苗（如未接种）。前往丛林区域建议接种破伤风疫苗。',
        tip: '出发前30天咨询医生，了解个人健康需求',
      },
      {
        title: '饮食卫生',
        content: '只喝瓶装水或煮沸的水，避免直接饮用自来水。路边摊热食通常安全，避免生冷食物和未削皮的水果。',
        tip: '随身携带肠胃药以备不时之需',
      },
      {
        title: '急救联系',
        content: '越南紧急电话：113（警察）、114（消防）、115（急救）。富国岛主要医院：AN Thới区医院，大型度假村有驻场医护。',
        tip: '购买旅行保险，确保涵盖医疗和紧急撤离',
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
        content: '越南语是官方语言。旅游区英语交流基本通畅。富国岛面向中国游客的景区、餐厅通常有中文服务或中文菜单。',
        tip: '常用越语：Xin chào（你好）、Cảm ơn（谢谢）、Bao nhiêu?（多少钱？）',
      },
      {
        title: '手机网络',
        content: '建议购买越南本地SIM卡（Viettel 或 Vietnamobile），机场、便利店均可购买，约100,000 VND起，含7天流量。酒店和餐厅普遍提供免费WiFi。',
        tip: '中国移动/联通/电信国际漫游费用较高，建议换本地卡',
      },
      {
        title: '实用App',
        content: 'Grab（打车/外卖）、Google Maps（导航）、Google翻译（相机实时翻译菜单超实用）、Agoda（订房）',
        tip: '提前下载离线地图，部分景区信号弱',
      },
    ],
  },
]

export default function PracticalPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="富国岛"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/50 to-ocean-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-ocean-200 text-sm font-medium tracking-widest uppercase mb-3">Practical Info</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">实用信息</h1>
          <p className="text-white/80 max-w-md">出发前必读，让旅程更顺畅</p>
        </div>
      </div>

      {/* Quick nav */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-stone-600 hover:bg-ocean-50 hover:text-ocean-700 transition-colors"
              >
                {s.icon}
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {sections.map(section => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${section.color}`}>
                {section.icon}
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 card-hover">
                  <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">{item.content}</p>
                  <div className="flex items-start gap-2 bg-sand-50 rounded-xl p-3">
                    <Info className="w-4 h-4 text-sand-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-stone-600">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

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
              { label: '中国大使馆', number: '+84 24 3845 3736' },
            ].map(c => (
              <div key={c.label} className="text-center bg-white rounded-xl p-3 shadow-sm">
                <div className="text-rose-700 font-bold text-lg">{c.number}</div>
                <div className="text-rose-600 text-sm">{c.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
