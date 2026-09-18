import {
    vehicleKnowledge,
    dealershipKnowledge,
    faqKnowledge,
    intentPatterns,
    type VehicleKnowledge,
    type IntentType,
} from "./chatbot-knowledge";

/* ── Types ──────────────────────────────────────────────────── */

export interface ChatMessage {
    id: string;
    role: "user" | "bot";
    text: string;
    suggestions?: string[];
    vehicleSlug?: string;
}

interface ConversationContext {
    lastVehicle: VehicleKnowledge | null;
    lastIntent: IntentType | null;
    messageCount: number;
}

/* ── Helpers ────────────────────────────────────────────────── */

function normalize(text: string): string {
    return text
        .toLowerCase()
        .replace(/[''`]/g, "'")
        .replace(/[^a-z0-9\s'-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(text: string): string[] {
    return normalize(text).split(" ").filter(Boolean);
}

function generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ── Intent detection ───────────────────────────────────────── */

function detectIntent(input: string): { intent: IntentType; confidence: number } {
    const norm = normalize(input);
    const tokens = tokenize(input);

    let bestIntent: IntentType = "unknown";
    let bestScore = 0;

    for (const pattern of intentPatterns) {
        let score = 0;
        for (const keyword of pattern.keywords) {
            if (keyword.includes(" ")) {
                // Multi-word phrase match
                if (norm.includes(keyword)) {
                    score += 2.0 * pattern.weight;
                }
            } else {
                // Single word match
                if (tokens.includes(keyword)) {
                    score += 1.0 * pattern.weight;
                } else if (norm.includes(keyword)) {
                    score += 0.6 * pattern.weight;
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestIntent = pattern.intent;
        }
    }

    return { intent: bestIntent, confidence: Math.min(bestScore / 3, 1) };
}

/* ── Entity extraction ──────────────────────────────────────── */

function findVehicles(input: string): VehicleKnowledge[] {
    const norm = normalize(input);
    const tokens = tokenize(input);

    const scored = vehicleKnowledge.map((v) => {
        let score = 0;
        for (const term of v.searchTerms) {
            if (term.includes(" ")) {
                if (norm.includes(term)) score += 3;
            } else {
                if (tokens.includes(term)) score += 2;
                else if (norm.includes(term)) score += 1;
            }
        }
        return { vehicle: v, score };
    });

    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.vehicle);
}

function findPriceRange(input: string): { min?: number; max?: number } | null {
    const norm = normalize(input);
    const underMatch = norm.match(/under\s+(\d[\d,]*)/);
    const overMatch = norm.match(/over\s+(\d[\d,]*)/);
    const betweenMatch = norm.match(/(\d[\d,]*)\s*(?:to|-)\s*(\d[\d,]*)/);

    if (betweenMatch) {
        return {
            min: parseInt(betweenMatch[1].replace(/,/g, "")),
            max: parseInt(betweenMatch[2].replace(/,/g, "")),
        };
    }
    if (underMatch) {
        return { max: parseInt(underMatch[1].replace(/,/g, "")) };
    }
    if (overMatch) {
        return { min: parseInt(overMatch[1].replace(/,/g, "")) };
    }
    return null;
}

/* ── Response formatting ────────────────────────────────────── */

function formatVehicleSummary(v: VehicleKnowledge): string {
    const statusTag =
        v.status === "available"
            ? "Available"
            : v.status === "reserved"
                ? "Reserved"
                : v.status === "sold"
                    ? "Sold"
                    : "In Transit";

    return `**${v.name}**\n${v.priceFormatted} | ${v.engineSummary} | ${v.exterior}\n${v.condition} | ${statusTag} | ${v.location}`;
}

function formatVehicleDetails(v: VehicleKnowledge): string {
    const lines = [
        `**${v.name}**`,
        ``,
        `**Price:** ${v.priceFormatted}`,
        `**Engine:** ${v.engineSummary}`,
        `**Transmission:** ${v.transmission} | **Drive:** ${v.drive}`,
        `**Mileage:** ${v.mileage}`,
        `**Exterior:** ${v.exterior} | **Interior:** ${v.interior}`,
        `**Seats:** ${v.seats} | **Body:** ${v.bodyType}`,
        `**Condition:** ${v.condition}`,
        `**Status:** ${v.status === "available" ? "Available now" : v.status === "in-transit" ? "In transit" : v.status === "reserved" ? "Reserved" : "Sold"}`,
        ``,
        v.description,
    ];
    return lines.join("\n");
}

function formatFeatures(v: VehicleKnowledge): string {
    const lines = [
        `**${v.name} - Key Features:**`,
        ``,
        ...v.features.map((f) => `- ${f}`),
    ];
    return lines.join("\n");
}

/* ── Core engine ────────────────────────────────────────────── */

const context: ConversationContext = {
    lastVehicle: null,
    lastIntent: null,
    messageCount: 0,
};

export function getWelcomeMessage(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `Welcome to **${dealershipKnowledge.name}**! I'm your virtual concierge.\n\nI can help you explore our collection of premium SUVs and luxury vehicles, check pricing, find vehicle details, or answer questions about our services.\n\nHow can I assist you today?`,
        suggestions: [
            "Show me all cars",
            "What's the cheapest car?",
            "Do you offer financing?",
            "Opening hours",
            "Where are you located?",
        ],
    };
}

export function processMessage(userInput: string): ChatMessage {
    context.messageCount++;
    const { intent, confidence } = detectIntent(userInput);
    const matchedVehicles = findVehicles(userInput);
    const priceRange = findPriceRange(userInput);

    // Check FAQ first for high-confidence FAQ matches
    if (confidence < 0.5 || intent === "unknown") {
        const faqMatch = findFAQMatch(userInput);
        if (faqMatch) {
            return {
                id: generateId(),
                role: "bot",
                text: faqMatch.answer,
                suggestions: ["Show me all cars", "Contact info", "Opening hours"],
            };
        }
    }

    // Route by intent
    switch (intent) {
        case "greeting":
            return handleGreeting();
        case "farewell":
            return handleFarewell();
        case "thanks":
            return handleThanks();
        case "vehicle_list":
            return handleVehicleList();
        case "vehicle_search":
            return handleVehicleSearch(matchedVehicles);
        case "vehicle_price":
            return handleVehiclePrice(matchedVehicles, priceRange);
        case "vehicle_features":
            return handleVehicleFeatures(matchedVehicles);
        case "vehicle_availability":
            return handleVehicleAvailability(matchedVehicles);
        case "cheapest":
            return handleCheapest();
        case "most_expensive":
            return handleMostExpensive();
        case "suv":
            return handleSUV();
        case "dealership_hours":
            return handleHours();
        case "dealership_location":
            return handleLocation();
        case "dealership_contact":
            return handleContact();
        default:
            // Try to match a vehicle even without clear intent
            if (matchedVehicles.length > 0) {
                return handleVehicleSearch(matchedVehicles);
            }
            // Try FAQ as fallback
            const faqFallback = findFAQMatch(userInput);
            if (faqFallback) {
                return {
                    id: generateId(),
                    role: "bot",
                    text: faqFallback.answer,
                    suggestions: ["Show me all cars", "Contact info", "Opening hours"],
                };
            }
            return handleUnknown();
    }
}

/* ── FAQ matcher ────────────────────────────────────────────── */

function findFAQMatch(input: string) {
    const norm = normalize(input);
    const tokens = tokenize(input);

    let bestFAQ = null;
    let bestScore = 0;

    for (const faq of faqKnowledge) {
        let score = 0;
        for (const keyword of faq.keywords) {
            if (keyword.includes(" ")) {
                if (norm.includes(keyword)) score += 2;
            } else {
                if (tokens.includes(keyword)) score += 1;
                else if (norm.includes(keyword)) score += 0.5;
            }
        }
        if (score > bestScore && score >= 1) {
            bestScore = score;
            bestFAQ = faq;
        }
    }

    return bestFAQ;
}

/* ── Intent handlers ────────────────────────────────────────── */

function handleGreeting(): ChatMessage {
    const greetings = [
        `Hello! Welcome to ${dealershipKnowledge.name}. How can I help you today?`,
        `Hey there! I'm the Josam concierge. Looking for your next premium ride?`,
        `Hi! Great to have you here. I can help you explore our collection, check pricing, or answer any questions.`,
    ];
    return {
        id: generateId(),
        role: "bot",
        text: greetings[Math.floor(Math.random() * greetings.length)],
        suggestions: ["Show me all cars", "What's the cheapest?", "Do you offer financing?", "Opening hours"],
    };
}

function handleFarewell(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `Thank you for chatting with us! If you need anything else, don't hesitate to reach out. You can also contact our team directly on WhatsApp at ${dealershipKnowledge.phone}. Have a great day!`,
        suggestions: ["Contact info"],
    };
}

function handleThanks(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `You're welcome! Is there anything else I can help you with?`,
        suggestions: ["Show me all cars", "Opening hours", "Contact info"],
    };
}

function handleVehicleList(): ChatMessage {
    const available = vehicleKnowledge.filter((v) => v.status !== "sold");
    const lines = available.map((v) => formatVehicleSummary(v));

    return {
        id: generateId(),
        role: "bot",
        text: `We currently have **${available.length} vehicles** in our collection:\n\n${lines.join("\n\n")}`,
        suggestions: ["What's the cheapest?", "Tell me about the Range Rover", "Do you offer financing?"],
    };
}

function handleVehicleSearch(matchedVehicles: VehicleKnowledge[]): ChatMessage {
    if (matchedVehicles.length === 0) {
        // Check context for follow-up
        if (context.lastVehicle) {
            return {
                id: generateId(),
                role: "bot",
                text: formatVehicleDetails(context.lastVehicle),
                vehicleSlug: context.lastVehicle.slug,
                suggestions: [`Features of the ${context.lastVehicle.model}`, "Show me all cars", "Contact info"],
            };
        }
        return {
            id: generateId(),
            role: "bot",
            text: `I couldn't find a specific vehicle matching your query. Here's what we have in stock:`,
            suggestions: ["Show me all cars", "SUVs available", "What's the cheapest?"],
        };
    }

    const vehicle = matchedVehicles[0];
    context.lastVehicle = vehicle;
    context.lastIntent = "vehicle_search";

    if (matchedVehicles.length === 1) {
        return {
            id: generateId(),
            role: "bot",
            text: formatVehicleDetails(vehicle),
            vehicleSlug: vehicle.slug,
            suggestions: [`Features of the ${vehicle.model}`, `Price of the ${vehicle.model}`, "Show me all cars"],
        };
    }

    // Multiple matches
    const lines = matchedVehicles.slice(0, 5).map((v) => formatVehicleSummary(v));
    return {
        id: generateId(),
        role: "bot",
        text: `I found **${matchedVehicles.length} vehicles** matching your search:\n\n${lines.join("\n\n")}\n\nWould you like more details on any of these?`,
        suggestions: matchedVehicles.slice(0, 3).map((v) => `Tell me about the ${v.model}`),
    };
}

function handleVehiclePrice(matchedVehicles: VehicleKnowledge[], priceRange: { min?: number; max?: number } | null): ChatMessage {
    // Price range query
    if (priceRange) {
        const filtered = vehicleKnowledge.filter((v) => {
            if (priceRange.min && v.priceKES < priceRange.min) return false;
            if (priceRange.max && v.priceKES > priceRange.max) return false;
            return true;
        });

        if (filtered.length === 0) {
            return {
                id: generateId(),
                role: "bot",
                text: `No vehicles found in that price range. Our prices range from ${vehicleKnowledge.reduce((min, v) => v.priceKES < min.priceKES ? v : min).priceFormatted} to ${vehicleKnowledge.reduce((max, v) => v.priceKES > max.priceKES ? v : max).priceFormatted}.`,
                suggestions: ["Show me all cars", "What's the cheapest?", "Financing options"],
            };
        }

        const lines = filtered.sort((a, b) => a.priceKES - b.priceKES).map((v) => formatVehicleSummary(v));
        return {
            id: generateId(),
            role: "bot",
            text: `Here are vehicles in your price range:\n\n${lines.join("\n\n")}`,
            suggestions: ["Tell me more about the first one", "Do you offer financing?"],
        };
    }

    // Specific vehicle price
    if (matchedVehicles.length > 0) {
        const v = matchedVehicles[0];
        context.lastVehicle = v;
        return {
            id: generateId(),
            role: "bot",
            text: `The **${v.name}** is priced at **${v.priceFormatted}**.\n\n${v.condition} | ${v.status === "available" ? "Available now" : v.status === "in-transit" ? "In transit" : v.status} | ${v.location}\n\nWe can also guide you through flexible financing options.`,
            vehicleSlug: v.slug,
            suggestions: [`Features of the ${v.model}`, "Financing options", "Book a viewing"],
        };
    }

    // Context fallback
    if (context.lastVehicle) {
        const v = context.lastVehicle;
        return {
            id: generateId(),
            role: "bot",
            text: `The **${v.name}** is priced at **${v.priceFormatted}**.`,
            vehicleSlug: v.slug,
            suggestions: [`Features of the ${v.model}`, "Show me all cars", "Financing options"],
        };
    }

    // General pricing overview
    const sorted = [...vehicleKnowledge].sort((a, b) => a.priceKES - b.priceKES);
    const lines = sorted.map((v) => `**${v.name}** - ${v.priceFormatted}`);
    return {
        id: generateId(),
        role: "bot",
        text: `Here are all our vehicles sorted by price:\n\n${lines.join("\n")}`,
        suggestions: ["Tell me about the cheapest", "Financing options", "Contact info"],
    };
}

function handleVehicleFeatures(matchedVehicles: VehicleKnowledge[]): ChatMessage {
    const vehicle = matchedVehicles.length > 0 ? matchedVehicles[0] : context.lastVehicle;

    if (!vehicle) {
        return {
            id: generateId(),
            role: "bot",
            text: `Which vehicle would you like to know the features of? Please specify the make or model.`,
            suggestions: vehicleKnowledge.slice(0, 4).map((v) => `Features of the ${v.model}`),
        };
    }

    context.lastVehicle = vehicle;
    return {
        id: generateId(),
        role: "bot",
        text: formatFeatures(vehicle),
        vehicleSlug: vehicle.slug,
        suggestions: [`Price of the ${vehicle.model}`, "Book a viewing", "Show me all cars"],
    };
}

function handleVehicleAvailability(matchedVehicles: VehicleKnowledge[]): ChatMessage {
    if (matchedVehicles.length > 0) {
        const v = matchedVehicles[0];
        context.lastVehicle = v;
        const statusText =
            v.status === "available"
                ? `Yes, the **${v.name}** is currently **available** at our ${v.location}. Ready documents, you can buy and drive!`
                : v.status === "reserved"
                    ? `The **${v.name}** is currently **reserved**. However, contact us in case the reservation changes or to explore similar options.`
                    : v.status === "in-transit"
                        ? `The **${v.name}** is currently **in transit** (${v.location}). You can secure it with a refundable reservation ahead of arrival.`
                        : `The **${v.name}** has been **sold**. Let us know if you'd like us to source a similar vehicle for you.`;

        return {
            id: generateId(),
            role: "bot",
            text: statusText,
            vehicleSlug: v.slug,
            suggestions: ["Show me available cars", "Contact info", "Import a car"],
        };
    }

    // General availability
    const available = vehicleKnowledge.filter((v) => v.status === "available");
    return {
        id: generateId(),
        role: "bot",
        text: `We currently have **${available.length} vehicles available** for immediate purchase:\n\n${available.map((v) => `- **${v.name}** - ${v.priceFormatted}`).join("\n")}`,
        suggestions: ["Tell me about the first one", "What's the cheapest?", "Book a viewing"],
    };
}

function handleCheapest(): ChatMessage {
    const sorted = [...vehicleKnowledge].sort((a, b) => a.priceKES - b.priceKES);
    const cheapest = sorted[0];
    context.lastVehicle = cheapest;

    return {
        id: generateId(),
        role: "bot",
        text: `Our most affordable vehicle is:\n\n${formatVehicleDetails(cheapest)}`,
        vehicleSlug: cheapest.slug,
        suggestions: [`Features of the ${cheapest.model}`, "Next cheapest?", "Financing options"],
    };
}

function handleMostExpensive(): ChatMessage {
    const sorted = [...vehicleKnowledge].sort((a, b) => b.priceKES - a.priceKES);
    const top = sorted[0];
    context.lastVehicle = top;

    return {
        id: generateId(),
        role: "bot",
        text: `Our flagship vehicle is:\n\n${formatVehicleDetails(top)}`,
        vehicleSlug: top.slug,
        suggestions: [`Features of the ${top.model}`, "Show me all cars", "Book a viewing"],
    };
}

function handleSUV(): ChatMessage {
    const suvs = vehicleKnowledge.filter((v) => v.bodyType === "SUV");
    const lines = suvs.map((v) => formatVehicleSummary(v));

    return {
        id: generateId(),
        role: "bot",
        text: `We have **${suvs.length} SUVs** in our collection:\n\n${lines.join("\n\n")}`,
        suggestions: ["What's the cheapest SUV?", "Tell me about the Range Rover", "Financing options"],
    };
}

function handleHours(): ChatMessage {
    const hoursText = dealershipKnowledge.hours
        .map((h) => `**${h.days}:** ${h.time}`)
        .join("\n");

    return {
        id: generateId(),
        role: "bot",
        text: `**${dealershipKnowledge.name} Opening Hours:**\n\n${hoursText}\n\nPrivate viewings and test drives are available during business hours. Walk-ins are welcome, or book ahead via WhatsApp.`,
        suggestions: ["Where are you located?", "Contact info", "Book a viewing"],
    };
}

function handleLocation(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `**Showroom Location:**\n\n${dealershipKnowledge.address}\n\n[Open in Google Maps](${dealershipKnowledge.mapsUrl})\n\nWe offer private viewings and unhurried test drives. Coffee is on us!`,
        suggestions: ["Opening hours", "Contact info", "Book a viewing"],
    };
}

function handleContact(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `**Contact ${dealershipKnowledge.name}:**\n\n**Phone:** ${dealershipKnowledge.phone}\n**WhatsApp:** wa.me/${dealershipKnowledge.whatsapp}\n**Email:** ${dealershipKnowledge.email}\n\n**Showroom:** ${dealershipKnowledge.address}\n\nWhatsApp is the fastest way to reach our concierge team for enquiries, viewings, and reservations.`,
        suggestions: ["Opening hours", "Show me all cars", "Where are you located?"],
    };
}

function handleUnknown(): ChatMessage {
    return {
        id: generateId(),
        role: "bot",
        text: `I'm not sure I understood that. I can help you with:\n\n- **Vehicle information** - specs, pricing, features, availability\n- **Dealership services** - financing, imports, sell on behalf\n- **General info** - opening hours, location, contact details\n\nTry asking something like "Show me all cars" or "Do you offer financing?"`,
        suggestions: ["Show me all cars", "Financing options", "Opening hours", "Contact info"],
    };
}
