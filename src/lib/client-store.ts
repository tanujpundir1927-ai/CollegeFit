export interface SavedSearch {
  id: string;
  label: string;
  url: string;
  createdAt: string;
}

export interface LocalProfile {
  name: string;
  email: string;
  provider: "email" | "google";
}

export interface CollegeReview {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const KEYS = {
  wishlist: "collegefit_wishlist",
  searches: "collegefit_saved_searches",
  profile: "collegefit_profile",
  reviews: "collegefit_reviews",
} as const;

export const STORE_EVENT = "collegefit:storage";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
}

export function getWishlist() {
  return readJson<string[]>(KEYS.wishlist, []);
}

export function toggleWishlist(collegeId: string) {
  const current = getWishlist();
  const next = current.includes(collegeId)
    ? current.filter((id) => id !== collegeId)
    : [collegeId, ...current];
  writeJson(KEYS.wishlist, next);
  return next.includes(collegeId);
}

export function getSavedSearches() {
  return readJson<SavedSearch[]>(KEYS.searches, []);
}

export function saveSearch(search: Omit<SavedSearch, "id" | "createdAt">) {
  const entry: SavedSearch = {
    ...search,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.searches, [entry, ...getSavedSearches()].slice(0, 12));
}

export function getProfile() {
  return readJson<LocalProfile | null>(KEYS.profile, null);
}

export function saveProfile(profile: LocalProfile | null) {
  if (profile) writeJson(KEYS.profile, profile);
  else {
    localStorage.removeItem(KEYS.profile);
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key: KEYS.profile } }));
  }
}

export function getReviews(collegeId: string) {
  const reviews = readJson<Record<string, CollegeReview[]>>(KEYS.reviews, {});
  return reviews[collegeId] || [];
}

export function addReview(review: Omit<CollegeReview, "id" | "createdAt">) {
  const all = readJson<Record<string, CollegeReview[]>>(KEYS.reviews, {});
  const entry: CollegeReview = {
    ...review,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all[review.collegeId] = [entry, ...(all[review.collegeId] || [])];
  writeJson(KEYS.reviews, all);
  return entry;
}
