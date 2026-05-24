import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wordSections } from './wordContent.js'
import {
  CalendarDays, Map, UtensilsCrossed, Sparkles, Wallet, Briefcase, BookOpen,
  Menu, Bell, SunMedium, ChevronRight, MapPin, Clock3, Footprints,
  Camera, WalletCards, Globe, Smartphone, Hotel, Plane, Train, Phone,
  Languages, Mic, Volume2, Search, Send, PlusCircle, Trash2, Download,
  Flame, Route, Navigation, HeartPulse, FileText
} from 'lucide-react'

const assets = {
  splash: '/splash.png',
  banner: '/banner.jpg',
}

const days = [
  { id: 1, date: '11 juil.', city: 'Osaka', title: 'Tokyo → Osaka → Dotonbori', image: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e?auto=format&fit=crop&w=1200&q=80', summary: 'Haneda, Shinkansen, check-in Candeo Hotel Osaka Namba, soirée Dotonbori.', timeRange: '11:00 – 22:00', steps: '13 850 pas', highlights: ['Haneda', 'Tokyo Station', 'Dotonbori', 'Street food'], restaurants: ['Kukuru Takoyaki', 'Creo-ru', 'Rikuro Ojisan'], spots: ['Glico Running Man', 'Tombori Riverwalk'] },
  { id: 2, date: '12 juil.', city: 'Osaka', title: 'Namba Yasaka → Osaka Castle → Shinsekai', image: 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?auto=format&fit=crop&w=1200&q=80', summary: 'Tête de lion, château d’Osaka, Tempozan, Tsutenkaku et kushikatsu.', timeRange: '08:30 – 21:00', steps: '15 100 pas', highlights: ['Namba Yasaka', 'Osaka Castle', 'Shinsekai'], restaurants: ['Daruma Kushikatsu', 'Tempozan Food Court'], spots: ['Tsutenkaku', 'Osaka Castle'] },
  { id: 3, date: '13 juil.', city: 'Osaka', title: 'Universal Studios Japan', image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?auto=format&fit=crop&w=1200&q=80', summary: 'Super Nintendo World, Harry Potter, Jurassic Park et Umeda en soirée.', timeRange: '06:30 – 22:00', steps: '20 500 pas', highlights: ['USJ', 'Nintendo', 'Harry Potter'], restaurants: ['USJ snacks', 'Ichiran Shinjuku'], spots: ['Super Nintendo World', 'Hogwarts'] },
  { id: 4, date: '14 juil.', city: 'Nara / Kyoto', title: 'Nara → arrivée Gion', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', summary: 'Daims de Nara puis installation à Kyoto et soirée Gion.', timeRange: '08:00 – 21:30', steps: '14 600 pas', highlights: ['Nara Park', 'Kasuga Taisha', 'Gion'], restaurants: ['Nakatanidou', 'Gyoza ChaoChao'], spots: ['Daims', 'Yasaka Shrine'] },
  { id: 5, date: '15 juil.', city: 'Kyoto', title: 'Kyoto – Jour 1 ⛩️', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80', summary: 'Kiyomizu-dera, Sannenzaka, Yasaka Shrine, Nishiki Market, Gion & Shirakawa.', timeRange: '08:00 – 21:30', steps: '15 420 pas', highlights: ['Kiyomizu-dera', 'Nishiki Market', 'Gion'], restaurants: ['Nishiki Market', 'Ramen Sen no Kaze'], spots: ['Kiyomizu-dera', 'Sannenzaka', 'Gion Shirakawa'] },
  { id: 6, date: '16 juil.', city: 'Kyoto', title: 'Fushimi Inari → Arashiyama', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80', summary: 'Torii rouges, forêt de bambous, Tenryu-ji et Pontocho.', timeRange: '07:30 – 21:00', steps: '16 200 pas', highlights: ['Fushimi Inari', 'Bamboo Grove', 'Pontocho'], restaurants: ['% Arabica', 'Pontocho Alley'], spots: ['Torii rouges', 'Togetsukyo Bridge'] },
  { id: 7, date: '17 juil.', city: 'Kyoto / Séoul', title: 'Gion Matsuri → Séoul', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80', summary: 'Festival Gion Matsuri, Haruka Express, vol KIX → Incheon, Myeongdong.', timeRange: '08:00 – 23:00', steps: '10 800 pas', highlights: ['Gion Matsuri', 'Haruka', 'Myeongdong'], restaurants: ['Myeongdong Street Food'], spots: ['Shijo Kawaramachi', 'Myeongdong night'] },
  { id: 8, date: '18 juil.', city: 'Séoul', title: 'Gyeongbokgung → Bukchon → Myeongdong', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80', summary: 'Palais royal, village hanok, Insadong et street food Myeongdong.', timeRange: '09:00 – 21:30', steps: '14 900 pas', highlights: ['Gyeongbokgung', 'Bukchon', 'Myeongdong'], restaurants: ['Myeongdong Kyoja', 'Insadong Geujib'], spots: ['Bukchon Hanok', 'Myeongdong neon'] },
  { id: 9, date: '19 juil.', city: 'Séoul', title: 'N Seoul Tower → Hongdae', image: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?auto=format&fit=crop&w=1200&q=80', summary: 'Vue Namsan, marchés, Hongdae et dîner BBQ coréen.', timeRange: '10:00 – 22:00', steps: '13 400 pas', highlights: ['N Seoul Tower', 'Hongdae'], restaurants: ['Wangbijib', 'Hongdae Chicken'], spots: ['Namsan', 'Hongdae'] },
  { id: 10, date: '20 juil.', city: 'Busan', title: 'Séoul → Busan + Haeundae', image: 'https://images.unsplash.com/photo-1569264018996-a5e5a37ed2d0?auto=format&fit=crop&w=1200&q=80', summary: 'KTX vers Busan, Haeundae Beach, Dongbaekseom et The Bay 101.', timeRange: '08:00 – 21:30', steps: '12 100 pas', highlights: ['KTX', 'Haeundae', 'The Bay 101'], restaurants: ['Haeundae Market', 'The Bay 101'], spots: ['Haeundae', 'Skyline Busan'] },
  { id: 11, date: '21 juil.', city: 'Busan', title: 'Temple mer → Gamcheon → Gwangalli', image: 'https://images.unsplash.com/photo-1569264018996-a5e5a37ed2d0?auto=format&fit=crop&w=1200&q=80', summary: 'Temple Haedong Yonggungsa, Gamcheon, Jagalchi et Gwangalli.', timeRange: '09:00 – 22:00', steps: '16 050 pas', highlights: ['Temple mer', 'Gamcheon', 'Gwangalli'], restaurants: ['Jagalchi', 'BIFF Square'], spots: ['Gamcheon', 'Gwangalli Bridge'] },
  { id: 12, date: '22 juil.', city: 'Tokyo', title: 'Busan → Narita → Shinjuku', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80', summary: 'Gimhae Airport, vol vers Narita, Narita Express puis Shinjuku.', timeRange: '08:30 – 22:00', steps: '9 400 pas', highlights: ['Blue Line Park', 'NEX', 'Shinjuku'], restaurants: ['Shinjuku late dinner'], spots: ['Kabukicho'] },
]

const instagramBuzz = [
  {
    dayId: 1, date: '11 juil.', city: 'Osaka', title: 'Dotonbori & Namba',
    spots: [
      { name: 'Dotonbori Bridge', tag: 'dotonbori', url: 'https://www.instagram.com/explore/tags/dotonbori/' },
      { name: 'Glico Running Man', tag: 'glicoman', url: 'https://www.instagram.com/explore/tags/glicoman/' },
      { name: 'Tombori Riverwalk', tag: 'tomboririverwalk', url: 'https://www.instagram.com/explore/tags/tomboririverwalk/' },
    ],
    restaurants: [
      { name: 'Kukuru Takoyaki', handle: 'kukurutakoyaki_official', tag: 'kukurutakoyaki', url: 'https://www.instagram.com/explore/tags/kukurutakoyaki/' },
      { name: 'Rikuro Ojisan', handle: 'rikuro_ojisan_namba', tag: 'rikuroojisan', url: 'https://www.instagram.com/explore/tags/rikuroojisan/' },
      { name: 'Creo-ru Takoyaki', tag: 'creoru', url: 'https://www.instagram.com/explore/tags/creoru/' },
    ]
  },
  {
    dayId: 2, date: '12 juil.', city: 'Osaka', title: 'Osaka Castle & Shinsekai',
    spots: [
      { name: 'Osaka Castle', tag: 'osakacastle', url: 'https://www.instagram.com/explore/tags/osakacastle/' },
      { name: 'Tsutenkaku Tower', handle: 'tsutenkaku_official', tag: 'tsutenkaku', url: 'https://www.instagram.com/tsutenkaku_official/' },
      { name: 'Namba Yasaka Shrine', tag: 'nambayasaka', url: 'https://www.instagram.com/explore/tags/nambayasaka/' },
    ],
    restaurants: [
      { name: 'Daruma Kushikatsu', tag: 'darumakushikatsu', url: 'https://www.instagram.com/explore/tags/darumakushikatsu/' },
      { name: 'Shinsekai Food', tag: 'shinsekai', url: 'https://www.instagram.com/explore/tags/shinsekai/' },
    ]
  },
  {
    dayId: 3, date: '13 juil.', city: 'Osaka', title: 'Universal Studios Japan',
    spots: [
      { name: 'Super Nintendo World', handle: 'usjofficialinstagram', tag: 'supernintendoworld', url: 'https://www.instagram.com/usjofficialinstagram/' },
      { name: 'Hogwarts Castle USJ', handle: 'usjofficialinstagram', tag: 'harrypotterworldjapan', url: 'https://www.instagram.com/explore/tags/harrypotterworldjapan/' },
      { name: 'Jurassic Park USJ', handle: 'usjofficialinstagram', tag: 'usjjurassicpark', url: 'https://www.instagram.com/explore/tags/usj/' },
    ],
    restaurants: [
      { name: 'Butterbeer', handle: 'usjofficialinstagram', tag: 'butterbeerusj', url: 'https://www.instagram.com/explore/tags/butterbeerusj/' },
      { name: 'Three Broomsticks', tag: 'usjfood', url: 'https://www.instagram.com/explore/tags/usjfood/' },
    ]
  },
  {
    dayId: 4, date: '14 juil.', city: 'Nara / Kyoto', title: 'Daims de Nara & Gion',
    spots: [
      { name: 'Nara Deer Park', tag: 'naradeer', url: 'https://www.instagram.com/explore/tags/naradeer/' },
      { name: 'Kasuga Taisha', tag: 'kasugataisha', url: 'https://www.instagram.com/explore/tags/kasugataisha/' },
      { name: 'Gion at Night', tag: 'gionkyoto', url: 'https://www.instagram.com/explore/tags/gionkyoto/' },
    ],
    restaurants: [
      { name: 'Nakatanidou Mochi', tag: 'nakatanidou', url: 'https://www.instagram.com/explore/tags/nakatanidou/' },
      { name: 'Gyoza ChaoChao', tag: 'chaochaogyoza', url: 'https://www.instagram.com/explore/tags/chaochao/' },
    ]
  },
  {
    dayId: 5, date: '15 juil.', city: 'Kyoto', title: 'Kiyomizu & Higashiyama',
    spots: [
      { name: 'Kiyomizu-dera', tag: 'kiyomizudera', url: 'https://www.instagram.com/explore/tags/kiyomizudera/' },
      { name: 'Sannenzaka', tag: 'sannenzaka', url: 'https://www.instagram.com/explore/tags/sannenzaka/' },
      { name: 'Gion Shirakawa', tag: 'gionshirakawa', url: 'https://www.instagram.com/explore/tags/gionshirakawa/' },
    ],
    restaurants: [
      { name: 'Nishiki Market', tag: 'nishikimarket', url: 'https://www.instagram.com/explore/tags/nishikimarket/' },
      { name: 'Ramen Kyoto', tag: 'ramenyakyoto', url: 'https://www.instagram.com/explore/tags/ramenyakyoto/' },
    ]
  },
  {
    dayId: 6, date: '16 juil.', city: 'Kyoto', title: 'Fushimi Inari & Arashiyama',
    spots: [
      { name: 'Fushimi Inari Torii', tag: 'fushimiinari', url: 'https://www.instagram.com/explore/tags/fushimiinari/' },
      { name: 'Arashiyama Bamboo', tag: 'arashiyamabamboo', url: 'https://www.instagram.com/explore/tags/arashiyamabamboo/' },
      { name: 'Togetsukyo Bridge', tag: 'togetsukyobridge', url: 'https://www.instagram.com/explore/tags/togetsukyobridge/' },
    ],
    restaurants: [
      { name: '% Arabica Kyoto', handle: 'arabicakyoto', tag: 'arabicakyoto', url: 'https://www.instagram.com/arabicakyoto/' },
      { name: 'Pontocho Alley', tag: 'pontocho', url: 'https://www.instagram.com/explore/tags/pontocho/' },
    ]
  },
  {
    dayId: 7, date: '17 juil.', city: 'Kyoto → Séoul', title: 'Gion Matsuri & Myeongdong',
    spots: [
      { name: 'Gion Matsuri Festival', tag: 'gionmatsuri', url: 'https://www.instagram.com/explore/tags/gionmatsuri/' },
      { name: 'Shijo Kawaramachi', tag: 'shijokawaramachi', url: 'https://www.instagram.com/explore/tags/shijokawaramachi/' },
      { name: 'Myeongdong Night', tag: 'myeongdong', url: 'https://www.instagram.com/explore/tags/myeongdong/' },
    ],
    restaurants: [
      { name: 'Myeongdong Street Food', tag: 'myeongdongstreetfood', url: 'https://www.instagram.com/explore/tags/myeongdongstreetfood/' },
    ]
  },
  {
    dayId: 8, date: '18 juil.', city: 'Séoul', title: 'Gyeongbokgung & Bukchon',
    spots: [
      { name: 'Gyeongbokgung Palace', tag: 'gyeongbokgung', url: 'https://www.instagram.com/explore/tags/gyeongbokgung/' },
      { name: 'Bukchon Hanok Village', tag: 'bukchonhanokvillage', url: 'https://www.instagram.com/explore/tags/bukchonhanokvillage/' },
      { name: 'Insadong Street', tag: 'insadong', url: 'https://www.instagram.com/explore/tags/insadong/' },
    ],
    restaurants: [
      { name: 'Myeongdong Kyoja', tag: 'myeongdongkyoja', url: 'https://www.instagram.com/explore/tags/myeongdongkyoja/' },
      { name: 'Insadong Food', tag: 'insadongfood', url: 'https://www.instagram.com/explore/tags/insadongfood/' },
    ]
  },
  {
    dayId: 9, date: '19 juil.', city: 'Séoul', title: 'N Seoul Tower & Hongdae',
    spots: [
      { name: 'N Seoul Tower', handle: 'nseoultower', tag: 'nseoultower', url: 'https://www.instagram.com/nseoultower/' },
      { name: 'Namsan Park View', tag: 'namsanpark', url: 'https://www.instagram.com/explore/tags/namsanpark/' },
      { name: 'Hongdae Street Art', tag: 'hongdaeseoul', url: 'https://www.instagram.com/explore/tags/hongdaeseoul/' },
    ],
    restaurants: [
      { name: 'Wangbijib BBQ', tag: 'wangbijib', url: 'https://www.instagram.com/explore/tags/wangbijib/' },
      { name: 'Seongsu Cafés', tag: 'seongsuseoul', url: 'https://www.instagram.com/explore/tags/seongsuseoul/' },
    ]
  },
  {
    dayId: 10, date: '20 juil.', city: 'Busan', title: 'Haeundae & The Bay 101',
    spots: [
      { name: 'Haeundae Beach', tag: 'haeundaebeach', url: 'https://www.instagram.com/explore/tags/haeundaebeach/' },
      { name: 'The Bay 101', handle: 'thebay101', tag: 'thebay101', url: 'https://www.instagram.com/thebay101/' },
      { name: 'Dongbaekseom Island', tag: 'dongbaekseom', url: 'https://www.instagram.com/explore/tags/dongbaekseom/' },
    ],
    restaurants: [
      { name: 'Haeundae Market', tag: 'haeundaemarket', url: 'https://www.instagram.com/explore/tags/haeundaemarket/' },
      { name: 'The Bay 101 Bar', handle: 'thebay101', tag: 'thebay101food', url: 'https://www.instagram.com/thebay101/' },
    ]
  },
  {
    dayId: 11, date: '21 juil.', city: 'Busan', title: 'Gamcheon & Gwangalli',
    spots: [
      { name: 'Gamcheon Village', tag: 'gamcheon', url: 'https://www.instagram.com/explore/tags/gamcheon/' },
      { name: 'Gwangalli Bridge Night', tag: 'gwangallibridge', url: 'https://www.instagram.com/explore/tags/gwangallibridge/' },
      { name: 'Haedong Yonggungsa', tag: 'haedong', url: 'https://www.instagram.com/explore/tags/haedong/' },
    ],
    restaurants: [
      { name: 'Jagalchi Market', tag: 'jagalchi', url: 'https://www.instagram.com/explore/tags/jagalchi/' },
      { name: 'BIFF Square', tag: 'biffsquare', url: 'https://www.instagram.com/explore/tags/biffsquare/' },
    ]
  },
  {
    dayId: 12, date: '22 juil.', city: 'Tokyo', title: 'Shinjuku & Kabukicho',
    spots: [
      { name: 'Kabukicho Neon', tag: 'kabukicho', url: 'https://www.instagram.com/explore/tags/kabukicho/' },
      { name: 'Shinjuku by Night', tag: 'shinjukubynight', url: 'https://www.instagram.com/explore/tags/shinjukubynight/' },
      { name: 'Golden Gai Bars', tag: 'goldengai', url: 'https://www.instagram.com/explore/tags/goldengai/' },
    ],
    restaurants: [
      { name: 'Ichiran Ramen', handle: 'ichiran_global', tag: 'ichiranramen', url: 'https://www.instagram.com/ichiran_global/' },
      { name: 'Omoide Yokocho', tag: 'omoide', url: 'https://www.instagram.com/explore/tags/omoide/' },
    ]
  },
]

const quickLinks = [
  { key: 'days',     label: 'Jours',    icon: CalendarDays, color: 'violet' },
  { key: 'explorer', label: 'Explorer', icon: Camera,       color: 'orange' },
  { key: 'budget',   label: 'Budget',   icon: Wallet,       color: 'pink'   },
  { key: 'carnet',   label: 'Carnet',   icon: BookOpen,     color: 'amber'  },
  { key: 'tools',    label: 'Outils',   icon: Briefcase,    color: 'teal'   },
]
// Onglets secondaires accessibles via le menu hamburger uniquement
const secondaryLinks = [
  { key: 'map', label: 'Carte', icon: Map, color: 'blue' },
  { key: 'ai',  label: 'ChatGPT', icon: Sparkles, color: 'green' },
  { key: 'converter', label: 'Convertisseur', icon: Calculator, color: 'indigo' },
]

const usefulInfo = [
  { icon: Globe, title: 'Passeport', line1: 'Vérifiez la validité', line2: '6+ mois', tone: 'violet' },
  { icon: Smartphone, title: 'eSIM', line1: 'Japon & Corée', line2: 'Installée', tone: 'pink' },
  { icon: SunMedium, title: 'Météo Tokyo', line1: '25°C', line2: 'Ensoleillé', tone: 'yellow' },
  { icon: SunMedium, title: 'Météo Séoul', line1: '24°C', line2: 'Peu nuageux', tone: 'blue' },
]

const reservationItems = [
  { icon: Train, title: 'Shinkansen Tokyo → Osaka', text: '11 juillet · Tokyo Station', maps: 'Tokyo Station Tokaido Shinkansen' },
  { icon: Hotel, title: 'Candeo Hotel Osaka Namba', text: '11 au 14 juillet', maps: 'Candeo Hotel Osaka Namba' },
  { icon: Hotel, title: 'Rinn Kiyomizu Gion', text: 'Kyoto · quartier Gion', maps: 'Rinn Kiyomizu Gion Kyoto' },
  { icon: Plane, title: 'Haruka Express → KIX', text: '17 juillet · Kyoto Station', maps: 'Kyoto Station Haruka Express' },
  { icon: Hotel, title: 'Mohenic Hotel Myeongdong', text: 'Séoul · Myeongdong', maps: 'Mohenic Hotel Seoul Myeongdong' },
  { icon: Train, title: 'KTX Séoul → Busan', text: '20 juillet · Seoul Station', maps: 'Seoul Station KTX' },
  { icon: Hotel, title: 'Sunset Hotel Haeundae', text: 'Busan · Haeundae Beach', maps: 'Sunset Hotel Haeundae Busan' },
  { icon: Train, title: 'Narita Express → Shinjuku', text: '22 juillet · Narita T1', maps: 'Narita Express Terminal 1' },
  { icon: Hotel, title: 'Shinjuku Prince Hotel', text: 'Tokyo', maps: 'Shinjuku Prince Hotel Tokyo' },
  { icon: Train, title: 'Romancecar Shinjuku → Hakone', text: '28 juillet', maps: 'Odakyu Shinjuku Station Romancecar' },
]

function euro(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })
  const update = (next) => {
    const resolved = typeof next === 'function' ? next(value) : next
    setValue(resolved)
    localStorage.setItem(key, JSON.stringify(resolved))
  }
  return [value, update]
}

function openMaps(place, mode = 'search') {
  const q = encodeURIComponent(place)
  const url = mode === 'directions'
    ? `https://www.google.com/maps/dir/?api=1&destination=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function SectionTitle({ title, linkLabel, onLink }) {
  return (
    <div className="section-head">
      <h3>{title}</h3>
      {linkLabel && <button className="text-link" onClick={onLink}>{linkLabel}</button>}
    </div>
  )
}

function SplashScreen({ onStart }) {
  return (
    <div className="splash-screen">
      <img src={assets.splash} alt="Écran d’entrée Famille Lacidi" />
      <button
        className="start-hotspot"
        onClick={onStart}
        aria-label="Commencer l’aventure"
        title="Commencer l’aventure"
      >
        Commencer l’aventure
        <Plane size={22} />
      </button>
    </div>
  )
}

function QuickAction({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button className={`quick-action ${item.color} ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="quick-icon"><Icon size={28} /></span>
      <span>{item.label}</span>
    </button>
  )
}

function BudgetOverviewCard({ spent, total, onOpen }) {
  const remaining = total - spent
  const ratio = Math.max(0, Math.min(100, (spent / total) * 100))
  return (
    <div className="panel card-panel">
      <SectionTitle title="Budget global" />
      <div className="budget-stats">
        <div><small>Budget total</small><strong>{euro(total)}</strong></div>
        <div><small>Dépensé</small><strong>{euro(spent)}</strong><span>{ratio.toFixed(1)}%</span></div>
        <div><small>Restant</small><strong className="green">{euro(remaining)}</strong></div>
      </div>
      <div className="progress"><span style={{ width: `${ratio}%` }} /></div>
      <button className="line-action" onClick={onOpen}><WalletCards size={18} /> Voir le détail du budget <ChevronRight size={18} /></button>
    </div>
  )
}

function DayPreviewCard({ day, onOpen }) {
  return (
    <div className="next-day-card">
      <img src={day.image} alt={day.title} />
      <div className="next-day-content">
        <div className="date-badge">
          <strong>{String(day.id).padStart(2, '0')}</strong>
          <span>{day.date}</span>
        </div>
        <div className="next-day-text">
          <h4>{day.title}</h4>
          <p className="location"><MapPin size={15} /> {day.city}</p>
          <p className="summary">{day.summary}</p>
          <div className="meta-chips">
            <span className="chip green"><Clock3 size={15} /> {day.timeRange}</span>
            <span className="chip sand"><Footprints size={15} /> {day.steps}</span>
            <button className="chip blue" onClick={onOpen}><Camera size={15} /> Spots photo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsefulCard({ info }) {
  const Icon = info.icon
  return (
    <div className="useful-card">
      <div className={`useful-icon ${info.tone}`}><Icon size={26} /></div>
      <div>
        <strong>{info.title}</strong>
        <p>{info.line1}</p>
        <span>{info.line2}</span>
      </div>
    </div>
  )
}


const weatherCodes = {
  0: `Ciel dégagé`, 1: 'Principalement clair', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: `Brouillard`, 48: 'Brouillard givrant', 51: 'Bruine faible', 53: 'Bruine', 55: 'Bruine forte',
  61: `Pluie faible`, 63: 'Pluie', 65: 'Pluie forte', 71: 'Neige faible', 73: 'Neige', 75: 'Neige forte',
  80: 'Averses faibles', 81: 'Averses', 82: 'Averses fortes', 95: 'Orage'
}

function WeatherLiveCard() {
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('Active la géolocalisation pour afficher la météo autour de toi.')
  const [loading, setLoading] = useState(false)

  const loadWeather = () => {
    if (!navigator.geolocation) {
      setStatus('La géolocalisation n’est pas disponible sur ce téléphone.')
      return
    }
    setLoading(true)
    setStatus('Recherche de ta position...')
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`),
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { 'Accept-Language': 'fr' } })
        ])
        const data = await weatherRes.json()
        const geo  = await geoRes.json()
        const city = geo.address?.city || geo.address?.town || geo.address?.village || geo.address?.county || ''
        const country = geo.address?.country || ''
        const place = city && country ? `${city}, ${country}` : (city || country || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`)
        setWeather({ ...data.current, latitude, longitude, place })
        setStatus(`📍 ${place}`)
      } catch {
        setStatus('Impossible de charger la météo. Vérifie la connexion internet.')
      } finally {
        setLoading(false)
      }
    }, () => {
      setStatus('Autorisation géolocalisation refusée ou position indisponible.')
      setLoading(false)
    })
  }

  return (
    <div className="panel card-panel weather-card">
      <SectionTitle title="Météo autour de moi" linkLabel={weather ? 'Actualiser' : null} onLink={loadWeather} />
      {weather ? (
        <div className="weather-content">
          <div className="weather-main">
            <SunMedium size={32} />
            <div>
              <strong>{Math.round(weather.temperature_2m)}°C</strong>
              <span>{weatherCodes[weather.weather_code] || 'Météo actuelle'}</span>
            </div>
          </div>
          <div className="weather-details">
            <span>Ressenti {Math.round(weather.apparent_temperature)}°C</span>
            <span>Humidité {weather.relative_humidity_2m}%</span>
            <span>Vent {Math.round(weather.wind_speed_10m)} km/h</span>
          </div>
          <p className="soft">{weather.place || status}</p>
        </div>
      ) : (
        <div className="weather-empty">
          <p className="soft">{status}</p>
          <button className="primary-action" onClick={loadWeather} disabled={loading}>
            {loading ? 'Chargement météo...' : 'Activer la météo en temps réel'} <MapPin size={17} />
          </button>
        </div>
      )}
    </div>
  )
}

function HomePage({ nextDay, spent, total, onGo }) {
  const [showAll, setShowAll] = useState(false)
  return (
    <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-stack">
      <BudgetOverviewCard spent={spent} total={total} onOpen={() => onGo('budget')} />
      <WeatherLiveCard />

      <div className="panel card-panel">
        <SectionTitle title="Prochain jour" linkLabel={showAll ? 'Réduire' : 'Voir tout'} onLink={() => setShowAll(!showAll)} />
        <DayPreviewCard day={nextDay} onOpen={() => onGo('food')} />
      </div>

      {showAll && (
        <div className="days-list">
          {days.map((day) => (
            <div key={day.id} className="small-day-card" onClick={() => onGo('map')}>
              <img src={day.image} alt={day.title} />
              <div>
                <b>{day.date} · {day.city}</b>
                <p>{day.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <SectionTitle title="Informations utiles" />
        <div className="useful-grid">
          {usefulInfo.map((info) => <UsefulCard key={info.title} info={info} />)}
        </div>
      </div>
    </motion.div>
  )
}

function MapPage() {
  const around = ['restaurant', 'café', 'toilettes', 'station métro', 'taxi', 'spot photo']
  return (
    <motion.div key="map" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-stack">
      <div className="panel card-panel">
        <SectionTitle title="Autour de moi" />
        <p className="soft">Recherche rapide autour de ta position via Google Maps.</p>
        <div className="pill-grid">
          {around.map((item) => <button key={item} className="pill-btn" onClick={() => openMaps(item, 'search')}>{item}</button>)}
        </div>
      </div>
      <div className="panel card-panel">
        <SectionTitle title="Points clés du voyage" />
        <div className="simple-list">
          {reservationItems.slice(0, 6).map((item) => (
            <button key={item.title} className="simple-row" onClick={() => openMaps(item.maps)}>
              <span className="simple-left"><item.icon size={18} /> {item.title}</span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function FoodPage() {
  return (
    <motion.div key="food" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-stack">
      {days.map((day) => (
        <div className="panel card-panel" key={day.id}>
          <SectionTitle title={`${day.date} · ${day.city}`} />
          <h4 className="panel-title">{day.title}</h4>
          <p className="soft">{day.summary}</p>
          <div className="tag-wrap">
            {day.restaurants.map((r) => <button key={r} className="tag" onClick={() => openMaps(r)}>{r}</button>)}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function ChatGPTPage() {
  const [copied, setCopied] = useState(null)
  const openChatGPT = () => window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer')

  const copyPrompt = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const buttons = [
    {
      id: 'photo',
      icon: '📷',
      title: 'Traduire une photo',
      sub: "Ouvre ChatGPT, puis ajoute la photo d'un menu, panneau ou ticket.",
      prompt: `Traduis cette photo en français. C'est un menu ou une carte de restaurant. Résume les plats, indique les prix si visibles, et conseille-moi les meilleurs choix pour une famille.`,
      color: '#e8523a',
    },
    {
      id: 'voice',
      icon: '🎙️',
      title: 'Traduction vocale',
      sub: "Ouvre ChatGPT et utilise le mode vocal pour parler français, japonais ou coréen.",
      prompt: "Tu vas servir de traducteur vocal français ↔ japonais/coréen pendant mon voyage. Traduis simplement, naturellement, et garde les phrases courtes.",
      color: '#3a7bd5',
    },
    {
      id: 'search',
      icon: '🔍',
      title: 'Recherche avec ChatGPT',
      sub: "Ouvre ChatGPT pour chercher un restaurant, un trajet ou une idée proche de toi.",
      prompt: "Je suis en voyage au Japon et en Corée avec ma famille. Propose-moi les meilleurs restaurants, visites ou trajets proches de ma position, simples et adaptés à une famille.",
      color: '#27ae60',
    },
  ]

  return (
    <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-stack">

      {/* Header */}
      <div style={{ background:'#0b1f3a', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff', display:'flex', alignItems:'center', gap:14 }}>
        <span style={{ fontSize:'2rem' }}>🤖</span>
        <div>
          <div style={{ fontWeight:800, fontSize:'1.1rem' }}>Assistant ChatGPT</div>
          <div style={{ fontSize:'0.82rem', opacity:0.75, marginTop:2 }}>Traduis, cherche, explore — via ChatGPT</div>
        </div>
      </div>

      {/* 3 boutons */}
      {buttons.map(btn => (
        <div key={btn.id} style={{ background:'#fff', border:`2px solid ${btn.color}`, borderRadius:16, padding:'1rem 1.2rem' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
            <span style={{ fontSize:'1.8rem', lineHeight:1 }}>{btn.icon}</span>
            <div>
              <div style={{ fontWeight:700, fontSize:'1rem', color:'#0b1f3a' }}>{btn.title}</div>
              <div style={{ fontSize:'0.82rem', color:'#666', marginTop:3 }}>{btn.sub}</div>
            </div>
          </div>

          {/* Prompt copiable */}
          <div style={{ background:'#f8f8f8', borderRadius:10, padding:'0.7rem 0.9rem', marginBottom:12, fontSize:'0.8rem', color:'#444', lineHeight:1.5, fontStyle:'italic' }}>
            "{btn.prompt}"
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => copyPrompt(btn.prompt, btn.id)}
              style={{ flex:1, padding:'0.55rem', borderRadius:10, border:`1.5px solid ${btn.color}`,
                background: copied===btn.id ? btn.color : '#fff',
                color: copied===btn.id ? '#fff' : btn.color,
                fontWeight:700, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s' }}>
              {copied===btn.id ? '✓ Copié !' : '📋 Copier le prompt'}
            </button>
            <button onClick={openChatGPT}
              style={{ flex:1, padding:'0.55rem', borderRadius:10, border:'none',
                background: btn.color, color:'#fff',
                fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
              Ouvrir ChatGPT →
            </button>
          </div>
        </div>
      ))}

      {/* Astuce */}
      <div style={{ background:'#fffbea', border:'1px solid #f0d060', borderRadius:12, padding:'0.9rem 1.1rem', fontSize:'0.82rem', color:'#7a6010' }}>
        <b>💡 Astuce :</b> Copie le prompt → ouvre ChatGPT → colle-le. Pour la photo, appuie sur l'icône 📎 dans ChatGPT pour ajouter ton image.
      </div>

    </motion.div>
  )
}

function BudgetPage() {
  // ── Constantes stables (hors du render) ──
  const ZONE_CURRENCY = { Japon:{code:'JPY',sym:'¥'}, Corée:{code:'KRW',sym:'₩'}, Europe:{code:'EUR',sym:'€'} }
  const CATEGORIES    = ['Restaurant','Transport','Visite','Shopping','Hôtel','Snack','Autre']
  const ENV_LIST      = ['Restauration','Transport','Loisirs']
  const CAT_TO_ENV    = { Restaurant:'Restauration', Snack:'Restauration', Transport:'Transport', Visite:'Loisirs', Shopping:'Loisirs', Hôtel:'Loisirs', Autre:'Loisirs' }
  const ENV_COLORS    = { Restauration:'#e8523a', Transport:'#3a7bd5', Loisirs:'#27ae60' }
  const ENV_EMOJI     = { Restauration:'🍜', Transport:'🚆', Loisirs:'🎌' }

  // ── États localStorage ──
  const [rates,     setRates]     = useLocalStorage('budget_rates',     { JPY:0.0061, KRW:0.00064, EUR:1 })
  const [expenses,  setExpenses]  = useLocalStorage('budget_items',     [])
  const [envBudgets,setEnvBudgets]= useLocalStorage('budget_envelopes', { Restauration:1200, Transport:800, Loisirs:600 })

  // ── UI states ──
  const [showRates, setShowRates] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10), pays:'Japon', categorie:'Restaurant', label:'', amount:''
  })

  // ── Calculs dérivés — toujours à jour ──
  const toEUR = (amount, pays) => {
    const code = ZONE_CURRENCY[pays]?.code ?? 'EUR'
    return Math.round(parseFloat(amount) * (Number(rates[code]) || 1) * 100) / 100
  }

  // Dépensé par enveloppe (robuste : gère les anciennes dépenses sans .eur)
  const spentByEnv = (env) =>
    expenses
      .filter(x => (CAT_TO_ENV[x.categorie] || 'Loisirs') === env)
      .reduce((s, x) => s + (Number(x.eur) || Number(x.amount) || 0), 0)

  const totalBudget = ENV_LIST.reduce((s, e) => s + (Number(envBudgets[e]) || 0), 0)
  const totalSpent  = ENV_LIST.reduce((s, e) => s + spentByEnv(e), 0)
  const totalLeft   = totalBudget - totalSpent

  // ── Ajouter une dépense ──
  const addExpense = () => {
    const raw = parseFloat(form.amount)
    if (!form.label.trim() || isNaN(raw) || raw <= 0) return
    const eurVal = toEUR(raw, form.pays)
    setExpenses(prev => [{
      id: Date.now(), date: form.date, pays: form.pays,
      categorie: form.categorie, label: form.label.trim(),
      amount: raw, devise: ZONE_CURRENCY[form.pays].code, eur: eurVal,
    }, ...prev])
    setForm(f => ({ ...f, label:'', amount:'' }))
  }

  const removeExpense = (id) => setExpenses(prev => prev.filter(x => x.id !== id))

  const exportCsv = () => {
    const header = 'date,pays,catégorie,libellé,montant_local,devise,equivalent_eur,enveloppe'
    const rows = expenses.map(x =>
      [x.date, x.pays, x.categorie, `"${x.label}"`, x.amount, x.devise,
       (Number(x.eur)||0).toFixed(2), CAT_TO_ENV[x.categorie]||'Loisirs'].join(',')
    )
    const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'depenses-lacidi.csv'; a.click()
  }

  const zoneInfo = ZONE_CURRENCY[form.pays]
  const preview  = form.amount ? toEUR(form.amount, form.pays) : 0

  return (
    <motion.div key="budget" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">

      {/* ── Récap global ── */}
      <div className="panel card-panel" style={{ background:'#0b1f3a', color:'#fff', borderRadius:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:'1.05rem' }}>💰 Budget voyage</span>
          <span style={{ fontSize:'1.3rem', fontWeight:800 }}>{totalBudget.toFixed(0)} €</span>
        </div>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:10, height:10, marginBottom:8 }}>
          <div style={{ background: totalLeft<0?'#ff6b6b':'#7dffb0', height:10, borderRadius:10,
            width:`${Math.min(100, totalBudget ? (totalSpent/totalBudget)*100 : 0)}%`, transition:'width 0.4s' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem' }}>
          <span>Dépensé : <b>{totalSpent.toFixed(2)} €</b></span>
          <span style={{ color: totalLeft<0?'#ff6b6b':'#7dffb0', fontWeight:700 }}>
            {totalLeft<0?'⚠ Dépassé':'Restant'} : {Math.abs(totalLeft).toFixed(2)} €
          </span>
        </div>
      </div>

      {/* ── Enveloppes ── */}
      <div className="panel card-panel">
        <SectionTitle title="Enveloppes par catégorie" />
        <p className="soft" style={{ marginBottom:'0.8rem' }}>Modifie les montants. Les dépenses s'imputent automatiquement sur chaque enveloppe.</p>
        {ENV_LIST.map(env => {
          const budgetEnv = Number(envBudgets[env]) || 0
          const spentEnv  = spentByEnv(env)
          const leftEnv   = budgetEnv - spentEnv
          const pct       = budgetEnv > 0 ? Math.min(100, (spentEnv/budgetEnv)*100) : 0
          return (
            <div key={env} style={{ border:`2px solid ${ENV_COLORS[env]}`, borderRadius:12, padding:'0.8rem 1rem', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontWeight:700, color:ENV_COLORS[env] }}>{ENV_EMOJI[env]} {env}</span>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <input type="number" value={budgetEnv}
                    onChange={e => setEnvBudgets(prev => ({ ...prev, [env]: Math.max(0, Number(e.target.value)||0) }))}
                    style={{ width:75, textAlign:'right', border:'none', borderBottom:`2px solid ${ENV_COLORS[env]}`,
                      background:'transparent', fontWeight:700, fontSize:'1rem', color:ENV_COLORS[env] }} />
                  <span style={{ color:ENV_COLORS[env], fontWeight:700 }}>€</span>
                </div>
              </div>
              <div style={{ background:'#e8e8e8', borderRadius:8, height:8, marginBottom:6 }}>
                <div style={{ background:ENV_COLORS[env], height:8, borderRadius:8, width:`${pct}%`, transition:'width 0.4s' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'#666' }}>
                <span>Dépensé : <b style={{ color:ENV_COLORS[env] }}>{spentEnv.toFixed(2)} €</b></span>
                <span style={{ color: leftEnv<0?'#e53935':'#27ae60', fontWeight:700 }}>
                  {leftEnv<0?'⚠ +':''}{Math.abs(leftEnv).toFixed(2)} € {leftEnv<0?'dépassé':'restant'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Taux & réglages ── */}
      <div className="panel card-panel">
        <SectionTitle title="Réglages" linkLabel={showRates?'Masquer':'⚙ Taux de change'} onLink={() => setShowRates(v => !v)} />
        {showRates && (
          <div className="input-grid two" style={{ marginTop:'0.5rem' }}>
            {Object.entries({ JPY:'Yen ¥', KRW:'Won ₩', EUR:'Euro €' }).map(([code,label]) => (
              <label key={code}><span>1 {label} = … €</span>
                <input className="text-input" type="number" step="0.0001" value={rates[code] ?? ''}
                  onChange={e => setRates(prev => ({ ...prev, [code]: parseFloat(e.target.value)||0 }))} />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── Formulaire ── */}
      <div className="panel card-panel">
        <SectionTitle title="Ajouter une dépense" />
        <div className="input-grid two">
          <label><span>Date</span>
            <input className="text-input" type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
          </label>
          <label><span>Zone</span>
            <select className="text-input" value={form.pays} onChange={e => setForm(f=>({...f,pays:e.target.value}))}>
              {Object.keys(ZONE_CURRENCY).map(z => <option key={z}>{z}</option>)}
            </select>
          </label>
          <label><span>Catégorie</span>
            <select className="text-input" value={form.categorie} onChange={e => setForm(f=>({...f,categorie:e.target.value}))}>
              {CATEGORIES.map(c => <option key={c}>{c} → {CAT_TO_ENV[c]||'Loisirs'}</option>)}
            </select>
          </label>
          <label><span>Libellé</span>
            <input className="text-input" placeholder="ex : Ramen Kyoto" value={form.label}
              onChange={e => setForm(f=>({...f,label:e.target.value}))} />
          </label>
          <label style={{ gridColumn:'1 / -1' }}>
            <span>Montant ({zoneInfo?.sym} {zoneInfo?.code}) — ≈ <strong style={{ color:'#0b1f3a' }}>{preview.toFixed(2)} €</strong>
              &nbsp;<small style={{ color:'#888' }}>→ enveloppe <b>{CAT_TO_ENV[form.categorie]||'Loisirs'}</b></small>
            </span>
            <input className="text-input" type="number" placeholder="0" value={form.amount}
              onChange={e => setForm(f=>({...f,amount:e.target.value}))} />
          </label>
        </div>
        <button className="primary-action" onClick={addExpense}><PlusCircle size={17} /> Enregistrer la dépense</button>
      </div>

      {/* ── Historique ── */}
      <div className="panel card-panel">
        <SectionTitle title={`Historique (${expenses.length})`} linkLabel={expenses.length?'CSV':undefined} onLink={exportCsv} />
        <div className="simple-list">
          {expenses.length===0 && <p className="soft">Aucune dépense enregistrée.</p>}
          {expenses.map(item => {
            const env = CAT_TO_ENV[item.categorie]||'Loisirs'
            return (
              <div className="simple-row no-hover" key={item.id}>
                <span>
                  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:ENV_COLORS[env], marginRight:6 }} />
                  <strong>{item.label}</strong>
                  <small style={{ marginLeft:6, color:'#888' }}>{item.date} · {item.categorie}</small><br/>
                  <small>{(item.amount||0).toLocaleString('fr-FR')} {item.devise} → <b>{euro(Number(item.eur)||0)}</b>
                    <span style={{ marginLeft:6, fontSize:'0.7rem', color:ENV_COLORS[env] }}>({env})</span>
                  </small>
                </span>
                <button className="icon-btn" onClick={() => removeExpense(item.id)}><Trash2 size={16} /></button>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════
//  DONNÉES EXPLORER
// ════════════════════════════════════════════════════
const RESTAURANTS_DB = [
  // ── Ramen ──
  { id:'r1', city:'Tokyo', zone:'Shinjuku', name:'Fuunji', type:'Ramen', dish:'Tsukemen signature', price:'¥950', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d1838622-Reviews-Fuunji-Shinjuku.html', instagram:'https://www.instagram.com/explore/tags/fuunji/', tag:'fuunji', budget:'💰', note:`File d'attente 30min mais exceptionnel` },
  { id:'r2', city:'Tokyo', zone:'Ikebukuro', name:'Ichiran Ramen', type:'Ramen', dish:'Tonkotsu solo booth', price:'¥980', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d7079898-Reviews-Ichiran_Ramen_Shinjuku.html', instagram:'https://www.instagram.com/ichiran_global/', tag:'ichiranramen', budget:'💰', note:'Expérience unique en cabine solo' },
  { id:'r3', city:'Osaka', zone:'Namba', name:'Kinryu Ramen', type:'Ramen', dish:'Ramen Dotonbori 24h/24', price:'¥700', rating:4.5, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234561-Reviews-Kinryu_Ramen-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kinryuramen/', tag:'kinryuramen', budget:'💰', note:'Le dragon devant la boutique est iconique' },
  { id:'r4', city:'Kyoto', zone:'Fushimi', name:'Ramen Sen no Kaze', type:'Ramen', dish:'Shoyu léger kyotoite', price:'¥850', rating:4.6, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d2345672-Reviews-Sen_no_Kaze-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/ramenyakyoto/', tag:'ramenyakyoto', budget:'💰', note:'Bouillon clair typique Kyoto' },
  // ── Sushi ──
  { id:'s1', city:'Tokyo', zone:'Tsukiji', name:'Sushi Dai', type:'Sushi', dish:'Omakase 10 pièces', price:'¥4000', rating:4.9, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234567-Reviews-Sushi_Dai-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/sushidai/', tag:'sushidai', budget:'💰💰', note:'File 2h — vaut chaque minute' },
  { id:'s2', city:'Tokyo', zone:'Ginza', name:'Sushi Yoshitake', type:'Sushi', dish:'Omakase Michelin ★★★', price:'¥30000', rating:5.0, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d2345678-Reviews-Sushi_Yoshitake-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/sushiyoshitake/', tag:'sushiyoshitake', budget:'💰💰💰', note:'Meilleur sushi de Tokyo selon Michelin' },
  { id:'s3', city:'Osaka', zone:'Namba', name:'Kaiten Midori Sushi', type:'Sushi', dish:'Kaiten (tapis roulant)', price:'¥150/pièce', rating:4.4, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d3456789-Reviews-Midori_Sushi-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kaitensushi/', tag:'kaitensushi', budget:'💰', note:'Idéal en famille, choix immense' },
  { id:'s4', city:'Tokyo', zone:'Shibuya', name:'Uobei Sushi', type:'Sushi', dish:'Sushi commande tablette', price:'¥110/pièce', rating:4.3, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d4567890-Reviews-Uobei_Sushi-Shibuya.html', instagram:'https://www.instagram.com/explore/tags/uobei/', tag:'uobei', budget:'💰', note:'Livré par rail, kids adorent' },
  // ── Pancakes fluffy ──
  { id:'p1', city:'Osaka', zone:'Shinsaibashi', name:'Gram Café', type:'Pancakes fluffy', dish:'Premium pancakes (3/jour)', price:'¥750', rating:4.9, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d5678901-Reviews-Gram-Osaka.html', instagram:'https://www.instagram.com/explore/tags/grampancake/', tag:'grampancake', budget:'💰', note:'Servis 3x/jour seulement — arriver tôt!' },
  { id:'p2', city:'Tokyo', zone:'Harajuku', name:"Flipper's", type:'Pancakes fluffy', dish:'Soufflé miracle pancake', price:'¥1200', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d6789012-Reviews-Flippers-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/flipperspancake/', tag:'flipperspancake', budget:'💰', note:'Le plus viral de Tokyo' },
  { id:'p3', city:'Tokyo', zone:'Shibuya', name:'A Happy Pancake', type:'Pancakes fluffy', dish:'Thick souffle pancake', price:'¥1100', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d7890123-Reviews-A_Happy_Pancake-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/ahappypancake/', tag:'ahappypancake', budget:'💰', note:'Texture nuage incroyable' },
  // ── Takoyaki ──
  { id:'t1', city:'Osaka', zone:'Dotonbori', name:'Kukuru Takoyaki', type:'Takoyaki', dish:'Takoyaki XL croustillant', price:'¥600', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d8901234-Reviews-Kukuru-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kukurutakoyaki/', tag:'kukurutakoyaki', budget:'💰', note:`L'incontournable de Dotonbori` },
  { id:'t2', city:'Osaka', zone:'Shinsekai', name:"Creo-ru", type:'Takoyaki', dish:'Takoyaki au fromage', price:'¥550', rating:4.6, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d9012345-Reviews-Creo_ru-Osaka.html', instagram:'https://www.instagram.com/explore/tags/creoru/', tag:'creoru', budget:'💰', note:'Version fromage unique à Osaka' },
  // ── BBQ coréen ──
  { id:'b1', city:'Séoul', zone:'Mapo', name:'Maple Tree House', type:'BBQ coréen', dish:'Galbi & samgyeopsal premium', price:'₩35000/pers', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d1234568-Reviews-Maple_Tree_House-Seoul.html', instagram:'https://www.instagram.com/explore/tags/mapletreehouse/', tag:'mapletreehouse', budget:'💰💰', note:`Bœuf wagyu coréen d'exception` },
  { id:'b2', city:'Séoul', zone:'Hongdae', name:'Wangbijib', type:'BBQ coréen', dish:'Galbi marinés maison', price:'₩25000/pers', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d2345679-Reviews-Wangbijib-Seoul.html', instagram:'https://www.instagram.com/explore/tags/wangbijib/', tag:'wangbijib', budget:'💰💰', note:'Institution de Hongdae depuis 20 ans' },
  { id:'b3', city:'Busan', zone:'Haeundae', name:'Galmegi Brewing', type:'BBQ coréen', dish:'BBQ + craft beer vue mer', price:'₩20000/pers', rating:4.5, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d3456780-Reviews-Galmegi-Busan.html', instagram:'https://www.instagram.com/galmegibrewing/', tag:'galmegibrewing', budget:'💰', note:'Vue sur Haeundae en bonus' },
  // ── Street food ──
  { id:'sf1', city:'Kyoto', zone:'Nishiki', name:'Nishiki Market', type:'Street food', dish:'Tofu, mochi, sardines grillées', price:'¥200-500', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234570-Reviews-Nishiki_Market-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/nishikimarket/', tag:'nishikimarket', budget:'💰', note:`Marché couvert 400 ans d'histoire` },
  { id:'sf2', city:'Séoul', zone:'Myeongdong', name:'Myeongdong Street', type:'Street food', dish:'Tteokbokki, odeng, hotteok', price:'₩2000-5000', rating:4.6, tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g294197-d2345680-Reviews-Myeongdong-Seoul.html', instagram:'https://www.instagram.com/explore/tags/myeongdongstreetfood/', tag:'myeongdongstreetfood', budget:'💰', note:'Street food coréen authentique le soir' },
  { id:'sf3', city:'Séoul', zone:'Gwangjang', name:'Gwangjang Market', type:'Street food', dish:'Bindaetteok, mayak gimbap', price:'₩3000-8000', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456781-Reviews-Gwangjang_Market-Seoul.html', instagram:'https://www.instagram.com/explore/tags/gwangjangmarket/', tag:'gwangjangmarket', budget:'💰', note:'Le plus vieux marché de Séoul (1905)' },
  // ── Desserts ──
  { id:'d1', city:'Nara', zone:'Centre', name:'Nakatanidou', type:'Desserts', dish:'Mochi frappé à la main', price:'¥400', rating:4.9, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298198-d1234571-Reviews-Nakatanidou-Nara.html', instagram:'https://www.instagram.com/explore/tags/nakatanidou/', tag:'nakatanidou', budget:'💰', note:'Le spectacle du mochi vaut le détour' },
  { id:'d2', city:'Tokyo', zone:'Asakusa', name:'Kagetsudo', type:'Desserts', dish:'Melon pan géant', price:'¥250', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d2345681-Reviews-Kagetsudo-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/kagetsudo/', tag:'kagetsudo', budget:'💰', note:'Pain melon croustillant iconique Asakusa' },
  { id:'d3', city:'Osaka', zone:'Namba', name:'Rikuro Ojisan', type:'Desserts', dish:'Fromage cake soufflé', price:'¥965', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d3456782-Reviews-Rikuro_Ojisan-Osaka.html', instagram:'https://www.instagram.com/explore/tags/rikuroojisan/', tag:'rikuroojisan', budget:'💰', note:'Sorti du four toutes les 15min' },
  { id:'d4', city:'Kyoto', zone:'Arashiyama', name:'% Arabica Kyoto', type:'Café & desserts', dish:'Café latte vue bambous', price:'¥700', rating:4.9, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d4567892-Reviews-Arabica-Kyoto.html', instagram:'https://www.instagram.com/arabicakyoto/', tag:'arabicakyoto', budget:'💰', note:'Le café le plus photographié du Japon' },
  // ── Restaurants coréens ──
  { id:'k1', city:'Séoul', zone:'Myeongdong', name:'Myeongdong Kyoja', type:'Cuisine coréenne', dish:'Kalguksu & mandu', price:'₩9000', rating:4.8, tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d1234572-Reviews-Myeongdong_Kyoja-Seoul.html', instagram:'https://www.instagram.com/explore/tags/myeongdongkyoja/', tag:'myeongdongkyoja', budget:'💰', note:'Institution depuis 1966 — file normale' },
  { id:'k2', city:'Busan', zone:'Nampo', name:'Jagalchi Market', type:'Fruits de mer', dish:'Hoe (poisson cru coréen)', price:'₩15000', rating:4.7, tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g297884-d2345682-Reviews-Jagalchi_Market-Busan.html', instagram:'https://www.instagram.com/explore/tags/jagalchi/', tag:'jagalchi', budget:'💰💰', note:'Plus grand marché de fruits de mer Corée' },
]

const TYPES_FOOD = [...new Set(RESTAURANTS_DB.map(r => r.type))]
const CITIES_FOOD = [...new Set(RESTAURANTS_DB.map(r => r.city))]

const SPOTS_DB = [
  // ── Osaka ──
  { city:'Osaka', name:'Dotonbori Bridge', desc:'Néons, Glico Man, rivière — meilleur la nuit', heure:'21h-23h', tag:'dotonbori', ig:'https://www.instagram.com/explore/tags/dotonbori/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234560-Reviews-Dotonbori-Osaka.html' },
  { city:'Osaka', name:'Glico Running Man', desc:`L'icône la plus photographiée du Japon`, heure:'20h-23h', tag:'glicoman', ig:'https://www.instagram.com/explore/tags/glicoman/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234561-Reviews-Glico_Sign-Osaka.html' },
  { city:'Osaka', name:'Tsutenkaku Tower', desc:'Rétro, panorama 360° sur Shinsekai', heure:'10h-16h', tag:'tsutenkaku', ig:'https://www.instagram.com/tsutenkaku_official/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234562-Reviews-Tsutenkaku-Osaka.html' },
  { city:'Osaka', name:'Osaka Castle au lever', desc:'Lumière dorée sur le château', heure:'6h-9h', tag:'osakacastle', ig:'https://www.instagram.com/explore/tags/osakacastle/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234563-Reviews-Osaka_Castle-Osaka.html' },
  // ── Kyoto ──
  { city:'Kyoto', name:'Fushimi Inari Torii', desc:'Tunnel de 10 000 torii rouges', heure:'5h-8h', tag:'fushimiinari', ig:'https://www.instagram.com/explore/tags/fushimiinari/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234564-Reviews-Fushimi_Inari-Kyoto.html' },
  { city:'Kyoto', name:'Arashiyama Bambouseraie', desc:'Forêt de bambous géants, lumière filtrée', heure:'7h-9h', tag:'arashiyamabamboo', ig:'https://www.instagram.com/explore/tags/arashiyamabamboo/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234565-Reviews-Arashiyama_Bamboo-Kyoto.html' },
  { city:'Kyoto', name:`Kinkaku-ji (Pavillon d'Or)`, desc:`Reflet parfait sur l'étang`, heure:'9h-11h', tag:'kinkakuji', ig:'https://www.instagram.com/explore/tags/kinkakuji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234566-Reviews-Kinkakuji-Kyoto.html' },
  { city:'Kyoto', name:'Gion Shirakawa', desc:'Quartier geisha, lanternes et canal', heure:'18h-21h', tag:'gionshirakawa', ig:'https://www.instagram.com/explore/tags/gionshirakawa/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d2345670-Reviews-Gion-Kyoto.html' },
  { city:'Kyoto', name:'Sannenzaka Ninenzaka', desc:'Ruelle pavée typique Meiji', heure:'8h-10h', tag:'sannenzaka', ig:'https://www.instagram.com/explore/tags/sannenzaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d3456780-Reviews-Sannenzaka-Kyoto.html' },
  // ── Nara ──
  { city:'Nara', name:'Daims de Nara Park', desc:'Cerfs en liberté dans le parc national', heure:'7h-10h', tag:'naradeer', ig:'https://www.instagram.com/explore/tags/naradeer/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234567-Reviews-Nara_Park-Nara.html' },
  { city:'Nara', name:'Tōdai-ji', desc:'Plus grand bâtiment en bois du monde', heure:'8h-12h', tag:'todaiji', ig:'https://www.instagram.com/explore/tags/todaiji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234568-Reviews-Todaiji-Nara.html' },
  // ── Séoul ──
  { city:'Séoul', name:'Gyeongbokgung Palace', desc:'Palais royal, garde royale à 10h et 14h', heure:'9h-11h', tag:'gyeongbokgung', ig:'https://www.instagram.com/explore/tags/gyeongbokgung/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234569-Reviews-Gyeongbokgung-Seoul.html' },
  { city:'Séoul', name:'Bukchon Hanok Village', desc:'Maisons coréennes traditionnelles', heure:'8h-10h', tag:'bukchonhanokvillage', ig:'https://www.instagram.com/explore/tags/bukchonhanokvillage/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d2345671-Reviews-Bukchon-Seoul.html' },
  { city:'Séoul', name:'N Seoul Tower', desc:'Vue 360° sur la ville illuminée', heure:'19h-22h', tag:'nseoultower', ig:'https://www.instagram.com/nseoultower/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d320895-Reviews-N_Seoul_Tower-Seoul.html' },
  { city:'Séoul', name:'Hongdae Street Art', desc:'Street art, musiques live, jeunesse', heure:'18h-23h', tag:'hongdaeseoul', ig:'https://www.instagram.com/explore/tags/hongdaeseoul/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456783-Reviews-Hongdae-Seoul.html' },
  // ── Busan ──
  { city:'Busan', name:'Gamcheon Village', desc:'Village arc-en-ciel sur la colline', heure:'10h-14h', tag:'gamcheon', ig:'https://www.instagram.com/explore/tags/gamcheon/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234573-Reviews-Gamcheon-Busan.html' },
  { city:'Busan', name:'Gwangalli Bridge by Night', desc:'Double pont illuminé face à la mer', heure:'20h-23h', tag:'gwangallibridge', ig:'https://www.instagram.com/explore/tags/gwangallibridge/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d2345683-Reviews-Gwangalli_Beach-Busan.html' },
  { city:'Busan', name:'Haedong Yonggungsa Temple', desc:'Temple bouddhiste au bord de la mer', heure:'7h-9h', tag:'haedong', ig:'https://www.instagram.com/explore/tags/haedong/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234574-Reviews-Haedong-Busan.html' },
  // ── Tokyo ──
  { city:'Tokyo', name:'Shibuya Crossing', desc:'Le carrefour le plus fréquenté du monde', heure:'18h-20h', tag:'shibuyacrossing', ig:'https://www.instagram.com/explore/tags/shibuyacrossing/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234575-Reviews-Shibuya_Crossing-Tokyo.html' },
  { city:'Tokyo', name:'Senso-ji Asakusa', desc:'Pagode et lanterne géante rouge', heure:'6h-8h', tag:'sensoji', ig:'https://www.instagram.com/explore/tags/sensoji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d320888-Reviews-Senso_ji-Tokyo.html' },
  { city:'Tokyo', name:'Shinjuku Kabukicho', desc:'Néons, Golden Gai, énergie unique', heure:'21h-23h', tag:'kabukicho', ig:'https://www.instagram.com/explore/tags/kabukicho/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234576-Reviews-Kabukicho-Tokyo.html' },
  { city:'Tokyo', name:'Takeshita Street Harajuku', desc:'Mode, couleurs, culture pop jeune', heure:'11h-16h', tag:'takeshitastreet', ig:'https://www.instagram.com/explore/tags/takeshitastreet/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234577-Reviews-Takeshita_Street-Tokyo.html' },
]
const CITIES_SPOTS = [...new Set(SPOTS_DB.map(s => s.city))]

const INSOLITE_DB = [
  { emoji:'🦔', city:'Tokyo', name:'Hedgehog Café Harry', desc:'Caresser des hérissons miniatures', price:'¥1500/30min', ig:'https://www.instagram.com/explore/tags/hedgehogcafe/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234578-Reviews-Harry_Hedgehog-Tokyo.html' },
  { emoji:'🦉', city:'Tokyo', name:'Owl Café Akiba Fukurou', desc:'Hiboux en liberté dans le café', price:'¥1800/1h', ig:'https://www.instagram.com/explore/tags/owlcafe/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234579-Reviews-Owl_Cafe-Tokyo.html' },
  { emoji:'🐱', city:'Osaka', name:'Cat Café Calico Osaka', desc:'50+ chats, ambiance cosy', price:'¥200/10min', ig:'https://www.instagram.com/explore/tags/catcafeosaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234580-Reviews-Calico_Cat_Cafe-Osaka.html' },
  { emoji:'♨️', city:'Tokyo', name:'Oedo Onsen Monogatari', desc:'Parc onsen thématique Edo, accès famille', price:'¥2980', ig:'https://www.instagram.com/explore/tags/oedoonsen/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234581-Reviews-Oedo_Onsen-Tokyo.html' },
  { emoji:'🎎', city:'Kyoto', name:'Kimono Rental Yumeyakata', desc:'Louer un kimono et se promener à Gion', price:'¥3000-6000', ig:'https://www.instagram.com/explore/tags/kimonoryokan/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234582-Reviews-Yumeyakata-Kyoto.html' },
  { emoji:'🍵', city:'Kyoto', name:'Cérémonie du thé En', desc:'Cérémonie authentique à Higashiyama', price:'¥3800', ig:'https://www.instagram.com/explore/tags/teaceremonykyoto/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d2345685-Reviews-Tea_Ceremony-Kyoto.html' },
  { emoji:'🎮', city:'Tokyo', name:'Akihabara Retro Games', desc:'Arcades 3 étages, Taiko no Tatsujin', price:'¥500-2000', ig:'https://www.instagram.com/explore/tags/akihabara/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234583-Reviews-Akihabara-Tokyo.html' },
  { emoji:'🌸', city:'Tokyo', name:'Shinjuku Gyoen Garden', desc:'Jardin national, cerisiers & azalées', price:'¥500', ig:'https://www.instagram.com/explore/tags/shinjukugyoen/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234584-Reviews-Shinjuku_Gyoen-Tokyo.html' },
  { emoji:'🐺', city:'Nara', name:'Nara Deer selfies', desc:`Les cerfs s'inclinent si tu t'inclines`, price:'Gratuit', ig:'https://www.instagram.com/explore/tags/naradeer/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234585-Reviews-Nara_Park-Nara.html' },
  { emoji:'🎡', city:'Séoul', name:'Lotte World Theme Park', desc:`Parc d'attraction indoor + outdoor géant`, price:'₩54000', ig:'https://www.instagram.com/explore/tags/lotteworld/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234586-Reviews-Lotte_World-Seoul.html' },
  { emoji:'🌃', city:'Séoul', name:'Café avec vue N Tower', desc:'Cafés en hauteur sur Namsan', price:'₩8000 conso', ig:'https://www.instagram.com/explore/tags/namsancafe/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d2345686-Reviews-Namsan-Seoul.html' },
  { emoji:'🎭', city:'Séoul', name:'Nanta Show', desc:'Comédie musicale culinaire sans paroles', price:'₩40000', ig:'https://www.instagram.com/explore/tags/nantashow/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234587-Reviews-Nanta_Show-Seoul.html' },
]

// ════════════════════════════════════════════════════
//  EXPLORER PAGE
// ════════════════════════════════════════════════════
function ExplorerPage() {
  const [subTab, setSubTab] = useState('jour')
  const [activeDay, setActiveDay] = useState(instagramBuzz[0]?.dayId || 1)
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [cityFilter, setCityFilter] = useState('Toutes')
  const [citySpot, setCitySpot] = useState('Osaka')
  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer')
  const [copied, setCopied] = useState(null)
  const copyTag = (tag, id) => {
    navigator.clipboard.writeText('#' + tag)
    setCopied(id); setTimeout(() => setCopied(null), 1500)
  }

  const SUB_TABS = [
    { key:'jour',  label:'📅 Par jour' },
    { key:'food',  label:'🍜 Adresses' },
    { key:'spots', label:'📸 Spots' },
    { key:'inso',  label:'💡 Insolite' },
  ]

  const restosFiltered = RESTAURANTS_DB.filter(r =>
    (typeFilter === 'Tous' || r.type === typeFilter) &&
    (cityFilter === 'Toutes' || r.city === cityFilter)
  )

  const item = instagramBuzz.find(d => d.dayId === activeDay) || instagramBuzz[0]

  return (
    <motion.div key="explorer" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#e1306c,#833ab4)', borderRadius:16, padding:'1rem 1.4rem', color:'#fff', marginBottom:0 }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>🌏 Explorer</div>
        <div style={{ fontSize:'0.8rem', opacity:0.85, marginTop:2 }}>Restaurants · Spots photo · Insolite</div>
      </div>

      {/* Sous-onglets */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', padding:'4px 0' }}>
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            style={{ flexShrink:0, padding:'7px 14px', borderRadius:20, fontSize:'0.8rem', fontWeight:700, cursor:'pointer', border:'none', whiteSpace:'nowrap',
              background: subTab===t.key ? '#e1306c' : '#f0f0f0',
              color: subTab===t.key ? '#fff' : '#555' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── PAR JOUR ─── */}
      {subTab === 'jour' && (
        <div>
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 8px' }}>
            {instagramBuzz.map(d => (
              <button key={d.dayId} onClick={() => setActiveDay(d.dayId)}
                style={{ flexShrink:0, padding:'4px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'none',
                  background: activeDay===d.dayId ? '#833ab4' : '#f0f0f0',
                  color: activeDay===d.dayId ? '#fff' : '#555' }}>
                {d.date}
              </button>
            ))}
          </div>
          {item && (
            <div style={{ background:'#fff', border:'1px solid #f0d0da', borderRadius:14, padding:'1rem' }}>
              <div style={{ fontWeight:800, fontSize:'1rem', color:'#0b1f3a', marginBottom:8 }}>📍 {item.city} — {item.title}</div>
              <div style={{ fontWeight:700, fontSize:'0.75rem', color:'#e1306c', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>📸 Spots photo</div>
              {item.spots.map(s => (
                <div key={s.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #fce8f0' }}>
                  <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{s.name}</span>
                  <button onClick={() => open(s.url)} style={igBtnStyle}>#{s.tag}</button>
                </div>
              ))}
              <div style={{ fontWeight:700, fontSize:'0.75rem', color:'#e1306c', textTransform:'uppercase', letterSpacing:1, margin:'10px 0 6px' }}>🍜 Restaurants</div>
              {item.restaurants.map(r => {
                const db = RESTAURANTS_DB.find(x => x.name.toLowerCase().includes(r.name.split(' ')[0].toLowerCase()))
                return (
                  <div key={r.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #fce8f0' }}>
                    <div>
                      <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{r.name}</div>
                      {db && <div style={{ fontSize:'0.72rem', color:'#888' }}>{db.price} · {db.budget}</div>}
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      <button onClick={() => open(r.url)} style={igBtnStyle}>#{r.tag}</button>
                      {db && <button onClick={() => open(db.tripadvisor)} style={triBtnStyle}>TA</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ADRESSES PAR TYPE ─── */}
      {subTab === 'food' && (
        <div>
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 6px' }}>
            {['Tous', ...TYPES_FOOD].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ flexShrink:0, padding:'4px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'none',
                  background: typeFilter===t ? '#e8523a' : '#f0f0f0',
                  color: typeFilter===t ? '#fff' : '#555' }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 8px' }}>
            {['Toutes', ...CITIES_FOOD].map(c => (
              <button key={c} onClick={() => setCityFilter(c)}
                style={{ flexShrink:0, padding:'3px 9px', borderRadius:20, fontSize:'0.7rem', cursor:'pointer', border:'1px solid #ddd',
                  background: cityFilter===c ? '#0b1f3a' : '#fff',
                  color: cityFilter===c ? '#fff' : '#555' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ fontSize:'0.75rem', color:'#888', marginBottom:8 }}>{restosFiltered.length} restaurant{restosFiltered.length>1?'s':''} trouvé{restosFiltered.length>1?'s':''}</div>
          {restosFiltered.map(r => (
            <div key={r.id} style={{ background:'#fff', border:'1px solid #eee', borderRadius:14, padding:'0.9rem 1rem', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#0b1f3a' }}>{r.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'#e8523a', fontWeight:600 }}>{r.type} · {r.city} · {r.zone}</div>
                  <div style={{ fontSize:'0.8rem', color:'#555', margin:'3px 0' }}>{r.dish}</div>
                  <div style={{ fontSize:'0.75rem', color:'#888', fontStyle:'italic' }}>"{r.note}"</div>
                </div>
                <div style={{ textAlign:'right', marginLeft:10 }}>
                  <div style={{ fontWeight:700, color:'#27ae60', fontSize:'0.9rem' }}>{r.price}</div>
                  <div style={{ fontSize:'0.85rem' }}>{r.budget}</div>
                  <div style={{ fontSize:'0.75rem', color:'#f5a623' }}>★ {r.rating}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, marginTop:8 }}>
                <button onClick={() => open(r.instagram)} style={{ ...igBtnStyle, flex:1 }}>📷 Instagram</button>
                <button onClick={() => open(r.tripadvisor)} style={{ ...triBtnStyle, flex:1 }}>🟢 TripAdvisor</button>
                <button onClick={() => openMaps(r.name + ' ' + r.city)} style={{ ...mapBtnStyle, flex:1 }}>📍 Maps</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── SPOTS PHOTO ─── */}
      {subTab === 'spots' && (
        <div>
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 8px' }}>
            {CITIES_SPOTS.map(c => (
              <button key={c} onClick={() => setCitySpot(c)}
                style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none',
                  background: citySpot===c ? '#833ab4' : '#f0f0f0',
                  color: citySpot===c ? '#fff' : '#555' }}>
                {c}
              </button>
            ))}
          </div>
          {SPOTS_DB.filter(s => s.city === citySpot).map(spot => (
            <div key={spot.name} style={{ background:'#fff', border:'1px solid #eee', borderRadius:14, padding:'0.85rem 1rem', marginBottom:8 }}>
              <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#0b1f3a' }}>{spot.name}</div>
              <div style={{ fontSize:'0.78rem', color:'#666', margin:'3px 0' }}>{spot.desc}</div>
              <div style={{ fontSize:'0.72rem', color:'#833ab4', fontWeight:600, marginBottom:8 }}>⏰ Meilleure heure : {spot.heure}</div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => open(spot.ig)} style={{ ...igBtnStyle, flex:1 }}>📷 #{spot.tag}</button>
                <button onClick={() => open(spot.tri)} style={{ ...triBtnStyle, flex:1 }}>🟢 TripAdvisor</button>
                <button onClick={() => { navigator.clipboard.writeText('#'+spot.tag); setCopied(spot.name); setTimeout(()=>setCopied(null),1500) }}
                  style={{ padding:'5px 10px', borderRadius:10, fontSize:'0.72rem', border:'1px solid #ccc', background: copied===spot.name?'#27ae60':'#fff', color: copied===spot.name?'#fff':'#666', cursor:'pointer', flex:1 }}>
                  {copied===spot.name?'✓ Copié':'📋 Tag'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── INSOLITE ─── */}
      {subTab === 'inso' && (
        <div>
          <p style={{ fontSize:'0.82rem', color:'#888', marginBottom:10 }}>Expériences uniques que les guides ne montrent pas 🎌</p>
          {INSOLITE_DB.map(item => (
            <div key={item.name} style={{ background:'#fff', border:'1px solid #eee', borderRadius:14, padding:'0.85rem 1rem', marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#0b1f3a' }}>{item.emoji} {item.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'#833ab4', fontWeight:600 }}>{item.city}</div>
                  <div style={{ fontSize:'0.8rem', color:'#555', marginTop:3 }}>{item.desc}</div>
                </div>
                <div style={{ fontWeight:700, color:'#27ae60', fontSize:'0.85rem', marginLeft:10, whiteSpace:'nowrap' }}>{item.price}</div>
              </div>
              <div style={{ display:'flex', gap:6, marginTop:8 }}>
                <button onClick={() => open(item.ig)} style={{ ...igBtnStyle, flex:1 }}>📷 Instagram</button>
                <button onClick={() => open(item.tri)} style={{ ...triBtnStyle, flex:1 }}>🟢 TripAdvisor</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

const igBtnStyle  = { padding:'5px 10px', borderRadius:10, fontSize:'0.72rem', fontWeight:700, background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color:'#fff', border:'none', cursor:'pointer' }
const triBtnStyle = { padding:'5px 10px', borderRadius:10, fontSize:'0.72rem', fontWeight:700, background:'#00af87', color:'#fff', border:'none', cursor:'pointer' }
const mapBtnStyle = { padding:'5px 10px', borderRadius:10, fontSize:'0.72rem', fontWeight:700, background:'#0b1f3a', color:'#fff', border:'none', cursor:'pointer' }

// ════════════════════════════════════════════════════
//  CARNET DE VOYAGE (remplace FullWordGuide)
// ════════════════════════════════════════════════════
function CarnetPage() {
  const [selected, setSelected] = useState(wordSections[0]?.id || 1)
  const [search, setSearch] = useState('')
  const section = wordSections.find(s => s.id === selected) || wordSections[0]
  const idx = wordSections.findIndex(s => s.id === selected)

  const filtered = search.trim()
    ? wordSections.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.paragraphs?.some(p => p.toLowerCase().includes(search.toLowerCase()))
      )
    : wordSections

  return (
    <motion.div key="carnet" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f9f7f2' }}>

      {/* ── Header ── */}
      <div style={{ background:'#0b1f3a', padding:'1rem 1.2rem', color:'#fff', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontWeight:800, fontSize:'1.05rem', marginBottom:8 }}>📖 Carnet de voyage</div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un lieu, une activité…"
          style={{ width:'100%', padding:'8px 12px', borderRadius:10, border:'none', fontSize:'0.85rem',
            background:'rgba(255,255,255,0.15)', color:'#fff', outline:'none', boxSizing:'border-box' }} />
      </div>

      {/* ── Sommaire scrollable ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'8px 12px', overflowX:'auto', display:'flex', gap:6, whiteSpace:'nowrap' }}>
        {filtered.map(s => (
          <button key={s.id} onClick={() => { setSelected(s.id); setSearch('') }}
            style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
              background: selected===s.id ? '#0b1f3a' : '#f0f0f0',
              color: selected===s.id ? '#fff' : '#444' }}>
            {s.title?.split('–')[0]?.trim() || s.title}
          </button>
        ))}
      </div>

      {/* ── Contenu pleine page ── */}
      <div style={{ flex:1, padding:'1.2rem 1rem 2rem', maxWidth:680, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
        <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#0b1f3a', marginBottom:4, lineHeight:1.3 }}>{section?.title}</h2>
        <div style={{ height:3, width:60, background:'#e1306c', borderRadius:4, marginBottom:16 }} />
        <div>
          {section?.paragraphs?.map((p, i) => {
            if (!p.trim()) return null
            const isH = /^(📅|✈️|🚄|🏯|🗾|Jour\s|JOUR|Programme|Le matin|L'après|La soirée|Hébergement|Budget|Transport|Activité|Repas)/.test(p)
            const isEmoji = /^[📍🍜🚌🎌🌸🏮⛩️🎋🌊🏖️🏔️💴💶🕐]/.test(p)
            return (
              <p key={i} style={{
                fontSize: isH ? '1rem' : '0.9rem',
                fontWeight: isH ? 700 : 400,
                color: isH ? '#0b1f3a' : '#444',
                lineHeight: 1.7,
                marginBottom: isH ? 12 : 8,
                paddingLeft: isEmoji && !isH ? 4 : 0,
                borderLeft: isH ? '3px solid #e1306c' : 'none',
                paddingLeft: isH ? 10 : (isEmoji ? 4 : 0),
                background: isH ? '#fff9fb' : 'transparent',
                borderRadius: isH ? 6 : 0,
                padding: isH ? '6px 10px' : undefined,
              }}>{p}</p>
            )
          })}
        </div>
      </div>

      {/* ── Navigation bas ── */}
      <div style={{ position:'sticky', bottom:0, background:'#fff', borderTop:'1px solid #eee', padding:'10px 16px', display:'flex', justifyContent:'space-between', gap:10 }}>
        <button onClick={() => { if(idx > 0) setSelected(wordSections[idx-1].id) }}
          disabled={idx === 0}
          style={{ flex:1, padding:'10px', borderRadius:12, border:'1px solid #ddd', background: idx===0?'#f5f5f5':'#0b1f3a', color: idx===0?'#bbb':'#fff', fontWeight:700, fontSize:'0.85rem', cursor: idx===0?'not-allowed':'pointer' }}>
          ← Précédent
        </button>
        <div style={{ display:'flex', alignItems:'center', fontSize:'0.75rem', color:'#888' }}>
          {idx+1} / {wordSections.length}
        </div>
        <button onClick={() => { if(idx < wordSections.length-1) setSelected(wordSections[idx+1].id) }}
          disabled={idx === wordSections.length-1}
          style={{ flex:1, padding:'10px', borderRadius:12, border:'1px solid #ddd', background: idx===wordSections.length-1?'#f5f5f5':'#0b1f3a', color: idx===wordSections.length-1?'#bbb':'#fff', fontWeight:700, fontSize:'0.85rem', cursor: idx===wordSections.length-1?'not-allowed':'pointer' }}>
          Suivant →
        </button>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════
//  TOOLS PAGE (réservations + urgence)
// ════════════════════════════════════════════════════
function ToolsPage() {
  return (
    <motion.div key="tools" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div className="panel card-panel">
        <SectionTitle title="Réservations clés" />
        <div className="simple-list">
          {reservationItems.map(item => (
            <button className="simple-row" key={item.title} onClick={() => openMaps(item.maps)}>
              <span className="simple-left"><item.icon size={18} /><span><b>{item.title}</b><small>{item.text}</small></span></span>
              <Navigation size={18} />
            </button>
          ))}
        </div>
      </div>
      <div className="panel card-panel">
        <SectionTitle title="Urgence & santé" />
        <div className="input-grid two">
          <a className="call-card" href="tel:110"><Phone size={18} /> Police Japon 110</a>
          <a className="call-card" href="tel:119"><Phone size={18} /> Urgence Japon 119</a>
          <a className="call-card" href="tel:112"><Phone size={18} /> Police Corée 112</a>
          <a className="call-card" href="tel:119"><HeartPulse size={18} /> Pompiers Corée 119</a>
        </div>
      </div>
    </motion.div>
  )
}


function ConverterPage() {
  const CURRENCIES = [
    { code:'EUR', label:'Euro', symbol:'€', flag:'🇪🇺' },
    { code:'JPY', label:'Yen japonais', symbol:'¥', flag:'🇯🇵' },
    { code:'KRW', label:'Won coréen', symbol:'₩', flag:'🇰🇷' },
    { code:'USD', label:'Dollar US', symbol:'$', flag:'🇺🇸' },
  ]
  const DEFAULT_RATES = { EUR:1, JPY:162.5, KRW:1480, USD:1.08 }
  const [rates, setRates]   = useLocalStorage('conv_rates', DEFAULT_RATES)
  const [from, setFrom]     = useState('EUR')
  const [to, setTo]         = useState('JPY')
  const [amount, setAmount] = useState('')
  const [showRates, setShowRates] = useState(false)

  const convert = (val, f, t) => {
    const n = parseFloat(val)
    if (isNaN(n)) return ''
    const inEur = n / (rates[f] || 1)
    return (inEur * (rates[t] || 1)).toFixed(t === 'JPY' || t === 'KRW' ? 0 : 2)
  }

  const result = convert(amount, from, to)
  const fromCur = CURRENCIES.find(c => c.code === from)
  const toCur   = CURRENCIES.find(c => c.code === to)

  const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000, 50000]

  return (
    <motion.div key="conv" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0b1f3a,#1a3a6b)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>💱 Convertisseur</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>Yen · Won · Euro · Dollar — mis à jour manuellement</div>
      </div>

      {/* Convertisseur principal */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1.2rem', border:'1px solid #e0e0e0' }}>

        {/* De */}
        <label style={{ display:'block', fontSize:'0.8rem', color:'#888', marginBottom:4 }}>De</label>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <select value={from} onChange={e => setFrom(e.target.value)}
            style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid #ddd', fontSize:'0.95rem', background:'#f9f9f9' }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.label} ({c.symbol})</option>)}
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0" style={{ flex:1, padding:'10px', borderRadius:10, border:'2px solid #0b1f3a', fontSize:'1.1rem', fontWeight:700, textAlign:'right' }} />
        </div>

        {/* Flèche swap */}
        <div style={{ textAlign:'center', margin:'4px 0' }}>
          <button onClick={() => { setFrom(to); setTo(from) }}
            style={{ background:'#f0f0f0', border:'none', borderRadius:20, padding:'6px 16px', cursor:'pointer', fontSize:'1rem' }}>
            ⇅ Inverser
          </button>
        </div>

        {/* Vers */}
        <label style={{ display:'block', fontSize:'0.8rem', color:'#888', margin:'8px 0 4px' }}>Vers</label>
        <div style={{ display:'flex', gap:8 }}>
          <select value={to} onChange={e => setTo(e.target.value)}
            style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid #ddd', fontSize:'0.95rem', background:'#f9f9f9' }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.label} ({c.symbol})</option>)}
          </select>
          <div style={{ flex:1, padding:'10px', borderRadius:10, background: result ? '#e8f5e9' : '#f5f5f5',
            border:`2px solid ${result ? '#27ae60' : '#ddd'}`, fontSize:'1.3rem', fontWeight:800,
            textAlign:'right', color:'#27ae60', display:'flex', alignItems:'center', justifyContent:'flex-end' }}>
            {result ? `${toCur?.symbol}${Number(result).toLocaleString('fr-FR')}` : '—'}
          </div>
        </div>

        {/* Taux affiché */}
        {amount && result && (
          <div style={{ textAlign:'center', marginTop:10, fontSize:'0.8rem', color:'#888' }}>
            1 {fromCur?.symbol} = {convert(1, from, to)} {toCur?.symbol}
          </div>
        )}
      </div>

      {/* Montants rapides */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1rem', border:'1px solid #e0e0e0' }}>
        <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#0b1f3a', marginBottom:8 }}>
          Montants rapides — {fromCur?.flag} {fromCur?.symbol} → {toCur?.flag} {toCur?.symbol}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
          {QUICK_AMOUNTS.map(n => (
            <button key={n} onClick={() => setAmount(String(n))}
              style={{ padding:'8px 4px', borderRadius:10, border:'1px solid #e0e0e0', background:'#f9f9f9',
                cursor:'pointer', fontSize:'0.8rem', textAlign:'center' }}>
              <div style={{ fontWeight:700, color:'#0b1f3a' }}>{fromCur?.symbol}{n.toLocaleString()}</div>
              <div style={{ color:'#27ae60', fontSize:'0.78rem' }}>
                {toCur?.symbol}{Number(convert(n, from, to)).toLocaleString('fr-FR')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tableau toutes devises */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1rem', border:'1px solid #e0e0e0' }}>
        <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#0b1f3a', marginBottom:8 }}>
          {amount ? `${fromCur?.symbol}${Number(amount).toLocaleString()} =` : 'Équivalences (pour 1 unité)'}
        </div>
        {CURRENCIES.filter(c => c.code !== from).map(c => (
          <div key={c.code} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f0f0f0' }}>
            <span style={{ fontSize:'0.9rem' }}>{c.flag} {c.label}</span>
            <span style={{ fontWeight:700, color:'#0b1f3a', fontSize:'0.95rem' }}>
              {c.symbol}{Number(convert(amount || 1, from, c.code)).toLocaleString('fr-FR')}
            </span>
          </div>
        ))}
      </div>

      {/* Taux modifiables */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1rem', border:'1px solid #e0e0e0' }}>
        <button onClick={() => setShowRates(v => !v)}
          style={{ background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.85rem', color:'#0b1f3a' }}>
          ⚙️ {showRates ? 'Masquer' : 'Mettre à jour les taux de change'}
        </button>
        {showRates && (
          <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {CURRENCIES.filter(c => c.code !== 'EUR').map(c => (
              <label key={c.code} style={{ fontSize:'0.82rem' }}>
                {c.flag} 1 EUR = … {c.symbol}
                <input type="number" step="0.01" value={rates[c.code]}
                  onChange={e => setRates(prev => ({ ...prev, [c.code]: parseFloat(e.target.value)||0 }))}
                  style={{ display:'block', width:'100%', padding:'6px', borderRadius:8, border:'1px solid #ddd', marginTop:2 }} />
              </label>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  )
}

function loadNotifData(setNotifPos, setNotifData) {
  if (!navigator.geolocation) { setNotifPos('denied'); return }
  setNotifPos('loading')
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords
    try {
      const [weatherRes, geoRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`),
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { 'Accept-Language': 'fr' } })
      ])
      const weatherData = await weatherRes.json()
      const geoData     = await geoRes.json()
      const city    = geoData.address?.city || geoData.address?.town || geoData.address?.village || ''
      const country = geoData.address?.country || ''
      setNotifData({
        place: city && country ? `${city}, ${country}` : `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        temp:  Math.round(weatherData.current?.temperature_2m ?? 0),
        desc:  { 0:'Ciel dégagé', 1:'Peu nuageux', 2:'Partiellement nuageux', 3:'Couvert', 61:'Pluie', 80:'Averses', 95:'Orage' }[weatherData.current?.weather_code] || 'Météo variable'
      })
      setNotifPos('ok')
    } catch { setNotifPos('error') }
  }, () => setNotifPos('denied'))
}

function AppShell() {
  const [tab, setTab] = useState('days')
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifPos, setNotifPos] = useState(null)
  const [notifData, setNotifData] = useState(null)
  const [expenses]   = useLocalStorage('budget_items', [])
  const [envBudgets2]= useLocalStorage('budget_envelopes', { Restauration:1200, Transport:800, Loisirs:600 })
  const spent = expenses.reduce((s, x) => s + (Number(x.eur) || Number(x.amount) || 0), 0)
  const total = Object.values(envBudgets2).reduce((s, v) => s + (Number(v)||0), 0)
  const nextDay = useMemo(() => days[4], [])

  const page = {
    days:      <HomePage nextDay={nextDay} spent={spent} total={total} onGo={setTab} />,
    map:       <MapPage />,
    food:      <FoodPage />,
    explorer:  <ExplorerPage />,
    carnet:    <CarnetPage />,
    ai:        <ChatGPTPage />,
    budget:    <BudgetPage />,
    tools:     <ToolsPage />,
    converter: <ConverterPage />,
  }[tab]

  return (
    <div className="phone-shell">
      <div className="hero-banner">
        <img src={assets.banner} alt="Bandeau voyage Famille Lacidi" />
        <div className="hero-topbar">
          <button className="round-btn" onClick={() => setShowMenu(true)}><Menu size={20} /></button>
          <div className="hero-actions">
            <button className="round-btn" onClick={() => { setShowNotifs(true); loadNotifData(setNotifPos, setNotifData) }}><Bell size={20} /></button>
            <button className="round-btn"><SunMedium size={20} /></button>
          </div>
        </div>

      {/* DRAWER MENU */}
      {showMenu && (
        <div style={{ position:'fixed', inset:0, zIndex:9999 }} onClick={() => setShowMenu(false)}>
          <div style={{ position:'absolute', top:0, left:0, width:280, height:'100%', background:'#0b1f3a', color:'#fff', padding:'2rem 1.5rem', boxShadow:'4px 0 20px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
              <span style={{ fontSize:'1.2rem', fontWeight:700 }}>Lacidi Travel</span>
              <button onClick={() => setShowMenu(false)} style={{ background:'none', border:'none', color:'#fff', fontSize:'1.4rem', cursor:'pointer' }}>✕</button>
            </div>
            {[...quickLinks, ...secondaryLinks].map(item => {
              const Icon = item.icon
              return (
                <button key={item.key} onClick={() => { setTab(item.key); setShowMenu(false) }}
                  style={{ display:'flex', alignItems:'center', gap:14, width:'100%', background: tab===item.key ? 'rgba(255,255,255,0.15)' : 'none',
                    border:'none', color:'#fff', padding:'0.75rem 1rem', borderRadius:10, marginBottom:4, cursor:'pointer', fontSize:'1rem', textAlign:'left' }}>
                  <Icon size={20} style={{ opacity:0.9 }} />
                  {item.label}
                </button>
              )
            })}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.15)', marginTop:'1.5rem', paddingTop:'1.5rem', fontSize:'0.8rem', opacity:0.5 }}>
              Famille Lacidi — Japon &amp; Corée 2025
            </div>
          </div>
        </div>
      )}

      {/* PANEL NOTIFICATIONS */}
      {showNotifs && (
        <div style={{ position:'fixed', inset:0, zIndex:9999 }} onClick={() => setShowNotifs(false)}>
          <div style={{ position:'absolute', top:60, right:12, width:300, background:'#fff', borderRadius:16, boxShadow:'0 8px 32px rgba(0,0,0,0.18)', padding:'1rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.8rem' }}>
              <span style={{ fontWeight:700, fontSize:'1rem' }}>🔔 Alertes &amp; Autour de moi</span>
              <button onClick={() => setShowNotifs(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
            </div>
            {notifData ? (
              <div>
                <p style={{ fontSize:'0.85rem', color:'#0b1f3a', fontWeight:600, marginBottom:4 }}>📍 {notifData.place}</p>
                <p style={{ fontSize:'0.82rem', color:'#555', marginBottom:'0.6rem' }}>🌡 {notifData.temp}°C — {notifData.desc}</p>
                <div style={{ borderTop:'1px solid #eee', paddingTop:'0.6rem' }}>
                  <p style={{ fontSize:'0.78rem', color:'#888', marginBottom:4 }}>À explorer à proximité :</p>
                  {['Restaurants locaux', 'Attractions du quartier', 'Transports proches', 'Cafés & snacks'].map(tip => (
                    <div key={tip} style={{ fontSize:'0.82rem', padding:'0.3rem 0', borderBottom:'1px solid #f5f5f5', color:'#333' }}>• {tip}</div>
                  ))}
                </div>
              </div>
            ) : notifPos === 'loading' ? (
              <p style={{ fontSize:'0.82rem', color:'#888' }}>Localisation en cours…</p>
            ) : notifPos === 'denied' ? (
              <p style={{ fontSize:'0.82rem', color:'#e53935' }}>Géolocalisation refusée. Active-la dans les réglages du navigateur.</p>
            ) : (
              <button onClick={() => loadNotifData(setNotifPos, setNotifData)} style={{ background:'#0b1f3a', color:'#fff', border:'none', borderRadius:8, padding:'0.5rem 1rem', cursor:'pointer', width:'100%' }}>
                Activer les alertes de localisation
              </button>
            )}
          </div>
        </div>
      )}
      </div>

      <div className="home-surface">
        <div className="quick-grid">
          {quickLinks.map((item) => <QuickAction key={item.key} item={item} active={tab === item.key} onClick={() => setTab(item.key)} />)}
        </div>

        <AnimatePresence mode="wait">{page}</AnimatePresence>
      </div>

      <nav className="bottom-nav">
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.key} className={`bottom-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
              <Icon size={21} />
              <span>{item.label === 'IA Assistant' ? 'IA' : item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(() => sessionStorage.getItem('lacidi-started') === '1')
  if (!started) return <SplashScreen onStart={() => { sessionStorage.setItem('lacidi-started', '1'); setStarted(true) }} />
  return <AppShell />
}
