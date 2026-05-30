import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Globe, ChevronDown, ChevronUp, Bot, ArrowRight, UserPlus, Plug, Box, Truck, Search, MapPin, Calculator, Calendar, Phone, Star, ShieldCheck, Check } from 'lucide-react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import Truck3D from '../components/Truck3D'

// ── Translations Dictionary ──────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी',    flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ',   flag: '🏳️' },
  { code: 'te', label: 'తెలుగు',  flag: '🏳️' },
  { code: 'ta', label: 'தமிழ்',   flag: '🏳️' },
]

const T = {
  en: {
    logoLeft: 'DELI',
    logoRight: 'VERSE',
    logoSub: 'by Multiverse',
    navHome: 'Home',
    navServices: 'Services',
    navIntegrations: 'Integrations',
    navPricing: 'Pricing',
    navContact: 'Contact',
    navTrack: 'Track Shipment',
    portalEntry: 'Portal Entry',
    heroBadge: 'Start Shipping Now',
    heroTitleLeft: 'Speed meets ',
    heroTitleAccent: 'reliability ',
    heroTitleRight: 'in every delivery',
    heroSub: 'City-wide same-day logistics engineered for local commerce. Connecting Multiverse merchants with our premium courier network to enable swift, worry-free delivery.',
    btnCreateAcc: 'Create your account',
    btnStartShipping: 'Start shipping',
    btnGetStarted: 'Get started',
    worryFree: 'Shipped, worry-free',
    activeLabel: 'Deliverse active',
    secTag: 'Logistics Infrastructure',
    secTitle: 'A seamless pipeline from checkout to doorstep',
    c1Title: 'Create your account',
    c1Desc: 'Register as a local merchant or driver in seconds and configure your pickup geofences.',
    c1Label: 'Multiverse Verified',
    c2Title: 'Connect your store',
    c2Desc: 'Link Shopify, WooCommerce, or your Multiverse vendor portal with 1-click API integration.',
    c2Label: 'Merchant Choice',
    c3Title: 'Warehouse Dispatch',
    c3Desc: 'Our micro-sorting centers instantly assign orders to the nearest local courier.',
    c3Label: 'Local Hubs',
    c4Title: 'Start shipping',
    c4Desc: 'Get instant dispatch, live interactive tracking, and automated proof of delivery.',
    c4Label: '4.9/5 Average',
    teamTag: 'Deliverse Ecosystem Partners',
    teamTitle: 'Trusted by couriers, loved by merchants',
    contactTitle: 'Get in Touch with Deliverse',
    contactSub: 'Have questions about delivery integrations, custom enterprise shipping volumes, or working as a driver?',
  },
  hi: {
    logoLeft: 'डेली',
    logoRight: 'वर्स',
    logoSub: 'मल्टीवर्स द्वारा',
    navHome: 'होम',
    navServices: 'सेवाएं',
    navIntegrations: 'एकीकरण',
    navPricing: 'मूल्य निर्धारण',
    navContact: 'संपर्क',
    navTrack: 'शिपमेंट ट्रैक करें',
    portalEntry: 'पोर्टल प्रवेश',
    heroBadge: 'अभी शिपिंग शुरू करें',
    heroTitleLeft: 'हर डिलीवरी में ',
    heroTitleAccent: 'गति और ',
    heroTitleRight: 'विश्वसनीयता का मिलन',
    heroSub: 'स्थानीय व्यापार के लिए इंजीनियर की गई शहर-व्यापी उसी दिन की रसद। त्वरित, चिंता मुक्त डिलीवरी सक्षम करने के लिए मल्टीवर्स व्यापारियों को हमारे प्रीमियम कूरियर नेटवर्क से जोड़ना।',
    btnCreateAcc: 'अपना खाता बनाएं',
    btnStartShipping: 'शिपिंग शुरू करें',
    btnGetStarted: 'शुरू करें',
    worryFree: 'चिंता मुक्त शिपिंग',
    activeLabel: 'डेलीवर्स सक्रिय',
    secTag: 'लॉजिस्टिक्स इंफ्रास्ट्रक्चर',
    secTitle: 'चेकआउट से लेकर दरवाजे तक एक निर्बाध पाइपलाइन',
    c1Title: 'अपना खाता बनाएं',
    c1Desc: 'सेकंड में एक स्थानीय व्यापारी या ड्राइवर के रूप में पंजीकरण करें और अपने पिकअप जियोफेंस कॉन्फ़िगर करें।',
    c1Label: 'मल्टीवर्स सत्यापित',
    c2Title: 'अपना स्टोर कनेक्ट करें',
    c2Desc: '1-क्लिक एपीआई एकीकरण के साथ शॉपिफ़ाई, वूकॉमर्स या अपने मल्टीवर्स वेंडर पोर्टल को लिंक करें।',
    c2Label: 'व्यापारी की पसंद',
    c3Title: 'गोदाम प्रेषण',
    c3Desc: 'हमारे माइक्रो-सॉर्टिंग सेंटर तुरंत निकटतम स्थानीय कूरियर को ऑर्डर सौंपते हैं।',
    c3Label: 'स्थानीय हब',
    c4Title: 'शिपिंग शुरू करें',
    c4Desc: 'त्वरित प्रेषण, लाइव इंटरैक्टिव ट्रैकिंग और डिलीवरी का स्वचालित प्रमाण प्राप्त करें।',
    c4Label: '4.9/5 औसत',
    teamTag: 'डेलीवर्स इकोसिस्टम पार्टनर्स',
    teamTitle: 'कूरियरों द्वारा विश्वसनीय, व्यापारियों द्वारा पसंद किया गया',
    contactTitle: 'डेलीवर्स से संपर्क करें',
    contactSub: 'डिलीवरी एकीकरण, कस्टम एंटरप्राइज़ शिपिंग वॉल्यूम, या ड्राइवर के रूप में काम करने के बारे में प्रश्न हैं?',
  },
  kn: {
    logoLeft: 'ಡೆಲಿ',
    logoRight: 'ವರ್ಸ್',
    logoSub: 'ಮಲ್ಟಿವರ್ಸ್ ಮೂಲಕ',
    navHome: 'ಮುಖಪುಟ',
    navServices: 'ಸೇವೆಗಳು',
    navIntegrations: 'ಸಂಯೋಜನೆಗಳು',
    navPricing: 'ದರಗಳು',
    navContact: 'ಸಂಪರ್ಕ',
    navTrack: 'ಸಾಗಣೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    portalEntry: 'ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
    heroBadge: 'ಈಗಲೇ ಶಿಪ್ಪಿಂಗ್ ಆರಂಭಿಸಿ',
    heroTitleLeft: 'ಪ್ರತಿ ವಿತರಣೆಯಲ್ಲೂ ',
    heroTitleAccent: 'ವೇಗ ಮತ್ತು ',
    heroTitleRight: 'ನಂಬಿಕೆ ಒಟ್ಟಿಗೆ',
    heroSub: 'ಸ್ಥಳೀಯ ವಾಣಿಜ್ಯಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ನಗರ-ವ್ಯಾಪ್ತಿಯ ಒಂದೇ ದಿನದ ಲಾಜಿಸ್ಟಿಕ್ಸ್. ತ್ವರಿತ, ಆತಂಕ-ಮುಕ್ತ ವಿತರಣೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ನಮ್ಮ ಪ್ರೀಮಿಯಂ ಕೊರಿಯರ್ ನೆಟ್‌ವರ್ಕ್‌ನೊಂದಿಗೆ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    btnCreateAcc: 'ಖಾತೆ ರಚಿಸಿ',
    btnStartShipping: 'ಶಿಪ್ಪಿಂಗ್ ಆರಂಭಿಸಿ',
    btnGetStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    worryFree: 'ಚಿಂತೆಯಿಲ್ಲದ ವಿತರಣೆ',
    activeLabel: 'ಡೆಲಿವರ್ಸ್ ಸಕ್ರಿಯ',
    secTag: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮೂಲಸೌಕರ್ಯ',
    secTitle: 'ಚೆಕೌಟ್‌ನಿಂದ ಮನೆ ಬಾಗಿಲಿಗೆ ಸುಲಭವಾದ ಸಾಗಣೆ',
    c1Title: 'ಖಾತೆ ರಚಿಸಿ',
    c1Desc: 'ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿ ಅಥವಾ ಚಾಲಕರಾಗಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಪಿಕಪ್ ಜಿಯೋಫೆನ್ಸ್‌ಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.',
    c1Label: 'ಮಲ್ಟಿವರ್ಸ್ ವೆರಿಫೈಡ್',
    c2Title: 'ನಿಮ್ಮ ಸ್ಟೋರ್ ಸಂಪರ್ಕಿಸಿ',
    c2Desc: '1-ಕ್ಲಿಕ್ API ಸಂಯೋಜನೆಯೊಂದಿಗೆ Shopify, WooCommerce ಅಥವಾ ನಿಮ್ಮ ಮಲ್ಟಿವರ್ಸ್ ಮಾರಾಟಗಾರರ ಪೋರ್ಟಲ್ ಅನ್ನು ಲಿಂಕ್ ಮಾಡಿ.',
    c2Label: 'ವ್ಯಾಪಾರಿಗಳ ಆಯ್ಕೆ',
    c3Title: 'ಉಗ್ರಾಣ ವಿತರಣೆ',
    c3Desc: 'ನಮ್ಮ ಮೈಕ್ರೋ-ಸಾರ್ಟಿಂಗ್ ಕೇಂದ್ರಗಳು ತಕ್ಷಣವೇ ಆದೇಶಗಳನ್ನು ಹತ್ತಿರದ ಸ್ಥಳೀಯ ಕೊರಿಯರ್‌ಗೆ ನಿಯೋಜಿಸುತ್ತವೆ.',
    c3Label: 'ಸ್ಥಳೀಯ ಹಬ್‌ಗಳು',
    c4Title: 'ಶಿಪ್ಪಿಂಗ್ ಆರಂಭಿಸಿ',
    c4Desc: 'ತ್ವರಿತ ವಿತರಣೆ, ಲೈವ್ ಸಂವಾದಾತ್ಮಕ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ವಿತರಣೆಯ ಪುರಾವೆಯನ್ನು ಪಡೆಯಿರಿ.',
    c4Label: '4.9/5 ಸರಾಸರಿ',
    teamTag: 'ಡೆಲಿವರ್ಸ್ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಪಾಲುದಾರರು',
    teamTitle: 'ಕೊರಿಯರ್‌ಗಳ ನಂಬಿಕೆ, ವ್ಯಾಪಾರಿಗಳ ಪ್ರೀತಿ',
    contactTitle: 'ಡೆಲಿವರ್ಸ್ ಜೊತೆಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ',
    contactSub: 'ವಿತರಣಾ ಸಂಯೋಜನೆಗಳು, ಕಸ್ಟಮ್ ಕಾರ್ಪೊರೇಟ್ ಸಾಗಣೆ ದರಗಳು ಅಥವಾ ಚಾಲಕರಾಗಿ ಕೆಲಸ ಮಾಡುವ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?',
  },
  te: {
    logoLeft: 'డెలి',
    logoRight: 'వర్స్',
    logoSub: 'మల్టీవర్స్ ద్వారా',
    navHome: 'హోమ్',
    navServices: 'సేవలు',
    navIntegrations: 'అనుసంధానం',
    navPricing: 'ధరలు',
    navContact: 'సంప్రదించండి',
    navTrack: 'రవాణాను ట్రాక్ చేయండి',
    portalEntry: 'పోర్టల్ ప్రవేశం',
    heroBadge: 'ఇప్పుడే షిప్పింగ్ ప్రారంభించండి',
    heroTitleLeft: 'ప్రతి డెలివరీలో ',
    heroTitleAccent: 'వేగం మరియు ',
    heroTitleRight: 'విశ్వసనీయత కలయిక',
    heroSub: 'స్థానిక వాణిజ్యం కోసం రూపొందించిన నగర-వ్యాప్త అదే రోజు లాజిస్టిక్స్. శీఘ్ర, ఆందోళన లేని డెలివరీని ప్రారంభించడానికి మా ప్రీమియం కొరియర్ నెట్‌వర్క్‌తో స్థానిక వ్యాపారులను అనుసంధానిస్తుంది.',
    btnCreateAcc: 'ఖాతాను సృష్టించండి',
    btnStartShipping: 'షిప్పింగ్ ప్రారంభించండి',
    btnGetStarted: 'ప్రారంభించండి',
    worryFree: 'ఆందోళన లేని రవాణా',
    activeLabel: 'డెలివర్స్ యాక్టివ్',
    secTag: 'లాజిస్టిక్స్ మౌలిక సదుపాయాలు',
    secTitle: 'చెక్అవుట్ నుండి ఇంటి గుమ్మం వరకు సులభమైన పైప్‌లైన్',
    c1Title: 'ఖాతాను సృష్టించండి',
    c1Desc: 'సెకన్లలో స్థానిక వ్యాపారి లేదా డ్రైవర్‌గా నమోదు చేసుకోండి మరియు మీ పికప్ జియోఫెన్స్‌లను కాన్ఫిగర్ చేయండి.',
    c1Label: 'మల్టీవర్స్ వెరిఫైడ్',
    c2Title: 'మీ స్టోర్‌ను కనెక్ట్ చేయండి',
    c2Desc: '1-క్లిక్ API అనుసంధానంతో Shopify, WooCommerce లేదా మీ మల్టీవర్స్ విక్రేత పోర్టల్‌ను లింక్ చేయండి.',
    c2Label: 'వ్యాపారి ఎంపిక',
    c3Title: 'వేర్‌హౌస్ డిస్పాచ్',
    c3Desc: 'మా మైక్రో-సార్టింగ్ కేంద్రాలు తక్షణమే ఆర్డర్‌లను సమీప స్థానిక కొరియర్‌కు కేటాయిస్తాయి.',
    c3Label: 'స్థానిక హబ్‌లు',
    c4Title: 'షిప్పింగ్ ప్రారంభించండి',
    c4Desc: 'తక్షణ డిస్పాచ్, లైవ్ ఇంటరాక్టివ్ ట్రాకింగ్ మరియు ఆటోమేటెడ్ ప్రూఫ్ ఆఫ్ డెలివరీని పొందండి.',
    c4Label: '4.9/5 సగటు',
    teamTag: 'డెలివర్స్ ఎకోసిస్టమ్ భాగస్వాములు',
    teamTitle: 'కొరియర్ల నమ్మకం, వ్యాపారుల ప్రేమ',
    contactTitle: 'డెలివర్స్‌తో కనెక్ట్ అవ్వండి',
    contactSub: 'డెలివరీ ఇంటిగ్రేషన్లు, అనుకూల కార్పొరేట్ రవాణా పరిమాణాలు లేదా డ్రైవర్‌గా పనిచేయడం గురించి సందేహాలు ఉన్నాయా?',
  },
  ta: {
    logoLeft: 'டெலி',
    logoRight: 'வர்ஸ்',
    logoSub: 'மல்டிவர்ஸ் மூலம்',
    navHome: 'முகப்பு',
    navServices: 'சேவைகள்',
    navIntegrations: 'இணைப்புகள்',
    navPricing: 'விலை நிர்ணயம்',
    navContact: 'தொடர்பு',
    navTrack: 'பொருளைக் கண்காணித்தல்',
    portalEntry: 'போர்டல் நுழைவு',
    heroBadge: 'இப்பொழுதே ஷிப்பிங் தொடங்குங்கள்',
    heroTitleLeft: 'ஒவ்வொரு விநியோகத்திலும் ',
    heroTitleAccent: 'வேகமும் ',
    heroTitleRight: 'நம்பகத்தன்மையும் இணையும் இடம்',
    heroSub: 'உள்ளூர் வணிகத்திற்காக வடிவமைக்கப்பட்ட நகரம் தழுவிய ஒரே நாள் தளவாடங்கள். விரைவான, கவலை இல்லாத விநியோகத்தை இயக்க எங்களின் பிரீமியம் கூரியர் நெட்வொர்க்குடன் உள்ளூர் வர்த்தகர்களை இணைக்கிறது.',
    btnCreateAcc: 'கணக்கை உருவாக்குங்கள்',
    btnStartShipping: 'ஷிப்பிங் தொடங்குங்கள்',
    btnGetStarted: 'தொடங்குங்கள்',
    worryFree: 'கவலை இல்லாத விநியோகம்',
    activeLabel: 'டெலிவர்ஸ் செயலில் உள்ளது',
    secTag: 'தளவாட உள்கட்டமைப்பு',
    secTitle: 'செக்அவுட் முதல் வீட்டு வாசல் வரை தடையற்ற பாதை',
    c1Title: 'கணக்கை உருவாக்குங்கள்',
    c1Desc: 'நொடிகளில் உள்ளூர் வணிகராக அல்லது ஓட்டுநராகப் பதிவு செய்து, உங்கள் பிக்கப் ஜியோஃபென்ஸ்களை உள்ளமைக்கவும்.',
    c1Label: 'மல்டிவர்ஸ் சரிபார்க்கப்பட்டது',
    c2Title: 'உங்கள் கடையை இணைக்கவும்',
    c2Desc: '1-கிளிக் ஏபிஐ ஒருங்கிணைப்புடன் Shopify, WooCommerce அல்லது உங்கள் மல்டிவர்ஸ் விற்பனையாளர் போர்ட்டலை இணைக்கவும்.',
    c2Label: 'வணிகர்களின் தேர்வு',
    c3Title: 'கிடங்கு விநியோகம்',
    c3Desc: 'எங்கள் மைக்ரோ-சார்ட்டிங் மையங்கள் உடனடியாக ஆர்டர்களை அருகிலுள்ள உள்ளூர் கூரியருக்கு வழங்குகின்றன.',
    c3Label: 'உள்ளூர் மையங்கள்',
    c4Title: 'ஷிப்பிங் தொடங்குங்கள்',
    c4Desc: 'உடனடி விநியோகம், நேரடி ஊடாடும் கண்காணிப்பு மற்றும் விநியோகத்திற்கான தானியங்கி ஆதாரம் ஆகியவற்றைப் பெறுங்கள்.',
    c4Label: '4.9/5 சராசரி',
    teamTag: 'டெலிவர்ஸ் சுற்றுச்சூழல் பங்காளிகள்',
    teamTitle: 'கூரியர்களின் நம்பிக்கை, வர்த்தகர்களின் அன்பு',
    contactTitle: 'டெலிவர்ஸை தொடர்பு கொள்ளவும்',
    contactSub: 'விநியோக ஒருங்கிணைப்புகள், தனிப்பயன் கார்ப்பரேட் ஷிப்பிங் அளவுகள் அல்லது ஓட்டுநராக பணிபுரிவது பற்றி கேள்விகள் உள்ளதா?',
  },
}

export default function Deliverse() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  
  // Custom states
  const [lang, setLang] = useState('en')
  const [dropOpen, setDropOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Modal states
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [intOpen, setIntOpen] = useState(false)
  const [driverOpen, setDriverOpen] = useState(false)

  // Sub-features states
  const [trips, setTrips] = useState(40)
  const [trackId, setTrackId] = useState('MLT-7798')
  const [trackStatus, setTrackStatus] = useState('Waiting to Locate...')
  const [trackEta, setTrackEta] = useState('-- mins')
  const [trackCourier, setTrackCourier] = useState('Marcus Chen')
  const [timelineStep, setTimelineStep] = useState(0) // 0 to 4
  const [calcResults, setCalcResults] = useState(null)
  
  // Integrations states
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [wooConnected, setWooConnected] = useState(false)
  const [multiverseConnected, setMultiverseConnected] = useState(true)

  const t = T[lang]
  const activeLang = LANGUAGES.find(l => l.code === lang)

  // Tracking Canvas references
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Radar Map References
  const mapRef = useRef(null)
  const partnersRef = useRef([])
  const [hoveredPartner, setHoveredPartner] = useState(null)
  const [hoveredCardPos, setHoveredCardPos] = useState({ x: 0, y: 0 })
  const [sidebarHighlightId, setSidebarHighlightId] = useState(null)

  // Curved street coordinates mapping for courier routing path
  const shopLoc = { x: 50, y: 120, label: "Merchant Shop" }
  const sortingLoc = { x: 260, y: 60, label: "Deliverse Hub" }
  const houseLoc = { x: 500, y: 150, label: "Customer Door" }

  const roadNodes = []
  for (let i = 0; i <= 50; i++) {
    const pt = i / 50
    const x = (1 - pt) * (1 - pt) * shopLoc.x + 2 * (1 - pt) * pt * 150 + pt * pt * sortingLoc.x
    const y = (1 - pt) * (1 - pt) * shopLoc.y + 2 * (1 - pt) * pt * 140 + pt * pt * sortingLoc.y
    roadNodes.push({ x, y })
  }
  for (let i = 1; i <= 50; i++) {
    const pt = i / 50
    const x = (1 - pt) * (1 - pt) * sortingLoc.x + 2 * (1 - pt) * pt * 380 + pt * pt * houseLoc.x
    const y = (1 - pt) * (1 - pt) * sortingLoc.y + 2 * (1 - pt) * pt * 30 + pt * pt * houseLoc.y
    roadNodes.push({ x, y })
  }

  // Animation on load
  useEffect(() => {
    const el = pageRef.current
    if (!el) return

    gsap.fromTo(el.querySelectorAll('.hero-anim'),
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' }
    )

    const cards = el.querySelectorAll('.process-card-anim')
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el.querySelector('.process-grid-trigger'),
          start: 'top 80%',
        }
      }
    )
  }, [])

  // Auth status observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser)
    })
    return unsub
  }, [])

  // Radar Map Leaflet GIS initialization once on mount
  useEffect(() => {
    const L = window.L;
    if (!L) return;

    // 1. Initialize Leaflet Map centered in Midtown Manhattan, NYC
    const map = L.map('fleetRadarMap', {
      center: [40.743, -73.990],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false
    });
    mapRef.current = map;

    // Load Premium Dark CartoDB Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(map);

    // 2. Define NYC Intersection Graph Nodes (Manhattan Grid)
    const nodes = [
      { id: 0, name: "14th & 7th", lat: 40.7388, lng: -73.9996 },
      { id: 1, name: "14th & 6th", lat: 40.7373, lng: -73.9967 },
      { id: 2, name: "14th & 5th", lat: 40.7360, lng: -73.9939 },
      { id: 3, name: "14th & Broadway", lat: 40.7359, lng: -73.9911 },
      
      { id: 4, name: "23rd & 7th", lat: 40.7441, lng: -73.9960 },
      { id: 5, name: "23rd & 6th", lat: 40.7427, lng: -73.9931 },
      { id: 6, name: "23rd & 5th", lat: 40.7411, lng: -73.9897 },
      { id: 7, name: "23rd & Broadway", lat: 40.7410, lng: -73.9892 },
      
      { id: 8, name: "28th & 7th", lat: 40.7472, lng: -73.9938 },
      { id: 9, name: "28th & 6th", lat: 40.7458, lng: -73.9909 },
      { id: 10, name: "28th & 5th", lat: 40.7443, lng: -73.9875 },
      { id: 11, name: "28th & Broadway", lat: 40.7454, lng: -73.9881 },
      
      { id: 12, name: "34th & 7th", lat: 40.7510, lng: -73.9912 },
      { id: 13, name: "34th & 6th", lat: 40.7497, lng: -73.9884 },
      { id: 14, name: "34th & 5th", lat: 40.7484, lng: -73.9857 },
      { id: 15, name: "34th & Broadway", lat: 40.7488, lng: -73.9859 }
    ];

    // Grid street links (Adjacency Graph List)
    const adjacency = {
      0: [1, 4],
      1: [0, 2, 5],
      2: [1, 3, 6],
      3: [2, 7],
      4: [0, 5, 8],
      5: [1, 4, 6, 9],
      6: [2, 5, 7, 10],
      7: [3, 6, 11],
      8: [4, 9, 12],
      9: [5, 8, 10, 13],
      10: [6, 9, 11, 14],
      11: [7, 10, 15],
      12: [8, 13],
      13: [9, 12, 14],
      14: [10, 13, 15],
      15: [11, 14]
    };

    // 3. Plot Premium Glowing Landmarks
    const landmarks = [
      { coords: [40.7411, -73.9897], color: "#ef4444", label: "Merchant Shop" },
      { coords: [40.7454, -73.9881], color: "#f59e0b", label: "Deliverse Hub" },
      { coords: [40.7359, -73.9911], color: "#6366f1", label: "Express Drop" }
    ];

    landmarks.forEach(land => {
      L.marker(land.coords, {
        icon: L.divIcon({
          className: 'custom-landmark-wrapper',
          html: `<div class="custom-landmark-core" style="--landmark-color: ${land.color};"></div><span class="custom-landmark-label">${land.label}</span>`,
          iconSize: [30, 30]
        })
      }).addTo(map);
    });

    // 4. Set Up Live Partners Data & Leaflet Markers
    const partners = [
      { id: 0, name: "Marcus Chen", vehicle: "🏍️ Scooter", rating: "5.0", status: "Available", avatar: "🏍️", color: "#00f0ff", node: nodes[6], targetNode: nodes[7], progress: 0, speed: 0.003 },
      { id: 1, name: "Sarah Jenkins", vehicle: "🛺 Cargo Auto", rating: "4.9", status: "Available", avatar: "🛺", color: "#f59e0b", node: nodes[9], targetNode: nodes[5], progress: 0, speed: 0.002 },
      { id: 2, name: "Elena Rostova", vehicle: "🚲 E-Bike", rating: "5.0", status: "Available", avatar: "🚲", color: "#10b981", node: nodes[14], targetNode: nodes[15], progress: 0, speed: 0.004 },
      { id: 3, name: "Alex Rivera", vehicle: "🚛 Lorry Truck", rating: "4.8", status: "Available", avatar: "🚛", color: "#4f46e5", node: nodes[3], targetNode: nodes[2], progress: 0, speed: 0.0015 },
      { id: 4, name: "Ravi Kumar", vehicle: "🛺 Goods Auto", rating: "4.9", status: "Available", avatar: "🛺", color: "#ff7a00", node: nodes[10], targetNode: nodes[11], progress: 0, speed: 0.0025 },
      { id: 5, name: "Siti Aminah", vehicle: "🛵 Moped", rating: "5.0", status: "Available", avatar: "🛵", color: "#a855f7", node: nodes[15], targetNode: nodes[11], progress: 0, speed: 0.0035 }
    ];

    partners.forEach(p => {
      const lat = p.node.lat + (p.targetNode.lat - p.node.lat) * p.progress;
      const lng = p.node.lng + (p.targetNode.lng - p.node.lng) * p.progress;

      p.marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker-wrapper',
          html: `
            <div class="custom-marker-pulse" style="--pulse-color: ${p.color};"></div>
            <div class="custom-marker-core" style="--core-color: ${p.color};"></div>
            <div class="custom-marker-emoji">${p.avatar}</div>
          `,
          iconSize: [40, 40]
        })
      }).addTo(map);

      // Mouseover tooltip synchronization
      p.marker.on('mouseover', () => {
        setHoveredPartner(p);
        const mapPoint = map.latLngToContainerPoint(p.marker.getLatLng());
        setHoveredCardPos({
          x: mapPoint.x,
          y: mapPoint.y - 12
        });
      });

      p.marker.on('mouseout', () => {
        setHoveredPartner(null);
      });
    });

    partnersRef.current = partners;

    // 5. Linear Interpolation (LERP) Loop for real-time GIS pathing
    let animId;
    function updateFleet() {
      partnersRef.current.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.node = p.targetNode;
          
          const neighbors = adjacency[p.node.id];
          if (neighbors && neighbors.length > 0) {
            const nextNodeId = neighbors[Math.floor(Math.random() * neighbors.length)];
            p.targetNode = nodes.find(n => n.id === nextNodeId);
          }
        }

        // Interpolate LERP coordinates
        const lat = p.node.lat + (p.targetNode.lat - p.node.lat) * p.progress;
        const lng = p.node.lng + (p.targetNode.lng - p.node.lng) * p.progress;

        // Set live LatLng
        if (p.marker) {
          p.marker.setLatLng([lat, lng]);
        }
      });

      animId = requestAnimationFrame(updateFleet);
    }

    updateFleet();

    // Re-draw coordinates on map resize
    const handleResize = () => {
      // Re-trigger LERP updates and mapping
    };
    map.on('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      map.remove();
    };
  }, []);

  // Update marker highlight state and pan when hoveredPartner or sidebarHighlightId changes
  useEffect(() => {
    if (!partnersRef.current) return;

    partnersRef.current.forEach(p => {
      if (p.marker) {
        const isFocused = (hoveredPartner && hoveredPartner.id === p.id) || (sidebarHighlightId === p.id);
        const el = p.marker.getElement();
        if (el) {
          if (isFocused) {
            el.classList.add('focused');
          } else {
            el.classList.remove('focused');
          }
        }
      }
    });

    // Pan map to sidebar hovered partner
    if (sidebarHighlightId !== null && mapRef.current) {
      const p = partnersRef.current.find(partner => partner.id === sidebarHighlightId);
      if (p && p.marker) {
        mapRef.current.panTo(p.marker.getLatLng(), { animate: true, duration: 0.6 });
      }
    }
  }, [hoveredPartner, sidebarHighlightId]);

  // Canvas drawing
  const drawMap = (ctx, canvas, courierProgress = -1) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background grid
    ctx.fillStyle = '#1e293b' // Dark background matching design
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke()
    }
    for (let j = 0; j < canvas.height; j += 30) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke()
    }

    // Draw Parks (Green translucents)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)'
    ctx.beginPath(); ctx.arc(360, 110, 45, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
    ctx.font = 'bold 9px Montserrat'
    ctx.textAlign = 'center'
    ctx.fillText("DISTRIBUTION ZONE", 360, 113)

    // Draw Roads (Slate tracks)
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.8)'
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(roadNodes[0].x, roadNodes[0].y)
    for (let k = 1; k < roadNodes.length; k++) {
      ctx.lineTo(roadNodes[k].x, roadNodes[k].y)
    }
    ctx.stroke()

    // Yellow center dash lines
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw Pins
    drawPin(ctx, shopLoc, '#06b6d4', 'Shop')
    drawPin(ctx, sortingLoc, '#f59e0b', 'Hub')
    drawPin(ctx, houseLoc, '#6366f1', 'Door')

    // Draw Courier Beacon if active
    if (courierProgress >= 0) {
      const idx = Math.min(Math.floor(courierProgress), roadNodes.length - 1)
      const pos = roadNodes[idx]

      // Radar pulse
      const rad = 10 + Math.abs(Math.sin(Date.now() / 200)) * 6
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)'
      ctx.beginPath(); ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2); ctx.fill()

      // Core point
      ctx.fillStyle = '#06b6d4'
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  const drawPin = (ctx, loc, color, label) => {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath(); ctx.arc(loc.x, loc.y + 4, 6, 0, Math.PI * 2); ctx.fill()

    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(loc.x, loc.y, 8, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#94a3b8'
    ctx.font = '700 9px Plus Jakarta Sans'
    ctx.textAlign = 'center'
    ctx.fillText(label, loc.x, loc.y - 12)
  }

  // Handle Tracking Search Simulation
  const handleTrackingSubmit = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let prog = 0

    setTrackCourier(trackId.includes('2041') ? 'Sarah Jenkins' : 'Marcus Chen')
    setTimelineStep(1)
    
    const animate = () => {
      drawMap(ctx, canvas, prog)
      
      const pct = (prog / (roadNodes.length - 1)) * 100
      
      if (pct === 0) {
        setTrackStatus('Order Dispatched')
        setTrackEta('25 mins')
        setTimelineStep(1)
      } else if (pct > 0 && pct < 30) {
        setTrackStatus('Courier at Merchant Store')
        setTrackEta('22 mins')
        setTimelineStep(2)
      } else if (pct >= 30 && pct < 50) {
        setTrackStatus('Sorted at Local Hub')
        setTrackEta('17 mins')
        setTimelineStep(2)
      } else if (pct >= 50 && pct < 95) {
        setTrackStatus('In Transit (Motorcycle Delivery)')
        const rem = Math.max(1, Math.round(15 * (1 - (pct - 50) / 45)))
        setTrackEta(`${rem} mins`)
        setTimelineStep(3)
      } else {
        setTrackStatus('Delivered successfully! ✓')
        setTrackEta('Delivered')
        setTimelineStep(4)
      }

      if (prog < roadNodes.length - 1) {
        prog += 0.38
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  // Draw initial static map on opening tracking modal
  useEffect(() => {
    if (trackingOpen && canvasRef.current) {
      setTimeout(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        drawMap(ctx, canvas)
      }, 100)
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [trackingOpen])

  // Cost calculator submit
  const handleCalculator = (e) => {
    e.preventDefault()
    const form = e.target
    const weight = parseFloat(form.weight.value) || 1.0
    const size = form.size.value
    const speed = form.speed.value
    const pick = form.pickup.value
    const drop = form.drop.value

    let base = 4.00 * 83
    if (size === 'envelope') base = 3.00 * 83
    else if (size === 'medium') base = 5.50 * 83
    else if (size === 'large') base = 9.00 * 83

    base += Math.max(0, (weight - 1) * 0.75) * 83

    let distSurcharge = 2.00 * 83
    if (pick === drop) distSurcharge = 1.00 * 83
    else if ((pick === 'harbor' && drop === 'suburbs') || (pick === 'suburbs' && drop === 'harbor')) distSurcharge = 4.50 * 83
    else distSurcharge = 2.75 * 83

    let mult = 1.0
    let label = 'Same-day (Under 4 hours)'
    if (speed === 'eco') {
      mult = 0.8
      label = 'Eco Next-day (By 2:00 PM)'
    } else if (speed === 'express') {
      mult = 1.6
      label = 'Super Sonic Express (Under 90 mins)'
    }

    const total = (base + distSurcharge) * mult

    setCalcResults({
      base: base.toFixed(2),
      dist: distSurcharge.toFixed(2),
      total: total.toFixed(2),
      window: label
    })
  }

  const handlePortalChange = (btn, store) => {
    if (store === 'shopify') {
      if (shopifyConnected) setShopifyConnected(false)
      else {
        setShopifyConnected(true)
        alert('Shopify store linked with Deliverse API!')
      }
    } else if (store === 'woo') {
      if (wooConnected) setWooConnected(false)
      else {
        setWooConnected(true)
        alert('WooCommerce local sync automated!')
      }
    } else if (store === 'multiverse') {
      setMultiverseConnected(!multiverseConnected)
    }
  }

  return (
    <div ref={pageRef} className="w-full min-h-screen text-slate-800 flex flex-col items-center relative bg-white">
      
      {/* ── NAVBAR ── */}
      <header className="w-full max-w-7xl px-8 py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <div className="logo-icon w-8 h-8 relative">
            <span className="absolute w-5 h-5 rounded-md bg-slate-900 top-0 left-0 z-10" />
            <span className="absolute w-5 h-5 rounded-md bg-cyan-500 bottom-0 right-0 z-0" />
          </div>
          <div className="flex flex-col line-none">
            <span className="font-display font-extrabold text-2xl tracking-widest text-slate-900 leading-none">
              {t.logoLeft}<span className="text-cyan-600 text-glow-cyan">{t.logoRight}</span>
            </span>
            <span className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
              {t.logoSub}
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-display font-semibold text-[13px] tracking-wider uppercase text-slate-600">
          <a href="#home" className="text-slate-900 border-b-2 border-slate-900 pb-1">{t.navHome}</a>
          <a href="#services" className="hover:text-cyan-600 transition-colors">{t.navServices}</a>
          <a href="#integrations" className="hover:text-cyan-600 transition-colors">{t.navIntegrations}</a>
          <a href="#pricing" className="hover:text-cyan-600 transition-colors">{t.navPricing}</a>
          <a href="#contact" className="hover:text-cyan-600 transition-colors">{t.navContact}</a>
          <button 
            onClick={() => setTrackingOpen(true)}
            className="flex items-center gap-2 bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 px-4 py-2 rounded-full transition-all duration-300"
          >
            <Search size={14} className="text-cyan-500" />
            {t.navTrack}
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(o => !o)}
              className="flex items-center gap-2 border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:border-cyan-400 px-4 py-2 rounded-full font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm"
            >
              <Globe size={14} className="text-cyan-500" />
              <span>{activeLang.flag} {activeLang.label}</span>
              {dropOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {dropOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setDropOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-display font-semibold tracking-wide uppercase transition-colors
                      ${lang === l.code
                        ? 'bg-cyan-50 text-cyan-600 border-l-2 border-cyan-500'
                        : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    {l.label}
                    {lang === l.code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-full font-display font-bold text-xs tracking-wider uppercase text-slate-800 shadow-sm hover:shadow transition-all">
              <span className="text-base">👤</span>
              <span className="max-w-[100px] truncate">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
              <button
                onClick={() => {
                  signOut(auth).then(() => {
                    navigate('/login')
                  })
                }}
                className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform ml-1.5"
                title="Sign Out"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="border border-cyan-300 text-cyan-600 hover:bg-cyan-50 px-5 py-2 rounded-full font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-neonCyan"
            >
              {t.portalEntry}
            </button>
          )}
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="w-full max-w-7xl min-h-[85vh] px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 relative z-10 py-10" id="home">
        
        {/* Left Side Hero Content */}
        <div className="hero-content lg:col-span-7 flex flex-col gap-6 text-left">
          
          {/* Top Yellow Capsule Badge */}
          <div className="hero-anim self-start">
            <button 
              onClick={() => setCalcOpen(true)}
              className="flex items-center gap-3 bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 py-2 rounded-full transition-transform duration-300 hover:scale-105 shadow-md shadow-amber-400/20"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] text-slate-900 font-bold"><ArrowRight size={12} /></span>
              <span className="font-display font-extrabold text-[11px] tracking-widest uppercase">{t.heroBadge}</span>
            </button>
          </div>

          <h1 className="hero-anim font-display font-black text-5xl md:text-7xl leading-none text-slate-900 select-none tracking-tighter">
            {t.heroTitleLeft}<span className="text-cyan-600 text-glow-cyan">{t.heroTitleAccent}</span>{t.heroTitleRight}
          </h1>

          <p className="hero-anim text-slate-600 font-medium text-lg leading-relaxed max-w-xl">
            {t.heroSub}
          </p>

          <div className="hero-anim flex flex-wrap items-center gap-6 mt-4">
            <button 
              onClick={() => setDriverOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-display font-bold text-sm tracking-widest uppercase rounded-full hover:shadow-neonCyan hover:scale-105 transition-all duration-300 shadow-md shadow-cyan-500/25"
            >
              {t.btnCreateAcc}
            </button>

            {/* Integration Pills */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border border-slate-200 rounded-full bg-amber-400 text-red-700 italic font-black text-xs tracking-tight shadow-sm hover:scale-105 transition-transform select-none">
                DHL
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full bg-white text-indigo-700 font-bold text-xs tracking-tight shadow-sm hover:scale-105 transition-transform select-none">
                FedEx
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full bg-white text-emerald-600 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm hover:scale-105 transition-transform select-none">
                <Truck size={10} className="text-emerald-500" /> Gojek
              </div>
            </div>
          </div>
        </div>

        {/* Right Side 3D Truck Model Viewport */}
        <div className="hero-anim lg:col-span-5 w-full h-[450px] relative flex items-center justify-center rounded-3xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-md shadow-glow p-4 overflow-hidden group border-glow-cyan">
          
          {/* SKEWED ROAD BACKDROP SYSTEM */}
          <div className="absolute inset-0 w-[150%] h-[150%] bg-gradient-to-tr from-slate-200/30 via-slate-300/40 to-slate-200/30 transform skew-y-12 rotate-6 rounded-[50px] pointer-events-none border border-white/60 z-0" />
          
          {/* Main Hero Image Showcase */}
          <div className="w-full h-full relative z-10 rounded-2xl overflow-hidden">
            <img 
              src="/assets/deliverse/hero_trucks.png" 
              alt="Deliverse Fleet Logistics" 
              className="w-full h-full object-cover rounded-2xl"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Absolute floating worry-free badge */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/95 border border-slate-200/70 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg text-[11px] font-display font-bold text-slate-800 tracking-wider hover:scale-105 transition-transform pointer-events-none select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500 animate-pulse" />
            {t.worryFree}
          </div>

          {/* Absolute floating active beacon */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-slate-900 border border-slate-700/60 text-white px-4 py-2.5 rounded-full shadow-lg text-[11px] font-display font-bold tracking-wider hover:scale-105 transition-transform pointer-events-none select-none">
            <ShieldCheck size={14} className="text-cyan-400" />
            {t.activeLabel}
          </div>
        </div>

      </section>

      {/* ── PROCESS / HOW IT WORKS SECTION ── */}
      <section className="w-full bg-slate-50/50 border-t border-b border-slate-100 py-24 px-8 flex flex-col items-center relative z-10" id="services">
        <div className="w-full max-w-7xl flex flex-col gap-12">
          
          <div className="section-header text-left">
            <span className="text-cyan-600 font-display font-extrabold text-[12px] uppercase tracking-widest block mb-2">{t.secTag}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight">{t.secTitle}</h2>
          </div>

          <div className="process-grid-trigger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            
            {/* Card 1: Create Account */}
            <div 
              onClick={() => setDriverOpen(true)}
              className="process-card-anim bg-white border border-slate-200/70 p-8 rounded-2xl border-glow-cyan hover:border-cyan-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 flex items-center justify-center"><UserPlus size={22} /></div>
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="font-display font-bold text-xl text-slate-900">{t.c1Title}</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">{t.c1Desc}</p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wider">{t.c1Label}</span>
              </div>
            </div>

            {/* Card 2: Connect Store */}
            <div 
              onClick={() => setIntOpen(true)}
              className="process-card-anim bg-white border border-slate-200/70 p-8 rounded-2xl border-glow-cyan hover:border-cyan-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center"><Plug size={22} /></div>
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="font-display font-bold text-xl text-slate-900">{t.c2Title}</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">{t.c2Desc}</p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wider">{t.c2Label}</span>
              </div>
            </div>

            {/* Card 3: Warehouse Hub */}
            <div 
              onClick={() => setIntOpen(true)}
              className="process-card-anim bg-white border border-slate-200/70 p-8 rounded-2xl border-glow-cyan hover:border-cyan-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center"><Box size={22} /></div>
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="font-display font-bold text-xl text-slate-900">{t.c3Title}</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">{t.c3Desc}</p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} /></div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wider">{t.c3Label}</span>
              </div>
            </div>

            {/* Card 4: Start Shipping */}
            <div 
              onClick={() => setCalcOpen(true)}
              className="process-card-anim bg-white border border-slate-200/70 p-8 rounded-2xl border-glow-cyan hover:border-cyan-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center"><Truck size={22} /></div>
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="font-display font-bold text-xl text-slate-900">{t.c4Title}</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">{t.c4Desc}</p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wider">{t.c4Label}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COURIERS & PARTNERS TESTIMONIAL ROW ── */}
      <section className="w-full max-w-7xl px-8 py-24 flex flex-col items-center relative z-10" id="integrations">
        <div className="w-full flex flex-col gap-12">
          
          <div className="section-header text-left">
            <span className="text-cyan-600 font-display font-extrabold text-[12px] uppercase tracking-widest block mb-2">{t.teamTag}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight">{t.teamTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* Courier Profile */}
            <div className="bg-white border border-slate-200/70 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                <img src="/assets/deliverse/avatar_driver.png" alt="Marcus Chen" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Marcus Chen</h4>
                <span className="text-[10px] font-display font-bold text-cyan-600 uppercase tracking-wider mt-1 block mb-2">Lead Delivery Partner</span>
                <p className="text-slate-500 text-xs italic leading-relaxed">"Deliverse gives me steady local deliveries and optimized routes. I can manage 20+ runs daily without stress."</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-4">
                  <span className="text-[10px] font-display font-extrabold text-amber-500 uppercase flex items-center gap-0.5"><Star size={8} fill="currentColor" /> 5.0</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[9px] font-display font-bold text-slate-400 uppercase tracking-wide">1,820 Deliveries</span>
                </div>
              </div>
            </div>

            {/* Merchant Profile */}
            <div className="bg-white border border-slate-200/70 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                <img src="/assets/deliverse/avatar_merchant.png" alt="Sarah Jenkins" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Sarah Jenkins</h4>
                <span className="text-[10px] font-display font-bold text-rose-600 uppercase tracking-wider mt-1 block mb-2">Owner, Bloom & Clay Shop</span>
                <p className="text-slate-500 text-xs italic leading-relaxed">"Connecting my local shop took one click. My customers get their handmade ceramics safely in less than 2 hours!"</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-4">
                  <span className="text-[10px] font-display font-extrabold text-amber-500 uppercase flex items-center gap-0.5"><Star size={8} fill="currentColor" /> 4.9</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[9px] font-display font-bold text-slate-400 uppercase tracking-wide">Active Merchant</span>
                </div>
              </div>
            </div>

            {/* Support Profile */}
            <div className="bg-white border border-slate-200/70 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                <img src="/assets/deliverse/avatar_support.png" alt="Elena Rostova" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Elena Rostova</h4>
                <span className="text-[10px] font-display font-bold text-indigo-600 uppercase tracking-wider mt-1 block mb-2">Support & Dispatch Lead</span>
                <p className="text-slate-500 text-xs italic leading-relaxed">"We coordinate driver dispatch and assist vendors 24/7. Speed is our promise, but client peace of mind is our goal."</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-4">
                  <span className="text-[10px] font-display font-extrabold text-amber-500 uppercase flex items-center gap-0.5"><Star size={8} fill="currentColor" /> 5.0</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[9px] font-display font-bold text-slate-400 uppercase tracking-wide">Support Specialist</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FLEET RENTALS & DEMO RATES SHOWCASE ── */}
      <section className="w-full max-w-7xl px-8 py-24 flex flex-col items-center relative z-10" id="fleet-rentals">
        <div className="w-full flex flex-col gap-12">
          <div className="section-header text-left">
            <span className="text-cyan-600 font-display font-extrabold text-[12px] uppercase tracking-widest block mb-2">Deliverse Fleet & Rentals</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight">Demo Vehicles Available for Delivery & Rent</h2>
            <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-xl mt-2">Rent premium logistics vehicles or hire dedicated delivery partners. Select from our advanced range of green city-block couriers and heavy cargo transports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              { id: 'bike', title: 'Electric Cargo Bicycle', badge: 'Eco Friendly', desc: 'Pedal-assist micro-mobility. The ultimate choice for zero-emissions neighborhood drop-offs and tight city alleyways.', w: '20 kg', r: '50 km', s: '25 km/h', price: '₹660.00', icon: '🚲', bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981' },
              { id: 'moped', title: 'Electric Cargo Moped', badge: 'Popular', desc: 'High-speed moped courier with custom dual-battery swaps. Designed for ultra-fast merchant checkout parcel fulfillment.', w: '45 kg', r: '90 km', s: '55 km/h', price: '₹1,250.00', icon: '🏍️', bg: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4' },
              { id: 'auto', title: 'Cargo Goods Auto', badge: 'Heavy Duty', desc: 'Local high-torque three-wheeler tempo. Perfect for loading heavy boxes, bulk wholesale packages, and local market crates.', w: '400 kg', r: '120 km', s: '60 km/h', price: '₹2,900.00', icon: '🛺', bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' },
              { id: 'lorry', title: 'Express Lorry Truck', badge: 'Max Cargo', desc: 'Premium multi-ton container truck. Optimized for heavy warehouse transfers, large commercial furniture, and bulk freight shipping.', w: '2,500 kg', r: 'Unlimited', s: '300 HP', price: '₹6,200.00', icon: '🚛', bg: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5' }
            ].map(v => (
              <div key={v.id} className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 relative">
                <span className="absolute top-4 right-4 bg-cyan-50 border border-cyan-100 text-cyan-600 text-[8px] font-display font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">{v.badge}</span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: v.bg, color: v.color }}>{v.icon}</div>
                <div className="flex flex-col gap-2 text-left flex-grow">
                  <h3 className="font-display font-bold text-base text-slate-900">{v.title}</h3>
                  <p className="text-slate-400 font-medium text-[11px] leading-relaxed">{v.desc}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-left my-2">
                  <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[9px] text-slate-500">Weight: <strong>{v.w}</strong></span>
                  <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[9px] text-slate-500">Range: <strong>{v.r}</strong></span>
                  <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[9px] text-slate-500">Speed: <strong>{v.s}</strong></span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display font-black text-lg text-slate-900">{v.price}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ day</span>
                  </div>
                  <button 
                    onClick={() => alert(`${v.title} booked successfully! Our fleet dispatcher will contact you in 5 minutes.`)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-display font-bold text-[10px] tracking-widest uppercase transition-colors shadow-md shadow-emerald-500/10"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE NEIGHBORHOOD COURIER FLEET RADAR MAP ── */}
      <section className="w-full max-w-7xl px-8 py-10 relative z-10" id="fleet-radar">
        <div className="w-full flex flex-col gap-12 bg-slate-950 text-slate-100 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="section-header text-left">
            <span className="text-cyan-400 font-display font-extrabold text-[12px] uppercase tracking-widest flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Live Fleet Dispatch Radar
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">Nearby Delivery Partners Available</h2>
            <p className="text-slate-400 font-medium text-xs leading-relaxed max-w-xl mt-2">Monitor local couriers, cargo tempos, and mopeds navigating street blocks in real-time. Connect your store checkout to automate instant dispatching.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
            {/* Sidebar list */}
            <div className="lg:col-span-4 bg-slate-900/60 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 max-h-[400px] overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 8px #10b981' }} />
                <h4 className="font-display font-bold text-xs tracking-wider uppercase text-white">Active Local Fleet</h4>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: 0, name: "Marcus Chen", vehicle: "🏍️ Scooter", rating: "5.0", color: "#00f0ff", avatar: "🏍️" },
                  { id: 1, name: "Sarah Jenkins", vehicle: "🛺 Cargo Auto", rating: "4.9", color: "#f59e0b", avatar: "🛺" },
                  { id: 2, name: "Elena Rostova", vehicle: "🚲 E-Bike", rating: "5.0", color: "#10b981", avatar: "🚲" },
                  { id: 3, name: "Alex Rivera", vehicle: "🚛 Lorry Truck", rating: "4.8", color: "#4f46e5", avatar: "🚛" },
                  { id: 4, name: "Ravi Kumar", vehicle: "🛺 Goods Auto", rating: "4.9", color: "#ff7a00", avatar: "🛺" },
                  { id: 5, name: "Siti Aminah", vehicle: "🛵 Moped", rating: "5.0", color: "#a855f7", avatar: "🛵" }
                ].map(p => {
                  const isActive = (hoveredPartner && hoveredPartner.id === p.id) || sidebarHighlightId === p.id;
                  return (
                    <div 
                      key={p.id}
                      onMouseEnter={() => setSidebarHighlightId(p.id)}
                      onMouseLeave={() => setSidebarHighlightId(null)}
                      className={`flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                        ${isActive ? 'bg-cyan-500/10 border-cyan-500/30 translate-x-1.5' : 'hover:bg-white/10 hover:translate-x-1'}`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-white/10" style={{ border: `1.5px solid ${p.color}` }}>{p.avatar}</div>
                      <div className="flex flex-col text-left flex-grow">
                        <h5 className="font-display font-bold text-xs text-white">{p.name}</h5>
                        <span className="text-[10px] text-slate-400">{p.vehicle} · ⭐ {p.rating}</span>
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8px] font-display font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">Online</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Canvas Wrapper */}
            <div className="lg:col-span-8 border border-white/10 bg-[#040815] rounded-2xl overflow-hidden relative min-h-[400px] h-[400px]" style={{ zIndex: 10 }}>
              <div id="fleetRadarMap" className="w-full h-full custom-leaflet-container" style={{ zIndex: 1 }} />
              
              {/* Sonar sweep label */}
              <div className="absolute top-4 right-4 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-display font-bold text-cyan-400 flex items-center gap-2 tracking-wider uppercase pointer-events-none select-none" style={{ zIndex: 100 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                LIVE FLEET RADAR ACTIVE
              </div>

              {/* Hover Tooltip Overlay */}
              {hoveredPartner && (
                <div 
                  className="absolute bg-slate-950/95 border border-cyan-500/30 backdrop-blur-md rounded-xl p-3 shadow-2xl z-20 pointer-events-none transition-all duration-100 flex flex-col gap-2 w-48 text-left"
                  style={{ left: `${hoveredCardPos.x}px`, top: `${hoveredCardPos.y}px`, transform: 'translate(-50%, -105%)' }}
                >
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-base">{hoveredPartner.avatar}</span>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-[11px] text-white leading-none">{hoveredPartner.name}</span>
                      <span className="text-[9px] text-cyan-400 font-bold mt-0.5">{hoveredPartner.vehicle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-medium">
                    <div className="flex justify-between"><span>Status:</span><span className="text-emerald-400 font-bold">{hoveredPartner.status}</span></div>
                    <div className="flex justify-between"><span>Rating:</span><span className="text-amber-500 font-bold">⭐ {hoveredPartner.rating}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORT CONTACT BOX ── */}
      <section className="w-full max-w-7xl px-8 py-10 relative z-10" id="contact">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl">
          
          <div className="lg:col-span-5 p-12 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col justify-center gap-6 relative">
            <span className="w-48 h-48 rounded-full bg-cyan-500/10 absolute -bottom-16 -left-16 blur-3xl" />
            <h3 className="font-display font-extrabold text-3xl text-left leading-tight">{t.contactTitle}</h3>
            <p className="text-slate-400 text-left text-[13px] leading-relaxed max-w-xs">{t.contactSub}</p>
            
            <div className="flex flex-col gap-4 text-left mt-4 z-10 font-semibold text-[13px] text-slate-300">
              <div className="flex items-center gap-4"><Search size={16} className="text-cyan-400" /><span>support@deliverse.multiverse.net</span></div>
              <div className="flex items-center gap-4"><Phone size={16} className="text-cyan-400" /><span>+1 (800) 555-DELI</span></div>
              <div className="flex items-center gap-4"><MapPin size={16} className="text-cyan-400" /><span>Multiverse Hub, Tech District, Suite 500</span></div>
            </div>
          </div>

          <div className="lg:col-span-7 p-12 bg-slate-800 flex flex-col justify-center">
            <form onSubmit={(e) => { e.preventDefault(); alert('Message dispatched! Our logistics dispatch center will reply in 10 minutes.'); }} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" placeholder="Alex Rivera" required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" placeholder="alex@example.com" required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Your Role</label>
                <select className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors">
                  <option value="merchant">Local Merchant / Vendor</option>
                  <option value="driver">Courier Candidate</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Your Message</label>
                <textarea rows={4} placeholder="How can our delivery network help your local shop?" required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-display font-bold text-[13px] tracking-widest uppercase transition-colors mt-2 shadow-lg shadow-cyan-500/10">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-7xl px-8 py-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 mt-20 z-10 text-xs text-slate-600 font-display">
        <p>© 2026 CustomerVerse. Empowering commerce.</p>
        <p>Built with React Three Fiber, GSAP & Tailwind</p>
      </footer>


      {/* ==================== INTERACTIVE MODAL PANELS ==================== */}

      {/* Backdrop */}
      {(trackingOpen || calcOpen || intOpen || driverOpen) && (
        <div 
          onClick={() => { setTrackingOpen(false); setCalcOpen(false); setIntOpen(false); setDriverOpen(false); }}
          className="fixed inset-0 w-full h-full bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* 1. Track & Trace Modal */}
      {trackingOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90%] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center"><Search size={18} /></div>
              <div className="flex flex-col text-left">
                <h3 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Track & Trace Simulator</h3>
                <span className="text-[10px] font-medium text-slate-400 mt-1">Live city road courier monitor</span>
              </div>
            </div>
            <button onClick={() => setTrackingOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={trackId} 
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="Tracking ID (MLT-7798, MLT-2041)..." 
                className="flex-grow px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500" 
              />
              <button onClick={handleTrackingSubmit} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-display font-bold text-xs tracking-wider uppercase">Locate</button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase">Courier Status</span>
                <span className={`text-xs font-bold ${trackStatus !== 'Waiting to Locate...' ? 'text-cyan-600 animate-pulse' : 'text-slate-800'}`}>{trackStatus}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase">Est. Delivery</span>
                <span className="text-xs font-bold text-slate-800">{trackEta}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase">Courier Agent</span>
                <span className="text-xs font-bold text-slate-800">{trackCourier}</span>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="w-full h-[200px] border border-slate-200 rounded-xl overflow-hidden relative">
              <canvas ref={canvasRef} width={552} height={200} className="w-full h-full block" />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded text-[10px] text-white flex items-center gap-1.5 font-semibold"><Check size={10} className="text-cyan-400" /> Click 'Locate' to start routing</div>
            </div>

            {/* Timeline Progress */}
            <div className="flex justify-between relative px-2 mt-2">
              <span className="absolute top-[15px] left-8 right-8 h-0.5 bg-slate-100 -z-10" />
              
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[11px] font-bold ${timelineStep >= 1 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>✓</div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wide">Ordered</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[11px] font-bold ${timelineStep >= 2 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>📦</div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wide">Picked Up</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[11px] font-bold ${timelineStep >= 3 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>🚴</div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wide">In Transit</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[11px] font-bold ${timelineStep >= 4 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>✓</div>
                <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wide">Delivered</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Shipping Quote Calculator Modal */}
      {calcOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90%] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center"><Calculator size={18} /></div>
              <div className="flex flex-col text-left">
                <h3 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Shipping Cost Estimator</h3>
                <span className="text-[10px] font-medium text-slate-400 mt-1">Instant delivery quotes</span>
              </div>
            </div>
            <button onClick={() => setCalcOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
          </div>
          <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[75vh]">
            <form onSubmit={handleCalculator} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Pickup Area</label>
                  <select name="pickup" className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="downtown">Downtown Core</option>
                    <option value="tech-park">Westside Tech Park</option>
                    <option value="harbor">East Harbor Docks</option>
                    <option value="suburbs">North Suburbs</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Drop-off Area</label>
                  <select name="drop" className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="suburbs">North Suburbs</option>
                    <option value="downtown">Downtown Core</option>
                    <option value="tech-park">Westside Tech Park</option>
                    <option value="harbor">East Harbor Docks</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                  <input type="number" name="weight" min={0.1} step={0.1} defaultValue={1.5} className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Package Size</label>
                  <select name="size" className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="envelope">Envelope</option>
                    <option value="small">Small Carton</option>
                    <option value="medium">Medium Parcel</option>
                    <option value="large">Heavy Box</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Delivery Speed</label>
                  <select name="speed" className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="eco">Eco Saver (Next-day)</option>
                    <option value="standard">Standard (4 hours)</option>
                    <option value="express">Express (90 mins)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-display font-bold text-xs tracking-widest uppercase mt-2 shadow-lg shadow-cyan-500/10">Calculate Cost</button>
            </form>

            {calcResults && (
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
                  <h4 className="font-display font-bold text-[14px] text-slate-800">Your Quote Details</h4>
                  <span className="font-display font-black text-2xl text-cyan-600">₹{calcResults.total}</span>
                </div>
                <div className="flex flex-col gap-2 font-semibold text-[13px] text-slate-500">
                  <div className="flex justify-between"><span>Transit Base Price:</span><span className="text-slate-800">₹{calcResults.base}</span></div>
                  <div className="flex justify-between"><span>Distance Charge:</span><span className="text-slate-800">₹{calcResults.dist}</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 mt-1 font-bold text-slate-800"><span>Estimated Cost:</span><span className="text-cyan-600">₹{calcResults.total}</span></div>
                  <div className="flex justify-between italic mt-1"><span>Estimated Arrival:</span><span className="text-slate-700 font-bold">{calcResults.window}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Integration Hub Modal */}
      {intOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] max-w-[90%] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center"><Plug size={18} /></div>
              <div className="flex flex-col text-left">
                <h3 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Store Integration Hub</h3>
                <span className="text-[10px] font-medium text-slate-400 mt-1">Automate local courier dispatches</span>
              </div>
            </div>
            <button onClick={() => setIntOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <p className="text-slate-500 font-medium text-xs leading-relaxed text-left">Connect your vendor shopfront directly. When a client orders on your storefront, Deliverse assigns the nearest courier to complete delivery instantly.</p>
            
            <div className="flex flex-col gap-3">
              
              {/* Multiverse Core */}
              <div className={`p-4 border rounded-xl flex items-center gap-4 transition-colors ${multiverseConnected ? 'bg-cyan-500/5 border-cyan-500' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">M</div>
                <div className="flex flex-col text-left flex-grow">
                  <h4 className="font-display font-bold text-sm text-slate-900">Multiverse Storefront</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Core marketplace vendor account</p>
                </div>
                <button onClick={() => handlePortalChange(null, 'multiverse')} className={`px-4 py-1.5 rounded-full font-display font-bold text-[10px] tracking-wider uppercase transition-colors ${multiverseConnected ? 'bg-cyan-500 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>{multiverseConnected ? 'Linked' : 'Link'}</button>
              </div>

              {/* Shopify */}
              <div className={`p-4 border rounded-xl flex items-center gap-4 transition-colors ${shopifyConnected ? 'bg-cyan-500/5 border-cyan-500' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">S</div>
                <div className="flex flex-col text-left flex-grow">
                  <h4 className="font-display font-bold text-sm text-slate-900">Shopify Integration</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Sync Shopify order dispatching</p>
                </div>
                <button onClick={() => handlePortalChange(null, 'shopify')} className={`px-4 py-1.5 rounded-full font-display font-bold text-[10px] tracking-wider uppercase transition-colors ${shopifyConnected ? 'bg-cyan-500 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>{shopifyConnected ? 'Linked' : 'Link'}</button>
              </div>

              {/* WooCommerce */}
              <div className={`p-4 border rounded-xl flex items-center gap-4 transition-colors ${wooConnected ? 'bg-cyan-500/5 border-cyan-500' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">W</div>
                <div className="flex flex-col text-left flex-grow">
                  <h4 className="font-display font-bold text-sm text-slate-900">WooCommerce Sync</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Sync custom WordPress storefronts</p>
                </div>
                <button onClick={() => handlePortalChange(null, 'woo')} className={`px-4 py-1.5 rounded-full font-display font-bold text-[10px] tracking-wider uppercase transition-colors ${wooConnected ? 'bg-cyan-500 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>{wooConnected ? 'Linked' : 'Link'}</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. Courier Estimator Modal */}
      {driverOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] max-w-[90%] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center"><UserPlus size={18} /></div>
              <div className="flex flex-col text-left">
                <h3 className="font-display font-extrabold text-[15px] text-slate-900 leading-none">Courier Partner Portal</h3>
                <span className="text-[10px] font-medium text-slate-400 mt-1">Deliver locally, earn flexibly</span>
              </div>
            </div>
            <button onClick={() => setDriverOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
          </div>
          <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[75vh]">
            <div className="flex flex-col gap-4 bg-slate-50 border border-slate-100 p-6 rounded-xl">
              <h4 className="font-display font-bold text-sm text-slate-900 text-left">Earnings Estimator</h4>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Deliveries / Week:</span>
                <span className="text-cyan-600 text-base">{trips}</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={120} 
                value={trips} 
                step={5} 
                onChange={(e) => setTrips(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
              />
              
              <div className="border-t border-slate-200/80 pt-4 flex flex-col items-center gap-1 bg-white border border-slate-150 p-4 rounded-lg mt-2">
                <span className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Weekly Income Estimate</span>
                <span className="font-display font-black text-3xl text-cyan-600">${(trips * 7.50).toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 italic mt-1">*Based on standard delivery payouts. Tips are 100% yours!</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted! Our courier onboarding fleet will contact you shortly.'); }} className="flex flex-col gap-4 text-left">
              <h4 className="font-display font-bold text-sm text-slate-900">Apply to Join the Fleet</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" placeholder="Alex Rivera" required className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input type="tel" placeholder="(555) 000-0000" required className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Vehicle Type</label>
                  <select className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="e-bike">Electric Bicycle / Scooter</option>
                    <option value="motorcycle">Motorcycle / Moped</option>
                    <option value="car">Delivery Sedan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display font-extrabold text-slate-400 uppercase tracking-widest">Primary Service Area</label>
                  <select className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
                    <option value="downtown">Downtown Core</option>
                    <option value="suburbs">North Suburbs</option>
                    <option value="tech">Westside Tech Parks</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-display font-bold text-xs tracking-widest uppercase transition-colors shadow-lg shadow-cyan-500/10">Submit Application</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
