export interface TransportDestination {
  state: string;
  majorHubs: string[];
  recommendedCarriers: string[];
  estimatedTransitDays: string;
  freightPerCartonRange: [number, number]; // [min ₹, max ₹] per 4-fan master carton
  freightPerFanRange: [number, number];    // [min ₹, max ₹] per fan unit
  doorDeliveryAvailable: boolean;
  notes?: string;
}

export interface FanPackingSpec {
  id: string;
  name: string;
  category: "ceiling" | "table" | "pedestal" | "wall";
  unitsPerCarton: number;
  cartonGrossWeightKg: number;
  cartonDimensionsCm: { length: number; width: number; height: number };
  cartonCbm: number; // Cubic meters
  cartonCft: number; // Cubic feet
  hsnCode: string;
  description: string;
}

export const FAN_PACKING_SPECS: Record<string, FanPackingSpec> = {
  standard_ceiling_4in1: {
    id: "standard_ceiling_4in1",
    name: "Standard Ceiling Fans (1200mm / 1400mm)",
    category: "ceiling",
    unitsPerCarton: 4,
    cartonGrossWeightKg: 17.5,
    cartonDimensionsCm: { length: 56, width: 28, height: 26 },
    cartonCbm: 0.0408,
    cartonCft: 1.44,
    hsnCode: "84145100",
    description: "4 Motors + 4 Downrods + 4 Canopy Sets + 4 Blade Sets in heavy 5-ply export master carton.",
  },
  decorative_ceiling_2in1: {
    id: "decorative_ceiling_2in1",
    name: "Premium / Decorative Fans (Underlight / Aero)",
    category: "ceiling",
    unitsPerCarton: 2,
    cartonGrossWeightKg: 9.5,
    cartonDimensionsCm: { length: 54, width: 28, height: 20 },
    cartonCbm: 0.0302,
    cartonCft: 1.07,
    hsnCode: "84145100",
    description: "2 Premium Units with thermocol cushioning & metallic blade protective sleeves.",
  },
  pedestal_fan_1in1: {
    id: "pedestal_fan_1in1",
    name: "Pedestal / Standing Fans (400mm / 450mm High Speed)",
    category: "pedestal",
    unitsPerCarton: 1,
    cartonGrossWeightKg: 8.2,
    cartonDimensionsCm: { length: 52, width: 22, height: 50 },
    cartonCbm: 0.0572,
    cartonCft: 2.02,
    hsnCode: "84145100",
    description: "Heavy round base + telescopic pipe + motor guard & aerofoil blades in 1 master box.",
  },
  table_wall_fan_1in1: {
    id: "table_wall_fan_1in1",
    name: "Table / Wall Mount Fans (400mm High Speed)",
    category: "table",
    unitsPerCarton: 1,
    cartonGrossWeightKg: 4.8,
    cartonDimensionsCm: { length: 46, width: 20, height: 46 },
    cartonCbm: 0.0423,
    cartonCft: 1.49,
    hsnCode: "84145100",
    description: "Compact high-grade corrugated box with motor assembly & guard ring.",
  },
};

export const TRANSPORT_DESTINATIONS: TransportDestination[] = [
  {
    state: "Telangana",
    majorHubs: ["Hyderabad (Local)", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Ramagundam", "Suryapet"],
    recommendedCarriers: ["Local Factory Dispatch", "Navata Road Transport", "Kranti Road Transport", "BMPS Transport", "VRL Logistics"],
    estimatedTransitDays: "Same Day - 24 Hours",
    freightPerCartonRange: [40, 65],
    freightPerFanRange: [10, 16],
    doorDeliveryAvailable: true,
    notes: "Direct factory pickup or same-day local transport booking available from Hyderabad plant.",
  },
  {
    state: "Andhra Pradesh",
    majorHubs: ["Vijayawada Hub", "Visakhapatnam", "Guntur", "Tirupati", "Kurnool", "Nellore", "Rajahmundry", "Kakinada", "Anantapur", "Kadapa", "Eluru", "Ongole"],
    recommendedCarriers: ["Navata Road Transport", "Kranti Road Transport", "BMPS", "VRL Logistics", "Southern Express"],
    estimatedTransitDays: "24 - 48 Hours",
    freightPerCartonRange: [60, 95],
    freightPerFanRange: [15, 24],
    doorDeliveryAvailable: true,
    notes: "Daily night dispatch to Vijayawada / Guntur / Vizag transport corridors.",
  },
  {
    state: "Karnataka",
    majorHubs: ["Bengaluru Hub", "Hubballi-Dharwad", "Belagavi", "Mysuru", "Kalaburagi (Gulbarga)", "Ballari", "Mangaluru", "Davanagere", "Raichur", "Bidar"],
    recommendedCarriers: ["VRL Logistics", "Navata Road Transport", "TCI Freight", "Southern Roadways", "Sugama Tourist Cargo"],
    estimatedTransitDays: "24 - 48 Hours",
    freightPerCartonRange: [75, 120],
    freightPerFanRange: [19, 30],
    doorDeliveryAvailable: true,
    notes: "Direct connectivity via NH44 to Bengaluru & Hyderabad-Kalaburagi corridor.",
  },
  {
    state: "Maharashtra",
    majorHubs: ["Nagpur Hub", "Pune Hub", "Bhiwandi / Mumbai Hub", "Nanded", "Solapur", "Aurangabad (Chhatrapati Sambhajinagar)", "Nashik", "Kolhapur", "Akola", "Amravati"],
    recommendedCarriers: ["VRL Logistics", "TCI Freight", "GATI-KWE", "ARC (Associated Road Carriers)", "Patel Roadways"],
    estimatedTransitDays: "2 - 3 Days",
    freightPerCartonRange: [85, 140],
    freightPerFanRange: [21, 35],
    doorDeliveryAvailable: true,
    notes: "Fast transit via NH44 (North Corridor) and Hyderabad-Pune Highway.",
  },
  {
    state: "Tamil Nadu",
    majorHubs: ["Chennai Hub", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    recommendedCarriers: ["VRL Logistics", "Navata Road Transport", "Southern Roadways", "TCI Express", "ABT Parcel Service"],
    estimatedTransitDays: "2 - 3 Days",
    freightPerCartonRange: [90, 145],
    freightPerFanRange: [22, 36],
    doorDeliveryAvailable: true,
    notes: "High connectivity via Chennai corridor with daily consolidated truck dispatches.",
  },
  {
    state: "Kerala",
    majorHubs: ["Kochi Hub", "Kozhikode", "Thiruvananthapuram", "Thrissur", "Kannur", "Palakkad", "Kollam", "Alappuzha"],
    recommendedCarriers: ["VRL Logistics", "Kerala Road Lines (KRL)", "TCI Express", "Southern Roadways"],
    estimatedTransitDays: "3 - 4 Days",
    freightPerCartonRange: [110, 170],
    freightPerFanRange: [27, 42],
    doorDeliveryAvailable: true,
    notes: "Moisture-resistant poly-wrap packaging applied for coastal transit.",
  },
  {
    state: "Odisha",
    majorHubs: ["Bhubaneswar Hub", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Balasore"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "ARC", "East India Transport Agency (EITA)"],
    estimatedTransitDays: "2 - 4 Days",
    freightPerCartonRange: [95, 155],
    freightPerFanRange: [24, 39],
    doorDeliveryAvailable: true,
    notes: "Direct transit via Vizag-Bhubaneswar NH16 corridor.",
  },
  {
    state: "Gujarat",
    majorHubs: ["Ahmedabad Hub", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhidham"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "GATI", "Om Logistics", "Shree Maruti"],
    estimatedTransitDays: "3 - 4 Days",
    freightPerCartonRange: [100, 160],
    freightPerFanRange: [25, 40],
    doorDeliveryAvailable: true,
  },
  {
    state: "Madhya Pradesh",
    majorHubs: ["Indore Hub", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "ARC", "GATI", "Patel Roadways"],
    estimatedTransitDays: "2 - 4 Days",
    freightPerCartonRange: [90, 150],
    freightPerFanRange: [23, 38],
    doorDeliveryAvailable: true,
  },
  {
    state: "Delhi & NCR",
    majorHubs: ["Delhi Central / Okhla Hub", "Noida", "Gurugram", "Faridabad", "Ghaziabad"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "GATI-KWE", "Safexpress", "ARC"],
    estimatedTransitDays: "3 - 4 Days",
    freightPerCartonRange: [115, 175],
    freightPerFanRange: [29, 44],
    doorDeliveryAvailable: true,
    notes: "Daily express container runs directly to Delhi-NCR transshipment centers.",
  },
  {
    state: "Uttar Pradesh",
    majorHubs: ["Lucknow Hub", "Kanpur", "Varanasi", "Agra", "Prayagraj (Allahabad)", "Meerut", "Bareilly", "Gorakhpur"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "GATI", "Safexpress", "Om Logistics"],
    estimatedTransitDays: "3 - 5 Days",
    freightPerCartonRange: [120, 185],
    freightPerFanRange: [30, 46],
    doorDeliveryAvailable: true,
  },
  {
    state: "Rajasthan",
    majorHubs: ["Jaipur Hub", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "ARC", "Safexpress"],
    estimatedTransitDays: "3 - 5 Days",
    freightPerCartonRange: [125, 190],
    freightPerFanRange: [31, 48],
    doorDeliveryAvailable: true,
  },
  {
    state: "Bihar & Jharkhand",
    majorHubs: ["Patna Hub", "Ranchi Hub", "Jamshedpur", "Dhanbad", "Muzaffarpur", "Gaya", "Bhagalpur", "Bokaro"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "NECC", "ARC"],
    estimatedTransitDays: "4 - 5 Days",
    freightPerCartonRange: [130, 195],
    freightPerFanRange: [32, 49],
    doorDeliveryAvailable: true,
  },
  {
    state: "West Bengal",
    majorHubs: ["Kolkata / Howrah Hub", "Siliguri", "Asansol", "Durgapur", "Kharagpur"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "East India Transport (EITA)", "ARC"],
    estimatedTransitDays: "3 - 5 Days",
    freightPerCartonRange: [125, 190],
    freightPerFanRange: [31, 48],
    doorDeliveryAvailable: true,
  },
  {
    state: "Punjab & Haryana",
    majorHubs: ["Ludhiana Hub", "Amritsar", "Jalandhar", "Ambala", "Panipat", "Karnal", "Chandigarh Hub"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "Safexpress", "GATI"],
    estimatedTransitDays: "4 - 5 Days",
    freightPerCartonRange: [135, 205],
    freightPerFanRange: [34, 51],
    doorDeliveryAvailable: true,
  },
  {
    state: "Chhattisgarh",
    majorHubs: ["Raipur Hub", "Bilaspur", "Durg-Bhilai", "Korba", "Rajnandgaon"],
    recommendedCarriers: ["TCI Freight", "VRL Logistics", "Navata", "ARC"],
    estimatedTransitDays: "2 - 3 Days",
    freightPerCartonRange: [85, 140],
    freightPerFanRange: [21, 35],
    doorDeliveryAvailable: true,
  },
  {
    state: "Assam & North East",
    majorHubs: ["Guwahati Hub", "Dibrugarh", "Silchar", "Jorhat", "Agartala", "Dimapur"],
    recommendedCarriers: ["NECC (North Eastern Carrying Corp)", "TCI Express", "ARC"],
    estimatedTransitDays: "6 - 8 Days",
    freightPerCartonRange: [190, 290],
    freightPerFanRange: [48, 72],
    doorDeliveryAvailable: false,
    notes: "Consignments routed via Kolkata / Guwahati transshipment depot.",
  },
];

export interface VehicleCapacity {
  name: string;
  category: string;
  maxCartons: number;
  maxUnits: number;
  payloadKg: number;
  cbmCapacity: number;
  icon: string;
  bestFor: string;
}

export const VEHICLE_CAPACITIES: VehicleCapacity[] = [
  {
    name: "Small Commercial Auto (Tata Ace / Bolero Pickup)",
    category: "Small Commercial",
    maxCartons: 50,
    maxUnits: 200,
    payloadKg: 1000,
    cbmCapacity: 3.5,
    icon: "Truck",
    bestFor: "Local Town Dealers, Retailers & Urgent replenishment batches",
  },
  {
    name: "Light Commercial Vehicle (14-ft / 17-ft Eicher / Canter)",
    category: "LCV / Medium Truck",
    maxCartons: 150,
    maxUnits: 600,
    payloadKg: 4000,
    cbmCapacity: 14.0,
    icon: "Truck",
    bestFor: "Wholesalers, Large Dealers & District Zonal distribution",
  },
  {
    name: "Medium Commercial Truck (20-ft / 24-ft Container)",
    category: "Medium Container",
    maxCartons: 350,
    maxUnits: 1400,
    payloadKg: 9000,
    cbmCapacity: 32.0,
    icon: "Container",
    bestFor: "Super Stockists & Multi-District Regional Depots",
  },
  {
    name: "Heavy Full Truckload (32-ft Multi-Axle Container / Trailer)",
    category: "FTL Heavy Container",
    maxCartons: 750,
    maxUnits: 3000,
    payloadKg: 18000,
    cbmCapacity: 65.0,
    icon: "Trailer",
    bestFor: "State Super Stockists, Institutional Bulk Supply & Central Warehouses",
  },
];
