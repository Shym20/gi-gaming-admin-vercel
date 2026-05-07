import type { AppState } from "../types";

export const initialState: AppState = {
    token: null,
    user: null,
    currentRoute: "dashboard",
    searchQuery: "",
    productsScreen: "inventory",
    rentalsScreen: "list",
    rentalLedgerRentalId: null,
    
    stats: {
        revenue: 45280,
        bookings: 142,
        activeRentals: 28,
        totalUsers: 3402,
        chartData: [
            { day: 'Mon', revenue: 4200 }, { day: 'Tue', revenue: 3800 },
            { day: 'Wed', revenue: 5100 }, { day: 'Thu', revenue: 4900 },
            { day: 'Fri', revenue: 8400 }, { day: 'Sat', revenue: 12500 }, { day: 'Sun', revenue: 11000 }
        ]
    },

    bookings: [
        { id: "BKG-1042", userId: "USR-001", user: "Alex Gaming", center: "Downtown Hub", slot: "2023-10-27 14:00", status: "ACTIVE", payment: "PAID", amount: 450, snacks: [{ name: "Salted Popcorn", qty: 1 }, { name: "Coke (500ml)", qty: 2 }] },
        { id: "BKG-1043", userId: "USR-002", user: "Sarah Connor", center: "Uptown Arena", slot: "2023-10-27 15:30", status: "PENDING", payment: "PENDING", amount: 300, snacks: [] },
        { id: "BKG-1044", userId: "USR-003", user: "Mike Ross", center: "Downtown Hub", slot: "2023-10-27 12:00", status: "COMPLETED", payment: "PAID", amount: 600, snacks: [{ name: "Nachos with Salsa", qty: 1 }] },
        { id: "BKG-1045", userId: "USR-001", user: "John Wick", center: "Eastside VR", slot: "2023-10-27 16:00", status: "CANCELLED", payment: "REFUNDED", amount: 800, snacks: [] },
        { id: "BKG-1046", userId: "USR-002", user: "Emma Watson", center: "Downtown Hub", slot: "2023-10-28 10:00", status: "PENDING", payment: "PAID", amount: 450, snacks: [{ name: "Coke (500ml)", qty: 1 }] },
    ],

    rentals: [
        {
            id: "RNT-881", userId: "USR-001", user: "Alex Gaming", console: "PS5", type: "DELIVERY",
            basePrice: 1500, extensionCharges: 450, lateFee: 0, deposit: 5000, depositMethod: "ONLINE",
            status: "ACTIVE", contractId: "CTR-881-A", contractDate: "2023-10-25",
            dueAt: "2026-03-08T18:00:00+05:30",
            accessories: [
                { item: 'Console Unit', qty: 1, status: 'Pending', penalty: 0 },
                { item: 'Wireless Controller', qty: 2, status: 'Pending', penalty: 0 },
                { item: 'HDMI & Power Cables', qty: 1, status: 'Pending', penalty: 0 },
                { item: 'Protective Carry Case', qty: 1, status: 'Pending', penalty: 0 }
            ],
            timeline: [
                { time: "2023-10-25 10:00 AM", text: "Rental Created" },
                { time: "2023-10-25 10:05 AM", text: "Deposit Received (₹5000 via ONLINE)" },
                { time: "2023-10-25 10:15 AM", text: "Pickup Confirmed" }
            ]
        },
        {
            id: "RNT-882", userId: "USR-002", user: "Sarah Connor", console: "Xbox Series X", type: "PICKUP",
            basePrice: 1200, extensionCharges: 0, lateFee: 500, deposit: 4000, depositMethod: "CASH",
            status: "OVERDUE", contractId: "CTR-882-A", contractDate: "2023-10-20",
            dueAt: "2026-03-03T14:00:00+05:30",
            accessories: [
                { item: 'Console Unit', qty: 1, status: 'Pending', penalty: 0 },
                { item: 'Wireless Controller', qty: 1, status: 'Pending', penalty: 0 },
                { item: 'Power Adapter', qty: 1, status: 'Pending', penalty: 0 }
            ],
            timeline: [
                { time: "2023-10-20 02:00 PM", text: "Rental Created" },
                { time: "2023-10-20 02:10 PM", text: "Deposit Received (₹4000 via CASH)" },
                { time: "2023-10-23 02:00 PM", text: "⚠️ Late Fee Applied (₹500) - System Update" }
            ]
        },
        {
            id: "RNT-883", userId: "USR-003", user: "Mike Ross", console: "PS4 Pro", type: "PICKUP",
            basePrice: 800, extensionCharges: 0, lateFee: 0, deposit: 2500, depositMethod: "UPI",
            status: "RETURNED", contractId: "CTR-883-B", contractDate: "2023-10-22",
            dueAt: "2026-02-25T11:00:00+05:30",
            accessories: [
                { item: 'Console Unit', qty: 1, status: 'Returned', penalty: 0 },
                { item: 'Wireless Controller', qty: 1, status: 'Missing', penalty: 1200 }
            ],
            timeline: [
                { time: "2023-10-22 11:00 AM", text: "Rental Created" },
                { time: "2023-10-22 11:05 AM", text: "Deposit Received (₹2500 via UPI)" },
                { time: "2023-10-24 11:30 AM", text: "Accessory Penalty Added ₹1200" },
                { time: "2023-10-24 11:35 AM", text: "Final Settlement Completed. Refunded ₹500 via UPI" }
            ],
            settlementSummary: {
                basePrice: 800, extraFees: 0, accPenalty: 1200, totalCharges: 2000, deposit: 2500, balanceDue: -500, method: 'UPI'
            }
        },
        {
            id: "RNT-884", userId: "USR-003", user: "Mike Ross", console: "PS5", type: "PICKUP",
            basePrice: 1500, extensionCharges: 0, lateFee: 0, deposit: 5000, depositMethod: "PENDING",
            status: "PENDING", contractId: null, contractDate: null,
            dueAt: "2026-03-09T10:00:00+05:30",
            accessories: [
                { item: 'Console Unit', qty: 1, status: 'Pending', penalty: 0 },
                { item: 'Wireless Controller', qty: 2, status: 'Pending', penalty: 0 }
            ],
            timeline: [
                { time: "2023-10-28 09:00 AM", text: "Rental Requested via App. Awaiting Pickup Handover." }
            ]
        }
    ],

    users: [
        { id: "USR-001", name: "Alex Gaming", email: "alex@example.com", phone: "+91 9876543210", location: "Mumbai, Maharashtra", aadhaar: "1234-5678-9012", pan: "ABCDE1234F", balance: 1500, bookings: 12, status: "ACTIVE", joined: "2023-01-15", kycStatus: "VERIFIED" },
        { id: "USR-002", name: "Sarah Connor", email: "sarah@example.com", phone: "+91 9998887776", location: "Delhi, NCR", aadhaar: "9876-5432-1098", pan: "XYZPQ9876H", balance: 0, bookings: 3, status: "SUSPENDED", joined: "2023-05-20", kycStatus: "REJECTED" },
        { id: "USR-003", name: "Mike Ross", email: "mike@example.com", phone: "+91 9123456789", location: "Bangalore, Karnataka", aadhaar: "", pan: "", balance: 450, bookings: 8, status: "ACTIVE", joined: "2023-08-11", kycStatus: "PENDING" },
    ],

    // centers: [
    //     { id: "CTR-01", name: "Downtown Hub", location: "City Center", pcs: 45, consoles: 12, status: "ACTIVE" },
    //     { id: "CTR-02", name: "Uptown Arena", location: "North Mall", pcs: 30, consoles: 8, status: "ACTIVE" },
    //     { id: "CTR-03", name: "Eastside VR", location: "Tech Park", pcs: 15, consoles: 5, status: "MAINTENANCE" },
    // ],

    products: [
        {
            id: "PRD-101",
            name: "Sony PS3 Slim Console",
            mainCategory: "Console",
            subCategory: "PS3",
            category: "Console/PS3",
            productType: "CONSOLE",
            serialNumber: "PS3-SLIM-001",
            condition: "GOOD",
            compatibleWith: ["PS3"],
            availability: "AVAILABLE",
            price: 16000,
            stock: 4,
            status: "IN_STOCK"
        },
        {
            id: "PRD-102",
            name: "PS3 Wireless Controller",
            mainCategory: "Accessory",
            subCategory: "PS3",
            category: "Accessory/PS3",
            productType: "CONTROLLER",
            serialNumber: "PS3-CTRL-011",
            condition: "GOOD",
            compatibleWith: ["PS3"],
            availability: "AVAILABLE",
            price: 2800,
            stock: 12,
            status: "IN_STOCK"
        },
        {
            id: "PRD-103",
            name: "PS3 HDMI + Power Cable Set",
            mainCategory: "Accessory",
            subCategory: "PS3",
            category: "Accessory/PS3",
            productType: "CABLE",
            serialNumber: "PS3-CBL-021",
            condition: "NEW",
            compatibleWith: ["PS3"],
            availability: "AVAILABLE",
            price: 900,
            stock: 18,
            status: "IN_STOCK"
        },
        {
            id: "PRD-104",
            name: "Sony PS2 Classic Console",
            mainCategory: "Console",
            subCategory: "PS2",
            category: "Console/PS2",
            productType: "CONSOLE",
            serialNumber: "PS2-CLS-004",
            condition: "FAIR",
            compatibleWith: ["PS2"],
            availability: "AVAILABLE",
            price: 8500,
            stock: 3,
            status: "IN_STOCK"
        },
        {
            id: "PRD-105",
            name: "PS2 Wired Controller",
            mainCategory: "Accessory",
            subCategory: "PS2",
            category: "Accessory/PS2",
            productType: "CONTROLLER",
            serialNumber: "PS2-CTRL-035",
            condition: "GOOD",
            compatibleWith: ["PS2"],
            availability: "AVAILABLE",
            price: 1200,
            stock: 10,
            status: "IN_STOCK"
        },
        {
            id: "PRD-106",
            name: "PS2 AV Cable Pack",
            mainCategory: "Accessory",
            subCategory: "PS2",
            category: "Accessory/PS2",
            productType: "CABLE",
            serialNumber: "PS2-AV-009",
            condition: "NEW",
            compatibleWith: ["PS2"],
            availability: "AVAILABLE",
            price: 650,
            stock: 9,
            status: "IN_STOCK"
        },
        {
            id: "PRD-107",
            name: "Gaming Mouse Pro",
            mainCategory: "Mouse",
            subCategory: "PS3",
            category: "Mouse/PS3",
            productType: "MOUSE",
            serialNumber: "MSE-PS3-045",
            condition: "NEW",
            compatibleWith: ["PS3", "PS4"],
            availability: "AVAILABLE",
            price: 3200,
            stock: 6,
            status: "IN_STOCK"
        },
        {
            id: "PRD-108",
            name: "PS3 Carry Case",
            mainCategory: "Accessory",
            subCategory: "PS3",
            category: "Accessory/PS3",
            productType: "ACCESSORY",
            serialNumber: "PS3-CASE-017",
            condition: "GOOD",
            compatibleWith: ["PS3"],
            availability: "AVAILABLE",
            price: 1400,
            stock: 5,
            status: "IN_STOCK"
        }
    ],

    snacks: [],

    transactions: [],
    rentalProducts: []
};