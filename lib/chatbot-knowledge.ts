import { vehicles } from "./vehicles";
import { dealer } from "./dealership";

/* ── Vehicle knowledge (auto-generated from inventory) ──────── */

export interface VehicleKnowledge {
    slug: string;
    name: string;
    make: string;
    model: string;
    trim: string;
    year: number;
    priceFormatted: string;
    priceKES: number;
    mileage: string;
    fuel: string;
    transmission: string;
    drive: string;
    engineSummary: string;
    bodyType: string;
    seats: number;
    exterior: string;
    interior: string;
    condition: string;
    status: string;
    location: string;
    description: string;
    features: string[];
    searchTerms: string[];
}

function formatKES(amount: number): string {
    return `KES ${amount.toLocaleString("en-KE")}`;
}

export const vehicleKnowledge: VehicleKnowledge[] = vehicles.map((v) => ({
    slug: v.slug,
    name: `${v.year} ${v.make} ${v.model} ${v.trim}`.trim(),
    make: v.make,
    model: v.model,
    trim: v.trim,
    year: v.year,
    priceFormatted: formatKES(v.priceKES),
    priceKES: v.priceKES,
    mileage: v.mileageKm === 0 ? "Low genuine mileage" : `${v.mileageKm.toLocaleString()} km`,
    fuel: v.fuel,
    transmission: v.transmission,
    drive: v.drive,
    engineSummary: v.engineSummary,
    bodyType: v.bodyType,
    seats: v.seats,
    exterior: v.exterior,
    interior: v.interior,
    condition: v.condition,
    status: v.status,
    location: v.location,
    description: v.description,
    features: v.features,
    searchTerms: [
        v.make.toLowerCase(),
        v.model.toLowerCase(),
        v.trim.toLowerCase(),
        v.bodyType.toLowerCase(),
        v.fuel.toLowerCase(),
        v.exterior.toLowerCase(),
        `${v.year}`,
        v.slug,
        ...(v.make === "Land Rover" ? ["range rover", "landrover"] : []),
        ...(v.model.includes("Land Cruiser") ? ["landcruiser", "lc", "v8"] : []),
        ...(v.model === "Hilux" ? ["pickup", "truck"] : []),
        ...(v.model === "Cayenne" ? ["porsche", "cayenne"] : []),
        ...(v.model === "Q5" ? ["audi", "q5", "quattro"] : []),
        ...(v.model === "GLE" ? ["mercedes", "benz", "gle", "amg"] : []),
        ...(v.model === "X5" ? ["bmw", "x5", "m sport"] : []),
        ...(v.model === "LX 600" ? ["lexus", "lx", "lx600"] : []),
    ],
}));

/* ── Dealership knowledge ───────────────────────────────────── */

export const dealershipKnowledge = {
    name: dealer.name,
    tagline: dealer.tagline,
    description: dealer.description,
    phone: dealer.phoneDisplay,
    whatsapp: dealer.whatsapp,
    email: dealer.email,
    address: `${dealer.addressLine1}, ${dealer.addressLine2}`,
    mapsUrl: dealer.mapsUrl,
    hours: dealer.hours,
    socials: dealer.socials,
    siteUrl: dealer.siteUrl,
};

/* ── FAQ knowledge ──────────────────────────────────────────── */

export interface FAQ {
    keywords: string[];
    question: string;
    answer: string;
}

export const faqKnowledge: FAQ[] = [
    {
        keywords: ["finance", "financing", "loan", "credit", "installment", "payment plan", "sacco", "bank"],
        question: "Do you offer financing?",
        answer: `Yes! ${dealer.name} can guide you through flexible financing options with transparent rates and payment structures designed around your cash flow. Visit our Financing page or message us on WhatsApp to get a personalized estimate.`,
    },
    {
        keywords: ["import", "source", "sourcing", "japan", "uk", "united kingdom", "auction", "order"],
        question: "Can you import a specific car?",
        answer: `Absolutely. Our Import Concierge service sources vehicles directly from Japanese auctions, UK dealers, and European stock. We handle everything: verified condition reports, transparent duty breakdowns, clearing, registration, and tracked delivery to your door. Just tell us what you are looking for.`,
    },
    {
        keywords: ["trade", "trade-in", "sell", "selling", "valuation", "exchange", "upgrade", "consign", "behalf"],
        question: "Can you sell my car on my behalf?",
        answer: `Yes, we sell premium SUVs and luxury vehicles on your behalf. We handle professional presentation, marketing, viewings, negotiation and paperwork, then you receive your funds minus our agreed commission. List your car through our website or WhatsApp.`,
    },
    {
        keywords: ["deliver", "delivery", "shipping", "transport", "ship", "mombasa", "upcountry"],
        question: "Do you deliver nationwide?",
        answer: `Yes! Your vehicle is detailed, fuelled, and registered, then handed over at your doorstep anywhere in Kenya. We even offer a complimentary driving orientation if you wish.`,
    },
    {
        keywords: ["inspect", "inspection", "check", "condition", "quality", "verified", "verify", "provenance"],
        question: "How do you verify vehicle condition?",
        answer: `Every vehicle passes a thorough pre-delivery inspection and comes with documented history and service records. We believe in evidence, not stories. All documentation is available for your review before purchase.`,
    },
    {
        keywords: ["warranty", "guarantee", "after-sale", "aftersale"],
        question: "Do vehicles come with a warranty?",
        answer: `Each vehicle's warranty status varies based on age and origin. Many of our newer imports still carry manufacturer warranty. We are happy to discuss the specific coverage for any vehicle you are interested in. Reach out via WhatsApp for details.`,
    },
    {
        keywords: ["test drive", "test-drive", "testdrive", "try", "viewing", "view", "see", "visit", "showroom", "book", "appointment"],
        question: "Can I book a test drive or viewing?",
        answer: `Of course! We offer private viewings and unhurried test drives, by appointment or on a whim. We are open six days a week, and coffee is on us. Book through WhatsApp or just walk in during opening hours.`,
    },
    {
        keywords: ["documents", "registration", "logbook", "transfer", "paperwork", "ready"],
        question: "Are documents ready for transfer?",
        answer: `All vehicles listed as "available" come with ready documents, meaning you can buy and drive the same day. We handle all the paperwork for a seamless ownership transfer.`,
    },
    {
        keywords: ["reserve", "reservation", "hold", "deposit", "book a car", "secure"],
        question: "Can I reserve a vehicle?",
        answer: `Yes, you can secure any vehicle with a refundable reservation. This is especially useful for vehicles marked "in-transit" that haven't arrived yet. Contact us on WhatsApp to arrange a reservation.`,
    },
    {
        keywords: ["free", "complimentary", "bonus", "offer", "deal", "gift"],
        question: "Are there any complimentary offers?",
        answer: `Select vehicles come with a complimentary full tank of fuel and a complimentary first service on purchase. It's Josam's way of ensuring your ownership story starts perfectly. Check individual vehicle listings for specific offers.`,
    },
];

/* ── Intent patterns ────────────────────────────────────────── */

export type IntentType =
    | "greeting"
    | "farewell"
    | "thanks"
    | "vehicle_list"
    | "vehicle_search"
    | "vehicle_price"
    | "vehicle_features"
    | "vehicle_availability"
    | "cheapest"
    | "most_expensive"
    | "suv"
    | "dealership_hours"
    | "dealership_location"
    | "dealership_contact"
    | "unknown";

export interface IntentPattern {
    intent: IntentType;
    keywords: string[];
    weight: number;
}

export const intentPatterns: IntentPattern[] = [
    {
        intent: "greeting",
        keywords: ["hello", "hi", "hey", "howdy", "good morning", "good afternoon", "good evening", "sasa", "niaje", "mambo", "sup", "whats up"],
        weight: 1.5,
    },
    {
        intent: "farewell",
        keywords: ["bye", "goodbye", "see you", "later", "thanks bye", "take care", "goodnight"],
        weight: 1.5,
    },
    {
        intent: "thanks",
        keywords: ["thank", "thanks", "asante", "appreciate", "helpful", "great help"],
        weight: 1.3,
    },
    {
        intent: "vehicle_list",
        keywords: ["cars", "vehicles", "inventory", "collection", "stock", "what do you have", "available cars", "show me", "all cars", "list", "lineup", "range"],
        weight: 1.2,
    },
    {
        intent: "vehicle_search",
        keywords: ["looking for", "interested in", "tell me about", "information", "details", "specs", "specifications", "about the"],
        weight: 1.0,
    },
    {
        intent: "vehicle_price",
        keywords: ["price", "cost", "how much", "pricing", "amount", "bei", "budget", "afford", "expensive", "cheap", "cheapest"],
        weight: 1.3,
    },
    {
        intent: "vehicle_features",
        keywords: ["feature", "features", "equipped", "come with", "include", "specification", "specs", "what does it have", "interior", "tech", "technology"],
        weight: 1.1,
    },
    {
        intent: "vehicle_availability",
        keywords: ["available", "availability", "in stock", "ready", "can i buy", "still available", "sold", "reserved"],
        weight: 1.2,
    },
    {
        intent: "cheapest",
        keywords: ["cheapest", "lowest price", "most affordable", "budget", "least expensive", "under"],
        weight: 1.4,
    },
    {
        intent: "most_expensive",
        keywords: ["most expensive", "highest price", "top of the range", "flagship", "premium"],
        weight: 1.4,
    },
    {
        intent: "suv",
        keywords: ["suv", "suvs", "4x4", "offroad", "off-road", "off road"],
        weight: 1.0,
    },
    {
        intent: "dealership_hours",
        keywords: ["hours", "open", "opening", "close", "closing", "time", "when", "schedule", "working hours", "business hours"],
        weight: 1.3,
    },
    {
        intent: "dealership_location",
        keywords: ["location", "where", "address", "directions", "find you", "map", "place", "situated", "located", "showroom address"],
        weight: 1.3,
    },
    {
        intent: "dealership_contact",
        keywords: ["contact", "phone", "call", "whatsapp", "email", "reach", "talk", "message", "number"],
        weight: 1.2,
    },
];
