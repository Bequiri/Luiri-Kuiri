export const BRAND = {
  name: "NORTHSTAR EXECUTIVE",
  sloganFi: "Satakunnan ensimmäinen premium-kuljetuskonsepti",
  sloganEn: "Satakunta's First Premium Executive Transport",
  phone: "+358 40 123 4567",
  email: "varaus@northstarexecutive.fi",
  whatsapp: "+358401234567",
  city: "Pori",
  region: "Satakunta",
  vehicle: "Polestar 4",
};

export const COLORS = {
  black: "#0A0A0A",
  gold: "#D4A853",
  white: "#F5F5F5",
};

export const ROUTES = [
  { fi: "Etusivu", en: "Home", href: "/", key: "home" },
  { fi: "Palvelut", en: "Services", href: "/palvelut", key: "services" },
  { fi: "Ajoneuvo", en: "Vehicle", href: "/ajoneuvo", key: "vehicle" },
  { fi: "Tarina", en: "Story", href: "/tarina", key: "story" },
  { fi: "Hinnat", en: "Pricing", href: "/hinnat", key: "pricing" },
  { fi: "Yrityksille", en: "For Business", href: "/yrityksille", key: "business" },
  { fi: "Yhteystiedot", en: "Contact", href: "/yhteystiedot", key: "contact" },
];

export const SERVICES = [
  {
    key: "airport",
    fi: {
      title: "Lentokenttäkuljetukset",
      description: "Täsmälliset kuljetukset Turun, Tampereen ja Helsingin lentoasemille. Seuraamme lennon aikataulua — viivästykset eivät aiheuta lisäkuluja.",
      details: ["Lentoasemanseuranta", "Noutaminen saapumishallista", "Matkatavarapalvelu", "24/7 saatavuus"],
    },
    en: {
      title: "Airport Transfers",
      description: "Precise transfers to Turku, Tampere and Helsinki airports. We track your flight — delays never cost extra.",
      details: ["Live flight tracking", "Meet & greet at arrivals", "Luggage assistance", "24/7 availability"],
    },
    basePrice: 180,
    icon: "✈️",
  },
  {
    key: "corporate",
    fi: {
      title: "Yrityspakettisopimukset",
      description: "Kuukausilaskutus, prioriteettivaraukset ja räätälöidyt sopimushinnat yrityksille. Oma tili ja raportointi.",
      details: ["Kuukausilaskutus", "Prioriteettivaraukset", "Asiakastilit", "Kuukausiraportointi"],
    },
    en: {
      title: "Corporate Accounts",
      description: "Monthly invoicing, priority bookings and custom contract rates for businesses. Dedicated account and reporting.",
      details: ["Monthly invoicing", "Priority bookings", "Company accounts", "Monthly reports"],
    },
    basePrice: null,
    icon: "🏢",
  },
  {
    key: "events",
    fi: {
      title: "Tapahtumapaketti",
      description: "VIP-kuljetukset Pori Jazz, Suomi Areena ja muihin suuriin tapahtumiin. Myös viinimatkoja ja ryhmäkuljetuksia.",
      details: ["Pori Jazz -paketit", "Suomi Areena -kuljetukset", "Ryhmäkuljetukset", "Viinimatkat"],
    },
    en: {
      title: "Event Transfers",
      description: "VIP transfers to Pori Jazz, Suomi Areena and other major events. Also wine tours and group transport.",
      details: ["Pori Jazz packages", "Suomi Areena transfers", "Group transport", "Wine tours"],
    },
    basePrice: 150,
    icon: "🎭",
  },
  {
    key: "pointtopoint",
    fi: {
      title: "Point-to-Point Premium",
      description: "Kiinteähintaiset premium-kuljetukset kaupunkien välillä. Pori, Turku, Tampere, Helsinki — aina täsmällisesti.",
      details: ["Kiinteät hinnat", "Täsmällisyystakuu", "Nimetty kuljettaja", "Tyylikäs saapuminen"],
    },
    en: {
      title: "Point-to-Point Premium",
      description: "Fixed-price premium transfers between cities. Pori, Turku, Tampere, Helsinki — always on time.",
      details: ["Fixed prices", "Punctuality guarantee", "Named driver", "Elegant arrival"],
    },
    basePrice: 120,
    icon: "🗺️",
  },
  {
    key: "senior",
    fi: {
      title: "Premium-kuljetukset ikäihmisille",
      description: "Erityisen huolellinen ja rauhallinen palvelu ikäihmisille. Apua astumisessa, odottaminen, kauppa-ajot.",
      details: ["Avustaminen sisään/ulos", "Rauhallinen ajotapa", "Odottaminen asioinneilla", "Luotettavuus"],
    },
    en: {
      title: "Premium Senior Transport",
      description: "Especially careful and calm service for elderly clients. Assistance boarding, waiting, shopping trips.",
      details: ["Boarding assistance", "Calm driving style", "Waiting during errands", "Full reliability"],
    },
    basePrice: 80,
    icon: "🌟",
  },
];

export const FIXED_ROUTES = [
  { from: "Pori", to: "Turku Lentokenttä (TKU)", priceFi: 180, priceEn: 180 },
  { from: "Pori", to: "Tampere Lentokenttä (TMP)", priceFi: 160, priceEn: 160 },
  { from: "Pori", to: "Helsinki-Vantaa (HEL)", priceFi: 320, priceEn: 320 },
  { from: "Pori", to: "Turku Keskusta", priceFi: 150, priceEn: 150 },
  { from: "Pori", to: "Tampere Keskusta", priceFi: 140, priceEn: 140 },
  { from: "Pori", to: "Helsinki Keskusta", priceFi: 340, priceEn: 340 },
  { from: "Pori", to: "Rauma", priceFi: 70, priceEn: 70 },
  { from: "Pori", to: "Satakunnan Sairaala", priceFi: 40, priceEn: 40 },
];

export const EXTRAS = [
  { key: "water", fi: "Vesipullot (2 kpl)", en: "Water bottles (2)", price: 0 },
  { key: "newspaper", fi: "Sanomalehti", en: "Newspaper", price: 0 },
  { key: "wifi", fi: "WiFi-hotspot", en: "WiFi hotspot", price: 0 },
  { key: "charger", fi: "Puhelinlaturi (USB-C/Lightning)", en: "Phone charger (USB-C/Lightning)", price: 0 },
  { key: "baby", fi: "Lapsen turvaistuinpaikka", en: "Child seat", price: 15 },
  { key: "flowers", fi: "Kukkakauppapysähdys", en: "Flower shop stop", price: 10 },
];

export const DEPOSIT_AMOUNT = 50;
