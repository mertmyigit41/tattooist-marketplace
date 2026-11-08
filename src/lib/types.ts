export type Role = "client" | "artist";

export type TravelMode = "local_only" | "specific_destination" | "open_worldwide";

export type RequestStatus = "open" | "booked" | "closed";

export interface Profile {
  id: string;
  role: Role;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  avatarUrl: string;
  styles: string[];
  portfolioUrls: string[];
  rating: number;
  reviewCount: number;
  isPro: boolean;
  whatsapp: string;
  hourlyRateEur?: number;
  tagline?: string;
  responseHours?: number;
  nextOpening?: string;
  approved?: boolean;
  createdAt?: number;
}

export interface TattooRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientCity: string;
  clientCountry: string;
  clientFlag: string;
  title: string;
  prompt: string;
  style: string;
  bodyPart: string;
  size: string;
  conceptImageUrl: string;
  stencilImageUrl: string;
  referenceImageUrls?: string[];
  travelMode: TravelMode;
  targetDestination: string;
  closesAt?: number;
  shortlistedBidIds?: string[];
  hiddenBidIds?: string[];
  status: RequestStatus;
  createdAt: number;
}

export interface Bid {
  id: string;
  requestId: string;
  artistId: string;
  artistName: string;
  artistCity: string;
  artistCountry: string;
  artistFlag: string;
  artistRating: number;
  priceEur: number;
  sessionPlan: string;
  availableDate: string;
  message: string;
  selectedPortfolioUrls: string[];
  createdAt: number;
  status?: "accepted";
}

export interface Persona {
  id: string;
  role: Role;
  name: string;
  city: string;
  country: string;
  flag: string;
  label: string;
}
