import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wordSections } from './wordContent.js'
import { supabase, loadEditsFromCloud, saveEditToCloud, deleteEditFromCloud,
  loadExpensesFromCloud, saveExpenseToCloud, deleteExpenseFromCloud,
  loadHotelsFromCloud, saveHotelToCloud, deleteHotelFromCloud,
  loadBudgetConfigFromCloud, saveBudgetConfigToCloud } from './supabase.js'
import {
  CalendarDays, Map, UtensilsCrossed, Sparkles, Wallet, Briefcase, BookOpen,
  Menu, Bell, SunMedium, ChevronRight, MapPin, Clock3, Footprints,
  Camera, WalletCards, Globe, Smartphone, Hotel, Plane, Train, Phone,
  Languages, Mic, Volume2, Search, Send, PlusCircle, Trash2, Download,
  Flame, Route, Navigation, HeartPulse, FileText, Calculator, CheckSquare, Clock,
  Heart, Wifi, ShoppingBag, Moon, Sun, AlertTriangle, Star
} from 'lucide-react'

const assets = {
  splash: '/splash.png',
  banner: '/banner.jpg',
  logo: '/icon-192.png',
}

const days = [
  { id: 0, date: '09 juil.', city: 'Paris → Rome', title: 'Départ Paris — Nuit à Paris CDG', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80', summary: "Départ de chez vous, trajet jusqu'à Paris CDG. Nuit à l'hôtel de l'aéroport pour un départ serein le lendemain matin.", timeRange: '06:00 – 23:00', steps: '-', highlights: ['CDG Aéroport', 'Hôtel transit Paris', 'Préparatifs finaux'], restaurants: ['Restaurant hôtel CDG', 'Brasserie aéroport'], spots: ['Tour Eiffel (si temps)', 'CDG Terminal 2'] },
  { id: -1, date: '10 juil.', city: 'Rome → Tokyo', title: 'Paris ✈️ Rome ✈️ Tokyo Haneda — Grand envol !', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', summary: "Vol Paris CDG → Rome Fiumicino, correspondance, puis vol long-courrier Rome → Tokyo Haneda (HND). Vol de nuit, arrivée à Haneda le 11 juillet au matin. Premier contact avec le Japon !", timeRange: '06:00 – 23:59', steps: '~20h de voyage', highlights: ['CDG Terminal', 'Rome Fiumicino FCO', 'Vol de nuit Rome-Tokyo', 'Tokyo Haneda HND'], restaurants: ['Repas à bord', 'Snack aéroport Rome'], spots: ['Vue aérienne Japon', 'Approche Haneda'], qrUrl: 'https://vjw.digital.go.jp', qrImg: '/qr-rome-tokyo.jpg' },
  { id: 1, date: '11 juil.', city: 'Haneda → Osaka', title: 'Arrivée Haneda → Shinkansen → Dotonbori', image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=80', summary: "Arrivée Tokyo Haneda Terminal 3 vers 11h. Monorail jusqu'à Hamamatsucho puis JR Yamanote/Keihin-Tohoku jusqu'à Tokyo Station (~500-700¥, 25-30 min). Shinkansen Tokaido (Nozomi ou Hikari) vers Shin-Osaka (2h30-3h). Métro Midosuji direction Namba → descente Nippombashi sortie 2 → 5 min à pied jusqu'au Candeo Hotel Osaka Namba. Check-in 18h. Soirée Dotonbori : croisière Tombori River Cruise (2000¥, 20 min), photos Glico Running Man et crabe géant Kani Doraku, street food (takoyaki, kushikatsu, brochettes wagyu, gyoza), ruelle Hozenji Yokocho et dessert cheesecake Rikuro Ojisan.", timeRange: '11:00 – 22:15', steps: '~10 000 pas', highlights: ['Haneda Terminal 3', 'Tokyo Monorail', 'Tokyo Station', 'Shinkansen Tokaido', 'Shin-Osaka', 'Midosuji Line', 'Candeo Hotel Namba', 'Tombori Cruise', 'Glico Man', 'Hozenji Yokocho'], restaurants: ['Kukuru Takoyaki', 'Daruma Kushikatsu', 'Kani Doraku Dotonbori', 'Rikuro Ojisan no Mise Namba', 'Hozenji Yokocho izakaya'], spots: ['Glico Running Man', 'Crabe Kani Doraku', 'Tombori Riverwalk', 'Hozenji Yokocho'], itinerary: [
    { time: '11:00', icon: '✈️', step: "Arrivée Haneda Terminal 3 (sortie arrivées)" },
    { time: '11:15', icon: '🚝', step: "Suivre panneaux Tokyo Monorail (モノレール) → direction Hamamatsucho" },
    { time: '11:45', icon: '🚆', step: "À Hamamatsucho : JR Yamanote ou Keihin-Tohoku → Tokyo Station" },
    { time: '13:00', icon: '🏯', step: "Tokyo Station : suivre Shinkansen → Tokaido → Shin-Osaka (machines anglais ou guichet JR)" },
    { time: '14:00', icon: '🚄', step: "Embarquement Shinkansen Nozomi ou Hikari (regarder écrans + numéro de voiture au sol)" },
    { time: '17:00', icon: '🚇', step: "Arrivée Shin-Osaka → Midosuji Line rouge direction Namba" },
    { time: '17:20', icon: '🚉', step: "Descendre à Nippombashi → sortie 2 → marche 3-5 min" },
    { time: '17:30', icon: '🏨', step: "Arrivée Candeo Hotel Osaka Namba" },
    { time: '18:00', icon: '🛏️', step: "Check-in hôtel, déposer bagages, repos rapide" },
    { time: '19:00', icon: '🚶', step: "Départ à pied vers Dotonbori (10-15 min)" },
    { time: '19:15', icon: '🎫', step: "Guichet Tombori River Cruise — quai près Don Quijote roue jaune" },
    { time: '19:25', icon: '📸', step: "Photos Glico Running Man + crabe géant Kani Doraku" },
    { time: '19:45', icon: '🍡', step: "Street food : takoyaki, gyoza, karaage, kushikatsu, brochettes wagyu" },
    { time: '20:00', icon: '🛥️', step: "Embarquement Tombori River Cruise (20 min, ~2000¥/adulte)" },
    { time: '20:30', icon: '🌃', step: "Promenade Tombori Riverwalk : artistes, musique, stands" },
    { time: '21:15', icon: '🏮', step: "Hozenji Yokocho : ruelle traditionnelle, lanternes, verser eau pour porter chance" },
    { time: '21:45', icon: '🧁', step: "Dessert : cheesecake fluffy Rikuro Ojisan no Mise Namba" },
    { time: '22:15', icon: '🛏️', step: "Retour à pied au Candeo Hotel" }
  ] },
  { id: 2, date: '12 juil.', city: 'Osaka', title: 'Namba Yasaka → Osaka Castle → Shinsekai', image: 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?auto=format&fit=crop&w=1200&q=80', summary: 'Tête de lion, château d’Osaka, Tempozan, Tsutenkaku et kushikatsu.', timeRange: '08:30 – 21:00', steps: '15 100 pas', highlights: ['Namba Yasaka', 'Osaka Castle', 'Shinsekai'], restaurants: ['Daruma Kushikatsu', 'Tempozan Food Court'], spots: ['Tsutenkaku', 'Osaka Castle'] },
  { id: 3, date: '13 juil.', city: 'Osaka', title: 'Universal Studios Japan', image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?auto=format&fit=crop&w=1200&q=80', summary: 'Super Nintendo World, Harry Potter, Jurassic Park et Umeda en soirée.', timeRange: '06:30 – 22:00', steps: '20 500 pas', highlights: ['USJ', 'Nintendo', 'Harry Potter'], restaurants: ['USJ snacks', 'Ichiran Shinjuku'], spots: ['Super Nintendo World', 'Hogwarts'] },
  { id: 4, date: '14 juil.', city: 'Nara / Kyoto', title: 'Nara → arrivée Gion', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', summary: 'Daims de Nara puis installation à Kyoto et soirée Gion.', timeRange: '08:00 – 21:30', steps: '14 600 pas', highlights: ['Nara Park', 'Kasuga Taisha', 'Gion'], restaurants: ['Nakatanidou', 'Gyoza ChaoChao'], spots: ['Daims', 'Yasaka Shrine'] },
  { id: 5, date: '15 juil.', city: 'Kyoto', title: 'Kyoto – Jour 1 ⛩️', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80', summary: 'Kiyomizu-dera, Sannenzaka, Yasaka Shrine, Nishiki Market, Gion & Shirakawa.', timeRange: '08:00 – 21:30', steps: '15 420 pas', highlights: ['Kiyomizu-dera', 'Nishiki Market', 'Gion'], restaurants: ['Nishiki Market', 'Ramen Sen no Kaze'], spots: ['Kiyomizu-dera', 'Sannenzaka', 'Gion Shirakawa'] },
  { id: 6, date: '16 juil.', city: 'Kyoto', title: 'Fushimi Inari → Arashiyama', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80', summary: 'Torii rouges, forêt de bambous, Tenryu-ji et Pontocho.', timeRange: '07:30 – 21:00', steps: '16 200 pas', highlights: ['Fushimi Inari', 'Bamboo Grove', 'Pontocho'], restaurants: ['% Arabica', 'Pontocho Alley'], spots: ['Torii rouges', 'Togetsukyo Bridge'] },
  { id: 7, date: '17 juil.', city: 'Kyoto / Séoul', title: 'Gion Matsuri → Séoul', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80', summary: 'Festival Gion Matsuri, Haruka Express, vol KIX → Incheon, Myeongdong.', timeRange: '08:00 – 23:00', steps: '10 800 pas', highlights: ['Gion Matsuri', 'Haruka', 'Myeongdong'], restaurants: ['Myeongdong Street Food'], spots: ['Shijo Kawaramachi', 'Myeongdong night'] },
  { id: 8, date: '18 juil.', city: 'Séoul', title: 'Gyeongbokgung → Bukchon → Myeongdong', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80', summary: 'Palais royal, village hanok, Insadong et street food Myeongdong.', timeRange: '09:00 – 21:30', steps: '14 900 pas', highlights: ['Gyeongbokgung', 'Bukchon', 'Myeongdong'], restaurants: ['Myeongdong Kyoja', 'Insadong Geujib'], spots: ['Bukchon Hanok', 'Myeongdong neon'] },
  { id: 9, date: '19 juil.', city: 'Séoul', title: 'N Seoul Tower → Hongdae', image: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?auto=format&fit=crop&w=1200&q=80', summary: 'Vue Namsan, marchés, Hongdae et dîner BBQ coréen.', timeRange: '10:00 – 22:00', steps: '13 400 pas', highlights: ['N Seoul Tower', 'Hongdae'], restaurants: ['Wangbijib', 'Hongdae Chicken'], spots: ['Namsan', 'Hongdae'] },
  { id: 10, date: '20 juil.', city: 'Busan', title: 'Séoul → Busan + Haeundae', image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1200&q=80', summary: 'KTX vers Busan, Haeundae Beach, Dongbaekseom et The Bay 101.', timeRange: '08:00 – 21:30', steps: '12 100 pas', highlights: ['KTX', 'Haeundae', 'The Bay 101'], restaurants: ['Haeundae Market', 'The Bay 101'], spots: ['Haeundae', 'Skyline Busan'] },
  { id: 11, date: '21 juil.', city: 'Busan', title: 'Temple mer → Gamcheon → Gwangalli', image: 'https://images.unsplash.com/photo-1601687962453-2780b75b2ce8?auto=format&fit=crop&w=1200&q=80', summary: 'Temple Haedong Yonggungsa, Gamcheon, Jagalchi et Gwangalli.', timeRange: '09:00 – 22:00', steps: '16 050 pas', highlights: ['Temple mer', 'Gamcheon', 'Gwangalli'], restaurants: ['Jagalchi', 'BIFF Square'], spots: ['Gamcheon', 'Gwangalli Bridge'] },
  { id: 12, date: '22 juil.', city: 'Tokyo', title: 'Busan → Narita → Shinjuku', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80', summary: 'Gimhae Airport, vol vers Narita, Narita Express puis Shinjuku.', timeRange: '08:30 – 22:00', steps: '9 400 pas', highlights: ['Blue Line Park', 'NEX', 'Shinjuku'], restaurants: ['Shinjuku late dinner'], spots: ['Kabukicho'], qrUrl: 'https://vjw.digital.go.jp', qrImg: '/qr-busan-tokyo.jpg' },
  { id: 13, date: '23 juil.', city: 'Tokyo', title: 'Shibuya Crossing → Harajuku → Omotesando', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', summary: 'Matinée à Shibuya Crossing, Takeshita Street à Harajuku, boutiques Omotesando et soirée Roppongi.', timeRange: '09:00 – 22:00', steps: '15 800 pas', highlights: ['Shibuya Crossing', 'Harajuku', 'Omotesando', 'Roppongi Hills'], restaurants: ['Ichiran Shibuya', 'Afuri Ramen Harajuku', 'Crêpes Takeshita'], spots: ['Shibuya Crossing', 'Takeshita Street', 'Omotesando Hills'] },
  { id: 14, date: '24 juil.', city: 'Tokyo', title: 'Asakusa → Senso-ji → Akihabara', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', summary: 'Temple Senso-ji et marché Nakamise à Asakusa, Tokyo Skytree, puis Akihabara électronique et manga.', timeRange: '08:30 – 21:30', steps: '15 200 pas', highlights: ['Senso-ji', 'Nakamise', 'Tokyo Skytree', 'Akihabara'], restaurants: ['Asakusa Mugitoro', 'Tempura Daikokuya', 'Akihabara maid café'], spots: ['Senso-ji', 'Tokyo Skytree', 'Akihabara Electric Town'] },
  { id: 15, date: '25 juil.', city: 'Tokyo', title: 'Odaiba → Shinjuku Gyoen → Kabukicho', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80', summary: 'Odaiba et baie de Tokyo, Shinjuku Gyoen pour la détente, soirée Kabukicho et Golden Gai.', timeRange: '09:30 – 23:00', steps: '14 600 pas', highlights: ['Odaiba', 'Rainbow Bridge', 'Shinjuku Gyoen', 'Golden Gai'], restaurants: ['Odaiba teamLab café', 'Shinjuku Omoide Yokocho', 'Golden Gai bar'], spots: ['Gundam Statue', 'Rainbow Bridge', 'Golden Gai'] },
  { id: 16, date: '26 juil.', city: 'Tokyo', title: 'Ueno → Yanaka → Akihabara soir', image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1200&q=80', summary: 'Parc Ueno et musées, quartier ancien de Yanaka, shopping et soirée Akihabara.', timeRange: '09:00 – 21:30', steps: '14 000 pas', highlights: ['Ueno Park', 'Yanaka', 'Ameya-Yokocho', 'Akihabara'], restaurants: ['Ueno Ippudo', 'Yanaka Ginza street food', 'Akihabara izakaya'], spots: ['Ueno Park', 'Yanaka cemetery', 'Ameya-Yokocho market'] },
  { id: 17, date: '27 juil.', city: 'Tokyo', title: 'Ikebukuro → Shimokitazawa → Nakameguro', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', summary: 'Ikebukuro et Sunshine City, quartier bohème de Shimokitazawa, canal Nakameguro en soirée.', timeRange: '10:00 – 22:00', steps: '13 500 pas', highlights: ['Ikebukuro', 'Shimokitazawa', 'Nakameguro'], restaurants: ['Sunshine City food court', 'Shimokitazawa curry', 'Nakameguro bistrot'], spots: ['Sunshine City', 'Shimokitazawa vintage', 'Canal Nakameguro'] },
  { id: 18, date: '28 juil.', city: 'Tokyo', title: 'Tsukiji → Ginza → Tokyo Tower', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=1200&q=80', summary: 'Marché extérieur Tsukiji et sushis du matin, shopping Ginza, panorama depuis Tokyo Tower.', timeRange: '07:00 – 21:00', steps: '13 800 pas', highlights: ['Tsukiji outer market', 'Ginza', 'Tokyo Tower'], restaurants: ['Sushis Tsukiji matin', 'Ginza Six food hall', 'Tokyo Tower restaurant'], spots: ['Tsukiji', 'Ginza', 'Tokyo Tower vue'] },
  { id: 19, date: '29 juil.', city: 'Tokyo', title: 'Dernier jour libre → Souvenirs', image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80', summary: 'Journée libre pour les derniers souvenirs, Shinjuku shopping, préparation des bagages et dîner d'adieu à Tokyo.', timeRange: '09:00 – 22:00', steps: '~10 000 pas', highlights: ['Shinjuku Takashimaya', 'Don Quijote', 'Dîner adieu'], restaurants: ['Sushi Saito', 'Shinjuku izakaya', 'Convenience store matcha'], spots: ['Shinjuku shopping', 'Don Quijote', 'Vue nocturne Tokyo'] },
  { id: 20, date: '30 juil.', city: 'Tokyo → Paris', title: '✈️ Vol retour — Tokyo Narita → Paris CDG', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', summary: 'Transfer Narita Express, embarquement Tokyo Narita NRT, vol long-courrier retour Paris CDG. Fin d'un voyage inoubliable au Japon et en Corée !', timeRange: '06:00 – 23:59', steps: '~5 000 pas', highlights: ['Narita Express', 'Tokyo Narita NRT', 'Vol Paris CDG', 'Retour maison'], restaurants: ['Brunch Narita Airport', 'Repas à bord'], spots: ['Narita Airport', 'Vue aérienne Japon', 'Atterrissage CDG'] },
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
  { key: 'metro',    label: 'Métro',    icon: MapPin,       color: 'violet' },
]
// Onglets secondaires accessibles via le menu hamburger uniquement
const secondaryLinks = [
  { key: 'map',       label: 'Carte',          icon: Map,        color: 'blue'   },
  { key: 'ai',        label: 'ChatGPT',        icon: Sparkles,   color: 'green'  },
  { key: 'converter', label: 'Convertisseur',  icon: Calculator, color: 'indigo' },
  { key: 'phrases',   label: 'Phrases utiles', icon: Languages,  color: 'rose'   },
  { key: 'transport', label: 'Transports',     icon: Train,      color: 'blue'   },
  { key: 'checklist', label: 'Checklist',      icon: CheckSquare,color: 'green'  },
  { key: 'notes',     label: 'Mes notes',      icon: FileText,   color: 'amber'  },
  { key: 'favoris',   label: 'Mes favoris',    icon: Heart,      color: 'pink'   },
  { key: 'shopping',  label: 'Shopping',       icon: ShoppingBag,color: 'orange' },
  { key: 'sante',     label: 'Santé & Urgence',icon: HeartPulse, color: 'red'    },
  { key: 'sim',       label: 'SIM & Wifi',     icon: Wifi,       color: 'teal'   },
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
  const [showItin, setShowItin] = useState(false)
  return (
    <div className="next-day-card">
      <img src={day.image} alt={day.title} />
      <div className="next-day-content">
        <div className="date-badge">
          <strong>{day.id < 0 ? '✈' : String(day.id).padStart(2, '0')}</strong>
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
          {day.qrImg && (() => {
            const [qrFull, setQrFull] = React.useState(false)
            return (
              <>
                {qrFull && (
                  <div onClick={() => setQrFull(false)}
                    style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:9999,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:20 }}>
                    <div style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', textAlign:'center' }}>
                      ✈️ {day.city}
                    </div>
                    <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>QR Code Immigration Japon</div>
                    <img src={day.qrImg} alt="QR Code"
                      style={{ width:'90vw', maxWidth:380, height:'auto', borderRadius:12, background:'#fff', padding:16 }} />
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem' }}>Appuyer pour fermer</div>
                  </div>
                )}
                <div onClick={() => setQrFull(true)}
                  style={{ marginTop:12, background:'#1a2e8a', borderRadius:14, padding:'12px 14px',
                    display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                  <img src={day.qrImg} alt="QR Code Visit Japan Web"
                    style={{ width:64, height:64, objectFit:'cover', borderRadius:8, background:'#fff', padding:4, flexShrink:0 }} />
                  <div>
                    <div style={{ color:'#fff', fontWeight:700, fontSize:'0.85rem' }}>📱 QR Code Immigration Japon</div>
                    <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.75rem', marginTop:3 }}>✈️ {day.city}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.7rem', marginTop:2 }}>Appuyer pour agrandir</div>
                  </div>
                </div>
              </>
            )
          })()}
          {day.itinerary && day.itinerary.length > 0 && (
            <div style={{ marginTop:12 }}>
              <button onClick={() => setShowItin(v => !v)}
                style={{ width:'100%', padding:'8px 12px', borderRadius:10, border:'1.5px solid #0b1f3a', background: showItin ? '#0b1f3a' : '#fff', color: showItin ? '#fff' : '#0b1f3a', fontSize:'0.85rem', fontWeight:700, cursor:'pointer' }}>
                {showItin ? '▲ Masquer' : '🗓️ Voir l\'itinéraire détaillé'} ({day.itinerary.length} étapes)
              </button>
              {showItin && (
                <div style={{ marginTop:10, background:'#f8f9fb', borderRadius:12, padding:'12px 14px', border:'1px solid #e8eaef' }}>
                  {day.itinerary.map((it, idx) => (
                    <div key={idx} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom: idx < day.itinerary.length-1 ? '1px solid #e8eaef' : 'none' }}>
                      <div style={{ minWidth:52, fontWeight:800, color:'#e8523a', fontSize:'0.82rem' }}>{it.time}</div>
                      <div style={{ fontSize:'1.05rem' }}>{it.icon}</div>
                      <div style={{ flex:1, fontSize:'0.83rem', color:'#333', lineHeight:1.4 }}>{it.step}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
  0: 'Ciel dégagé', 1: 'Principalement clair', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: 'Brouillard', 48: 'Brouillard givrant', 51: 'Bruine faible', 53: 'Bruine', 55: 'Bruine forte',
  61: 'Pluie faible', 63: 'Pluie', 65: 'Pluie forte', 71: 'Neige faible', 73: 'Neige', 75: 'Neige forte',
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
      <CountdownCard />
      <WeatherLiveCard />

      <div className="panel card-panel">
        <SectionTitle title="Prochain jour" linkLabel={showAll ? 'Réduire' : 'Voir tout'} onLink={() => setShowAll(!showAll)} />
        <DayPreviewCard day={nextDay} onOpen={() => onGo('food')} />
      </div>

      {showAll && (
        <div className="panel card-panel">
          <SectionTitle title="📓 Carnet de voyage — Tous les jours" />
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {days.map((day) => (
              <DayPreviewCard key={day.id} day={day} onOpen={() => onGo('food')} />
            ))}
          </div>
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
  const [favoris, setFavoris] = useLocalStorage('mes_favoris', [])
  const toggleFav = (id, nom, type) => {
    setFavoris(prev => prev.find(f=>f.id===id) ? prev.filter(f=>f.id!==id) : [...prev, {id, nom, type}])
  }
  const isFav = (id) => favoris.some(f=>f.id===id)
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
  const ZONE_CURRENCY = { Japon:{code:'JPY',sym:'¥'}, Corée:{code:'KRW',sym:'₩'}, Europe:{code:'EUR',sym:'€'} }
  const CATEGORIES    = ['Restaurant','Transport','Visite','Shopping','Hôtel','Snack','Autre']
  const ENV_LIST      = ['Restauration','Transport','Loisirs','Hébergement']
  const CAT_TO_ENV    = { Restaurant:'Restauration', Snack:'Restauration', Transport:'Transport', Visite:'Loisirs', Shopping:'Loisirs', Hôtel:'Hébergement', Autre:'Loisirs' }
  const ENV_COLORS    = { Restauration:'#e8523a', Transport:'#3a7bd5', Loisirs:'#27ae60', Hébergement:'#8e44ad' }
  const ENV_EMOJI     = { Restauration:'🍜', Transport:'🚆', Loisirs:'🎌', Hébergement:'🏨' }
  const VILLES        = ['Paris','Osaka','Kyoto','Nara','Hakone','Tokyo','Séoul','Busan']

  // ── États locaux ──
  const [rates,      setRates]      = useLocalStorage('budget_rates',     { JPY:0.0061, KRW:0.00064, EUR:1 })
  const [envBudgets, setEnvBudgets] = useLocalStorage('budget_envelopes', { Restauration:1200, Transport:800, Loisirs:600, Hébergement:2000 })
  const [expenses,   setExpenses]   = useState([])
  const [hotels,     setHotels]     = useState([])
  const [syncStatus, setSyncStatus] = useState('loading')
  const [activeTab,  setActiveTab]  = useState('depenses') // 'depenses' | 'hebergement' | 'enveloppes'
  const [showRates,  setShowRates]  = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10), pays:'Japon', categorie:'Restaurant', label:'', amount:''
  })
  const [hotelForm, setHotelForm] = useState({
    ville:'Tokyo', nom:'', dates:'', montant_eur:'', devise:'EUR', montant_local:'', paye:false, notes:''
  })
  const [showHotelForm, setShowHotelForm] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  // ── Chargement Supabase + Realtime ──
  useEffect(() => {
    const load = async () => {
      setSyncStatus('loading')
      const [cloudExp, cloudHotels] = await Promise.all([
        loadExpensesFromCloud(),
        loadHotelsFromCloud(),
      ])
      if (cloudExp !== null) setExpenses(cloudExp)
      if (cloudHotels !== null) setHotels(cloudHotels)
      setSyncStatus(cloudExp !== null ? 'synced' : 'error')
      setLastSync(new Date())
    }
    load()

    // Realtime : mise à jour instantanée dès qu'un autre téléphone modifie
    const channel = supabase
      .channel('budget-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_expenses' }, () => {
        load()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_hotels' }, () => {
        load()
      })
      .subscribe()

    // Fallback polling 60s au cas où Realtime est coupé
    const interval = setInterval(load, 60000)
    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  // ── Calculs ──
  const toEUR = (amount, pays) => {
    const code = ZONE_CURRENCY[pays]?.code ?? 'EUR'
    return Math.round(parseFloat(amount) * (Number(rates[code]) || 1) * 100) / 100
  }

  const spentByEnv = (env) => {
    let total = expenses
      .filter(x => (CAT_TO_ENV[x.categorie] || 'Loisirs') === env)
      .reduce((s, x) => s + (Number(x.eur) || 0), 0)
    if (env === 'Hébergement') {
      total += hotels
        .filter(h => h.paye)
        .reduce((s, h) => s + (Number(h.montant_eur) || 0), 0)
    }
    return total
  }

  const hotelTotal    = hotels.reduce((s, h) => s + (Number(h.montant_eur) || 0), 0)
  const hotelPaid     = hotels.filter(h => h.paye).reduce((s, h) => s + (Number(h.montant_eur) || 0), 0)
  const hotelPending  = hotelTotal - hotelPaid

  const totalBudget   = ENV_LIST.reduce((s, e) => s + (Number(envBudgets[e]) || 0), 0)
  const totalSpent    = ENV_LIST.reduce((s, e) => s + spentByEnv(e), 0)
  const totalLeft     = totalBudget - totalSpent

  // ── Ajouter dépense ──
  const addExpense = async () => {
    const raw = parseFloat(form.amount)
    if (!form.label.trim() || isNaN(raw) || raw <= 0) return
    const eurVal = toEUR(raw, form.pays)
    const newExp = {
      id: `exp_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      date: form.date, pays: form.pays,
      categorie: form.categorie, label: form.label.trim(),
      amount: raw, devise: ZONE_CURRENCY[form.pays].code, eur: eurVal,
      added_by: 'famille', created_at: new Date().toISOString(),
    }
    setExpenses(prev => [newExp, ...prev])
    setForm(f => ({ ...f, label:'', amount:'' }))
    setSyncStatus('loading')
    const ok = await saveExpenseToCloud(newExp)
    setSyncStatus(ok ? 'synced' : 'error')
  }

  const removeExpense = async (id) => {
    setExpenses(prev => prev.filter(x => x.id !== id))
    await deleteExpenseFromCloud(id)
  }

  // ── Ajouter hôtel ──
  const addHotel = async () => {
    if (!hotelForm.nom.trim() || !hotelForm.montant_eur) return
    const newHotel = {
      id: `hotel_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      ville: hotelForm.ville,
      nom: hotelForm.nom.trim(),
      dates: hotelForm.dates.trim(),
      montant_eur: parseFloat(hotelForm.montant_eur) || 0,
      devise: hotelForm.devise,
      montant_local: parseFloat(hotelForm.montant_local) || 0,
      paye: hotelForm.paye,
      notes: hotelForm.notes.trim(),
      created_at: new Date().toISOString(),
    }
    setHotels(prev => [...prev, newHotel])
    setHotelForm({ ville:'Tokyo', nom:'', dates:'', montant_eur:'', devise:'EUR', montant_local:'', paye:false, notes:'' })
    setShowHotelForm(false)
    setSyncStatus('loading')
    const ok = await saveHotelToCloud(newHotel)
    setSyncStatus(ok ? 'synced' : 'error')
  }

  const toggleHotelPaid = async (hotel) => {
    const updated = { ...hotel, paye: !hotel.paye }
    setHotels(prev => prev.map(h => h.id === hotel.id ? updated : h))
    await saveHotelToCloud(updated)
  }

  const removeHotel = async (id) => {
    setHotels(prev => prev.filter(h => h.id !== id))
    await deleteHotelFromCloud(id)
  }

  const exportCsv = () => {
    const header = 'date,pays,catégorie,libellé,montant_local,devise,equivalent_eur,enveloppe,ajouté_par'
    const rows = expenses.map(x =>
      [x.date, x.pays, x.categorie, `"${x.label}"`, x.amount, x.devise,
       (Number(x.eur)||0).toFixed(2), CAT_TO_ENV[x.categorie]||'Loisirs', x.added_by||''].join(',')
    )
    const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'depenses-lacidi.csv'; a.click()
  }

  const zoneInfo = ZONE_CURRENCY[form.pays]
  const preview  = form.amount ? toEUR(form.amount, form.pays) : 0

  return (
    <motion.div key="budget" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">

      {/* ── Bandeau sync ── */}
      <div style={{ background: syncStatus==='loading'?'#f39c12': syncStatus==='error'?'#e74c3c':'#27ae60',
        color:'#fff', textAlign:'center', padding:'5px 12px', fontSize:'0.72rem', fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>
          {syncStatus==='loading' && '☁️ Synchronisation…'}
          {syncStatus==='synced'  && '✅ Synchronisé — 4 téléphones connectés'}
          {syncStatus==='error'   && '⚠️ Hors-ligne — données locales'}
        </span>
        {lastSync && syncStatus==='synced' && (
          <span style={{ opacity:0.8 }}>{lastSync.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
        )}
      </div>

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
        {/* Mini récap hébergement */}
        <div style={{ marginTop:10, borderTop:'1px solid rgba(255,255,255,0.15)', paddingTop:8, display:'flex', justifyContent:'space-between', fontSize:'0.78rem' }}>
          <span>🏨 Hébergements : <b>{hotelTotal.toFixed(0)} €</b></span>
          <span style={{ color: hotelPending>0?'#f39c12':'#7dffb0' }}>
            {hotelPaid.toFixed(0)} € payé · {hotelPending.toFixed(0)} € à payer
          </span>
        </div>
      </div>

      {/* ── Onglets internes ── */}
      <div style={{ display:'flex', background:'#fff', borderRadius:14, padding:4, border:'1px solid #eee', gap:4 }}>
        {[
          { key:'depenses',     label:'💸 Dépenses' },
          { key:'hebergement',  label:'🏨 Hébergement' },
          { key:'enveloppes',   label:'📊 Enveloppes' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ flex:1, padding:'8px 4px', borderRadius:10, border:'none', cursor:'pointer', fontSize:'0.75rem', fontWeight:700,
              background: activeTab===t.key ? '#0b1f3a' : 'transparent',
              color: activeTab===t.key ? '#fff' : '#666' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════ */}
      {/* ── ONGLET DÉPENSES ── */}
      {/* ══════════════════════════════════ */}
      {activeTab === 'depenses' && (<>

        {/* Formulaire ajout */}
        <div className="panel card-panel">
          <SectionTitle title="Ajouter une dépense" />
          <div style={{ fontSize:'0.72rem', color:'#888', marginBottom:8 }}>
            👥 Visible par les 4 membres de la famille en temps réel
          </div>
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

        {/* Historique */}
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
                      {item.added_by && item.added_by !== 'famille' && <span style={{ marginLeft:4, color:'#aaa' }}>· {item.added_by}</span>}
                    </small>
                  </span>
                  <button className="icon-btn" onClick={() => removeExpense(item.id)}><Trash2 size={16} /></button>
                </div>
              )
            })}
          </div>
        </div>
      </>)}

      {/* ══════════════════════════════════ */}
      {/* ── ONGLET HÉBERGEMENT ── */}
      {/* ══════════════════════════════════ */}
      {activeTab === 'hebergement' && (<>

        {/* Récap hébergement */}
        <div className="panel card-panel" style={{ background:'#f8f3ff', border:'2px solid #8e44ad' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontWeight:800, color:'#8e44ad', fontSize:'1rem' }}>🏨 Enveloppe Hébergement</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <input type="number" value={Number(envBudgets['Hébergement'])||0}
                onChange={e => setEnvBudgets(prev => ({ ...prev, 'Hébergement': Math.max(0, Number(e.target.value)||0) }))}
                style={{ width:80, textAlign:'right', border:'none', borderBottom:'2px solid #8e44ad',
                  background:'transparent', fontWeight:700, fontSize:'1rem', color:'#8e44ad' }} />
              <span style={{ color:'#8e44ad', fontWeight:700 }}>€</span>
            </div>
          </div>
          <div style={{ background:'#e8e0f0', borderRadius:8, height:10, marginBottom:8 }}>
            <div style={{ background:'#8e44ad', height:10, borderRadius:8, transition:'width 0.4s',
              width:`${Math.min(100, (Number(envBudgets['Hébergement'])||1) ? (hotelTotal/(Number(envBudgets['Hébergement'])||1))*100 : 0)}%` }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, textAlign:'center' }}>
            <div style={{ background:'#fff', borderRadius:10, padding:'8px 4px' }}>
              <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#8e44ad' }}>{hotelTotal.toFixed(0)} €</div>
              <div style={{ fontSize:'0.7rem', color:'#888' }}>Total prévu</div>
            </div>
            <div style={{ background:'#fff', borderRadius:10, padding:'8px 4px' }}>
              <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#27ae60' }}>{hotelPaid.toFixed(0)} €</div>
              <div style={{ fontSize:'0.7rem', color:'#888' }}>Payé ✅</div>
            </div>
            <div style={{ background:'#fff', borderRadius:10, padding:'8px 4px' }}>
              <div style={{ fontSize:'1.1rem', fontWeight:800, color: hotelPending>0?'#e67e22':'#27ae60' }}>{hotelPending.toFixed(0)} €</div>
              <div style={{ fontSize:'0.7rem', color:'#888' }}>À payer</div>
            </div>
          </div>
          <div style={{ marginTop:8, fontSize:'0.75rem', color:'#666', textAlign:'center' }}>
            Restant enveloppe : <b style={{ color: (Number(envBudgets['Hébergement'])||0)-hotelTotal < 0 ? '#e74c3c':'#27ae60' }}>
              {((Number(envBudgets['Hébergement'])||0) - hotelTotal).toFixed(0)} €
            </b>
          </div>
        </div>

        {/* Bouton ajouter hôtel */}
        <button onClick={() => setShowHotelForm(v => !v)}
          style={{ background:'#8e44ad', color:'#fff', border:'none', borderRadius:12, padding:'12px', fontWeight:700,
            fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <PlusCircle size={18} /> {showHotelForm ? 'Annuler' : 'Ajouter un hébergement'}
        </button>

        {/* Formulaire hôtel */}
        {showHotelForm && (
          <div className="panel card-panel" style={{ border:'2px solid #8e44ad' }}>
            <SectionTitle title="Nouvel hébergement" />
            <div className="input-grid two">
              <label><span>Ville</span>
                <select className="text-input" value={hotelForm.ville} onChange={e => setHotelForm(f=>({...f,ville:e.target.value}))}>
                  {VILLES.map(v => <option key={v}>{v}</option>)}
                </select>
              </label>
              <label><span>Nom de l'hôtel</span>
                <input className="text-input" placeholder="ex : Dormy Inn Osaka" value={hotelForm.nom}
                  onChange={e => setHotelForm(f=>({...f,nom:e.target.value}))} />
              </label>
              <label style={{ gridColumn:'1 / -1' }}><span>Dates (ex : 11-13 juillet)</span>
                <input className="text-input" placeholder="ex : 11-13 juillet" value={hotelForm.dates}
                  onChange={e => setHotelForm(f=>({...f,dates:e.target.value}))} />
              </label>
              <label><span>Montant en €</span>
                <input className="text-input" type="number" placeholder="0" value={hotelForm.montant_eur}
                  onChange={e => setHotelForm(f=>({...f,montant_eur:e.target.value}))} />
              </label>
              <label><span>Devise locale</span>
                <select className="text-input" value={hotelForm.devise} onChange={e => setHotelForm(f=>({...f,devise:e.target.value}))}>
                  <option>EUR</option><option>JPY</option><option>KRW</option>
                </select>
              </label>
              <label style={{ gridColumn:'1 / -1' }}><span>Montant en devise locale (optionnel)</span>
                <input className="text-input" type="number" placeholder="0" value={hotelForm.montant_local}
                  onChange={e => setHotelForm(f=>({...f,montant_local:e.target.value}))} />
              </label>
              <label style={{ gridColumn:'1 / -1' }}><span>Notes (confirmation, adresse…)</span>
                <input className="text-input" placeholder="ex : Réf booking AB123" value={hotelForm.notes}
                  onChange={e => setHotelForm(f=>({...f,notes:e.target.value}))} />
              </label>
              <label style={{ gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" checked={hotelForm.paye} onChange={e => setHotelForm(f=>({...f,paye:e.target.checked}))}
                  style={{ width:18, height:18, cursor:'pointer' }} />
                <span style={{ fontWeight:700, color:'#27ae60' }}>✅ Paiement déjà effectué</span>
              </label>
            </div>
            <button className="primary-action" style={{ background:'#8e44ad' }} onClick={addHotel}>
              <PlusCircle size={17} /> Enregistrer l'hébergement
            </button>
          </div>
        )}

        {/* Liste hôtels */}
        <div className="panel card-panel">
          <SectionTitle title={`Hébergements (${hotels.length})`} />
          {hotels.length === 0 && <p className="soft">Aucun hébergement enregistré.</p>}
          {VILLES.filter(v => hotels.some(h => h.ville === v)).map(ville => (
            <div key={ville} style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, color:'#0b1f3a', fontSize:'0.85rem', marginBottom:8, paddingBottom:4, borderBottom:'2px solid #f0e0f5' }}>
                📍 {ville}
              </div>
              {hotels.filter(h => h.ville === ville).map(hotel => (
                <div key={hotel.id} style={{ border:`2px solid ${hotel.paye?'#27ae60':'#e67e22'}`, borderRadius:12,
                  padding:'10px 12px', marginBottom:8, background: hotel.paye?'#f0fff4':'#fffbf0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:'0.92rem', color:'#0b1f3a' }}>🏨 {hotel.nom}</div>
                      {hotel.dates && <div style={{ fontSize:'0.78rem', color:'#666', marginTop:2 }}>📅 {hotel.dates}</div>}
                      {hotel.notes && <div style={{ fontSize:'0.75rem', color:'#888', marginTop:2 }}>📝 {hotel.notes}</div>}
                      <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontWeight:800, color:'#8e44ad', fontSize:'1rem' }}>{Number(hotel.montant_eur).toFixed(0)} €</span>
                        {hotel.montant_local > 0 && (
                          <span style={{ fontSize:'0.75rem', color:'#888' }}>({hotel.montant_local.toLocaleString('fr-FR')} {hotel.devise})</span>
                        )}
                        <span style={{ background: hotel.paye?'#27ae60':'#e67e22', color:'#fff',
                          borderRadius:8, padding:'2px 8px', fontSize:'0.7rem', fontWeight:700 }}>
                          {hotel.paye ? '✅ Payé' : '⏳ À payer'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      <button onClick={() => toggleHotelPaid(hotel)}
                        style={{ background: hotel.paye?'#e67e22':'#27ae60', color:'#fff', border:'none', borderRadius:8,
                          padding:'5px 8px', cursor:'pointer', fontSize:'0.7rem', fontWeight:700, whiteSpace:'nowrap' }}>
                        {hotel.paye ? '↩ Impayé' : '✓ Payé'}
                      </button>
                      <button onClick={() => removeHotel(hotel.id)}
                        style={{ background:'transparent', border:'1px solid #ddd', borderRadius:8,
                          padding:'5px 8px', cursor:'pointer', color:'#e74c3c' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>)}

      {/* ══════════════════════════════════ */}
      {/* ── ONGLET ENVELOPPES ── */}
      {/* ══════════════════════════════════ */}
      {activeTab === 'enveloppes' && (<>
        <div className="panel card-panel">
          <SectionTitle title="Enveloppes par catégorie" />
          <p className="soft" style={{ marginBottom:'0.8rem' }}>Modifie les montants. Les dépenses s'imputent automatiquement.</p>
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
                {env === 'Hébergement' && (
                  <div style={{ marginTop:6, fontSize:'0.72rem', color:'#888', borderTop:'1px solid #f0e0f5', paddingTop:4 }}>
                    dont {hotelPaid.toFixed(0)} € payés / {hotelPending.toFixed(0)} € à payer sur {hotelTotal.toFixed(0)} € d'hôtels
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Réglages taux */}
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
      </>)}

    </motion.div>
  )
}


// ════════════════════════════════════════════════════
//  DONNÉES EXPLORER
// ════════════════════════════════════════════════════
const RESTAURANTS_DB = [

  // ════════ OSAKA ════════
  // PDJ
  { id:'os-pdj1', city:'Osaka', zone:'Shinsaibashi', meal:'🌅 PDJ', name:'Eggs n Things', type:'Café PDJ', dish:'Pancakes & œufs brunchstyle', price:'¥1200', rating:4.5, budget:'💰', tag:'eggsnthings', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d2228699-Reviews-Eggs_n_Things-Osaka.html', instagram:'https://www.instagram.com/explore/tags/eggsnthings/' },
  { id:'os-pdj2', city:'Osaka', zone:'Namba', meal:'🌅 PDJ', name:'Weekenders Coffee', type:'Café PDJ', dish:'Flat white & toast beurre', price:'¥600', rating:4.6, budget:'💰', tag:'weekenderscoffee', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d6543210-Reviews-Weekenders_Coffee-Osaka.html', instagram:'https://www.instagram.com/weekenderscoffee/' },
  { id:'os-pdj3', city:'Osaka', zone:'Umeda', meal:'🌅 PDJ', name:'Gram Café & Pancakes', type:'Pancakes fluffy', dish:'Premium pancakes soufflés 3x/jour', price:'¥750', rating:4.9, budget:'💰', tag:'grampancake', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d5678901-Reviews-Gram-Osaka.html', instagram:'https://www.instagram.com/explore/tags/grampancake/' },
  { id:'os-pdj4', city:'Osaka', zone:'Namba', meal:'🌅 PDJ', name:'Yamatoya', type:'Café PDJ', dish:'Tamago sando & café', price:'¥400', rating:4.4, budget:'💰', tag:'osakacafe', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d8765432-Reviews-Yamatoya-Osaka.html', instagram:'https://www.instagram.com/explore/tags/osakacafe/' },
  // Déjeuner
  { id:'os-dej1', city:'Osaka', zone:'Dotonbori', meal:'☀️ Déjeuner', name:'Kani Doraku', type:'Fruits de mer', dish:'Crabe géant, kaiseki marin', price:'¥3500', rating:4.7, budget:'💰💰', tag:'kanidoraku', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234562-Reviews-Kani_Doraku-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kanidoraku/' },
  { id:'os-dej2', city:'Osaka', zone:'Namba', meal:'☀️ Déjeuner', name:'Sushi Tetsu Namba', type:'Sushi', dish:'Kaiten sushi frais Osaka Bay', price:'¥180/pièce', rating:4.6, budget:'💰', tag:'sushitetsu', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d3456783-Reviews-Sushi_Tetsu-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kaitensushi/' },
  { id:'os-dej3', city:'Osaka', zone:'Shinsekai', meal:'☀️ Déjeuner', name:'Daruma Kushikatsu', type:'Kushikatsu', dish:'Brochettes panées sauce maison', price:'¥1200', rating:4.8, budget:'💰', tag:'darumakushikatsu', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1357924-Reviews-Daruma-Osaka.html', instagram:'https://www.instagram.com/explore/tags/darumakushikatsu/' },
  { id:'os-dej4', city:'Osaka', zone:'Umeda', meal:'☀️ Déjeuner', name:'Ichibirikiya', type:'Okonomiyaki', dish:'Okonomiyaki au comptoir', price:'¥950', rating:4.5, budget:'💰', tag:'okonomiyakiosaka', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d2468135-Reviews-Ichibirikiya-Osaka.html', instagram:'https://www.instagram.com/explore/tags/okonomiyakiosaka/' },
  { id:'os-dej5', city:'Osaka', zone:'Namba', meal:'☀️ Déjeuner', name:'Yakiniku Like', type:'Yakiniku', dish:'Yakiniku solo abordable', price:'¥1300', rating:4.4, budget:'💰', tag:'yakinikuosaka', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d9135790-Reviews-Yakiniku_Like-Osaka.html', instagram:'https://www.instagram.com/explore/tags/yakiniku/' },
  // Snacking
  { id:'os-snk1', city:'Osaka', zone:'Dotonbori', meal:'🍡 Snacking', name:'Kukuru Takoyaki', type:'Street food', dish:'Takoyaki XL croustillant', price:'¥600', rating:4.8, budget:'💰', tag:'kukurutakoyaki', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d8901234-Reviews-Kukuru-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kukurutakoyaki/' },
  { id:'os-snk2', city:'Osaka', zone:'Dotonbori', meal:'🍡 Snacking', name:'Creo-ru', type:'Street food', dish:'Takoyaki fromage fondant', price:'¥550', rating:4.6, budget:'💰', tag:'creoru', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d9012345-Reviews-Creo_ru-Osaka.html', instagram:'https://www.instagram.com/explore/tags/creoru/' },
  { id:'os-snk3', city:'Osaka', zone:'Namba', meal:'🍡 Snacking', name:'Rikuro Ojisan', type:'Desserts', dish:'Fromage cake soufflé sortant du four', price:'¥965', rating:4.8, budget:'💰', tag:'rikuroojisan', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d3456782-Reviews-Rikuro_Ojisan-Osaka.html', instagram:'https://www.instagram.com/explore/tags/rikuroojisan/' },
  { id:'os-snk4', city:'Osaka', zone:'Shinsaibashi', meal:'🍡 Snacking', name:'Pablo Cheese Tart', type:'Desserts', dish:'Tarte au fromage mi-cuite', price:'¥380', rating:4.5, budget:'💰', tag:'pablocheese', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d7654321-Reviews-Pablo-Osaka.html', instagram:'https://www.instagram.com/explore/tags/pablocheese/' },
  { id:'os-snk5', city:'Osaka', zone:'Kuromon', meal:'🍡 Snacking', name:'Kuromon Ichiba', type:'Street food', dish:'Brochettes, fruits de mer frais', price:'¥200-600', rating:4.7, budget:'💰', tag:'kuromon', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1357925-Reviews-Kuromon_Market-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kuromon/' },
  // Dîner
  { id:'os-din1', city:'Osaka', zone:'Dotonbori', meal:'🌙 Dîner', name:'Kinryu Ramen 24h', type:'Ramen', dish:'Ramen Dotonbori, ouvert la nuit', price:'¥700', rating:4.5, budget:'💰', tag:'kinryuramen', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234561-Reviews-Kinryu_Ramen-Osaka.html', instagram:'https://www.instagram.com/explore/tags/kinryuramen/' },
  { id:'os-din2', city:'Osaka', zone:'Namba', meal:'🌙 Dîner', name:'Dotonbori Imai', type:'Udon/Soba', dish:'Kitsune udon historique', price:'¥850', rating:4.6, budget:'💰', tag:'imaiosaka', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234563-Reviews-Imai-Osaka.html', instagram:'https://www.instagram.com/explore/tags/dotonborifood/' },
  { id:'os-din3', city:'Osaka', zone:'Umeda', meal:'🌙 Dîner', name:'Mizuno Okonomiyaki', type:'Okonomiyaki', dish:'Okonomiyaki Osaka style depuis 1945', price:'¥1100', rating:4.9, budget:'💰', tag:'mizunookonomiyaki', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234564-Reviews-Mizuno-Osaka.html', instagram:'https://www.instagram.com/explore/tags/mizunookonomiyaki/' },
  { id:'os-din4', city:'Osaka', zone:'Fukushima', meal:'🌙 Dîner', name:'Gyukatsu Motomura', type:'Gyukatsu', dish:'Bœuf pané rare à griller soi-même', price:'¥1590', rating:4.7, budget:'💰', tag:'gyukatsu', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d9876543-Reviews-Gyukatsu_Motomura-Osaka.html', instagram:'https://www.instagram.com/explore/tags/gyukatsu/' },
  { id:'os-din5', city:'Osaka', zone:'Namba', meal:'🌙 Dîner', name:'Ippudo Ramen Namba', type:'Ramen', dish:'Shiromaru motoaji tonkotsu', price:'¥890', rating:4.7, budget:'💰', tag:'ippudo', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298566-d1234565-Reviews-Ippudo-Osaka.html', instagram:'https://www.instagram.com/ippudo_global/' },

  // ════════ KYOTO ════════
  { id:'ky-pdj1', city:'Kyoto', zone:'Gion', meal:'🌅 PDJ', name:'% Arabica Higashiyama', type:'Café PDJ', dish:'Single origin latte & croissant', price:'¥750', rating:4.9, budget:'💰', tag:'arabicakyoto', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d4567892-Reviews-Arabica-Kyoto.html', instagram:'https://www.instagram.com/arabicakyoto/' },
  { id:'ky-pdj2', city:'Kyoto', zone:'Kawaramachi', meal:'🌅 PDJ', name:'Inoda Coffee', type:'Café PDJ', dish:'Café viennois & sandwich katsu', price:'¥900', rating:4.6, budget:'💰', tag:'inodacoffee', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234580-Reviews-Inoda_Coffee-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/inodacoffee/' },
  { id:'ky-pdj3', city:'Kyoto', zone:'Arashiyama', meal:'🌅 PDJ', name:'Café Arashiyama', type:'Café PDJ', dish:'Matcha latte vue rivière', price:'¥650', rating:4.5, budget:'💰', tag:'arashiyamacafe', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d7890125-Reviews-Cafe_Arashiyama-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/arashiyamacafe/' },
  { id:'ky-dej1', city:'Kyoto', zone:'Nishiki', meal:'☀️ Déjeuner', name:'Nishiki Market', type:'Street food', dish:'Tofu, tamago, sardines, brochettes', price:'¥200-600', rating:4.7, budget:'💰', tag:'nishikimarket', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234570-Reviews-Nishiki_Market-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/nishikimarket/' },
  { id:'ky-dej2', city:'Kyoto', meal:'☀️ Déjeuner', zone:'Fushimi', name:'Sushi no Musashi', type:'Sushi', dish:'Kaiten sushi frais Kyoto', price:'¥130/pièce', rating:4.5, budget:'💰', tag:'sushimusashi', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234581-Reviews-Sushi_Musashi-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/sushikyoto/' },
  { id:'ky-dej3', city:'Kyoto', zone:'Pontocho', meal:'☀️ Déjeuner', name:'Pontocho Alley', type:'Cuisine japonaise', dish:'Kaiseki lunch abordable en terrasse', price:'¥1500', rating:4.8, budget:'💰💰', tag:'pontocho', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234582-Reviews-Pontocho-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/pontocho/' },
  { id:'ky-dej4', city:'Kyoto', zone:'Higashiyama', meal:'☀️ Déjeuner', name:'Ramen Sen no Kaze', type:'Ramen', dish:'Shoyu clair style Kyoto', price:'¥850', rating:4.6, budget:'💰', tag:'ramenyakyoto', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d2345672-Reviews-Sen_no_Kaze-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/ramenyakyoto/' },
  { id:'ky-snk1', city:'Kyoto', zone:'Gion', meal:'🍡 Snacking', name:'Gion Tsujiri', type:'Desserts', dish:'Parfait matcha glacé', price:'¥1100', rating:4.8, budget:'💰', tag:'giontsujiri', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234583-Reviews-Gion_Tsujiri-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/giontsujiri/' },
  { id:'ky-snk2', city:'Kyoto', zone:'Sannenzaka', meal:'🍡 Snacking', name:'Yatsuhashi Honke', type:'Desserts', dish:'Yatsuhashi frais à la cannelle', price:'¥200', rating:4.6, budget:'💰', tag:'yatsuhashi', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234584-Reviews-Yatsuhashi-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/yatsuhashi/' },
  { id:'ky-snk3', city:'Kyoto', zone:'Arashiyama', meal:'🍡 Snacking', name:'Nakatanidou Kyoto', type:'Desserts', dish:'Mochi frappé spectacle', price:'¥400', rating:4.9, budget:'💰', tag:'nakatanidou', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234585-Reviews-Nakatanidou-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/nakatanidou/' },
  { id:'ky-din1', city:'Kyoto', zone:'Kawaramachi', meal:'🌙 Dîner', name:'Gyoza ChaoChao', type:'Gyoza', dish:'Gyoza croustillant fond violet', price:'¥580', rating:4.7, budget:'💰', tag:'chaochaogyoza', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d9134567-Reviews-Chaochao-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/chaochao/' },
  { id:'ky-din2', city:'Kyoto', zone:'Gion', meal:'🌙 Dîner', name:'Gion Nanba', type:'Izakaya', dish:'Izakaya traditionnel sake & yakitori', price:'¥2000', rating:4.6, budget:'💰💰', tag:'izakayakyoto', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234586-Reviews-Gion_Nanba-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/izakayakyoto/' },
  { id:'ky-din3', city:'Kyoto', zone:'Higashiyama', meal:'🌙 Dîner', name:'Ippodo Tea Dinner', type:'Cuisine japonaise', dish:'Bento kaiseki avec thé matcha', price:'¥3200', rating:4.8, budget:'💰💰', tag:'ippodotea', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298564-d1234587-Reviews-Ippodo-Kyoto.html', instagram:'https://www.instagram.com/explore/tags/kyotodinner/' },

  // ════════ NARA ════════
  { id:'na-pdj1', city:'Nara', zone:'Centre', meal:'🌅 PDJ', name:'Nakatanidou', type:'Desserts', dish:'Mochi frappé spectacle live', price:'¥400', rating:4.9, budget:'💰', tag:'nakatanidou', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298198-d1234571-Reviews-Nakatanidou-Nara.html', instagram:'https://www.instagram.com/explore/tags/nakatanidou/' },
  { id:'na-pdj2', city:'Nara', zone:'Centre', meal:'🌅 PDJ', name:'Cafe Wakakusa', type:'Café PDJ', dish:'Café matcha & toast fromage', price:'¥700', rating:4.4, budget:'💰', tag:'naracafe', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298198-d4567891-Reviews-Cafe_Wakakusa-Nara.html', instagram:'https://www.instagram.com/explore/tags/naracafe/' },
  { id:'na-dej1', city:'Nara', zone:'Parc', meal:'☀️ Déjeuner', name:'Kasugano', type:'Cuisine japonaise', dish:'Kakinoha sushi feuille de kaki', price:'¥1200', rating:4.7, budget:'💰', tag:'kakinohasushi', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g298198-d1234590-Reviews-Kasugano-Nara.html', instagram:'https://www.instagram.com/explore/tags/kakinohasushi/' },
  { id:'na-snk1', city:'Nara', zone:'Higashimuki', meal:'🍡 Snacking', name:'Edakichi', type:'Street food', dish:'Senbei crackers pour les daims', price:'¥150', rating:4.5, budget:'💰', tag:'narasenbei', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g298198-d2345690-Reviews-Nara_Park-Nara.html', instagram:'https://www.instagram.com/explore/tags/narasenbei/' },

  // ════════ SÉOUL ════════
  { id:'se-pdj1', city:'Séoul', zone:'Gangnam', meal:'🌅 PDJ', name:'Onion Bakery Gangnam', type:'Café PDJ', dish:'Croissant beurre + latte', price:'₩8000', rating:4.8, budget:'💰', tag:'onionbakery', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d12345678-Reviews-Onion_Bakery-Seoul.html', instagram:'https://www.instagram.com/explore/tags/onionbakery/' },
  { id:'se-pdj2', city:'Séoul', zone:'Seongsu', meal:'🌅 PDJ', name:'Cafe Bora', type:'Café PDJ', dish:'Latte violet aux graines de sésame', price:'₩7000', rating:4.7, budget:'💰', tag:'cafebora', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d13456789-Reviews-Cafe_Bora-Seoul.html', instagram:'https://www.instagram.com/explore/tags/cafebora/' },
  { id:'se-pdj3', city:'Séoul', zone:'Hongdae', meal:'🌅 PDJ', name:'Isaac Toast', type:'Café PDJ', dish:'Toast coréen chaud & œuf', price:'₩4500', rating:4.5, budget:'💰', tag:'isaactoast', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d2345671-Reviews-Isaac_Toast-Seoul.html', instagram:'https://www.instagram.com/explore/tags/isaactoast/' },
  { id:'se-pdj4', city:'Séoul', zone:'Insadong', meal:'🌅 PDJ', name:'Bukchon Teahouse', type:'Café PDJ', dish:'Thé de riz & gâteau de riz', price:'₩6000', rating:4.6, budget:'💰', tag:'bukchontea', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d3456782-Reviews-Teahouse-Seoul.html', instagram:'https://www.instagram.com/explore/tags/koreateahouse/' },
  { id:'se-dej1', city:'Séoul', zone:'Myeongdong', meal:'☀️ Déjeuner', name:'Myeongdong Kyoja', type:'Cuisine coréenne', dish:'Kalguksu & mandu maison', price:'₩9000', rating:4.8, budget:'💰', tag:'myeongdongkyoja', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d1234572-Reviews-Myeongdong_Kyoja-Seoul.html', instagram:'https://www.instagram.com/explore/tags/myeongdongkyoja/' },
  { id:'se-dej2', city:'Séoul', zone:'Insadong', meal:'☀️ Déjeuner', name:'Tosokchon Samgyetang', type:'Cuisine coréenne', dish:'Poulet au ginseng entier', price:'₩17000', rating:4.9, budget:'💰💰', tag:'tosokchon', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d1234573-Reviews-Tosokchon-Seoul.html', instagram:'https://www.instagram.com/explore/tags/tosokchon/' },
  { id:'se-dej3', city:'Séoul', zone:'Gwangjang', meal:'☀️ Déjeuner', name:'Gwangjang Market', type:'Street food', dish:'Bindaetteok & mayak gimbap', price:'₩3000-8000', rating:4.8, budget:'💰', tag:'gwangjangmarket', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456781-Reviews-Gwangjang_Market-Seoul.html', instagram:'https://www.instagram.com/explore/tags/gwangjangmarket/' },
  { id:'se-dej4', city:'Séoul', zone:'Hongdae', meal:'☀️ Déjeuner', name:'Burger B', type:'Burger', dish:'Smash burger coréen trendy', price:'₩12000', rating:4.6, budget:'💰', tag:'burgerseoul', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d14567890-Reviews-Burger_B-Seoul.html', instagram:'https://www.instagram.com/explore/tags/seoulburger/' },
  { id:'se-dej5', city:'Séoul', zone:'Seongsu', meal:'☀️ Déjeuner', name:'Seongsu Vinyl', type:'Café PDJ', dish:'Brunch trendy quartier hipster', price:'₩14000', rating:4.7, budget:'💰💰', tag:'seongsuseoul', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d15678901-Reviews-Seongsu-Seoul.html', instagram:'https://www.instagram.com/explore/tags/seongsuseoul/' },
  { id:'se-snk1', city:'Séoul', zone:'Myeongdong', meal:'🍡 Snacking', name:'Myeongdong Street Food', type:'Street food', dish:'Tteokbokki, odeng, hotteok', price:'₩2000-5000', rating:4.6, budget:'💰', tag:'myeongdongstreetfood', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g294197-d2345680-Reviews-Myeongdong-Seoul.html', instagram:'https://www.instagram.com/explore/tags/myeongdongstreetfood/' },
  { id:'se-snk2', city:'Séoul', zone:'Hongdae', meal:'🍡 Snacking', name:'Bingsu Cafe', type:'Desserts', dish:'Bingsu glace pilée patbingsu', price:'₩9000', rating:4.7, budget:'💰', tag:'bingsu', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d16789012-Reviews-Bingsu-Seoul.html', instagram:'https://www.instagram.com/explore/tags/bingsu/' },
  { id:'se-snk3', city:'Séoul', zone:'Insadong', meal:'🍡 Snacking', name:'Ssamziegil Food Court', type:'Street food', dish:'Gyeranppang pain œuf, waffles', price:'₩3000', rating:4.5, budget:'💰', tag:'insadongfood', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234590-Reviews-Ssamziegil-Seoul.html', instagram:'https://www.instagram.com/explore/tags/insadongfood/' },
  { id:'se-snk4', city:'Séoul', zone:'Gangnam', meal:'🍡 Snacking', name:'Sulbing', type:'Desserts', dish:'Bingsu premium aux fruits rouges', price:'₩10000', rating:4.6, budget:'💰', tag:'sulbing', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d17890123-Reviews-Sulbing-Seoul.html', instagram:'https://www.instagram.com/sulbing_official/' },
  { id:'se-din1', city:'Séoul', zone:'Mapo', meal:'🌙 Dîner', name:'Maple Tree House', type:'BBQ coréen', dish:'Wagyu galbi premium', price:'₩35000/pers', rating:4.8, budget:'💰💰', tag:'mapletreehouse', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d1234568-Reviews-Maple_Tree_House-Seoul.html', instagram:'https://www.instagram.com/explore/tags/mapletreehouse/' },
  { id:'se-din2', city:'Séoul', zone:'Hongdae', meal:'🌙 Dîner', name:'Wangbijib BBQ', type:'BBQ coréen', dish:'Galbi marinés 20 ans institution', price:'₩25000/pers', rating:4.7, budget:'💰💰', tag:'wangbijib', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d2345679-Reviews-Wangbijib-Seoul.html', instagram:'https://www.instagram.com/explore/tags/wangbijib/' },
  { id:'se-din3', city:'Séoul', zone:'Itaewon', meal:'🌙 Dîner', name:'Linus BBQ', type:'BBQ coréen', dish:'Samgyeopsal & makgeolli', price:'₩18000/pers', rating:4.5, budget:'💰', tag:'linusbbq', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d18901234-Reviews-Linus_BBQ-Seoul.html', instagram:'https://www.instagram.com/explore/tags/samgyeopsal/' },
  { id:'se-din4', city:'Séoul', zone:'Gangnam', meal:'🌙 Dîner', name:'KFC Korea Original', type:'Burger', dish:'Korean Fried Chicken croustillant', price:'₩15000', rating:4.5, budget:'💰', tag:'koreanfriedchicken', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d19012345-Reviews-KFC-Seoul.html', instagram:'https://www.instagram.com/explore/tags/koreanfriedchicken/' },
  { id:'se-din5', city:'Séoul', zone:'Sinchon', meal:'🌙 Dîner', name:'Oppadak', type:'Burger', dish:'Poulet frit au miel + fromage', price:'₩13000', rating:4.7, budget:'💰', tag:'oppadak', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d20123456-Reviews-Oppadak-Seoul.html', instagram:'https://www.instagram.com/explore/tags/oppadak/' },
  { id:'se-din6', city:'Séoul', zone:'Myeongdong', meal:'🌙 Dîner', name:'Jeju Abalone', type:'Fruits de mer', dish:'Abalone grill & bibimbap abalone', price:'₩28000', rating:4.8, budget:'💰💰', tag:'jeju', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g294197-d21234567-Reviews-Jeju_Abalone-Seoul.html', instagram:'https://www.instagram.com/explore/tags/abaloneseoul/' },

  // ════════ BUSAN ════════
  { id:'bu-pdj1', city:'Busan', zone:'Haeundae', meal:'🌅 PDJ', name:'Cafe Namusairo', type:'Café PDJ', dish:'Latte bois flottant vue mer', price:'₩7000', rating:4.7, budget:'💰', tag:'busancafe', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d22345678-Reviews-Namusairo-Busan.html', instagram:'https://www.instagram.com/explore/tags/busancafe/' },
  { id:'bu-pdj2', city:'Busan', zone:'Gwangalli', meal:'🌅 PDJ', name:'Momos Coffee', type:'Café PDJ', dish:'Flat white & gâteau de riz', price:'₩6500', rating:4.6, budget:'💰', tag:'momoscoffee', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d23456789-Reviews-Momos-Busan.html', instagram:'https://www.instagram.com/explore/tags/gwangallicafe/' },
  { id:'bu-dej1', city:'Busan', zone:'Nampo', meal:'☀️ Déjeuner', name:'Jagalchi Market', type:'Fruits de mer', dish:'Hoe poisson cru coréen ultra frais', price:'₩15000', rating:4.7, budget:'💰💰', tag:'jagalchi', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g297884-d2345682-Reviews-Jagalchi_Market-Busan.html', instagram:'https://www.instagram.com/explore/tags/jagalchi/' },
  { id:'bu-dej2', city:'Busan', zone:'Haeundae', meal:'☀️ Déjeuner', name:'Haeundae Amso Gobchang', type:'Cuisine coréenne', dish:'Abats grillés style Busan', price:'₩20000', rating:4.5, budget:'💰💰', tag:'haeundaefood', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d24567890-Reviews-Haeundae_Gobchang-Busan.html', instagram:'https://www.instagram.com/explore/tags/busanfood/' },
  { id:'bu-dej3', city:'Busan', zone:'Seomyeon', meal:'☀️ Déjeuner', name:'Noodle House Busan', type:'Ramen', dish:'Milmyeon nouilles froides Busan', price:'₩8000', rating:4.6, budget:'💰', tag:'busannoodle', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d25678901-Reviews-Noodle-Busan.html', instagram:'https://www.instagram.com/explore/tags/milmyeon/' },
  { id:'bu-snk1', city:'Busan', zone:'BIFF Square', meal:'🍡 Snacking', name:'BIFF Square Food', type:'Street food', dish:'Ssiat hotteok crêpe aux graines', price:'₩1500', rating:4.8, budget:'💰', tag:'biffsquare', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234583-Reviews-BIFF_Square-Busan.html', instagram:'https://www.instagram.com/explore/tags/biffsquare/' },
  { id:'bu-snk2', city:'Busan', zone:'Gukje Market', meal:'🍡 Snacking', name:'Gukje Market', type:'Street food', dish:'Bibim dangmyeon & sundae', price:'₩3000-6000', rating:4.6, budget:'💰', tag:'gukjemarket', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234584-Reviews-Gukje-Busan.html', instagram:'https://www.instagram.com/explore/tags/gukjemarket/' },
  { id:'bu-din1', city:'Busan', zone:'Haeundae', meal:'🌙 Dîner', name:'The Bay 101', type:'Fusion', dish:'Vue panoramique mer, cocktails & food', price:'₩30000', rating:4.6, budget:'💰💰', tag:'thebay101', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d3456780-Reviews-Galmegi-Busan.html', instagram:'https://www.instagram.com/thebay101/' },
  { id:'bu-din2', city:'Busan', zone:'Gwangalli', meal:'🌙 Dîner', name:'Galmegi Brewing', type:'BBQ coréen', dish:'BBQ + craft beer vue pont', price:'₩20000/pers', rating:4.5, budget:'💰', tag:'galmegibrewing', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d26789012-Reviews-Galmegi-Busan.html', instagram:'https://www.instagram.com/galmegibrewing/' },
  { id:'bu-din3', city:'Busan', zone:'Nampo', meal:'🌙 Dîner', name:'Choryang Milmyeon', type:'Cuisine coréenne', dish:'Bœuf braisé & nouilles froides', price:'₩10000', rating:4.7, budget:'💰', tag:'choryang', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g297884-d27890123-Reviews-Choryang-Busan.html', instagram:'https://www.instagram.com/explore/tags/busanmilmyeon/' },

  // ════════ TOKYO ════════
  { id:'tk-pdj1', city:'Tokyo', zone:'Shibuya', meal:'🌅 PDJ', name:'Bread, Espresso &', type:'Café PDJ', dish:'Pain de mie fondu & cappuccino', price:'¥800', rating:4.7, budget:'💰', tag:'breadespresso', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d2345682-Reviews-Bread_Espresso-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/breadespresso/' },
  { id:'tk-pdj2', city:'Tokyo', zone:'Harajuku', meal:'🌅 PDJ', name:"Flipper's", type:'Pancakes fluffy', dish:'Soufflé miracle pancake viral', price:'¥1200', rating:4.8, budget:'💰', tag:'flipperspancake', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d6789012-Reviews-Flippers-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/flipperspancake/' },
  { id:'tk-pdj3', city:'Tokyo', zone:'Aoyama', meal:'🌅 PDJ', name:'A Happy Pancake', type:'Pancakes fluffy', dish:'Souffle pancake 3cm épaisseur', price:'¥1100', rating:4.7, budget:'💰', tag:'ahappypancake', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d7890123-Reviews-A_Happy_Pancake-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/ahappypancake/' },
  { id:'tk-pdj4', city:'Tokyo', zone:'Shimokitazawa', meal:'🌅 PDJ', name:'Bear Pond Espresso', type:'Café PDJ', dish:'Espresso angel stain ultime', price:'¥700', rating:4.8, budget:'💰', tag:'bearpondespresso', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d2345683-Reviews-Bear_Pond-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/bearpondespresso/' },
  { id:'tk-dej1', city:'Tokyo', zone:'Tsukiji', meal:'☀️ Déjeuner', name:'Sushi Dai Tsukiji', type:'Sushi', dish:'Omakase 10 pièces, file 2h', price:'¥4000', rating:4.9, budget:'💰💰', tag:'sushidai', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234567-Reviews-Sushi_Dai-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/sushidai/' },
  { id:'tk-dej2', city:'Tokyo', zone:'Shibuya', meal:'☀️ Déjeuner', name:'Uobei Sushi', type:'Sushi', dish:'Sushi livré par rail, tablette', price:'¥110/pièce', rating:4.3, budget:'💰', tag:'uobei', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d4567890-Reviews-Uobei_Sushi-Shibuya.html', instagram:'https://www.instagram.com/explore/tags/uobei/' },
  { id:'tk-dej3', city:'Tokyo', zone:'Shinjuku', meal:'☀️ Déjeuner', name:'Fuunji Tsukemen', type:'Ramen', dish:'Tsukemen signature file 30min', price:'¥950', rating:4.8, budget:'💰', tag:'fuunji', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d1838622-Reviews-Fuunji-Shinjuku.html', instagram:'https://www.instagram.com/explore/tags/fuunji/' },
  { id:'tk-dej4', city:'Tokyo', zone:'Asakusa', meal:'☀️ Déjeuner', name:'Tempura Daikokuya', type:'Tempura', dish:'Tempura maison depuis 1887', price:'¥1500', rating:4.7, budget:'💰', tag:'daikokuya', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234588-Reviews-Daikokuya-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/tempuratokyo/' },
  { id:'tk-dej5', city:'Tokyo', zone:'Harajuku', meal:'☀️ Déjeuner', name:'Gyukatsu Motomura', type:'Gyukatsu', dish:'Bœuf pané grillé sur pierre', price:'¥1590', rating:4.7, budget:'💰', tag:'gyukatsu', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d9876543-Reviews-Gyukatsu_Motomura-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/gyukatsu/' },
  { id:'tk-snk1', city:'Tokyo', zone:'Asakusa', meal:'🍡 Snacking', name:'Kagetsudo Melon Pan', type:'Street food', dish:'Melon pan géant croustillant', price:'¥250', rating:4.7, budget:'💰', tag:'kagetsudo', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d2345681-Reviews-Kagetsudo-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/kagetsudo/' },
  { id:'tk-snk2', city:'Tokyo', zone:'Harajuku', meal:'🍡 Snacking', name:'Takeshita Crepes', type:'Street food', dish:'Crêpes colorées au lait coréen', price:'¥500', rating:4.4, budget:'💰', tag:'takeshitacrepe', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234589-Reviews-Takeshita-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/harajukucrepe/' },
  { id:'tk-snk3', city:'Tokyo', zone:'Shibuya', meal:'🍡 Snacking', name:'Totti Candy Factory', type:'Desserts', dish:'Barbe à papa arc-en-ciel géante', price:'¥800', rating:4.6, budget:'💰', tag:'totticandy', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d8765432-Reviews-Totti_Candy-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/totticandy/' },
  { id:'tk-snk4', city:'Tokyo', zone:'Ginza', meal:'🍡 Snacking', name:'Higashiya Ginza', type:'Desserts', dish:'Wagashi traditionnels premium', price:'¥600', rating:4.8, budget:'💰', tag:'higashiya', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d7654321-Reviews-Higashiya-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/higashiya/' },
  { id:'tk-din1', city:'Tokyo', zone:'Shinjuku', meal:'🌙 Dîner', name:'Ichiran Ramen', type:'Ramen', dish:'Tonkotsu cabine solo unique', price:'¥980', rating:4.7, budget:'💰', tag:'ichiranramen', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d7079898-Reviews-Ichiran_Ramen_Shinjuku.html', instagram:'https://www.instagram.com/ichiran_global/' },
  { id:'tk-din2', city:'Tokyo', zone:'Shibuya', meal:'🌙 Dîner', name:'Ippudo Ramen', type:'Ramen', dish:'Akamaru modern tonkotsu', price:'¥890', rating:4.7, budget:'💰', tag:'ippudo', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d2345684-Reviews-Ippudo-Tokyo.html', instagram:'https://www.instagram.com/ippudo_global/' },
  { id:'tk-din3', city:'Tokyo', zone:'Shinjuku', meal:'🌙 Dîner', name:'Omoide Yokocho', type:'Izakaya', dish:'Yakitori fumé ruelle magique', price:'¥2000', rating:4.6, budget:'💰', tag:'omoide', tripadvisor:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234591-Reviews-Omoide_Yokocho-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/omoide/' },
  { id:'tk-din4', city:'Tokyo', zone:'Ginza', meal:'🌙 Dîner', name:'Sukiyabashi Jiro', type:'Sushi', dish:'Sushi Michelin ★★★ légendaire', price:'¥30000+', rating:5.0, budget:'💰💰💰', tag:'jirosushi', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234592-Reviews-Sukiyabashi_Jiro-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/jirosushi/' },
  { id:'tk-din5', city:'Tokyo', zone:'Akihabara', meal:'🌙 Dîner', name:'Kanda Matsuya Soba', type:'Udon/Soba', dish:'Soba maison depuis 1884', price:'¥900', rating:4.8, budget:'💰', tag:'kandamatsuya', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234593-Reviews-Kanda_Matsuya-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/tokyosoba/' },
  { id:'tk-din6', city:'Tokyo', zone:'Roppongi', meal:'🌙 Dîner', name:'Gonpachi Nishi-Azabu', type:'Izakaya', dish:'Izakaya Kill Bill, robata & soba', price:'¥3500', rating:4.5, budget:'💰💰', tag:'gonpachi', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066454-d1234594-Reviews-Gonpachi-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/gonpachi/' },
  { id:'tk-din7', city:'Tokyo', zone:'Shibuya', meal:'🌙 Dîner', name:'Shibuya Cheese Stand', type:'Fusion', dish:'Fromage frais japonais & vin', price:'¥2800', rating:4.6, budget:'💰💰', tag:'shibuyacheese', tripadvisor:'https://www.tripadvisor.fr/Restaurant_Review-g1066456-d7654322-Reviews-Cheese_Stand-Tokyo.html', instagram:'https://www.instagram.com/explore/tags/shibuyacheese/' },
  // ═══ 💸 BONS PLANS PAS CHERS — Du matin au soir ═══
  { id:'os-bp1', city:'Osaka', zone:'Partout', meal:'🌅 PDJ', name:'7-Eleven / Lawson Onigiri', type:'Café PDJ', dish:'2 onigiri + café = matin complet', price:'¥300', rating:4.3, budget:'💸', tag:'konbini', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/explore/tags/konbini/' },
  { id:'os-bp2', city:'Osaka', zone:'Namba', meal:'☀️ Déjeuner', name:'Sukiya Gyudon', type:'Cuisine japonaise', dish:'Gyudon bol bœuf ultra rapide', price:'¥400', rating:4.2, budget:'💸', tag:'sukiya', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/sukiya_official/' },
  { id:'os-bp3', city:'Osaka', zone:'Umeda', meal:'☀️ Déjeuner', name:'Matsuya Gyumeshi', type:'Cuisine japonaise', dish:'Curry + bœuf bol XL', price:'¥500', rating:4.1, budget:'💸', tag:'matsuya', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/matsuyafoods/' },
  { id:'os-bp4', city:'Osaka', zone:'Dotonbori', meal:'🍡 Snacking', name:'FamilyMart Karaage-kun', type:'Street food', dish:'Poulet pané chaud convenience store', price:'¥220', rating:4.4, budget:'💸', tag:'familymart', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/familymart/' },
  { id:'os-bp5', city:'Osaka', zone:'Namba', meal:'🌙 Dîner', name:'Ichiran Express Take-away', type:'Ramen', dish:'Ramen tonkotsu à emporter moins cher', price:'¥980', rating:4.5, budget:'💸', tag:'ichiran', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/ichiran_japan/' },
  { id:'os-bp6', city:'Osaka', zone:'Shinsekai', meal:'🌙 Dîner', name:'Tachinomi Bar', type:'Izakaya', dish:'Bar debout : bières + brochettes 100¥', price:'¥800', rating:4.6, budget:'💸', tag:'tachinomi', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14122455-Osaka_Osaka_Prefecture_Kinki.html', instagram:'https://www.instagram.com/explore/tags/tachinomi/' },

  { id:'ky-bp1', city:'Kyoto', zone:'Partout', meal:'🌅 PDJ', name:'Konbini PDJ Kyoto', type:'Café PDJ', dish:'Sandwich tamago + café — Lawson', price:'¥350', rating:4.3, budget:'💸', tag:'konbini', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298564-Kyoto_Kyoto_Prefecture_Kinki.html', instagram:'https://www.instagram.com/explore/tags/lawsonjp/' },
  { id:'ky-bp2', city:'Kyoto', zone:'Kyoto Station', meal:'☀️ Déjeuner', name:'Yoshinoya Gyudon', type:'Cuisine japonaise', dish:'Gyudon avec miso + œuf cru', price:'¥450', rating:4.2, budget:'💸', tag:'yoshinoya', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298564-Kyoto_Kyoto_Prefecture_Kinki.html', instagram:'https://www.instagram.com/yoshinoya_jp/' },
  { id:'ky-bp3', city:'Kyoto', zone:'Nishiki', meal:'🍡 Snacking', name:'Nishiki Croquette', type:'Street food', dish:'Korokke patate à 100¥', price:'¥100', rating:4.5, budget:'💸', tag:'korokke', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298564-Kyoto_Kyoto_Prefecture_Kinki.html', instagram:'https://www.instagram.com/explore/tags/korokke/' },
  { id:'ky-bp4', city:'Kyoto', zone:'Gion', meal:'🌙 Dîner', name:'Tenkaippin Ramen', type:'Ramen', dish:'Ramen kotteri épaisse pas cher', price:'¥850', rating:4.4, budget:'💸', tag:'tenkaippin', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298564-Kyoto_Kyoto_Prefecture_Kinki.html', instagram:'https://www.instagram.com/tenkaippin_official/' },

  { id:'tk-bp1', city:'Tokyo', zone:'Partout', meal:'🌅 PDJ', name:'Doutor Coffee Morning Set', type:'Café PDJ', dish:'Toast œuf + café petit prix', price:'¥420', rating:4.3, budget:'💸', tag:'doutor', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298184-Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/doutor_jp/' },
  { id:'tk-bp2', city:'Tokyo', zone:'Shibuya', meal:'☀️ Déjeuner', name:'Tendon Tenya', type:'Tempura', dish:'Donburi tempura crevette à 540¥', price:'¥540', rating:4.4, budget:'💸', tag:'tenya', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298184-Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/tenya_official/' },
  { id:'tk-bp3', city:'Tokyo', zone:'Shinjuku', meal:'☀️ Déjeuner', name:'CoCo Curry House', type:'Cuisine japonaise', dish:'Curry japonais 1 niveau pâte', price:'¥650', rating:4.3, budget:'💸', tag:'cocoichi', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g298184-Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/cocoichi.curryhouse/' },
  { id:'tk-bp4', city:'Tokyo', zone:'Asakusa', meal:'🍡 Snacking', name:'Taiyaki Sharaku', type:'Desserts', dish:'Taiyaki croustillant pâte azuki', price:'¥200', rating:4.6, budget:'💸', tag:'taiyaki', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14129574-Asakusa_Taito_Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/explore/tags/taiyaki/' },
  { id:'tk-bp5', city:'Tokyo', zone:'Shinjuku', meal:'🌙 Dîner', name:'Tenkaippin Shinjuku', type:'Ramen', dish:'Ramen tonkotsu épais ouvert tard', price:'¥850', rating:4.4, budget:'💸', tag:'tenkaippin', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14129610-Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/tenkaippin_official/' },
  { id:'tk-bp6', city:'Tokyo', zone:'Ueno', meal:'🌙 Dîner', name:'Ameyoko Street Bars', type:'Izakaya', dish:'Yakitori 100¥ + biere fraiche', price:'¥800', rating:4.5, budget:'💸', tag:'ameyoko', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g14132588-Ueno_Taito_Tokyo_Tokyo_Prefecture_Kanto.html', instagram:'https://www.instagram.com/explore/tags/ameyoko/' },

  { id:'se-bp1', city:'Séoul', zone:'Partout', meal:'🌅 PDJ', name:'GS25 / CU Gimbap', type:'Café PDJ', dish:'Gimbap matin + café 1500₩', price:'₩2500', rating:4.4, budget:'💸', tag:'gs25', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/gs25_official/' },
  { id:'se-bp2', city:'Séoul', zone:'Myeongdong', meal:'☀️ Déjeuner', name:'Kimbap Cheonguk', type:'Cuisine coréenne', dish:'Gimbap thon + ramen instantané', price:'₩4500', rating:4.3, budget:'💸', tag:'kimbap', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/explore/tags/kimbap/' },
  { id:'se-bp3', city:'Séoul', zone:'Hongdae', meal:'☀️ Déjeuner', name:'Sinjeon Tteokbokki', type:'Cuisine coréenne', dish:'Tteokbokki + sundae + frit', price:'₩6000', rating:4.5, budget:'💸', tag:'sinjeon', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/sinjeontteokbokki_official/' },
  { id:'se-bp4', city:'Séoul', zone:'Myeongdong', meal:'🍡 Snacking', name:'Tornado Potato Street', type:'Street food', dish:'Pomme de terre torsade + sauce', price:'₩3000', rating:4.4, budget:'💸', tag:'tornadopotato', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/explore/tags/tornadopotato/' },
  { id:'se-bp5', city:'Séoul', zone:'Gwangjang', meal:'🍡 Snacking', name:'Hotteok Stand', type:'Street food', dish:'Crêpe coréenne sucrée graines', price:'₩2000', rating:4.7, budget:'💸', tag:'hotteok', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/explore/tags/hotteok/' },
  { id:'se-bp6', city:'Séoul', zone:'Hongdae', meal:'🌙 Dîner', name:'Yoogane Dak Galbi Solo', type:'BBQ coréen', dish:'Dak galbi solo poulet épicé', price:'₩9000', rating:4.5, budget:'💸', tag:'yoogane', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/yoogane_official/' },
  { id:'se-bp7', city:'Séoul', zone:'Sinchon', meal:'🌙 Dîner', name:'Pojangmacha Street Tent', type:'Izakaya', dish:'Tente rue : soju + brochettes', price:'₩8000', rating:4.6, budget:'💸', tag:'pojangmacha', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g294197-Seoul.html', instagram:'https://www.instagram.com/explore/tags/pojangmacha/' },

  { id:'bu-bp1', city:'Busan', zone:'Partout', meal:'🌅 PDJ', name:'Paris Baguette PDJ', type:'Café PDJ', dish:'Brioche fourrée + café petit prix', price:'₩3500', rating:4.3, budget:'💸', tag:'parisbaguette', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/parisbaguette_official/' },
  { id:'bu-bp2', city:'Busan', zone:'Seomyeon', meal:'☀️ Déjeuner', name:'Kim Bap Heaven Busan', type:'Cuisine coréenne', dish:'Gimbap + ramen instantané', price:'₩5000', rating:4.4, budget:'💸', tag:'kimbapheaven', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/kimbap/' },
  { id:'bu-bp3', city:'Busan', zone:'Nampo', meal:'☀️ Déjeuner', name:'Dwaeji Gukbap Street', type:'Cuisine coréenne', dish:'Soupe porc Busan signature 7000₩', price:'₩7000', rating:4.7, budget:'💸', tag:'dwaejigukbap', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/dwaejigukbap/' },
  { id:'bu-bp4', city:'Busan', zone:'BIFF Square', meal:'🍡 Snacking', name:'Ssiat Hotteok BIFF', type:'Street food', dish:'Hotteok aux graines Busan style', price:'₩1500', rating:4.8, budget:'💸', tag:'ssiathotteok', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/ssiathotteok/' },
  { id:'bu-bp5', city:'Busan', zone:'Gukje', meal:'🍡 Snacking', name:'Eomuk Fish Cake', type:'Street food', dish:'Brochette pâte poisson + bouillon chaud', price:'₩2000', rating:4.6, budget:'💸', tag:'eomuk', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/busaneomuk/' },
  { id:'bu-bp6', city:'Busan', zone:'Haeundae', meal:'🌙 Dîner', name:'Haeundae Pojangmacha', type:'Izakaya', dish:'Tente plage : soju + fruits de mer', price:'₩10000', rating:4.5, budget:'💸', tag:'haeundaepocha', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/pojangmacha/' },
  { id:'bu-bp7', city:'Busan', zone:'Seomyeon', meal:'🌙 Dîner', name:'Seomyeon Galbi Alley', type:'BBQ coréen', dish:'BBQ rue prix mini, ambiance locale', price:'₩9000', rating:4.5, budget:'💸', tag:'seomyeongalbi', tripadvisor:'https://www.tripadvisor.fr/Restaurants-g297884-Busan.html', instagram:'https://www.instagram.com/explore/tags/seomyeon/' },
]

const MEAL_TIMES = ['🌅 PDJ', '☀️ Déjeuner', '🍡 Snacking', '🌙 Dîner']
const TYPES_FOOD = [...new Set(RESTAURANTS_DB.map(r => r.type))]
const CITIES_FOOD = [...new Set(RESTAURANTS_DB.map(r => r.city))]

const SPOTS_DB = [
  // ════ OSAKA ════
  { cat:'📸 Instagram', city:'Osaka', name:'Dotonbori Nuit', desc:'Néons, Glico Man, reflets sur la rivière Dotonbori', heure:'20h-23h', tag:'dotonbori', ig:'https://www.instagram.com/explore/tags/dotonbori/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234560-Reviews-Dotonbori-Osaka.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Osaka', name:'Glico Running Man', desc:"L'icône la plus photographiée du Japon, fond de néons", heure:'20h-23h', tag:'glicoman', ig:'https://www.instagram.com/explore/tags/glicoman/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234561-Reviews-Glico_Sign-Osaka.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Osaka', name:'Tsutenkaku Tower', desc:'Tour rétro des années 50, quartier Shinsekai coloré', heure:'10h-16h', tag:'tsutenkaku', ig:'https://www.instagram.com/tsutenkaku_official/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234562-Reviews-Tsutenkaku-Osaka.html', prix:'¥900' },
  { cat:'📸 Instagram', city:'Osaka', name:'Osaka Castle Golden Hour', desc:'Lumière dorée sur le château, fossé miroir', heure:'6h-9h', tag:'osakacastle', ig:'https://www.instagram.com/explore/tags/osakacastle/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234563-Reviews-Osaka_Castle-Osaka.html', prix:'¥600' },
  { cat:'🎪 Insolite', city:'Osaka', name:'Cat Café Calico Osaka', desc:'50+ chats en liberté, ambiance cosy et relaxante', heure:'11h-20h', tag:'catcafeosaka', ig:'https://www.instagram.com/explore/tags/catcafeosaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234580-Reviews-Calico_Cat_Cafe-Osaka.html', prix:'¥200/10min' },
  { cat:'🎪 Insolite', city:'Osaka', name:'teamLab Borderless Osaka', desc:'Art numérique immersif, forêt de lumières interactives', heure:'10h-19h', tag:'teamlab', ig:'https://www.instagram.com/explore/tags/teamlab/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d12345601-Reviews-teamLab-Osaka.html', prix:'¥3200' },
  { cat:'🎪 Insolite', city:'Osaka', name:'Hep Five Ferris Wheel', desc:'Grande roue rouge au centre commercial, vue sur Umeda', heure:'11h-23h', tag:'hepfive', ig:'https://www.instagram.com/explore/tags/hepfive/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234602-Reviews-Hep_Five-Osaka.html', prix:'¥600' },
  { cat:'🏛️ Atypique', city:'Osaka', name:'Namba Yasaka Shrine', desc:'Temple avec tête de lion géante, architecture unique', heure:'8h-17h', tag:'nambayasaka', ig:'https://www.instagram.com/explore/tags/nambayasaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234603-Reviews-Yasaka-Osaka.html', prix:'Gratuit' },
  { cat:'🏛️ Atypique', city:'Osaka', name:'Shinsekai Quarter', desc:'Quartier rétro des années 20, bistrots & nostalgie', heure:'11h-21h', tag:'shinsekai', ig:'https://www.instagram.com/explore/tags/shinsekai/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234604-Reviews-Shinsekai-Osaka.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Osaka', name:'Namba Bears Live House', desc:'Salle de rock underground culte de Namba', heure:'19h-24h', tag:'nambabears', ig:'https://www.instagram.com/explore/tags/osakamusic/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234605-Reviews-Namba_Bears-Osaka.html', prix:'¥2000-3500' },
  { cat:'🎵 Musical', city:'Osaka', name:'Amemura Triangle Park', desc:'Concerts de rue quotidiens, cœur de la jeunesse Osaka', heure:'14h-21h', tag:'americanmuraosaka', ig:'https://www.instagram.com/explore/tags/americanmura/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298566-d1234606-Reviews-Amemura-Osaka.html', prix:'Gratuit' },

  // ════ KYOTO ════
  { cat:'📸 Instagram', city:'Kyoto', name:'Fushimi Inari Torii', desc:'Tunnel de 10 000 torii rouges, lever du soleil magique', heure:'5h-8h', tag:'fushimiinari', ig:'https://www.instagram.com/explore/tags/fushimiinari/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234564-Reviews-Fushimi_Inari-Kyoto.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Kyoto', name:'Arashiyama Bambouseraie', desc:'Forêt de bambous géants, lumière filtrée tôt le matin', heure:'7h-9h', tag:'arashiyamabamboo', ig:'https://www.instagram.com/explore/tags/arashiyamabamboo/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234565-Reviews-Arashiyama_Bamboo-Kyoto.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Kyoto', name:'Kinkaku-ji Pavillon Or', desc:'Reflet parfait du temple doré sur le lac Kyoko-chi', heure:'9h-11h', tag:'kinkakuji', ig:'https://www.instagram.com/explore/tags/kinkakuji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234566-Reviews-Kinkakuji-Kyoto.html', prix:'¥500' },
  { cat:'📸 Instagram', city:'Kyoto', name:'Gion Shirakawa at Dusk', desc:'Canal, lanternes, saules — photo parfaite au coucher du soleil', heure:'17h-20h', tag:'gionshirakawa', ig:'https://www.instagram.com/explore/tags/gionshirakawa/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d2345670-Reviews-Gion-Kyoto.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Kyoto', name:'Sannenzaka & Ninenzaka', desc:'Ruelles pavées Meiji, maisons de thé et kimono', heure:'8h-11h', tag:'sannenzaka', ig:'https://www.instagram.com/explore/tags/sannenzaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d3456780-Reviews-Sannenzaka-Kyoto.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Kyoto', name:'Philosopher Path Sakura', desc:'Chemin du philosophe longeant le canal, cerisiers en fleurs', heure:'7h-10h', tag:'philosopherspath', ig:'https://www.instagram.com/explore/tags/philosopherspath/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234610-Reviews-Philosophers_Path-Kyoto.html', prix:'Gratuit' },
  { cat:'🎪 Insolite', city:'Kyoto', name:'Kimono Rental Yumeyakata', desc:'Louer un kimono traditionnel et se balader à Gion', heure:'9h-17h', tag:'kimonoryokan', ig:'https://www.instagram.com/explore/tags/kimonokyoto/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234582-Reviews-Yumeyakata-Kyoto.html', prix:'¥3000-6000' },
  { cat:'🎪 Insolite', city:'Kyoto', name:'Ceremony du Thé Urasenke', desc:'Cérémonie authentique dans école de thé historique', heure:'9h-12h', tag:'teaceremonykyoto', ig:'https://www.instagram.com/explore/tags/teaceremonykyoto/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d2345685-Reviews-Tea_Ceremony-Kyoto.html', prix:'¥3800' },
  { cat:'🎪 Insolite', city:'Kyoto', name:'Manga Museum Kyoto', desc:'20 000 volumes en libre accès, lecture sur pelouse', heure:'10h-18h', tag:'mangamuseum', ig:'https://www.instagram.com/explore/tags/kyotomangamuseum/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234611-Reviews-Manga_Museum-Kyoto.html', prix:'¥900' },
  { cat:'🏛️ Atypique', city:'Kyoto', name:'Fushimi Sake District', desc:'Quartier des brasseurs de sake, murs et ruisseaux tradition', heure:'10h-17h', tag:'fushimisake', ig:'https://www.instagram.com/explore/tags/fushimisake/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234612-Reviews-Fushimi-Kyoto.html', prix:'Gratuit' },
  { cat:'🏛️ Atypique', city:'Kyoto', name:'Nishiki Covered Market', desc:'400 ans, 130 boutiques, cuisine de rue couverte', heure:'10h-18h', tag:'nishikimarket', ig:'https://www.instagram.com/explore/tags/nishikimarket/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234570-Reviews-Nishiki_Market-Kyoto.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Kyoto', name:'Pontocho Jazz Bars', desc:'Bars de jazz intimistes dans la ruelle Pontocho', heure:'20h-00h', tag:'pontochojazz', ig:'https://www.instagram.com/explore/tags/kyotojazz/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234582-Reviews-Pontocho-Kyoto.html', prix:'¥1500-3000' },
  { cat:'🎵 Musical', city:'Kyoto', name:'Gion Hatanaka Geisha Show', desc:'Spectacle de danse maiko & geisha en soirée', heure:'18h-21h', tag:'geishakyoto', ig:'https://www.instagram.com/explore/tags/geishakyoto/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298564-d1234613-Reviews-Gion_Show-Kyoto.html', prix:'¥3500' },

  // ════ NARA ════
  { cat:'📸 Instagram', city:'Nara', name:'Cerfs de Nara Park', desc:'Cerfs en liberté qui saluent si tu te courbes', heure:'7h-10h', tag:'naradeer', ig:'https://www.instagram.com/explore/tags/naradeer/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234567-Reviews-Nara_Park-Nara.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Nara', name:'Todai-ji Temple', desc:'Plus grand bâtiment en bois du monde, Buddha géant', heure:'8h-11h', tag:'todaiji', ig:'https://www.instagram.com/explore/tags/todaiji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234568-Reviews-Todaiji-Nara.html', prix:'¥600' },
  { cat:'📸 Instagram', city:'Nara', name:'Kasuga Taisha', desc:'Temple aux 3000 lanternes, allées de pierre mystiques', heure:'6h-9h', tag:'kasugataisha', ig:'https://www.instagram.com/explore/tags/kasugataisha/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234569-Reviews-Kasuga_Taisha-Nara.html', prix:'¥500' },
  { cat:'🎪 Insolite', city:'Nara', name:'Nakatanidou Mochi Show', desc:'Mochi frappé en direct 2 fois par seconde, spectacle', heure:'10h-17h', tag:'nakatanidou', ig:'https://www.instagram.com/explore/tags/nakatanidou/', tri:'https://www.tripadvisor.fr/Restaurant_Review-g298198-d1234571-Reviews-Nakatanidou-Nara.html', prix:'¥400' },
  { cat:'🏛️ Atypique', city:'Nara', name:'Isuien Garden', desc:'Jardin traditionnel avec vue sur Todai-ji, harmonie parfaite', heure:'9h-17h', tag:'isuien', ig:'https://www.instagram.com/explore/tags/isuien/', tri:'https://www.tripadvisor.fr/Attraction_Review-g298198-d1234614-Reviews-Isuien-Nara.html', prix:'¥900' },

  // ════ SÉOUL ════
  { cat:'📸 Instagram', city:'Séoul', name:'Gyeongbokgung Palace', desc:'Garde royale en costume 10h & 14h, architecture majestueuse', heure:'9h-11h', tag:'gyeongbokgung', ig:'https://www.instagram.com/explore/tags/gyeongbokgung/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234569-Reviews-Gyeongbokgung-Seoul.html', prix:'₩3000' },
  { cat:'📸 Instagram', city:'Séoul', name:'Bukchon Hanok Village', desc:'Maisons coréennes traditionnelles, vue sur la ville', heure:'8h-10h', tag:'bukchonhanokvillage', ig:'https://www.instagram.com/explore/tags/bukchonhanokvillage/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d2345671-Reviews-Bukchon-Seoul.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Séoul', name:'N Seoul Tower by Night', desc:'Vue 360° sur Seoul illuminée, cadenas amoureux', heure:'19h-22h', tag:'nseoultower', ig:'https://www.instagram.com/nseoultower/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d320895-Reviews-N_Seoul_Tower-Seoul.html', prix:'₩16000' },
  { cat:'📸 Instagram', city:'Séoul', name:'Seongsu Murals', desc:'Quartier hipster, cafés arty, murals streetart industriel', heure:'11h-18h', tag:'seongsuseoul', ig:'https://www.instagram.com/explore/tags/seongsuseoul/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456783-Reviews-Seongsu-Seoul.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Séoul', name:'Lotte Tower Sky Seoul', desc:'123e étage, vue panoramique, sky bridge vitré', heure:'9h-23h', tag:'lottetower', ig:'https://www.instagram.com/explore/tags/lottetower/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234615-Reviews-Lotte_Tower-Seoul.html', prix:'₩27000' },
  { cat:'🎪 Insolite', city:'Séoul', name:'Lotte World Theme Park', desc:"Parc d'attraction indoor + outdoor géant, Corée en miniature", heure:'9h-21h', tag:'lotteworld', ig:'https://www.instagram.com/explore/tags/lotteworld/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234586-Reviews-Lotte_World-Seoul.html', prix:'₩54000' },
  { cat:'🎪 Insolite', city:'Séoul', name:'Trick Eye Museum', desc:"Musée illusions optiques, photos trompe-l'oeil ultra virales", heure:'10h-20h', tag:'trickeye', ig:'https://www.instagram.com/explore/tags/trickeye/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d5678901-Reviews-Trick_Eye-Seoul.html', prix:'₩15000' },
  { cat:'🎪 Insolite', city:'Séoul', name:'Nanta Show Hongdae', desc:'Spectacle culinaire percussions sans paroles, interactif', heure:'17h & 20h', tag:'nantashow', ig:'https://www.instagram.com/explore/tags/nantashow/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234587-Reviews-Nanta_Show-Seoul.html', prix:'₩40000' },
  { cat:'🏛️ Atypique', city:'Séoul', name:'Ihwa Mural Village', desc:'Village mural sur colline Naksan, art de rue authentique', heure:'10h-18h', tag:'ihwamural', ig:'https://www.instagram.com/explore/tags/ihwamural/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234616-Reviews-Ihwa_Village-Seoul.html', prix:'Gratuit' },
  { cat:'🏛️ Atypique', city:'Séoul', name:'Gwangjang Market 1905', desc:"Plus vieux marché couvert de Corée, ambiance d'époque", heure:'8h-23h', tag:'gwangjangmarket', ig:'https://www.instagram.com/explore/tags/gwangjangmarket/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456781-Reviews-Gwangjang-Seoul.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Séoul', name:'Hongdae Club District', desc:'50+ clubs & live houses, K-indie & électro', heure:'22h-6h', tag:'hongdaeclub', ig:'https://www.instagram.com/explore/tags/hongdaeclub/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d3456784-Reviews-Hongdae-Seoul.html', prix:'₩10000-20000' },
  { cat:'🎵 Musical', city:'Séoul', name:'SM Town Coex', desc:'Pop coréenne, musée K-pop interactif, hologrammes', heure:'12h-21h', tag:'smtown', ig:'https://www.instagram.com/explore/tags/smtown/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d7654321-Reviews-SM_Town-Seoul.html', prix:'Gratuit (expo) ₩15000 show' },
  { cat:'🎵 Musical', city:'Séoul', name:'K-Star Road Gangnam', desc:'Statues des groupes K-pop, photozones officielles', heure:'Anytime', tag:'kstarroad', ig:'https://www.instagram.com/explore/tags/kstarroad/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d8765432-Reviews-K_Star_Road-Seoul.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Séoul', name:'Nanta Cookin Show', desc:'Comédie percussive culinaire, classique de Seoul', heure:'17h & 20h', tag:'nantashow', ig:'https://www.instagram.com/explore/tags/nantashow/', tri:'https://www.tripadvisor.fr/Attraction_Review-g294197-d1234617-Reviews-Nanta-Seoul.html', prix:'₩40000' },

  // ════ BUSAN ════
  { cat:'📸 Instagram', city:'Busan', name:'Gamcheon Culture Village', desc:'Village arc-en-ciel sur la colline, labyrinthes colorés', heure:'9h-13h', tag:'gamcheon', ig:'https://www.instagram.com/explore/tags/gamcheon/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234573-Reviews-Gamcheon-Busan.html', prix:'₩2000' },
  { cat:'📸 Instagram', city:'Busan', name:'Gwangalli Bridge by Night', desc:'Double pont illuminé en néons face à la mer', heure:'20h-23h', tag:'gwangallibridge', ig:'https://www.instagram.com/explore/tags/gwangallibridge/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d2345683-Reviews-Gwangalli-Busan.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Busan', name:'Haedong Yonggungsa', desc:'Temple bouddhiste spectaculaire au bord de la mer', heure:'6h-9h', tag:'haedong', ig:'https://www.instagram.com/explore/tags/haedong/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234574-Reviews-Haedong-Busan.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Busan', name:'Haeundae Beach Sunrise', desc:'Lever de soleil sur la plage la plus célèbre de Corée', heure:'5h30-7h', tag:'haeundaebeach', ig:'https://www.instagram.com/explore/tags/haeundaebeach/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234575-Reviews-Haeundae-Busan.html', prix:'Gratuit' },
  { cat:'🎪 Insolite', city:'Busan', name:'Aqua Palace Spa', desc:'Jjimjilbang géant coréen, sauna thématique 24h/24', heure:'24h/24', tag:'jjimjilbang', ig:'https://www.instagram.com/explore/tags/jjimjilbang/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234618-Reviews-Aqua_Palace-Busan.html', prix:'₩12000' },
  { cat:'🏛️ Atypique', city:'Busan', name:'Huinnyeoul Culture Village', desc:'Village abandonné réhabilité en galeries et ateliers', heure:'9h-18h', tag:'huinnyeoul', ig:'https://www.instagram.com/explore/tags/huinnyeoul/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d1234619-Reviews-Huinnyeoul-Busan.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Busan', name:'Galmegi Brewing Live', desc:'Brasserie craft beer avec concerts de groupes locaux', heure:'18h-24h', tag:'galmegibrewing', ig:'https://www.instagram.com/galmegibrewing/', tri:'https://www.tripadvisor.fr/Attraction_Review-g297884-d3456780-Reviews-Galmegi-Busan.html', prix:'₩5000-15000' },

  // ════ TOKYO ════
  { cat:'📸 Instagram', city:'Tokyo', name:'Shibuya Crossing', desc:'Carrefour le plus fréquenté du monde, 3000 personnes/vague', heure:'18h-20h', tag:'shibuyacrossing', ig:'https://www.instagram.com/explore/tags/shibuyacrossing/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234575-Reviews-Shibuya_Crossing-Tokyo.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Tokyo', name:'Senso-ji Asakusa Dawn', desc:'Pagode et lanterne géante rouge, brume matinale', heure:'5h30-7h30', tag:'sensoji', ig:'https://www.instagram.com/explore/tags/sensoji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d320888-Reviews-Senso_ji-Tokyo.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Tokyo', name:'Kabukicho Neon Night', desc:'Quartier des néons, Golden Gai, énergie nocturne unique', heure:'21h-00h', tag:'kabukicho', ig:'https://www.instagram.com/explore/tags/kabukicho/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234576-Reviews-Kabukicho-Tokyo.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Tokyo', name:'Takeshita Street', desc:'Mode, couleurs, Harajuku culture pop, créations uniques', heure:'11h-16h', tag:'takeshitastreet', ig:'https://www.instagram.com/explore/tags/takeshitastreet/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234577-Reviews-Takeshita_Street-Tokyo.html', prix:'Gratuit' },
  { cat:'📸 Instagram', city:'Tokyo', name:'Shinjuku Gyoen Garden', desc:'Cerisiers + azalées, jardin national dans la ville', heure:'9h-17h', tag:'shinjukugyoen', ig:'https://www.instagram.com/explore/tags/shinjukugyoen/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234584-Reviews-Shinjuku_Gyoen-Tokyo.html', prix:'¥500' },
  { cat:'📸 Instagram', city:'Tokyo', name:'Tokyo Tower by Night', desc:'Tour Eiffel japonaise illuminée rouge et blanc', heure:'19h-23h', tag:'tokyotower', ig:'https://www.instagram.com/explore/tags/tokyotower/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d320898-Reviews-Tokyo_Tower-Tokyo.html', prix:'¥1200' },
  { cat:'📸 Instagram', city:'Tokyo', name:'teamLab Planets Toyosu', desc:'Art digital immersif, marcher dans des fleurs numériques', heure:'9h-22h', tag:'teamlab', ig:'https://www.instagram.com/explore/tags/teamlabplanets/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d15678902-Reviews-teamLab_Planets-Tokyo.html', prix:'¥3200' },
  { cat:'🎪 Insolite', city:'Tokyo', name:'Hedgehog Café Harry', desc:'Caresser des hérissons miniatures dans un café cosy', heure:'11h-20h', tag:'hedgehogcafe', ig:'https://www.instagram.com/explore/tags/hedgehogcafe/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234578-Reviews-Harry_Hedgehog-Tokyo.html', prix:'¥1500/30min' },
  { cat:'🎪 Insolite', city:'Tokyo', name:'Owl Café Akiba Fukurou', desc:'Hiboux en liberté dans un café Akihabara', heure:'11h-21h', tag:'owlcafe', ig:'https://www.instagram.com/explore/tags/owlcafe/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234579-Reviews-Owl_Cafe-Tokyo.html', prix:'¥1800/1h' },
  { cat:'🎪 Insolite', city:'Tokyo', name:'Oedo Onsen Monogatari', desc:'Parc onsen thématique Edo, bains et village reconstitué', heure:'11h-9h', tag:'oedoonsen', ig:'https://www.instagram.com/explore/tags/oedoonsen/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234581-Reviews-Oedo_Onsen-Tokyo.html', prix:'¥2980' },
  { cat:'🎪 Insolite', city:'Tokyo', name:'Robot Restaurant Shinjuku', desc:'Show de robots géants fluorescents, spectacle hallucinant', heure:'17h30-22h', tag:'robotrestaurant', ig:'https://www.instagram.com/explore/tags/robotrestaurant/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d6543212-Reviews-Robot_Restaurant-Tokyo.html', prix:'¥8000' },
  { cat:'🏛️ Atypique', city:'Tokyo', name:'Akihabara Electronics', desc:'Paradis de la tech, manga, anime et retrogaming sur 5 rues', heure:'10h-21h', tag:'akihabara', ig:'https://www.instagram.com/explore/tags/akihabara/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234583-Reviews-Akihabara-Tokyo.html', prix:'Gratuit' },
  { cat:'🏛️ Atypique', city:'Tokyo', name:'Yanaka Old Town', desc:'Quartier préservé de la période Edo, temples et artisans', heure:'10h-17h', tag:'yanaka', ig:'https://www.instagram.com/explore/tags/yanaka/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234620-Reviews-Yanaka-Tokyo.html', prix:'Gratuit' },
  { cat:'🏛️ Atypique', city:'Tokyo', name:'Tsukiji Outer Market', desc:'Marché extérieur toujours actif, sushi & fruits de mer 6h', heure:'5h-14h', tag:'tsukiji', ig:'https://www.instagram.com/explore/tags/tsukiji/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234621-Reviews-Tsukiji-Tokyo.html', prix:'Gratuit' },
  { cat:'🎵 Musical', city:'Tokyo', name:'Shibuya Womb Club', desc:'Club techno emblématique de Tokyo, sound system légendaire', heure:'23h-6h', tag:'womb', ig:'https://www.instagram.com/womb_shibuya/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066456-d1234622-Reviews-Womb-Tokyo.html', prix:'¥3000-4000' },
  { cat:'🎵 Musical', city:'Tokyo', name:'Blue Note Tokyo', desc:'Jazz club de référence, artistes internationaux', heure:'18h-24h', tag:'bluenotetokyo', ig:'https://www.instagram.com/bluenotetokyo/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234623-Reviews-Blue_Note-Tokyo.html', prix:'¥7000-15000' },
  { cat:'🎵 Musical', city:'Tokyo', name:'Shimokitazawa Live Scene', desc:'10 petites salles de rock & indie en 500m², Le Brooklyn de Tokyo', heure:'18h-24h', tag:'shimokitazawa', ig:'https://www.instagram.com/explore/tags/shimokitazawa/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234624-Reviews-Shimokitazawa-Tokyo.html', prix:'¥1500-3000' },
  { cat:'🎵 Musical', city:'Tokyo', name:'Karaoke Uta Hiroba', desc:'Karaoké japonais luxe, salles privées 24h/24', heure:'24h/24', tag:'karaoke', ig:'https://www.instagram.com/explore/tags/karaoketokyo/', tri:'https://www.tripadvisor.fr/Attraction_Review-g1066454-d1234625-Reviews-Karaoke-Tokyo.html', prix:'¥500/h' },
]

const SPOT_CATS = ['Tous', '📸 Instagram', '🎪 Insolite', '🏛️ Atypique', '🎵 Musical']
const CITIES_SPOTS = [...new Set(SPOTS_DB.map(s => s.city))]

// ════════════════════════════════════════════════════
//  EXPLORER PAGE
// ════════════════════════════════════════════════════
function ExplorerPage() {
  const [subTab, setSubTab] = useState('jour')
  const [activeDay, setActiveDay] = useState(instagramBuzz[0]?.dayId || 1)
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [cityFilter, setCityFilter] = useState('Toutes')
  const [citySpot, setCitySpot] = useState('Osaka')
  const [mealFilter, setMealFilter] = useState('Tous repas')
  const [spotCat, setSpotCat] = useState('Tous')
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

  ]

  const restosFiltered = RESTAURANTS_DB.filter(r =>
    (mealFilter === 'Tous repas' || r.meal === mealFilter) &&
    (typeFilter === 'Tous styles' || r.type === typeFilter) &&
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
          {/* Repas */}
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 6px' }}>
            {['Tous repas', ...MEAL_TIMES].map(m => (
              <button key={m} onClick={() => setMealFilter(m)}
                style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none',
                  background: mealFilter===m ? '#e8523a' : '#f0f0f0', color: mealFilter===m ? '#fff' : '#555' }}>
                {m}
              </button>
            ))}
          </div>
          {/* Style */}
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 6px' }}>
            {['Tous styles', ...TYPES_FOOD].map(t => (
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
          <div style={{ fontSize:'0.75rem', color:'#888', marginBottom:8 }}>{restosFiltered.length} adresse{restosFiltered.length>1?'s':''}</div>
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
                <button onClick={() => open(`https://www.google.com/search?q=${encodeURIComponent(r.name+' '+r.city+' instagram')}`)} style={{ ...igBtnStyle, flex:1 }}>📷 IG</button>
                <button onClick={() => open(r.tripadvisor)} style={{ ...triBtnStyle, flex:1 }}>🟢 TA</button>
                <button onClick={() => openMaps(r.name + ' ' + r.city)} style={{ ...mapBtnStyle, flex:1 }}>📍</button>
                <button onClick={() => toggleFav(r.id, r.name, 'resto')}
                  style={{ padding:'5px 10px', borderRadius:10, fontSize:'0.85rem', border:'none', cursor:'pointer',
                    background: isFav(r.id)?'#e1306c':'#f0f0f0', color: isFav(r.id)?'#fff':'#555' }}>
                  {isFav(r.id)?'❤️':'🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── SPOTS / LIEUX ─── */}
      {subTab === 'spots' && (
        <div>
          {/* Filtre catégorie */}
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 6px' }}>
            {SPOT_CATS.map(c => (
              <button key={c} onClick={() => setSpotCat(c)}
                style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none', whiteSpace:'nowrap',
                  background: spotCat===c ? '#833ab4' : '#f0f0f0',
                  color: spotCat===c ? '#fff' : '#555' }}>
                {c}
              </button>
            ))}
          </div>
          {/* Filtre ville */}
          <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'2px 0 8px' }}>
            {['Toutes villes', ...CITIES_SPOTS].map(c => (
              <button key={c} onClick={() => setCitySpot(c)}
                style={{ flexShrink:0, padding:'3px 9px', borderRadius:20, fontSize:'0.7rem', cursor:'pointer', border:'1px solid #ddd',
                  background: citySpot===c ? '#0b1f3a' : '#fff',
                  color: citySpot===c ? '#fff' : '#555' }}>
                {c}
              </button>
            ))}
          </div>
          {(() => {
            const filtered = SPOTS_DB.filter(s =>
              (spotCat === 'Tous' || s.cat === spotCat) &&
              (citySpot === 'Toutes villes' || s.city === citySpot)
            )
            const CAT_COLORS = { '📸 Instagram':'#e1306c', '🎪 Insolite':'#f39c12', '🏛️ Atypique':'#2980b9', '🎵 Musical':'#8e44ad' }
            return (
              <div>
                <div style={{ fontSize:'0.75rem', color:'#888', marginBottom:8 }}>{filtered.length} lieu{filtered.length>1?'x':''}</div>
                {filtered.map(spot => (
                  <div key={spot.name+spot.city} style={{ background:'#fff', border:`1px solid ${CAT_COLORS[spot.cat]||'#eee'}`, borderRadius:14, padding:'0.85rem 1rem', marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                          <span style={{ fontSize:'0.68rem', fontWeight:700, background:CAT_COLORS[spot.cat], color:'#fff', padding:'2px 8px', borderRadius:10 }}>{spot.cat}</span>
                          <span style={{ fontSize:'0.72rem', color:'#888' }}>{spot.city}</span>
                        </div>
                        <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#0b1f3a' }}>{spot.name}</div>
                        <div style={{ fontSize:'0.78rem', color:'#555', margin:'3px 0' }}>{spot.desc}</div>
                        <div style={{ fontSize:'0.72rem', color:'#833ab4', fontWeight:600 }}>⏰ {spot.heure}</div>
                      </div>
                      <div style={{ marginLeft:8, fontWeight:700, color:'#27ae60', fontSize:'0.82rem', whiteSpace:'nowrap' }}>{spot.prix}</div>
                    </div>
                    <div style={{ display:'flex', gap:6, marginTop:8 }}>
                      <button onClick={() => open(spot.ig)} style={{ ...igBtnStyle, flex:1 }}>📷 #{spot.tag}</button>
                      <button onClick={() => open(spot.tri)} style={{ ...triBtnStyle, flex:1 }}>🟢 TripAdvisor</button>
                      <button onClick={() => { navigator.clipboard.writeText('#'+spot.tag); setCopied(spot.name); setTimeout(()=>setCopied(null),1500) }}
                        style={{ padding:'5px 8px', borderRadius:10, fontSize:'0.7rem', border:'1px solid #ccc', background: copied===spot.name?'#27ae60':'#fff', color: copied===spot.name?'#fff':'#666', cursor:'pointer' }}>
                        {copied===spot.name?'✓':'📋'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
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
  const [editMode, setEditMode] = useState(false)
  const [edits, setEdits] = useLocalStorage('carnetEdits', {})
  const [savedFlash, setSavedFlash] = useState(false)
  const [draftText, setDraftText] = useState(null) // texte brut en cours d'édition
  const [syncStatus, setSyncStatus] = useState('idle') // idle | loading | synced | error

  // ── Chargement initial depuis Supabase ──
  useEffect(() => {
    setSyncStatus('loading')
    loadEditsFromCloud().then(cloudEdits => {
      if (cloudEdits) {
        // Fusion : cloud gagne sur local si plus récent
        setEdits(prev => {
          const merged = { ...prev }
          for (const [id, ce] of Object.entries(cloudEdits)) {
            const localUpdated = prev[id]?.updated_at
            const cloudUpdated = ce.updated_at
            if (!localUpdated || cloudUpdated > localUpdated) {
              merged[id] = ce
            }
          }
          return merged
        })
        setSyncStatus('synced')
      } else {
        setSyncStatus('error')
      }
    })
  }, [])

  // Fusionne les éditions locales avec les sections originales
  const mergedSections = wordSections.map(s => {
    const e = edits[s.id]
    if (!e) return s
    return {
      ...s,
      title: e.title !== undefined ? e.title : s.title,
      paragraphs: e.paragraphs !== undefined ? e.paragraphs : s.paragraphs,
    }
  })

  const section = mergedSections.find(s => s.id === selected) || mergedSections[0]
  const idx = mergedSections.findIndex(s => s.id === selected)
  const isEdited = !!edits[selected]

  const filtered = search.trim()
    ? mergedSections.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.paragraphs?.some(p => p.toLowerCase().includes(search.toLowerCase()))
      )
    : mergedSections

  // Quand on bascule en mode édition, initialiser le draft avec le texte du bloc
  const toggleEditMode = () => {
    if (!editMode) {
      // Passer en mode édition : joindre tous les paragraphes en un seul bloc
      setDraftText((section?.paragraphs || []).join('\n'))
    } else {
      // Quitter le mode édition : sauvegarder le bloc complet
      if (draftText !== null) {
        const newParas = draftText.split('\n')
        const newTitle = edits[selected]?.title !== undefined ? edits[selected].title : section.title
        setEdits(prev => ({
          ...prev,
          [selected]: {
            ...(prev[selected] || {}),
            title: newTitle,
            paragraphs: newParas,
            updated_at: new Date().toISOString(),
          }
        }))
        setSyncStatus('loading')
        saveEditToCloud(selected, newTitle, newParas).then(ok => {
          setSyncStatus(ok ? 'synced' : 'error')
        })
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1800)
      }
      setDraftText(null)
    }
    setEditMode(v => !v)
  }

  // Changer de section en mode édition : sauvegarder d'abord
  const selectSection = (id) => {
    if (editMode && draftText !== null) {
      const newParas = draftText.split('\n')
      const newTitle = edits[selected]?.title !== undefined ? edits[selected].title : section.title
      setEdits(prev => ({
        ...prev,
        [selected]: {
          ...(prev[selected] || {}),
          title: newTitle,
          paragraphs: newParas,
          updated_at: new Date().toISOString(),
        }
      }))
      saveEditToCloud(selected, newTitle, newParas)
    }
    setSelected(id)
    setSearch('')
    // Mettre à jour le draft pour la nouvelle section
    if (editMode) {
      const newSect = mergedSections.find(s => s.id === id) || mergedSections[0]
      setDraftText((newSect?.paragraphs || []).join('\n'))
    }
  }

  const updateTitle = (val) => {
    setEdits(prev => ({
      ...prev,
      [selected]: {
        ...(prev[selected] || {}),
        title: val,
        paragraphs: prev[selected]?.paragraphs !== undefined ? prev[selected].paragraphs : section.paragraphs,
      }
    }))
  }

  const restoreOriginal = () => {
    if (!confirm('Restaurer le contenu original de cette journée ? Vos modifications seront perdues.')) return
    setEdits(prev => {
      const next = { ...prev }
      delete next[selected]
      return next
    })
    deleteEditFromCloud(selected)
    if (editMode) {
      const orig = wordSections.find(s => s.id === selected)
      setDraftText((orig?.paragraphs || []).join('\n'))
    }
  }

  return (
    <motion.div key="carnet" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f9f7f2' }}>

      {/* ── Header ── */}
      <div style={{ background:'#0b1f3a', padding:'1rem 1.2rem', color:'#fff', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, gap:8 }}>
          <div style={{ fontWeight:800, fontSize:'1.05rem' }}>📖 Carnet de voyage</div>
          <button onClick={toggleEditMode}
            style={{ padding:'5px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none',
              background: editMode ? '#e1306c' : 'rgba(255,255,255,0.2)', color:'#fff' }}>
            {editMode ? '💾 Enregistrer' : '✏️ Modifier'}
          </button>
        </div>
        {!editMode && (
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un lieu, une activité…"
            style={{ width:'100%', padding:'8px 12px', borderRadius:10, border:'none', fontSize:'0.85rem',
              background:'rgba(255,255,255,0.15)', color:'#fff', outline:'none', boxSizing:'border-box' }} />
        )}
        {editMode && (
          <div style={{ fontSize:'0.75rem', opacity:0.8, textAlign:'center', padding:'4px 0' }}>
            ✍️ Éditez le bloc complet de la journée — une ligne par paragraphe
          </div>
        )}
      </div>

      {/* ── Sommaire scrollable ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'8px 12px', overflowX:'auto', display:'flex', gap:6, whiteSpace:'nowrap' }}>
        {filtered.map(s => {
          const wasEdited = !!edits[s.id]
          return (
            <button key={s.id} onClick={() => selectSection(s.id)}
              style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
                background: selected===s.id ? '#0b1f3a' : '#f0f0f0',
                color: selected===s.id ? '#fff' : '#444' }}>
              {wasEdited && '✏️ '}{s.title?.split('–')[0]?.trim() || s.title}
            </button>
          )
        })}
      </div>

      {/* Bandeau enregistrement + statut sync */}
      {savedFlash && (
        <div style={{ background:'#27ae60', color:'#fff', textAlign:'center', padding:'8px', fontSize:'0.85rem', fontWeight:700 }}>
          ✓ Journée enregistrée et synchronisée ☁️
        </div>
      )}
      {!savedFlash && syncStatus === 'loading' && (
        <div style={{ background:'#f39c12', color:'#fff', textAlign:'center', padding:'5px', fontSize:'0.75rem', fontWeight:700 }}>
          ☁️ Synchronisation…
        </div>
      )}
      {!savedFlash && syncStatus === 'error' && (
        <div style={{ background:'#e74c3c', color:'#fff', textAlign:'center', padding:'5px', fontSize:'0.75rem', fontWeight:700 }}>
          ⚠️ Hors-ligne — modifications sauvées localement
        </div>
      )}

      {/* ── Contenu pleine page ── */}
      <div style={{ flex:1, padding:'1.2rem 1rem 2rem', maxWidth:680, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>

        {/* Titre — éditable en mode édition */}
        {editMode ? (
          <input value={section?.title || ''}
            onChange={e => updateTitle(e.target.value)}
            style={{ fontSize:'1.2rem', fontWeight:800, color:'#0b1f3a', marginBottom:4, lineHeight:1.3, width:'100%', border:'2px solid #e1306c', borderRadius:8, padding:'6px 10px', background:'#fff9fb', boxSizing:'border-box' }} />
        ) : (
          <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#0b1f3a', marginBottom:4, lineHeight:1.3 }}>{section?.title}</h2>
        )}
        <div style={{ height:3, width:60, background:'#e1306c', borderRadius:4, marginBottom:16 }} />

        {/* Indicateur édité + bouton restaurer */}
        {isEdited && !editMode && (
          <div style={{ background:'#fff9fb', border:'1px dashed #e1306c', borderRadius:8, padding:'8px 12px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:'0.78rem', color:'#e1306c', fontWeight:700 }}>✏️ Journée modifiée</span>
            <button onClick={restoreOriginal}
              style={{ padding:'4px 10px', borderRadius:8, border:'1px solid #e1306c', background:'#fff', color:'#e1306c', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>
              ↩ Restaurer l'original
            </button>
          </div>
        )}

        {/* ── MODE ÉDITION : grand textarea par bloc ── */}
        {editMode ? (
          <div style={{ background:'#fff', border:'2px solid #e1306c', borderRadius:12, padding:'4px', boxShadow:'0 2px 12px rgba(225,48,108,0.10)' }}>
            <textarea
              value={draftText || ''}
              onChange={e => setDraftText(e.target.value)}
              style={{
                width:'100%', minHeight:'55vh', border:'none', outline:'none',
                resize:'vertical', fontSize:'0.92rem', lineHeight:1.8, color:'#222',
                boxSizing:'border-box', background:'transparent', fontFamily:'inherit',
                padding:'12px'
              }}
              placeholder="Rédigez ici le contenu de la journée…
Chaque ligne deviendra un paragraphe dans la vue normale."
            />
            <div style={{ borderTop:'1px solid #f0e0e4', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.72rem', color:'#aaa' }}>
                {(draftText || '').split('\n').filter(l => l.trim()).length} lignes
              </span>
              <button onClick={restoreOriginal}
                style={{ padding:'4px 10px', borderRadius:8, border:'1px solid #ccc', background:'#fff', color:'#888', fontSize:'0.72rem', cursor:'pointer' }}>
                ↩ Restaurer l'original
              </button>
            </div>
          </div>
        ) : (
          /* ── MODE LECTURE : affichage paragraphes ── */
          <div>
            {section?.paragraphs?.map((p, i) => {
              const isH = /^(📅|✈️|🚄|🏯|🗾|Jour\s|JOUR|Programme|Le matin|L'après|La soirée|Hébergement|Budget|Transport|Activité|Repas)/.test(p)
              const isEmoji = /^[📍🍜🚌🎌🌸🏮⛩️🎋🌊🏖️🏔️💴💶🕐]/.test(p)
              if (!p.trim()) return null
              return (
                <p key={i} style={{
                  fontSize: isH ? '1rem' : '0.9rem',
                  fontWeight: isH ? 700 : 400,
                  color: isH ? '#0b1f3a' : '#444',
                  lineHeight: 1.7,
                  marginBottom: isH ? 12 : 8,
                  borderLeft: isH ? '3px solid #e1306c' : 'none',
                  background: isH ? '#fff9fb' : 'transparent',
                  borderRadius: isH ? 6 : 0,
                  padding: isH ? '6px 10px' : (isEmoji ? '0 0 0 4px' : '0'),
                  whiteSpace: 'pre-wrap',
                }}>{p}</p>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Navigation bas ── */}
      <div style={{ position:'sticky', bottom:0, background:'#fff', borderTop:'1px solid #eee', padding:'10px 16px', display:'flex', justifyContent:'space-between', gap:10 }}>
        <button onClick={() => { if(idx > 0) selectSection(mergedSections[idx-1].id) }}
          disabled={idx === 0}
          style={{ flex:1, padding:'10px', borderRadius:12, border:'1px solid #ddd', background: idx===0?'#f5f5f5':'#0b1f3a', color: idx===0?'#bbb':'#fff', fontWeight:700, fontSize:'0.85rem', cursor: idx===0?'not-allowed':'pointer' }}>
          ← Précédent
        </button>
        <div style={{ display:'flex', alignItems:'center', fontSize:'0.75rem', color:'#888' }}>
          {idx+1} / {mergedSections.length}
        </div>
        <button onClick={() => { if(idx < mergedSections.length-1) selectSection(mergedSections[idx+1].id) }}
          disabled={idx === mergedSections.length-1}
          style={{ flex:1, padding:'10px', borderRadius:12, border:'1px solid #ddd', background: idx===mergedSections.length-1?'#f5f5f5':'#0b1f3a', color: idx===mergedSections.length-1?'#bbb':'#fff', fontWeight:700, fontSize:'0.85rem', cursor: idx===mergedSections.length-1?'not-allowed':'pointer' }}>
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

// ════════════════════════════════════════════════════
//  PHRASES UTILES
// ════════════════════════════════════════════════════
const PHRASES_DB = [
  {
    cat: '👋 Salutations', phrases: [
      { fr: 'Bonjour / Bonsoir', jp: 'こんにちは / こんばんは', jpRom: 'Konnichiwa / Konbanwa', kr: '안녕하세요', krRom: 'Annyeonghaseyo' },
      { fr: 'Merci beaucoup', jp: 'ありがとうございます', jpRom: 'Arigatou gozaimasu', kr: '감사합니다', krRom: 'Gamsahamnida' },
      { fr: 'Excusez-moi / Pardon', jp: 'すみません', jpRom: 'Sumimasen', kr: '실례합니다', krRom: 'Sillyehamnida' },
      { fr: 'Oui / Non', jp: 'はい / いいえ', jpRom: 'Hai / Iie', kr: '네 / 아니요', krRom: 'Ne / Aniyo' },
      { fr: 'Je ne comprends pas', jp: 'わかりません', jpRom: 'Wakarimasen', kr: '모르겠어요', krRom: 'Moreugesseoyo' },
      { fr: 'Parlez-vous français ?', jp: 'フランス語を話せますか？', jpRom: 'Furansugo wo hanasemasu ka?', kr: '프랑스어 할 수 있어요?', krRom: 'Peurangseueo hal su isseoyo?' },
      { fr: 'Pouvez-vous répéter ?', jp: 'もう一度言ってください', jpRom: 'Mou ichido itte kudasai', kr: '다시 말씀해 주세요', krRom: 'Dasi malsseum hae juseyo' },
    ]
  },
  {
    cat: '🚇 Transport', phrases: [
      { fr: 'Où est la station de métro ?', jp: '地下鉄の駅はどこですか？', jpRom: 'Chikatetsu no eki wa doko desu ka?', kr: '지하철역이 어디예요?', krRom: 'Jihacheolyeogi eodieyo?' },
      { fr: "Un billet pour... s'il vous plaît", jp: '...まで一枚ください', jpRom: '...made ichimai kudasai', kr: '...까지 한 장 주세요', krRom: '...kkaji han jang juseyo' },
      { fr: "Où est l'arrêt de bus ?", jp: 'バス停はどこですか？', jpRom: 'Basu tei wa doko desu ka?', kr: '버스 정류장이 어디예요?', krRom: 'Beoseu jeongnyujang eodieyo?' },
      { fr: 'À quelle heure part le train ?', jp: '電車は何時に出ますか？', jpRom: 'Densha wa nanji ni demasu ka?', kr: '기차가 몇 시에 출발해요?', krRom: 'Gichaga myeot sie chulbalhaeyo?' },
      { fr: "C'est loin à pied ?", jp: '歩いて遠いですか？', jpRom: 'Aruite tooi desu ka?', kr: '걸어서 멀어요?', krRom: 'Georeo seo meoreoyo?' },
      { fr: 'Appelez-moi un taxi', jp: 'タクシーを呼んでください', jpRom: 'Takushi wo yonde kudasai', kr: '택시 불러 주세요', krRom: 'Taeksi bulleo juseyo' },
      { fr: 'Je veux aller à...', jp: '...に行きたいです', jpRom: '...ni ikitai desu', kr: '...에 가고 싶어요', krRom: '...e gago sipeoyo' },
    ]
  },
  {
    cat: '🍜 Restaurant', phrases: [
      { fr: 'Une table pour 4 personnes', jp: '4人用のテーブルをお願いします', jpRom: 'Yonin you no teburu wo onegaishimasu', kr: '4인 테이블 부탁드려요', krRom: 'Sa-in teibeul butakdeuryeoyo' },
      { fr: "Le menu s'il vous plaît", jp: 'メニューをください', jpRom: 'Menyu wo kudasai', kr: '메뉴판 주세요', krRom: 'Menyupan juseyo' },
      { fr: "C'est délicieux !", jp: 'おいしい！', jpRom: 'Oishii!', kr: '맛있어요!', krRom: 'Massisseoyo!' },
      { fr: "L'addition s'il vous plaît", jp: 'お会計をお願いします', jpRom: 'Okaikei wo onegaishimasu', kr: '계산서 주세요', krRom: 'Gyesanseo juseyo' },
      { fr: 'Je suis allergique à...', jp: '...アレルギーがあります', jpRom: '...arerugii ga arimasu', kr: '...알레르기가 있어요', krRom: '...allereugi ga isseoyo' },
      { fr: "Sans gluten s'il vous plaît", jp: 'グルテンなしでお願いします', jpRom: 'Guruten nashi de onegaishimasu', kr: '글루텐 없이 해주세요', krRom: 'Geulluten eopsi haejuseyo' },
      { fr: 'Je ne mange pas de porc', jp: '豚肉は食べません', jpRom: 'Butaniku wa tabemasen', kr: '돼지고기를 안 먹어요', krRom: 'Dwaejigogireul an meogoyo' },
      { fr: "C'est trop piquant", jp: '辛すぎます', jpRom: 'Kara sugimasu', kr: '너무 매워요', krRom: 'Neomu maewoyo' },
      { fr: "De l'eau s'il vous plaît", jp: 'お水をください', jpRom: 'Omizu wo kudasai', kr: '물 주세요', krRom: 'Mul juseyo' },
    ]
  },
  {
    cat: '🛍️ Shopping', phrases: [
      { fr: 'Combien ça coûte ?', jp: 'いくらですか？', jpRom: 'Ikura desu ka?', kr: '얼마예요?', krRom: 'Eolmayeyo?' },
      { fr: "C'est trop cher", jp: '高すぎます', jpRom: 'Taka sugimasu', kr: '너무 비싸요', krRom: 'Neomu bissayo' },
      { fr: 'Avez-vous une taille plus grande ?', jp: 'もっと大きいサイズはありますか？', jpRom: 'Motto ookii saizu wa arimasu ka?', kr: '더 큰 사이즈 있어요?', krRom: 'Deo keun saiseu isseoyo?' },
      { fr: 'Je peux essayer ?', jp: '試着できますか？', jpRom: 'Shichaku dekimasu ka?', kr: '입어봐도 돼요?', krRom: 'Ibeoboado dwaeyo?' },
      { fr: 'Je prends celui-ci', jp: 'これをください', jpRom: 'Kore wo kudasai', kr: '이걸로 할게요', krRom: 'Igeolro halgeyo' },
      { fr: 'Carte bancaire acceptée ?', jp: 'クレジットカードは使えますか？', jpRom: 'Kurejitto kado wa tsukaemasu ka?', kr: '신용카드 돼요?', krRom: 'Sinyongkadeu dwaeyo?' },
      { fr: 'Avez-vous un sac ?', jp: '袋をもらえますか？', jpRom: 'Fukuro wo moraemasu ka?', kr: '봉투 있어요?', krRom: 'Bongtu isseoyo?' },
    ]
  },
  {
    cat: '🏨 Hôtel', phrases: [
      { fr: "J'ai une réservation", jp: '予約があります', jpRom: 'Yoyaku ga arimasu', kr: '예약했어요', krRom: 'Yeyak haesseoyo' },
      { fr: 'Check-in / Check-out', jp: 'チェックイン / チェックアウト', jpRom: 'Chekkuin / Chekku auto', kr: '체크인 / 체크아웃', krRom: 'Chekeu-in / Chekeu-aut' },
      { fr: 'Où est ma chambre ?', jp: '私の部屋はどこですか？', jpRom: 'Watashi no heya wa doko desu ka?', kr: '제 방이 어디예요?', krRom: 'Je bangi eodieyo?' },
      { fr: 'Le wifi ne fonctionne pas', jp: 'ワイファイが使えません', jpRom: 'Waifai ga tsukaemasen', kr: '와이파이가 안 돼요', krRom: 'Waipai ga an dwaeyo' },
      { fr: "Pouvez-vous m'appeler un taxi ?", jp: 'タクシーを呼んでもらえますか？', jpRom: 'Takushi wo yonde moraemasu ka?', kr: '택시 불러주실 수 있어요?', krRom: 'Taeksi bulleojusil su isseoyo?' },
      { fr: 'Avez-vous un coffre-fort ?', jp: 'セーフを使えますか？', jpRom: 'Sefu wo tsukaemasu ka?', kr: '금고 있어요?', krRom: 'Geumgo isseoyo?' },
    ]
  },
  {
    cat: '🆘 Urgence', phrases: [
      { fr: 'Au secours !', jp: '助けて！', jpRom: 'Tasukete!', kr: '도와주세요!', krRom: 'Dowajuseyo!' },
      { fr: 'Appelez la police !', jp: '警察を呼んでください！', jpRom: 'Keisatsu wo yonde kudasai!', kr: '경찰을 불러주세요!', krRom: 'Gyeongchal eul bulleojuseyo!' },
      { fr: 'Appelez une ambulance !', jp: '救急車を呼んでください！', jpRom: 'Kyukyusha wo yonde kudasai!', kr: '구급차를 불러주세요!', krRom: 'Gugeupcha reul bulleojuseyo!' },
      { fr: "J'ai besoin d'un médecin", jp: '医者が必要です', jpRom: 'Isha ga hitsuyou desu', kr: '의사가 필요해요', krRom: 'Uisaga piryohaeyo' },
      { fr: 'Je me suis perdu(e)', jp: '迷子になりました', jpRom: 'Maigo ni narimashita', kr: '길을 잃었어요', krRom: 'Gireul ireoosseoyo' },
      { fr: "On m'a volé mon sac", jp: 'バッグを盗まれました', jpRom: 'Baggu wo nusumaremashita', kr: '가방을 도둑맞았어요', krRom: 'Gabangeul dodungmajasseoyo' },
      { fr: "Où est l'hôpital le plus proche ?", jp: '一番近い病院はどこですか？', jpRom: 'Ichiban chikai byouin wa doko desu ka?', kr: '가장 가까운 병원이 어디예요?', krRom: 'Gajang gakkaun byeongwoni eodieyo?' },
      { fr: "J'ai mal ici", jp: 'ここが痛いです', jpRom: 'Koko ga itai desu', kr: '여기가 아파요', krRom: 'Yeogiga apayo' },
      { fr: 'Urgences Japon : 110 (police) 119 (ambulance)', jp: '110番 (警察) / 119番 (救急)', jpRom: 'Hyakujuuban / Hyakujuukyuuban', kr: '한국 : 112 (경찰) / 119 (구급)', krRom: 'Ilil-i (Gyeongchal) / Ilil-gu (Gugeup)' },
    ]
  },
  {
    cat: '📍 Orientation', phrases: [
      { fr: 'Où est... ?', jp: '...はどこですか？', jpRom: '...wa doko desu ka?', kr: '...이/가 어디예요?', krRom: '...i/ga eodieyo?' },
      { fr: 'Tout droit', jp: 'まっすぐ', jpRom: 'Massugu', kr: '직진', krRom: 'Jikjin' },
      { fr: 'À gauche / À droite', jp: '左 / 右', jpRom: 'Hidari / Migi', kr: '왼쪽 / 오른쪽', krRom: 'Oenjjok / Oreunjjok' },
      { fr: "Près d'ici / Loin", jp: '近く / 遠い', jpRom: 'Chikaku / Tooi', kr: '가까워요 / 멀어요', krRom: 'Gakkawoyo / Meoreoyo' },
      { fr: 'Pouvez-vous me montrer sur la carte ?', jp: '地図で見せてもらえますか？', jpRom: 'Chizu de misete moraemasu ka?', kr: '지도에서 보여주실 수 있어요?', krRom: 'Jidoeseo boyeojusil su isseoyo?' },
    ]
  },
  {
    cat: '💬 Enfants', phrases: [
      { fr: 'Mon enfant est perdu', jp: '子供がいなくなりました', jpRom: 'Kodomo ga inakunarimashita', kr: '아이를 잃어버렸어요', krRom: 'Aireul ireobeoryeosseoyo' },
      { fr: 'Y a-t-il un espace enfants ?', jp: 'キッズスペースはありますか？', jpRom: 'Kizzu supeesu wa arimasu ka?', kr: '어린이 공간이 있어요?', krRom: 'Eorini gonggani isseoyo?' },
      { fr: "Tarif enfant s'il vous plaît", jp: '子供料金をお願いします', jpRom: 'Kodomo ryoukin wo onegaishimasu', kr: '어린이 요금으로 해주세요', krRom: 'Eorini yogeumeuro haejuseyo' },
      { fr: 'Avez-vous une chaise haute ?', jp: 'ベビーチェアはありますか？', jpRom: 'Bebi chea wa arimasu ka?', kr: '유아 의자 있어요?', krRom: 'Yua uija isseoyo?' },
    ]
  },
]

function PhrasesPage() {
  const [activeCat, setActiveCat] = useState(PHRASES_DB[0].cat)
  const [lang, setLang] = useState('both')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(null)

  const copy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id); setTimeout(() => setCopied(null), 1500)
  }

  const speak = (text, isJP) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = isJP ? 'ja-JP' : 'ko-KR'
    utt.rate = 0.85
    window.speechSynthesis.speak(utt)
  }

  const catData = PHRASES_DB.find(c => c.cat === activeCat) || PHRASES_DB[0]
  const filtered = search.trim()
    ? PHRASES_DB.flatMap(c => c.phrases.filter(p =>
        p.fr.toLowerCase().includes(search.toLowerCase()) ||
        p.jpRom.toLowerCase().includes(search.toLowerCase()) ||
        p.krRom.toLowerCase().includes(search.toLowerCase())
      ).map(p => ({ ...p, _cat: c.cat }))
    )
    : catData.phrases

  return (
    <motion.div key="phrases" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f9f7f2' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0b1f3a,#1a3a6b)', padding:'1rem 1.2rem', color:'#fff', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontWeight:800, fontSize:'1.05rem', marginBottom:8 }}>🗣️ Phrases utiles — 🇯🇵 🇰🇷</div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une phrase..."
          style={{ width:'100%', padding:'8px 12px', borderRadius:10, border:'none', fontSize:'0.85rem',
            background:'rgba(255,255,255,0.15)', color:'#fff', outline:'none', boxSizing:'border-box' }} />
      </div>

      {/* Filtre langue */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'8px 12px', display:'flex', gap:6 }}>
        {[['both','🇯🇵 + 🇰🇷'],['jp','🇯🇵 Japonais'],['kr','🇰🇷 Coréen']].map(([k,l]) => (
          <button key={k} onClick={() => setLang(k)}
            style={{ padding:'4px 12px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
              background: lang===k ? '#0b1f3a' : '#f0f0f0', color: lang===k ? '#fff' : '#555' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Catégories */}
      {!search.trim() && (
        <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'6px 12px', overflowX:'auto', display:'flex', gap:6, whiteSpace:'nowrap' }}>
          {PHRASES_DB.map(c => (
            <button key={c.cat} onClick={() => setActiveCat(c.cat)}
              style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
                background: activeCat===c.cat ? '#0b1f3a' : '#f0f0f0',
                color: activeCat===c.cat ? '#fff' : '#444' }}>
              {c.cat}
            </button>
          ))}
        </div>
      )}

      {/* Phrases */}
      <div style={{ padding:'0.8rem 1rem 2rem', flex:1 }}>
        {search.trim() && <div style={{ fontSize:'0.75rem', color:'#888', marginBottom:8 }}>{filtered.length} résultat{filtered.length>1?'s':''}</div>}
        {filtered.map((p, i) => (
          <div key={i} style={{ background:'#fff', borderRadius:14, padding:'0.9rem 1rem', marginBottom:10, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            {/* Français */}
            <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#0b1f3a', marginBottom:8 }}>🇫🇷 {p.fr}</div>

            {/* Japonais */}
            {(lang === 'both' || lang === 'jp') && (
              <div style={{ background:'#fff8f0', borderRadius:10, padding:'0.6rem 0.8rem', marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'1rem', color:'#c0392b', fontWeight:700 }}>{p.jp}</div>
                    <div style={{ fontSize:'0.78rem', color:'#888', fontStyle:'italic' }}>{p.jpRom}</div>
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    <button onClick={() => speak(p.jp, true)}
                      style={{ background:'#c0392b', color:'#fff', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:'0.75rem' }}>
                      🔊
                    </button>
                    <button onClick={() => copy(p.jp, `jp${i}`)}
                      style={{ background: copied===`jp${i}`?'#27ae60':'#f0f0f0', color: copied===`jp${i}`?'#fff':'#555', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:'0.75rem' }}>
                      {copied===`jp${i}`?'✓':'📋'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Coréen */}
            {(lang === 'both' || lang === 'kr') && (
              <div style={{ background:'#f0f4ff', borderRadius:10, padding:'0.6rem 0.8rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'1rem', color:'#2471a3', fontWeight:700 }}>{p.kr}</div>
                    <div style={{ fontSize:'0.78rem', color:'#888', fontStyle:'italic' }}>{p.krRom}</div>
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    <button onClick={() => speak(p.kr, false)}
                      style={{ background:'#2471a3', color:'#fff', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:'0.75rem' }}>
                      🔊
                    </button>
                    <button onClick={() => copy(p.kr, `kr${i}`)}
                      style={{ background: copied===`kr${i}`?'#27ae60':'#f0f0f0', color: copied===`kr${i}`?'#fff':'#555', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:'0.75rem' }}>
                      {copied===`kr${i}`?'✓':'📋'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}


// ════ COMPTE À REBOURS ════
function CountdownCard() {
  const DEPART = new Date('2025-07-09T06:00:00')
  const [now, setNow] = React.useState(new Date())
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = DEPART - now
  if (diff <= 0) return (
    <div style={{ background:'linear-gradient(135deg,#27ae60,#2ecc71)', borderRadius:16, padding:'1rem 1.4rem', color:'#fff', textAlign:'center' }}>
      <div style={{ fontSize:'1.5rem' }}>✈️ Bon voyage Famille Lacidi !</div>
    </div>
  )
  const j = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return (
    <div style={{ background:'linear-gradient(135deg,#0b1f3a,#1a3a6b)', borderRadius:16, padding:'1rem 1.4rem', color:'#fff' }}>
      <div style={{ fontSize:'0.8rem', opacity:0.7, marginBottom:6 }}>✈️ Départ Paris CDG → Rome → Osaka</div>
      <div style={{ display:'flex', justifyContent:'center', gap:12, textAlign:'center' }}>
        {[[j,'jours'],[h,'heures'],[m,'min'],[s,'sec']].map(([v,l]) => (
          <div key={l}>
            <div style={{ fontSize:'1.8rem', fontWeight:900, lineHeight:1 }}>{String(v).padStart(2,'0')}</div>
            <div style={{ fontSize:'0.65rem', opacity:0.7 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center', fontSize:'0.72rem', opacity:0.6, marginTop:6 }}>09 juillet 2025 — Paris ✈️ Rome ✈️ Osaka</div>
    </div>
  )
}

// ════ PAGE TRANSPORTS ════
const TRANSPORT_INFO = [
  {
    title: '🚅 JR Pass — Shinkansen',
    color: '#e8523a',
    items: [
      "Achetez le JR Pass AVANT de partir en France — moins cher et obligatoire à l'avance",
      "Pass 14 jours recommandé pour votre itinéraire (Osaka → Tokyo via Kyoto)",
      "Valider le pass au guichet JR à l'arrivée à l'aéroport",
      "Couvre : Shinkansen (sauf Nozomi/Mizuho), trains JR, bus JR",
      "Réserver les sièges Shinkansen gratuitement au guichet JR (ou via app JR)",
      "Prix adulte 14j : ~46 390 ¥ | Enfant (6-11 ans) : 50% de réduction",
    ]
  },
  {
    title: `💳 IC Card — Suica / Pasmo`,
    color: '#3a7bd5',
    items: [
      "Carte rechargeable pour métro, bus, et paiements (combinis, vending machines)",
      "Suica : achetez à l'aéroport Haneda ou Narita (dépôt ¥500 remboursable)",
      "Fonctionne dans tout le Japon — Osaka, Kyoto, Tokyo",
      "Rechargez aux distributeurs dans toutes les stations",
      "Alternative : Apple Pay Suica sur iPhone (sans carte physique)",
      "Remboursez à votre départ au guichet JR : ¥500 + solde restant",
    ]
  },
  {
    title: `🚇 Métro Osaka / Tokyo / Séoul`,
    color: '#27ae60',
    items: [
      "Osaka : ligne Midosuji (rouge) = axe principal Namba ↔ Umeda",
      "Osaka Pass 24h/48h recommandé pour les journées touristiques intensives",
      "Tokyo : 13 lignes JR + métro Tokyo = utiliser Google Maps pour naviguer",
      "Séoul : T-money Card (≈ Suica coréen) valable métro + bus + taxi",
      "T-money : achetez à l'aéroport Incheon, rechargez partout (₩1000 minimum)",
      "Séoul métro très simple : annonces en français dans les grandes stations",
      "Dernière rame de métro : ~23h30 Tokyo / ~24h Séoul",
    ]
  },
  {
    title: `✈️ Vols intérieurs & Ferries`,
    color: '#8e44ad',
    items: [
      "Kyoto → Séoul : aucun vol direct — prendre le Shinkansen jusqu'à Osaka/Kansai Airport",
      "Vol Osaka (KIX) → Séoul (ICN) : ~1h30 — Air Korea, Peach, Jeju Air",
      "Séoul → Tokyo : vol Gimpo (GMP) → Haneda (HND) = plus pratique que Incheon",
      "Ferry Busan → Fukuoka (Japon) : option si vous souhaitez revenir par mer",
      "Réservez les vols intérieurs sur Skyscanner ou Jeju Air directement",
    ]
  },
  {
    title: `🚌 Bus & Navettes aéroport`,
    color: '#f39c12',
    items: [
      "Osaka Kansai (KIX) → Namba : Haruka Express JR (50min, couvert JR Pass)",
      "Tokyo Haneda → centre : Monorail ou Keikyu (30min, ¥300-500)",
      "Seoul Incheon → centre : AREX Express (40min, ₩9500) ou bus limousine",
      "Busan Gimhae → centre : bus 307 (40min, ₩1700) ou métro ligne 2",
      "Gardez ¥1000 en cash à l'arrivée pour les navettes avant de recharger votre IC Card",
    ]
  },
  {
    title: `💡 Conseils pratiques`,
    color: '#0b1f3a',
    items: [
      "Google Maps fonctionne parfaitement pour les transports au Japon et en Corée",
      "Téléchargez les cartes hors-ligne Google Maps avant le départ",
      "Apps utiles : Japan Official Travel App, Naver Map (Corée), Kakao Map (Corée)",
      "Les taxis sont chers mais propres — évitez aux heures de pointe",
      "Ne mangez pas dans le métro au Japon (impoli)",
      "Files séparées montée/descente sur les quais — respectez l'ordre",
    ]
  },
]

function TransportPage() {
  const [open, setOpen] = React.useState(null)
  return (
    <motion.div key="transport" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#0b1f3a,#1a3a6b)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>🚆 Guide Transports</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>JR Pass · IC Card · Métro · Aéroport</div>
      </div>
      {TRANSPORT_INFO.map((section, i) => (
        <div key={section.title} style={{ background:'#fff', borderRadius:14, border:`2px solid ${section.color}`, overflow:'hidden' }}>
          <button onClick={() => setOpen(open===i ? null : i)}
            style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'0.9rem 1.1rem', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
            <span style={{ fontWeight:800, fontSize:'0.95rem', color:section.color }}>{section.title}</span>
            <span style={{ fontSize:'1.2rem', color:section.color }}>{open===i ? '▲' : '▼'}</span>
          </button>
          {open===i && (
            <div style={{ padding:'0 1.1rem 1rem' }}>
              {section.items.map((item, j) => (
                <div key={j} style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:'1px solid #f5f5f5', fontSize:'0.84rem', color:'#333', lineHeight:1.5 }}>
                  <span style={{ color:section.color, flexShrink:0 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  )
}

// ════ CHECKLIST PRÉ-DÉPART ════
const CHECKLIST_DEF = [
  { cat:'📄 Documents', items:['Passeports valides 6+ mois','Assurance voyage souscrite','Billets avion imprimés ou téléchargés','JR Pass commandé','Réservations hôtels confirmées','Carnet de vaccination','Photocopies documents (cloud + papier)',"Photos d'identité (x4 par personne)"] },
  { cat:'💳 Argent & Paiements', items:['Yens japonais (¥) — prévoir ~¥50 000/pers/semaine','Wons coréens (₩) — prévoir ~₩200 000/pers','CB Visa/Mastercard sans frais étrangers','Prévenir sa banque du voyage','Télécharger app banque','Code PIN à 4 chiffres connu'] },
  { cat:'📱 Tech & Connectivité', items:['SIM internationale ou Pocket WiFi réservé','Maps Japon + Corée téléchargées hors-ligne','App Suica / T-money','Adaptateur prise japonaise (Type A)','Batterie externe chargée (max 100Wh en cabine)','Chargeurs tous appareils','Écouteurs (film dans avion)'] },
  { cat:'👕 Bagages', items:['Valise ≤ 23kg + bagage cabine ≤ 10kg','Chaussures confortables (BEAUCOUP de marche)','Imperméable / coupe-vent','Vêtements été + 1 pull (clim forte Japon)','Chaussettes propres (déchausser souvent)','Maillots de bain (onsen, plage Busan)','Crème solaire SPF50+'] },
  { cat:'💊 Santé', items:['Médicaments habituels + ordonnances','Paracétamol / ibuprofène','Pansements + désinfectant','Anti-diarrhéique (changement alimentation)','Crème anti-moustiques','Masques chirurgicaux (courant en Asie)',"Carte européenne d'assurance maladie"] },
  { cat:'✈️ Jour J', items:['Arriver CDG 3h avant (vol Rome 09 juil.)',"Peluche / jeu enfant pour l'avion",'Collations avion',"Valider JR Pass à l'arrivée",'Retirer espèces au distributeur aéroport','Suica / T-money à acheter',"Note des numéros d'hôtel premiers jours"] },
]

function ChecklistPage() {
  const [checks, setChecks] = useLocalStorage(`checklist_items`, {})
  const [openCat, setOpenCat] = React.useState(CHECKLIST_DEF[0].cat)

  const toggle = (cat, item) => {
    const key = cat+'|'+item
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const total = CHECKLIST_DEF.reduce((s,c) => s + c.items.length, 0)
  const done  = Object.values(checks).filter(Boolean).length

  return (
    <motion.div key="checklist" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#27ae60,#2ecc71)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>✅ Checklist pré-départ</div>
        <div style={{ marginTop:8, background:'rgba(255,255,255,0.25)', borderRadius:8, height:10 }}>
          <div style={{ background:'#fff', height:10, borderRadius:8, width:`${(done/total)*100}%`, transition:'width 0.4s' }} />
        </div>
        <div style={{ fontSize:'0.82rem', marginTop:4 }}>{done} / {total} éléments cochés</div>
      </div>

      {CHECKLIST_DEF.map(cat => {
        const catDone = cat.items.filter(item => checks[cat.cat+'|'+item]).length
        return (
          <div key={cat.cat} style={{ background:'#fff', borderRadius:14, overflow:'hidden', border:'1px solid #eee' }}>
            <button onClick={() => setOpenCat(openCat===cat.cat ? null : cat.cat)}
              style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'0.9rem 1.1rem', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <span style={{ fontWeight:700, fontSize:'0.95rem', color:'#0b1f3a' }}>{cat.cat}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:'0.78rem', color: catDone===cat.items.length?'#27ae60':'#888' }}>
                  {catDone}/{cat.items.length}
                </span>
                <span>{openCat===cat.cat?'▲':'▼'}</span>
              </div>
            </button>
            {openCat===cat.cat && (
              <div style={{ padding:'0 0.8rem 0.8rem' }}>
                {cat.items.map(item => {
                  const checked = !!checks[cat.cat+'|'+item]
                  return (
                    <button key={item} onClick={() => toggle(cat.cat, item)}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 4px',
                        borderBottom:'1px solid #f5f5f5', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
                      <div style={{ width:22, height:22, borderRadius:6, flexShrink:0,
                        background: checked?'#27ae60':'#fff', border:`2px solid ${checked?'#27ae60':'#ccc'}`,
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {checked && <span style={{ color:'#fff', fontSize:'0.8rem', fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:'0.85rem', color: checked?'#aaa':'#333', textDecoration: checked?'line-through':'none', textAlign:'left' }}>
                        {item}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}

// ════ NOTES PAR JOUR ════
function NotesPage() {
  const [notes, setNotes] = useLocalStorage('voyage_notes', {})
  const [activeDay, setActiveDay] = React.useState(days[0].id)
  const day = days.find(d => d.id === activeDay) || days[0]

  return (
    <motion.div key="notes" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f9f7f2' }}>

      <div style={{ background:'#0b1f3a', padding:'1rem 1.2rem', color:'#fff', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontWeight:800, fontSize:'1.05rem' }}>📝 Mes notes de voyage</div>
        <div style={{ fontSize:'0.78rem', opacity:0.7, marginTop:2 }}>Souvenirs, adresses, remarques par journée</div>
      </div>

      {/* Sélecteur jour */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'6px 12px', overflowX:'auto', display:'flex', gap:6 }}>
        {days.map(d => (
          <button key={d.id} onClick={() => setActiveDay(d.id)}
            style={{ flexShrink:0, padding:'4px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'none', whiteSpace:'nowrap',
              background: activeDay===d.id ? '#0b1f3a' : '#f0f0f0',
              color: activeDay===d.id ? '#fff' : '#555' }}>
            {d.date} {notes[d.id] ? '📝' : ''}
          </button>
        ))}
      </div>

      {/* Zone de note */}
      <div style={{ flex:1, padding:'1rem', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ background:'#fff', borderRadius:14, padding:'0.9rem 1rem', border:'1px solid #e0e0e0' }}>
          <div style={{ fontWeight:700, color:'#0b1f3a', marginBottom:4 }}>{day.date} — {day.city}</div>
          <div style={{ fontSize:'0.8rem', color:'#888', marginBottom:8 }}>{day.title}</div>
          <textarea
            value={notes[activeDay] || ''}
            onChange={e => setNotes(prev => ({ ...prev, [activeDay]: e.target.value }))}
            placeholder="Tes souvenirs, impressions, bonnes adresses, anecdotes..."
            style={{ width:'100%', minHeight:200, padding:'0.8rem', borderRadius:10, border:'1px solid #ddd',
              fontSize:'0.9rem', lineHeight:1.6, resize:'vertical', boxSizing:'border-box',
              fontFamily:'inherit', outline:'none', background:'#fafafa' }}
          />
          <div style={{ textAlign:'right', fontSize:'0.72rem', color:'#bbb', marginTop:4 }}>
            {(notes[activeDay]||'').length} caractères — sauvegardé automatiquement
          </div>
        </div>

        {/* Notes récentes */}
        {days.filter(d => notes[d.id] && d.id !== activeDay).length > 0 && (
          <div style={{ background:'#fff', borderRadius:14, padding:'0.9rem 1rem', border:'1px solid #e0e0e0' }}>
            <div style={{ fontWeight:700, color:'#0b1f3a', marginBottom:8, fontSize:'0.9rem' }}>📋 Autres jours avec notes</div>
            {days.filter(d => notes[d.id] && d.id !== activeDay).map(d => (
              <button key={d.id} onClick={() => setActiveDay(d.id)}
                style={{ width:'100%', textAlign:'left', background:'#f9f9f9', border:'1px solid #eee',
                  borderRadius:10, padding:'0.6rem 0.8rem', marginBottom:6, cursor:'pointer' }}>
                <div style={{ fontWeight:700, fontSize:'0.82rem', color:'#0b1f3a' }}>{d.date} — {d.city}</div>
                <div style={{ fontSize:'0.75rem', color:'#888', marginTop:2, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                  {notes[d.id].slice(0,80)}...
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}


// ════ FAVORIS ════
function FavorisPage() {
  const [favoris, setFavoris] = useLocalStorage('mes_favoris', [])
  const removeFav = (id) => setFavoris(prev => prev.filter(f => f.id !== id))

  const restos = favoris.filter(f => f.type === 'resto')
  const spots  = favoris.filter(f => f.type === 'spot')

  return (
    <motion.div key="favoris" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#e1306c,#c0392b)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>❤️ Mes Favoris</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>Tes restaurants et lieux sauvegardés</div>
      </div>

      {favoris.length === 0 && (
        <div style={{ background:'#fff', borderRadius:14, padding:'2rem', textAlign:'center', color:'#888' }}>
          <div style={{ fontSize:'2rem', marginBottom:8 }}>🤍</div>
          <div style={{ fontWeight:700 }}>Aucun favori pour l'instant</div>
          <div style={{ fontSize:`0.82rem`, marginTop:4 }}>Appuie sur 🤍 dans la section Explorer pour sauvegarder des adresses</div>
        </div>
      )}

      {restos.length > 0 && (
        <div style={{ background:'#fff', borderRadius:14, padding:'1rem', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, color:'#e8523a', marginBottom:10 }}>🍜 Restaurants ({restos.length})</div>
          {restos.map(f => {
            const r = RESTAURANTS_DB.find(x => x.id === f.id)
            if (!r) return null
            return (
              <div key={f.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{r.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'#888' }}>{r.city} · {r.type} · {r.price} {r.budget}</div>
                  <div style={{ fontSize:'0.72rem', color:'#aaa', fontStyle:'italic' }}>{r.meal}</div>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button onClick={() => window.open(r.tripadvisor,'_blank')} style={{ ...triBtnStyle, fontSize:'0.7rem', padding:'4px 8px' }}>TA</button>
                  <button onClick={() => removeFav(f.id)} style={{ background:'#fee', border:'none', borderRadius:8, padding:'4px 8px', cursor:'pointer', fontSize:'0.85rem' }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {spots.length > 0 && (
        <div style={{ background:'#fff', borderRadius:14, padding:'1rem', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, color:'#833ab4', marginBottom:10 }}>📸 Lieux ({spots.length})</div>
          {spots.map(f => {
            const s = SPOTS_DB.find(x => x.name+x.city === f.id)
            if (!s) return null
            return (
              <div key={f.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{s.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'#888' }}>{s.city} · {s.cat} · {s.heure}</div>
                </div>
                <button onClick={() => removeFav(f.id)} style={{ background:'#fee', border:'none', borderRadius:8, padding:'4px 8px', cursor:'pointer', fontSize:'0.85rem' }}>🗑</button>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ════ SHOPPING ════
const SHOPPING_DB = [
  { cat:'🍫 Douceurs à ramener', emoji:'🍫', items:[
    { name:'Kit Kat saveurs Japon', desc:"Matcha, wasabi, sakura, patate douce — introuvables en France", ou:'Combinis, aéroport KIX', prix:'¥600/boîte' },
    { name:'Pocky & Pretz éditions limitées', desc:'Saveurs saisonnières et régionales exclusives', ou:'7-Eleven, Lawson', prix:'¥150-300' },
    { name:'Daifuku & Wagashi frais', desc:'Mochi à la crème, dorayaki — à consommer sur place', ou:'Patisseries locales, marchés', prix:'¥200-500' },
    { name:'Thé Matcha Ito En', desc:'Meilleur rapport qualité/prix, grandes boîtes', ou:'Supermarchés, aéroport', prix:'¥800-2000' },
    { name:'Confiseries coréennes', desc:'Choco Pie, Pepero, Yakgwa — snacks emblématiques', ou:'Myeongdong, supermarchés KR', prix:'₩2000-5000' },
  ]},
  { cat:'💄 Beauté & Cosmétiques', emoji:'💄', items:[
    { name:'Masques visage coréens', desc:"Tony Moly, Innisfree, Mediheal — 10x moins chers qu'en France", ou:'Myeongdong, Olive Young', prix:'₩500-2000/masque' },
    { name:'Crème BB & cushion', desc:'Formules coréennes très couvrantes et légères', ou:'Olive Young (toutes villes)', prix:'₩15000-35000' },
    { name:'Sérum Snail Repair', desc:'Crème escargot réparatrice — best-seller mondial', ou:'Innisfree, Nature Republic', prix:'₩20000-40000' },
    { name:'Produits Shiseido / Kose', desc:'Cosmétiques japonais premium à prix japonais', ou:'Drugstores JP (Matsumoto Kiyoshi)', prix:'¥1500-5000' },
    { name:'Parfum Issey Miyake', desc:"Prix duty-free bien plus bas qu'en France", ou:"Aéroports JP/KR", prix:'¥8000-15000' },
  ]},
  { cat:'🎌 Souvenirs Japon', emoji:'🎌', items:[
    { name:'Netsuke & figurines Maneki-neko', desc:'Chats porte-bonheur en céramique', ou:'Asakusa, Nishiki Market', prix:'¥500-3000' },
    { name:'Tenugui (tissus imprimés)', desc:'Foulards japonais traditionnels peints à la main', ou:'Kyoto, Tokyo artisans', prix:'¥800-2000' },
    { name:'Baguettes laquées', desc:'En bois de cerisier ou bambou, boîtes cadeau', ou:'Nishiki Kyoto, Asakusa', prix:'¥500-3000' },
    { name:'Papier Washi', desc:'Papier traditionnel pour origami ou déco', ou:'Papeteries Kyoto', prix:'¥300-1500' },
    { name:'Sake régional', desc:'Bouteilles de sake locale de Kyoto ou Nara', ou:'Fushimi Kyoto, supermarchés', prix:'¥1000-3000' },
    { name:'Capsule toys Gachapon', desc:'Figurines aléatoires dans des capsules — collectors!', ou:'Akihabara, partout JP', prix:'¥100-500' },
  ]},
  { cat:'🇰🇷 Souvenirs Corée', emoji:'🇰🇷', items:[
    { name:'Poupées Hahoetal (masques)', desc:'Masques traditionnels coréens, très colorés', ou:'Insadong, marchés', prix:'₩5000-20000' },
    { name:'Céramique Celadon', desc:'Poterie vert jade emblématique de la Corée', ou:'Insadong, Gyeongbokgung', prix:'₩15000-50000' },
    { name:'Épices ramyeon bag', desc:"Assortiment de ramyeon introuvable en France", ou:'Gwangjang Market, combinis', prix:'₩5000-15000' },
    { name:'Cartes K-pop officielles', desc:'Photocards des groupes BTS, Blackpink, etc.', ou:'SM Town, Myeongdong', prix:'₩3000-20000' },
    { name:'Chaussettes coréennes', desc:'Design unique, imprimés drôles — cadeau parfait', ou:'Partout (marchés, boutiques)', prix:'₩1000-3000' },
  ]},
  { cat:'💡 Pratique & Tech', emoji:'💡', items:[
    { name:'Adaptateur prise Japon (Type A)', desc:"Prises plates en J — si pas encore acheté", ou:'Aéroport CDG ou Amazon', prix:'€5-15' },
    { name:'Batterie externe Anker', desc:"Moins chère en Asie qu'en France", ou:'Akihabara, Yodobashi Camera', prix:'¥3000-6000' },
    { name:'Parapluie pliable Japonais', desc:'Qualité supérieure, très légers et compacts', ou:'Combinis JP (¥500 basique!)', prix:'¥500-2000' },
    { name:'Ventilateur de poche', desc:'Indispensable en juillet — chaleur intense', ou:'Combinis, Dollar stores JP/KR', prix:'¥300-1500' },
  ]},
]

function ShoppingPage() {
  const [openCat, setOpenCat] = useState(null)
  const [checkedItems, setCheckedItems] = useLocalStorage('shopping_checked', {})
  const toggle = (key) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <motion.div key="shopping" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#f39c12,#e67e22)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>🛍️ Que ramener ?</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>Douceurs · Beauté · Souvenirs · Tech</div>
      </div>

      {SHOPPING_DB.map((cat, ci) => (
        <div key={cat.cat} style={{ background:'#fff', borderRadius:14, overflow:'hidden', border:'1px solid #eee' }}>
          <button onClick={() => setOpenCat(openCat===ci ? null : ci)}
            style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'0.9rem 1.1rem', background:'none', border:'none', cursor:'pointer' }}>
            <span style={{ fontWeight:800, fontSize:'0.95rem', color:'#0b1f3a' }}>{cat.cat}</span>
            <span>{openCat===ci?'▲':'▼'}</span>
          </button>
          {openCat===ci && (
            <div style={{ padding:'0 0.8rem 0.8rem' }}>
              {cat.items.map((item, ii) => {
                const key = ci+'-'+ii
                const done = !!checkedItems[key]
                return (
                  <div key={ii} style={{ padding:'8px 4px', borderBottom:'1px solid #f5f5f5' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                      <button onClick={() => toggle(key)}
                        style={{ width:22, height:22, borderRadius:6, flexShrink:0, marginTop:2,
                          background: done?'#f39c12':'#fff', border:`2px solid ${done?'#f39c12':'#ccc'}`,
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {done && <span style={{ color:'#fff', fontSize:'0.75rem', fontWeight:700 }}>✓</span>}
                      </button>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:'0.88rem', color: done?'#bbb':'#0b1f3a', textDecoration:done?'line-through':'none' }}>{item.name}</div>
                        <div style={{ fontSize:'0.78rem', color:'#666', marginTop:2 }}>{item.desc}</div>
                        <div style={{ display:'flex', gap:12, marginTop:4, fontSize:'0.72rem' }}>
                          <span style={{ color:'#888' }}>📍 {item.ou}</span>
                          <span style={{ color:'#27ae60', fontWeight:700 }}>{item.prix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  )
}

// ════ SANTÉ & URGENCE ════
function SantePage() {
  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer')
  const SECTIONS = [
    {
      title: "🚨 Numéros d'urgence", color:'#e53935',
      items:[
        { label:'🇯🇵 Police Japon', val:'110', action:'tel:110' },
        { label:'🇯🇵 Ambulance/Pompiers Japon', val:'119', action:'tel:119' },
        { label:'🇰🇷 Police Corée', val:'112', action:'tel:112' },
        { label:'🇰🇷 Ambulance Corée', val:'119', action:'tel:119' },
        { label:'🇫🇷 Ambassade France Tokyo', val:'+81 3-5798-6000', action:'tel:+81357986000' },
        { label:'🇫🇷 Ambassade France Séoul', val:'+82 2-3149-4300', action:'tel:+82231494300' },
      ]
    },
    {
      title: '🏥 Hôpitaux avec English/French', color:'#e53935',
      items:[
        { label:"Tokyo — St. Luke's International", val:'Chuo-ku', action:'https://www.luke.ac.jp/eng/' },
        { label:'Tokyo — International Clinic', val:'Roppongi', action:'https://www.intlclinic.com/' },
        { label:'Osaka — Otemae Hospital', val:'Chuo-ku Osaka', action:'https://www.otemae.osakafu-hosp.jp/' },
        { label:'Séoul — Severance Hospital', val:'Sinchon, Séoul', action:'https://www.severance.or.kr/eng/' },
        { label:'Séoul — Samsung Medical Center', val:'Gangnam, Séoul', action:'https://www.samsunghospital.com/gb/main/index.do' },
      ]
    },
    {
      title: '💊 Pharmacies & Médicaments', color:'#2196f3',
      items:[
        { label:'Matsumoto Kiyoshi (JP)', val:'Chaîne pharmacie partout', action:'https://www.matsukiyo.co.jp/' },
        { label:'Welcia / Sundrug (JP)', val:'24h dans grandes villes', action:'https://www.welcia.co.jp/' },
        { label:'Olive Young (KR)', val:'Pharmacie + cosmétiques', action:'https://www.oliveyoung.co.kr/' },
        { label:'Dolgestin (JP) = paracétamol', val:'En vente libre', action:null },
        { label:'Loperamide (JP/KR)', val:'Anti-diarrhéique', action:null },
        { label:'Bufferin (JP) = ibuprofène', val:'En vente libre', action:null },
      ]
    },
    {
      title: '🌡️ Conseils santé été', color:'#ff9800',
      items:[
        { label:'Chaleur extrême juillet', val:'35°C+ avec humidité — hydratez-vous !', action:null },
        { label:'Coup de chaleur', val:'Cherchez la clim immédiatement, sel+eau', action:null },
        { label:'Vending machines', val:'Boissons froides partout — profitez-en !', action:null },
        { label:'Masques', val:'Portez un masque dans les transports bondés', action:null },
        { label:'Crème solaire', val:'Réappliquez toutes les 2h — soleil très fort', action:null },
        { label:'Belly band', val:'Protège du froid excessif de la clim (surtout enfants)', action:null },
      ]
    },
  ]
  return (
    <motion.div key="sante" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#e53935,#b71c1c)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>🏥 Santé & Urgences</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>Numéros · Hôpitaux · Pharmacies · Conseils</div>
      </div>
      {SECTIONS.map(section => (
        <div key={section.title} style={{ background:'#fff', borderRadius:14, padding:'1rem', border:`2px solid ${section.color}20` }}>
          <div style={{ fontWeight:800, color:section.color, marginBottom:10, fontSize:'0.95rem' }}>{section.title}</div>
          {section.items.map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #f5f5f5' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.85rem' }}>{item.label}</div>
                <div style={{ fontSize:'0.75rem', color:'#888' }}>{item.val}</div>
              </div>
              {item.action && (
                <button onClick={() => item.action.startsWith('tel:') ? window.location.href=item.action : open(item.action)}
                  style={{ background:section.color, color:'#fff', border:'none', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'0.78rem', fontWeight:700 }}>
                  {item.action.startsWith('tel:') ? '📞 Appeler' : '🌐 Ouvrir'}
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  )
}

// ════ SIM & WIFI ════
function SimPage() {
  const OPTIONS = [
    {
      title: '📶 SIM Internationale (recommandé)',
      color:'#27ae60',
      pros:['Pas de configuration compliquée','Fonctionne en Japon ET Corée','Données illimitées souvent incluses','Prix fixe prévisible'],
      cons:['Perdez votre numéro FR temporairement','Appels FR souvent non inclus'],
      recomm:"Airalo (eSIM) ou Ubigi — achetez l'eSIM avant le départ sur leur app",
      prix:`~15€ pour 10Go / 30 jours Japon+Corée`,
      lien:'https://www.airalo.com/',
    },
    {
      title: '📡 Pocket WiFi (très populaire)',
      color:'#3a7bd5',
      pros:['Plusieurs appareils connectés simultanément','Gardez votre numéro FR actif','Excellente couverture Japon'],
      cons:['Batterie à recharger chaque soir','Objet à ne pas perdre (caution)',"Récupération/retour à l'aéroport"],
      recomm:'Global WiFi ou IIJmio — réservez en ligne avant le départ',
      prix:"~500¥/jour — livré à l'aéroport à l'arrivée",
      lien:'https://www.globalwifi.com.au/',
    },
    {
      title: '📱 SIM Locale Japon (au KIX)',
      color:'#8e44ad',
      pros:["Achat simple à l'aéroport",'Bon débit 4G/5G','Pas de caution'],
      cons:['Valable Japon uniquement','Racheter une SIM pour la Corée'],
      recomm:'IIJmio ou Mobal — distributeurs aéroport Kansai (KIX) arrivée',
      prix:'~¥3000 pour 15Go / 30 jours',
      lien:'https://www.iijmio.jp/service/tourist/',
    },
    {
      title: '🇰🇷 SIM Locale Corée (à Incheon)',
      color:'#e8523a',
      pros:['Très bon marché','5G ultrarapide Séoul','Données illimitées souvent'],
      cons:['Corée uniquement'],
      recomm:'KT Olleh ou SK Telecom — boutiques aéroport Incheon arrivées',
      prix:'~₩15000 pour illimité / 10 jours',
      lien:'https://roaming.kt.com/en/index.html',
    },
  ]
  return (
    <motion.div key="sim" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="page-stack">
      <div style={{ background:'linear-gradient(135deg,#00b4db,#0083b0)', borderRadius:16, padding:'1.2rem 1.4rem', color:'#fff' }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem' }}>📶 SIM & Connexion Internet</div>
        <div style={{ fontSize:'0.8rem', opacity:0.75, marginTop:2 }}>Comparez les options — restez connectés partout</div>
      </div>
      <div style={{ background:'#fffbea', border:'1px solid #f0d060', borderRadius:12, padding:'0.9rem 1.1rem', fontSize:'0.82rem', color:'#7a6010' }}>
        💡 <b>Notre conseil :</b> L'eSIM Airalo est la solution la plus simple pour toute la famille — Japon + Corée en une seule souscription depuis votre téléphone.
      </div>
      {OPTIONS.map(opt => (
        <div key={opt.title} style={{ background:'#fff', borderRadius:14, padding:'1rem', border:`2px solid ${opt.color}` }}>
          <div style={{ fontWeight:800, color:opt.color, fontSize:'0.95rem', marginBottom:8 }}>{opt.title}</div>
          <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#27ae60', marginBottom:6 }}>{opt.prix}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
            <div style={{ background:'#e8f5e9', borderRadius:8, padding:'0.5rem' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#27ae60', marginBottom:3 }}>✅ Avantages</div>
              {opt.pros.map((p,i) => <div key={i} style={{ fontSize:'0.75rem', color:'#333' }}>• {p}</div>)}
            </div>
            <div style={{ background:'#fce4ec', borderRadius:8, padding:'0.5rem' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#e53935', marginBottom:3 }}>⚠️ Inconvénients</div>
              {opt.cons.map((c,i) => <div key={i} style={{ fontSize:'0.75rem', color:'#333' }}>• {c}</div>)}
            </div>
          </div>
          <div style={{ fontSize:'0.78rem', color:'#555', fontStyle:'italic', marginBottom:8 }}>📌 {opt.recomm}</div>
          <button onClick={() => window.open(opt.lien,'_blank')}
            style={{ background:opt.color, color:'#fff', border:'none', borderRadius:10, padding:'0.5rem 1rem', cursor:'pointer', fontWeight:700, fontSize:'0.82rem', width:'100%' }}>
            🌐 Voir l'offre
          </button>
        </div>
      ))}
    </motion.div>
  )
}


// ════ PLANS MÉTRO ════
const METRO_DATA = {
  Osaka: {
    flag: `🇯🇵`,
    color: '#e8523a',
    mapUrl: 'https://www.osakametro.co.jp/en/guide/map/img/rosenzu_en.png',
    pdfUrl: 'https://www.osakametro.co.jp/en/guide/map/',
    googleMaps: 'https://maps.app.goo.gl/osaka-metro',
    appStore: 'https://www.osakametro.co.jp/en/guide/app/',
    tip: 'Utilisez la ligne Midosuji (rouge) pour rejoindre Namba ↔ Umeda. Achetez un Osaka 1-Day Pass (¥800) pour les journées intenses.',
    lines: [
      { name: 'Midosuji', color: '#e60012', num: 'M', stations: ['Shin-Osaka','Umeda','Shinsaibashi','Namba','Tennoji'] },
      { name: 'Tanimachi', color: '#b36419', num: 'T', stations: ['Higashi-Umeda','Tanimachi 4-chome','Shitennoji','Tennoji'] },
      { name: 'Yotsubashi', color: '#0066b3', num: 'Y', stations: ['Nishi-Umeda','Yotsubashi','Namba (Namba Walk)'] },
      { name: 'Chuo', color: '#00a7db', num: 'C', stations: ['Cosmosquare','Osaka Port','Honmachi','Tanimachi 4-chome'] },
    ],
    keyStations: [
      { name: 'Namba (難波)', lines: ['M','Y','Se'], note: 'Centre Dotonbori, hôtel, shopping' },
      { name: 'Umeda (梅田)', lines: ['M','T','Y'], note: 'Gare JR, département Hankyu' },
      { name: 'Tennoji (天王寺)', lines: ['M','T'], note: 'Zoo, Abeno Harukas, Shinsekai' },
      { name: 'Shin-Osaka (新大阪)', lines: ['M'], note: 'Shinkansen vers Tokyo/Kyoto' },
      { name: 'Osaka Port (大阪港)', lines: ['C'], note: 'Aquarium Kaiyukan' },
    ]
  },
  Kyoto: {
    flag: '🇯🇵',
    color: '#8e44ad',
    mapUrl: 'https://www.city.kyoto.lg.jp/kotsu/cmsfiles/contents/0000016/16373/subway_map_e.pdf',
    pdfUrl: 'https://www.city.kyoto.lg.jp/kotsu/page/0000016373.html',
    googleMaps: 'https://maps.app.goo.gl/kyoto-subway',
    appStore: 'https://onepass.city.kyoto.lg.jp/',
    tip: 'Kyoto a seulement 2 lignes de métro. Utilisez le bus pour Fushimi Inari (Bus 5) et Arashiyama (Bus 28). Achetez le Kyoto 1-Day Bus Pass (¥700).',
    lines: [
      { name: 'Karasuma (Nord-Sud)', color: '#00885a', num: 'K', stations: ['Kokusaikaikan','Kitaoji','Kinkakuji-michi','Imadegawa','Kyoto Shiyakusho-mae','Kyoto (JR)','Toji','Takeda'] },
      { name: 'Tozai (Est-Ouest)', color: '#e0832a', num: 'T', stations: ['Rokujizo','Daigo','Yamashina','Higashiyama','Kyoto Shiyakusho-mae','Karasuma-Oike','Nijo','Uzumasa Tenjingawa'] },
    ],
    keyStations: [
      { name: 'Kyoto (京都)', lines: ['K','JR'], note: 'Gare principale, Shinkansen' },
      { name: 'Karasuma-Oike (烏丸御池)', lines: ['K','T'], note: 'Correspondance, centre-ville' },
      { name: 'Higashiyama (東山)', lines: ['T'], note: 'Kiyomizudera, Sannenzaka' },
      { name: 'Shijo (四条)', lines: ['K'], note: 'Gion, Pontocho, shopping' },
      { name: 'Kitaoji (北大路)', lines: ['K'], note: 'Bus vers Kinkaku-ji' },
    ]
  },
  Tokyo: {
    flag: '🇯🇵',
    color: '#c0392b',
    mapUrl: 'https://www.tokyometro.jp/en/subwaymap/img/metromap_en.png',
    pdfUrl: 'https://www.tokyometro.jp/en/subwaymap/',
    googleMaps: 'https://maps.app.goo.gl/tokyo-metro',
    appStore: 'https://www.tokyometro.jp/en/app/',
    tip: 'Tokyo a 13 lignes. Utilisez Google Maps pour naviguer — il indique toujours le bon quai. La Yamanote Line (verte JR, ¥200 flatrate) fait le tour des spots principaux.',
    lines: [
      { name: 'Yamanote (JR)', color: '#9acd32', num: 'JY', stations: ['Shinjuku','Harajuku','Shibuya','Osaki','Shinagawa','Tokyo','Akihabara','Ueno','Ikebukuro','Shinjuku'] },
      { name: 'Ginza', color: '#f39700', num: 'G', stations: ['Asakusa','Ueno','Ginza','Shimbashi','Shibuya'] },
      { name: 'Hibiya', color: '#9caeb7', num: 'H', stations: ['Naka-Meguro','Ebisu','Roppongi','Ginza','Akihabara','Ueno'] },
      { name: 'Hanzomon', color: '#8f76d6', num: 'Z', stations: ['Shibuya','Omotesando','Hanzomon','Kudanshita','Otemachi'] },
      { name: 'Chiyoda', color: '#00bb85', num: 'C', stations: ['Yoyogi-Uehara','Omotesando','Akasaka','Otemachi','Ayase'] },
    ],
    keyStations: [
      { name: 'Shinjuku (新宿)', lines: ['JY','M','O'], note: 'Hub principal, Kabukicho, Golden Gai' },
      { name: 'Shibuya (渋谷)', lines: ['JY','G','H','Z'], note: 'Crossing, shopping, jeunesse' },
      { name: 'Asakusa (浅草)', lines: ['G','A'], note: 'Senso-ji, marché, vieux Tokyo' },
      { name: 'Harajuku (原宿)', lines: ['JY','C'], note: 'Takeshita Street, Meiji Jingu' },
      { name: 'Ueno (上野)', lines: ['JY','G','H','A'], note: 'Musées, zoo, marché Ameyoko' },
      { name: 'Akihabara (秋葉原)', lines: ['JY','H'], note: 'Électronique, manga, retrogaming' },
      { name: 'Roppongi (六本木)', lines: ['H','O'], note: 'Musées art, vie nocturne' },
    ]
  },
  Nara: {
    flag: '🇯🇵',
    color: '#8B6914',
    mapUrl: 'https://www.kintetsu.co.jp/railway/Rosen/A50001.html',
    pdfUrl: 'https://www.kintetsu.co.jp/railway/Rosen/A50001.html',
    googleMaps: 'https://maps.app.goo.gl/nara',
    appStore: 'https://onepass.city.kyoto.lg.jp/',
    tip: 'Nara se visite principalement à pied depuis les gares Kintetsu Nara ou JR Nara. Les daims sont partout dans le Nara Park ! Trajet depuis Osaka : 30 min en Kintetsu (¥560).',
    lines: [
      { name: 'Kintetsu Nara Line', color: '#8B6914', num: 'KN', stations: ['Osaka Namba','Tsuruhashi','Yamato-Saidaiji','Kintetsu Nara'] },
      { name: 'JR Yamatoji', color: '#0072BC', num: 'JR', stations: ['Osaka','Tennoji','Oji','JR Nara'] },
    ],
    keyStations: [
      { name: 'Kintetsu Nara (近鉄奈良)', lines: ['KN'], note: 'La plus proche du Nara Park et des daims' },
      { name: 'JR Nara (JR奈良)', lines: ['JR'], note: 'Gare JR, bus vers Todai-ji' },
      { name: 'Yamato-Saidaiji (大和西大寺)', lines: ['KN'], note: 'Correspondance vers Kyoto et Osaka' },
    ]
  },
  Séoul: {
    flag: '🇰🇷',
    color: '#2471a3',
    mapUrl: 'https://www.seoulmetro.co.kr/en/file/linemap_en.gif',
    pdfUrl: 'https://www.seoulmetro.co.kr/en/page.do?menuIdx=551',
    googleMaps: 'https://maps.app.goo.gl/seoul-metro',
    appStore: 'https://www.kakaocorp.com/page/service/service/KakaoMap',
    tip: 'Séoul a 9 lignes numérotées + AREX (aéroport). Utilisez la T-money Card (rechargeable). Les annonces sont aussi en anglais et français dans les grandes stations.',
    lines: [
      { name: 'Ligne 1', color: '#0052A4', num: '1', stations: ['Incheon','Bupyeong','Guro','Seoul Station','Yongsan','Cheongnyangni'] },
      { name: 'Ligne 2', color: '#00A84D', num: '2', stations: ['Hongdae','Sinchon','Ewha','City Hall','Dongdaemun','Gangnam','Jamsil','Hongdae (boucle)'] },
      { name: 'Ligne 3', color: '#EF7C1C', num: '3', stations: ['Gupabal','Gyeongbokgung','Anguk','Jongno 3-ga','Dongdaemun','Express Bus Terminal'] },
      { name: 'Ligne 4', color: '#009BCD', num: '4', stations: ['Danggogae','Miasageori','Seoul Station','Myeongdong','Dongdaemun History'] },
      { name: 'Ligne 9', color: '#BDB092', num: '9', stations: ['Gimpo Airport','Yeongdeungpo','Noryangjin','Express Bus Terminal','Sinnonhyeon','Bongeunsa'] },
    ],
    keyStations: [
      { name: 'Myeongdong (명동)', lines: ['4'], note: 'Shopping, street food, cosmétiques' },
      { name: 'Gyeongbokgung (경복궁)', lines: ['3'], note: 'Palais royal, Bukchon' },
      { name: 'Hongdae (홍대입구)', lines: ['2','AREX'], note: 'Clubs, K-indie, street art' },
      { name: 'Gangnam (강남)', lines: ['2'], note: 'Quartier luxe, K-pop, Gangnam Style' },
      { name: 'Dongdaemun (동대문)', lines: ['1','2','4'], note: 'Marché 24h, shopping mode' },
      { name: 'Seoul Station (서울역)', lines: ['1','4','AREX'], note: 'Gare KTX, navette aéroport' },
      { name: 'Insadong (인사동)', lines: ['3→Anguk'], note: 'Artisanat, galeries, thé' },
    ]
  },
  Busan: {
    flag: '🇰🇷',
    color: '#27ae60',
    mapUrl: 'https://www.humetro.busan.kr/eng/file/linemap_en.jpg',
    pdfUrl: 'http://www.humetro.busan.kr/eng/main/index.do',
    googleMaps: 'https://maps.app.goo.gl/busan-metro',
    appStore: 'https://www.kakaocorp.com/page/service/service/KakaoMap',
    tip: `Busan a 4 lignes. La Ligne 1 (orange) relie Haeundae au centre. Achetez la T-money à l'aéroport — fonctionne partout. Taxi peu cher pour les courtes distances.`,
    lines: [
      { name: 'Ligne 1', color: '#E05B2C', num: '1', stations: ['Nopo','Seomyeon','Busan Station','Nampo','Jagalchi','Toseong'] },
      { name: 'Ligne 2', color: '#30A9DE', num: '2', stations: ['Jangsan','Haeundae','Centum City','Seomyeon','Sasang','Yangsan'] },
      { name: 'Ligne 3', color: '#9B6B29', num: '3', stations: ['Daejeo','Deokcheon','Yeonsan','Suyeong','Baekyangsan'] },
      { name: 'Ligne 4 (Gireum)', color: '#2DBF2D', num: '4', stations: ['Minam','Banyeo','Anpyeong','Danggam'] },
    ],
    keyStations: [
      { name: 'Haeundae (해운대)', lines: ['2'], note: 'Plage, The Bay 101, Centum City' },
      { name: 'Nampo (남포)', lines: ['1'], note: 'BIFF Square, Jagalchi Market' },
      { name: 'Seomyeon (서면)', lines: ['1','2'], note: 'Hub principal de Busan' },
      { name: 'Busan Station (부산역)', lines: ['1'], note: 'Gare KTX depuis/vers Séoul' },
      { name: 'Centum City (센텀시티)', lines: ['2'], note: 'Shinsegae le + grand mall' },
      { name: 'Suyeong (수영)', lines: ['2','3'], note: 'Gwangalli Beach à pied' },
    ]
  },
}

function MetroPage() {
  const [city, setCity] = useState('Osaka')
  const [view, setView] = useState('plan') // 'plan' | 'map'
  const [userPos, setUserPos] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle') // idle | loading | ok | denied
  const [nearestLine, setNearestLine] = useState(null)
  const metro = METRO_DATA[city]
  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer')

  // City centers for the interactive map
  const CITY_CENTERS = {
    Osaka:  { lat: 34.6937, lng: 135.5023, zoom: 13 },
    Kyoto:  { lat: 35.0116, lng: 135.7681, zoom: 13 },
    Nara:   { lat: 34.6851, lng: 135.8048, zoom: 14 },
    Tokyo:  { lat: 35.6762, lng: 139.6503, zoom: 12 },
    Séoul:  { lat: 37.5665, lng: 126.9780, zoom: 12 },
    Busan:  { lat: 35.1796, lng: 129.0756, zoom: 13 },
  }

  // Géolocalisation
  const locateMe = () => {
    if (!navigator.geolocation) { setGeoStatus('denied'); return }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoStatus('ok')
        // Trouver la ville la plus proche
        let closest = 'Osaka', minD = Infinity
        for (const [c, center] of Object.entries(CITY_CENTERS)) {
          const d = Math.hypot(pos.coords.latitude - center.lat, pos.coords.longitude - center.lng)
          if (d < minD) { minD = d; closest = c }
        }
        if (minD < 2) setCity(closest) // auto-switch si dans la ville
      },
      () => setGeoStatus('denied'),
      { timeout: 8000 }
    )
  }

  // Construire l'URL OpenStreetMap avec marqueur utilisateur
  const buildMapUrl = () => {
    const center = CITY_CENTERS[city]
    if (!center) return ''
    const zoom = center.zoom
    const lat = userPos ? userPos.lat : center.lat
    const lng = userPos ? userPos.lng : center.lng
    // OpenStreetMap embed with public transport layer
    if (userPos) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng-0.08}%2C${center.lat-0.06}%2C${center.lng+0.08}%2C${center.lat+0.06}&layer=transportmap&marker=${userPos.lat}%2C${userPos.lng}`
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng-0.08}%2C${center.lat-0.06}%2C${center.lng+0.08}%2C${center.lat+0.06}&layer=transportmap`
  }

  // Plan images officiels (haute résolution)
  const PLAN_IMAGES = {
    Osaka: 'https://www.osakametro.co.jp/en/guide/map/img/rosenzu_en.png',
    Kyoto: 'https://www2.city.kyoto.lg.jp/kotsu/webguide/img_network/subway_map_e.jpg',
    Nara:  'https://www.kintetsu.co.jp/railway/Rosen/A50001.html',
    Tokyo: 'https://www.tokyometro.jp/en/subwaymap/img/metromap_en.png',
    Séoul: 'https://www.seoulmetro.co.kr/en/file/linemap_en.gif',
    Busan: 'https://www.humetro.busan.kr/eng/file/linemap_en.jpg',
  }

  // PDF / liens officiels plans
  const PLAN_LINKS = {
    Osaka: { pdf: 'https://www.osakametro.co.jp/en/guide/map/', label: 'Osaka Metro EN' },
    Kyoto: { pdf: 'https://www2.city.kyoto.lg.jp/kotsu/webguide/img_network/subway_map_e.jpg', label: 'Kyoto Subway EN' },
    Nara:  { pdf: 'https://www.kintetsu.co.jp/railway/Rosen/A50001.html', label: 'Kintetsu Nara' },
    Tokyo: { pdf: 'https://www.tokyometro.jp/en/subwaymap/', label: 'Tokyo Metro EN' },
    Séoul: { pdf: 'https://www.seoulmetro.co.kr/en/page.do?menuIdx=551', label: 'Seoul Metro EN' },
    Busan: { pdf: 'http://www.humetro.busan.kr/eng/main/index.do', label: 'Humetro Busan EN' },
  }

  return (
    <motion.div key="metro" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ background:'#f5f5f5', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

      {/* ── Header ── */}
      <div style={{ background:'#0b1f3a', padding:'1rem 1.2rem', color:'#fff', position:'sticky', top:0, zIndex:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontWeight:800, fontSize:'1.05rem' }}>🚇 Cartes & Transports</div>
          <button onClick={locateMe}
            style={{ padding:'5px 12px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, border:'none', cursor:'pointer',
              background: geoStatus==='ok' ? '#27ae60' : geoStatus==='loading' ? '#f39c12' : geoStatus==='denied' ? '#e74c3c' : 'rgba(255,255,255,0.2)',
              color:'#fff' }}>
            {geoStatus==='loading' ? '⏳ Localisation…' : geoStatus==='ok' ? '📍 Localisé' : geoStatus==='denied' ? '🚫 GPS refusé' : '📍 Me localiser'}
          </button>
        </div>

        {/* Sélecteur villes */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', marginBottom:10 }}>
          {Object.keys(METRO_DATA).map(c => (
            <button key={c} onClick={() => setCity(c)}
              style={{ flexShrink:0, padding:'5px 14px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none',
                background: city===c ? METRO_DATA[c].color : 'rgba(255,255,255,0.15)', color:'#fff' }}>
              {METRO_DATA[c].flag} {c}
            </button>
          ))}
        </div>

        {/* Switch Plan / Carte */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.1)', borderRadius:12, padding:3 }}>
          {[
            { v:'plan', label:'🗺️ Plan officiel' },
            { v:'map',  label:'🌐 Carte interactive' },
            { v:'lines',label:'🚉 Lignes & stations' },
          ].map(({ v, label }) => (
            <button key={v} onClick={() => setView(v)}
              style={{ flex:1, padding:'6px 4px', borderRadius:10, fontSize:'0.75rem', fontWeight:700, border:'none', cursor:'pointer',
                background: view===v ? '#fff' : 'transparent',
                color: view===v ? '#0b1f3a' : '#fff' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bandeau géoloc info */}
      {geoStatus === 'ok' && userPos && (
        <div style={{ background:'#27ae60', color:'#fff', padding:'6px 16px', fontSize:'0.78rem', fontWeight:700, textAlign:'center' }}>
          📍 Position : {userPos.lat.toFixed(4)}°, {userPos.lng.toFixed(4)}° — visible sur la carte interactive
        </div>
      )}

      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

        {/* ══ VUE PLAN IMAGE ══ */}
        {view === 'plan' && (
          <div style={{ padding:'0.8rem', display:'flex', flexDirection:'column', gap:10 }}>
            {/* Tip */}
            <div style={{ background:'#fff', borderRadius:12, padding:'0.9rem 1rem', border:`2px solid ${metro.color}` }}>
              <div style={{ fontWeight:800, color:metro.color, marginBottom:6 }}>{metro.flag} {city} — Conseils transport</div>
              <div style={{ fontSize:'0.83rem', color:'#444', lineHeight:1.6 }}>💡 {metro.tip}</div>
            </div>

            {/* Image plan */}
            <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', border:`2px solid ${metro.color}` }}>
              <div style={{ background:metro.color, padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'#fff', fontWeight:700, fontSize:'0.85rem' }}>Plan officiel {city}</span>
                <button onClick={() => open(PLAN_LINKS[city].pdf)}
                  style={{ background:'rgba(255,255,255,0.25)', border:'none', color:'#fff', borderRadius:8, padding:'4px 10px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>
                  ↗ Ouvrir
                </button>
              </div>
              <div style={{ overflow:'auto', maxHeight:'55vh', background:'#f9f9f9' }}>
                <img
                  src={PLAN_IMAGES[city]}
                  alt={`Plan métro ${city}`}
                  style={{ width:'100%', display:'block', minHeight:200 }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div style={{ display:'none', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem 1rem', gap:12 }}>
                  <div style={{ fontSize:'2.5rem' }}>🗺️</div>
                  <div style={{ fontWeight:700, color:'#666', textAlign:'center' }}>Plan non disponible en aperçu</div>
                  <button onClick={() => open(PLAN_LINKS[city].pdf)}
                    style={{ background:metro.color, color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                    Voir le plan officiel ↗
                  </button>
                </div>
              </div>
            </div>

            {/* Boutons rapides */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={() => open(PLAN_LINKS[city].pdf)}
                style={{ background:metro.color, color:'#fff', border:'none', borderRadius:10, padding:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.8rem' }}>
                🗺️ Plan officiel
              </button>
              <button onClick={() => open(`https://maps.app.goo.gl/?q=${encodeURIComponent(city+' metro')}`)}
                style={{ background:'#4285f4', color:'#fff', border:'none', borderRadius:10, padding:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.8rem' }}>
                📍 Google Maps
              </button>
              <button onClick={() => open(metro.appStore)}
                style={{ background:'#333', color:'#fff', border:'none', borderRadius:10, padding:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.8rem' }}>
                📱 App officielle
              </button>
              <button onClick={() => { setView('map'); if(geoStatus==='idle') locateMe() }}
                style={{ background:'#27ae60', color:'#fff', border:'none', borderRadius:10, padding:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.8rem' }}>
                🌐 Carte interactive
              </button>
            </div>
          </div>
        )}

        {/* ══ VUE CARTE INTERACTIVE ══ */}
        {view === 'map' && (
          <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
            {/* Barre info */}
            <div style={{ background:'#fff', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee', gap:8, flexWrap:'wrap' }}>
              <div style={{ fontSize:'0.78rem', color:'#555' }}>
                Couche transport public OpenStreetMap
                {geoStatus !== 'ok' && <span style={{ color:'#e67e22' }}> — Appuie sur 📍 pour te localiser</span>}
              </div>
              <button onClick={() => open(`https://www.openstreetmap.org/#map=14/${CITY_CENTERS[city].lat}/${CITY_CENTERS[city].lng}&layers=T`)}
                style={{ background:'#0b1f3a', color:'#fff', border:'none', borderRadius:8, padding:'5px 10px', fontSize:'0.72rem', cursor:'pointer', fontWeight:700, whiteSpace:'nowrap' }}>
                ↗ Ouvrir plein écran
              </button>
            </div>

            {/* Iframe OSM */}
            <div style={{ position:'relative', flex:1, minHeight:'55vh' }}>
              <iframe
                key={city + (userPos ? userPos.lat : 'no')}
                src={buildMapUrl()}
                style={{ width:'100%', height:'100%', minHeight:'55vh', border:'none', display:'block' }}
                title={`Carte transport ${city}`}
                loading="lazy"
              />
              {/* Overlay bouton recentrer */}
              <div style={{ position:'absolute', bottom:16, right:12, display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={locateMe}
                  style={{ background:'#0b1f3a', color:'#fff', border:'none', borderRadius:50, width:44, height:44,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
                  📍
                </button>
                <button onClick={() => open(`https://www.google.com/maps/search/transport+station/@${CITY_CENTERS[city].lat},${CITY_CENTERS[city].lng},14z`)}
                  style={{ background:metro.color, color:'#fff', border:'none', borderRadius:50, width:44, height:44,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
                  🚉
                </button>
              </div>
            </div>

            {/* Légende transport */}
            <div style={{ background:'#fff', padding:'10px 12px', borderTop:'1px solid #eee', display:'flex', gap:12, overflowX:'auto', flexShrink:0 }}>
              {[
                { color:'#2979ff', label:'Métro' },
                { color:'#e53935', label:'Bus' },
                { color:'#43a047', label:'Tramway' },
                { color:'#f57c00', label:'Train' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                  <div style={{ width:14, height:5, background:color, borderRadius:3 }} />
                  <span style={{ fontSize:'0.72rem', color:'#555' }}>{label}</span>
                </div>
              ))}
              <div style={{ fontSize:'0.7rem', color:'#999', marginLeft:'auto', flexShrink:0 }}>© OpenStreetMap</div>
            </div>

            {/* Liens rapides Google Maps itinéraire */}
            {geoStatus === 'ok' && userPos && (
              <div style={{ background:'#f0f7ff', padding:'10px 12px', borderTop:'1px solid #dce8f5' }}>
                <div style={{ fontWeight:700, fontSize:'0.8rem', color:'#0b1f3a', marginBottom:6 }}>🚀 Itinéraire depuis ma position</div>
                <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
                  {metro.keyStations.slice(0,3).map(st => (
                    <button key={st.name} onClick={() => open(`https://www.google.com/maps/dir/${userPos.lat},${userPos.lng}/${encodeURIComponent(st.name)}`)}
                      style={{ flexShrink:0, background:metro.color, color:'#fff', border:'none', borderRadius:8, padding:'6px 10px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>
                      → {st.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ VUE LIGNES & STATIONS ══ */}
        {view === 'lines' && (
          <div style={{ padding:'0.8rem', display:'flex', flexDirection:'column', gap:10 }}>
            {/* Lignes */}
            <div style={{ background:'#fff', borderRadius:14, padding:'1rem', border:'1px solid #eee' }}>
              <div style={{ fontWeight:800, color:'#0b1f3a', marginBottom:12, fontSize:'0.95rem' }}>🚉 Lignes principales</div>
              {metro.lines.map(line => (
                <div key={line.name} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ background:line.color, color:'#fff', width:30, height:30, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.75rem', flexShrink:0 }}>
                      {line.num}
                    </div>
                    <span style={{ fontWeight:700, fontSize:'0.88rem', color:'#0b1f3a' }}>{line.name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', overflowX:'auto', paddingBottom:6 }}>
                    {line.stations.map((st, i) => (
                      <React.Fragment key={st+i}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                          <div style={{ width:11, height:11, borderRadius:'50%', background:line.color, border:'2px solid #fff', boxShadow:`0 0 0 2px ${line.color}` }} />
                          <div style={{ fontSize:'0.58rem', color:'#555', marginTop:3, whiteSpace:'nowrap', maxWidth:55, textAlign:'center', lineHeight:1.2 }}>{st}</div>
                        </div>
                        {i < line.stations.length-1 && (
                          <div style={{ height:3, width:22, background:line.color, flexShrink:0, marginBottom:14 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stations clés */}
            <div style={{ background:'#fff', borderRadius:14, padding:'1rem', border:'1px solid #eee' }}>
              <div style={{ fontWeight:800, color:'#0b1f3a', marginBottom:10, fontSize:'0.95rem' }}>⭐ Stations clés pour votre voyage</div>
              {metro.keyStations.map(st => (
                <div key={st.name} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #f5f5f5', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0b1f3a' }}>{st.name}</div>
                    <div style={{ marginTop:3, display:'flex', flexWrap:'wrap', gap:4 }}>
                      {st.lines.map(l => (
                        <span key={l} style={{ background: metro.lines.find(ml=>ml.num===l)?.color||metro.color,
                          color:'#fff', borderRadius:10, padding:'1px 8px', fontSize:'0.65rem', fontWeight:700 }}>
                          {l}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize:'0.76rem', color:'#666', marginTop:3 }}>{st.note}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                    <button onClick={() => open(`https://www.google.com/maps/search/${encodeURIComponent(st.name+' station')}`)}
                      style={{ background:'#4285f4', color:'#fff', border:'none', borderRadius:7, padding:'5px 8px', cursor:'pointer', fontSize:'0.68rem', fontWeight:700 }}>
                      Maps
                    </button>
                    {geoStatus==='ok' && userPos && (
                      <button onClick={() => open(`https://www.google.com/maps/dir/${userPos.lat},${userPos.lng}/${encodeURIComponent(st.name)}`)}
                        style={{ background:metro.color, color:'#fff', border:'none', borderRadius:7, padding:'5px 8px', cursor:'pointer', fontSize:'0.68rem', fontWeight:700 }}>
                        ↗ Itinéraire
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Astuce paiement */}
            <div style={{ background:`${metro.color}15`, borderRadius:14, padding:'1rem', border:`1px solid ${metro.color}40` }}>
              <div style={{ fontWeight:700, color:metro.color, marginBottom:6, fontSize:'0.88rem' }}>💳 Paiement & cartes</div>
              {city === 'Osaka' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>Suica ou ICOCA acceptés. Osaka 1-Day Pass ¥800. Distributeurs anglais dans toutes les stations.</div>}
              {city === 'Kyoto' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>Bus 1-Day Pass ¥700. Suica accepté partout. Les bus sont souvent plus pratiques que le métro.</div>}
              {city === 'Nara' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>Kintetsu depuis Osaka Namba (30 min, ¥560). JR depuis Kyoto (45 min, ¥720). La ville se visite à pied.</div>}
              {city === 'Tokyo' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>Suica ou Pasmo (rechargeable). Yamanote Line JR à ¥140–210. Tokyo Metro 1-Day ¥600.</div>}
              {city === 'Séoul' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>T-money Card ₩2500 + recharge. Tarif de base ₩1400 (1.25km). Correspondances gratuites dans les 30 min.</div>}
              {city === 'Busan' && <div style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6 }}>T-money ou carte Busan acceptée. Tarif ₩1500 base. Taxi recommandé pour Gamcheon Culture Village.</div>}
            </div>
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
  const [darkMode, setDarkMode] = useLocalStorage('dark_mode', false)
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
    phrases:   <PhrasesPage />,
    transport: <TransportPage />,
    checklist: <ChecklistPage />,
    notes:     <NotesPage />,
    favoris:   <FavorisPage />,
    shopping:  <ShoppingPage />,
    sante:     <SantePage />,
    sim:       <SimPage />,
    metro:     <MetroPage />,
  }[tab]

  return (
    <div className="phone-shell">
      <div className="hero-banner">
        <img src={assets.banner} alt="Bandeau voyage Famille Lacidi" />
        <div className="hero-topbar">
          <button className="round-btn" onClick={() => setShowMenu(true)}><Menu size={20} /></button>
          <div className="hero-actions">
            <button className="round-btn" onClick={() => { setShowNotifs(true); loadNotifData(setNotifPos, setNotifData) }}><Bell size={20} /></button>
            <button className="round-btn" onClick={() => setDarkMode(v=>!v)}>{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
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
