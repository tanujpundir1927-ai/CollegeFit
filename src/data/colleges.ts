// ─────────────────────────────────────────────────────────────────────────────
// colleges.ts
// Local dataset of Indian colleges.
// No database needed — this is plain TypeScript data.
// ─────────────────────────────────────────────────────────────────────────────

export type Branch =
  | "Computer Science"
  | "Electronics"
  | "Mechanical"
  | "Civil"
  | "Chemical"
  | "Data Science"
  | "Biotechnology"
  | "Information Technology";

export type CollegeType = "IIT" | "NIT" | "IIIT" | "Private" | "Deemed";

export type Location =
  | "Mumbai"
  | "Delhi"
  | "Bangalore"
  | "Chennai"
  | "Hyderabad"
  | "Pune"
  | "Kolkata"
  | "Kharagpur"
  | "Roorkee"
  | "Pilani";

export interface College {
  id: string;
  name: string;
  shortName: string;
  type: CollegeType;
  location: Location;
  nirf_rank: number;            // National ranking (lower = better)
  avg_package_lpa: number;      // Average placement package in LPA
  fees_per_year_lakh: number;   // Annual fee in Lakhs
  cutoff_percentile: number;    // JEE cutoff (0–100)
  branches: Branch[];           // Available branches
  campus_size_acres: number;    // Campus size
  research_score: number;       // Research output score (1–10)
  has_hostel: boolean;
  is_coed: boolean;
  city_type: "Metro" | "Tier-2" | "Town";
  description: string;
  strengths: string[];          // Used to explain recommendations
}

// ─────────────────────────────────────────────────────────────────────────────
// The Dataset (10 colleges)
// ─────────────────────────────────────────────────────────────────────────────

export const colleges: College[] = [
  {
    id: "iit-bombay",
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    type: "IIT",
    location: "Mumbai",
    nirf_rank: 3,
    avg_package_lpa: 21,
    fees_per_year_lakh: 2.5,
    cutoff_percentile: 99.5,
    branches: ["Computer Science", "Electronics", "Mechanical", "Chemical", "Data Science"],
    campus_size_acres: 550,
    research_score: 9.5,
    has_hostel: true,
    is_coed: true,
    city_type: "Metro",
    description:
      "One of India's premier engineering institutes, located in the heart of Mumbai with world-class research facilities and strong industry connections.",
    strengths: [
      "Top 3 NIRF ranking",
      "Highest average placement package",
      "Strong research output",
      "Mumbai location with great industry exposure",
    ],
  },
  {
    id: "iit-delhi",
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    type: "IIT",
    location: "Delhi",
    nirf_rank: 2,
    avg_package_lpa: 22,
    fees_per_year_lakh: 2.5,
    cutoff_percentile: 99.6,
    branches: ["Computer Science", "Electronics", "Mechanical", "Chemical", "Biotechnology"],
    campus_size_acres: 325,
    research_score: 9.7,
    has_hostel: true,
    is_coed: true,
    city_type: "Metro",
    description:
      "Ranked #2 in India, IIT Delhi is located in the capital city with proximity to government, startups, and MNCs.",
    strengths: [
      "NIRF Rank 2 in India",
      "Best placement packages",
      "Strong research publications",
      "Delhi — startup and policy hub",
    ],
  },
  {
    id: "iit-madras",
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    type: "IIT",
    location: "Chennai",
    nirf_rank: 1,
    avg_package_lpa: 20,
    fees_per_year_lakh: 2.5,
    cutoff_percentile: 99.7,
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil", "Data Science"],
    campus_size_acres: 617,
    research_score: 9.9,
    has_hostel: true,
    is_coed: true,
    city_type: "Metro",
    description:
      "India's #1 ranked engineering institute, located in Chennai with a massive campus and the country's top research output.",
    strengths: [
      "NIRF Rank 1 — best in India",
      "Largest campus among IITs",
      "Highest research score",
      "Strong alumni network",
    ],
  },
  {
    id: "iit-kharagpur",
    name: "Indian Institute of Technology Kharagpur",
    shortName: "IIT Kharagpur",
    type: "IIT",
    location: "Kharagpur",
    nirf_rank: 5,
    avg_package_lpa: 18,
    fees_per_year_lakh: 2.3,
    cutoff_percentile: 99.2,
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"],
    campus_size_acres: 2100,
    research_score: 9.0,
    has_hostel: true,
    is_coed: true,
    city_type: "Town",
    description:
      "The first IIT established in India with the largest campus in the country. Offers a unique self-contained campus experience.",
    strengths: [
      "First IIT — rich legacy",
      "Largest campus in India (2100 acres)",
      "Low annual fees",
      "Strong core engineering programs",
    ],
  },
  {
    id: "iit-roorkee",
    name: "Indian Institute of Technology Roorkee",
    shortName: "IIT Roorkee",
    type: "IIT",
    location: "Roorkee",
    nirf_rank: 6,
    avg_package_lpa: 17,
    fees_per_year_lakh: 2.3,
    cutoff_percentile: 99.0,
    branches: ["Computer Science", "Electronics", "Civil", "Chemical", "Biotechnology"],
    campus_size_acres: 365,
    research_score: 8.8,
    has_hostel: true,
    is_coed: true,
    city_type: "Town",
    description:
      "Asia's oldest technical institute, known for its civil engineering legacy and growing excellence in CS and Electronics.",
    strengths: [
      "Oldest technical institute in Asia",
      "Strong civil engineering heritage",
      "Affordable fee structure",
      "Growing CS and research output",
    ],
  },
  {
    id: "nit-trichy",
    name: "National Institute of Technology Trichy",
    shortName: "NIT Trichy",
    type: "NIT",
    location: "Chennai",
    nirf_rank: 8,
    avg_package_lpa: 14,
    fees_per_year_lakh: 1.5,
    cutoff_percentile: 98.0,
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"],
    campus_size_acres: 800,
    research_score: 7.5,
    has_hostel: true,
    is_coed: true,
    city_type: "Tier-2",
    description:
      "The best NIT in India with excellent placements, affordable fees, and a serene campus in Tamil Nadu.",
    strengths: [
      "Best NIT in India",
      "Very affordable fee structure",
      "Excellent placement record",
      "Strong alumni in top MNCs",
    ],
  },
  {
    id: "bits-pilani",
    name: "Birla Institute of Technology & Science Pilani",
    shortName: "BITS Pilani",
    type: "Deemed",
    location: "Pilani",
    nirf_rank: 25,
    avg_package_lpa: 16,
    fees_per_year_lakh: 5.5,
    cutoff_percentile: 97.5,
    branches: ["Computer Science", "Electronics", "Chemical", "Data Science", "Information Technology"],
    campus_size_acres: 328,
    research_score: 8.0,
    has_hostel: true,
    is_coed: true,
    city_type: "Town",
    description:
      "India's top private engineering university with a unique dual-degree and WILP model. Highly autonomous and industry-integrated.",
    strengths: [
      "Top private engineering university",
      "Practice School internship model",
      "High autonomy and academic flexibility",
      "Strong industry partnerships",
    ],
  },
  {
    id: "iiit-hyderabad",
    name: "International Institute of Information Technology Hyderabad",
    shortName: "IIIT Hyderabad",
    type: "IIIT",
    location: "Hyderabad",
    nirf_rank: 30,
    avg_package_lpa: 18,
    fees_per_year_lakh: 4.0,
    cutoff_percentile: 96.0,
    branches: ["Computer Science", "Electronics", "Data Science", "Information Technology"],
    campus_size_acres: 66,
    research_score: 8.5,
    has_hostel: true,
    is_coed: true,
    city_type: "Metro",
    description:
      "India's best IIIT with a research-first culture and excellent CS placements. Located in Hyderabad's thriving tech hub.",
    strengths: [
      "Best IIIT in India",
      "Research-first culture (Research as Core curriculum)",
      "Hyderabad — India's IT hub",
      "Excellent CS and AI placements",
    ],
  },
  {
    id: "vit-vellore",
    name: "Vellore Institute of Technology",
    shortName: "VIT Vellore",
    type: "Private",
    location: "Chennai",
    nirf_rank: 11,
    avg_package_lpa: 9,
    fees_per_year_lakh: 3.5,
    cutoff_percentile: 85.0,
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil", "Data Science", "Biotechnology", "Information Technology"],
    campus_size_acres: 350,
    research_score: 6.5,
    has_hostel: true,
    is_coed: true,
    city_type: "Tier-2",
    description:
      "One of India's largest private universities with a very diverse branch offering and a low entrance cutoff compared to IITs/NITs.",
    strengths: [
      "Wide variety of specializations",
      "Lower entrance requirement (VITEEE)",
      "Large campus with good infrastructure",
      "Active student clubs and fests",
    ],
  },
  {
    id: "nit-surathkal",
    name: "National Institute of Technology Karnataka Surathkal",
    shortName: "NIT Surathkal",
    type: "NIT",
    location: "Hyderabad",
    nirf_rank: 18,
    avg_package_lpa: 13,
    fees_per_year_lakh: 1.5,
    cutoff_percentile: 97.0,
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"],
    campus_size_acres: 295,
    research_score: 7.0,
    has_hostel: true,
    is_coed: true,
    city_type: "Tier-2",
    description:
      "A top NIT on the Mangalore coast known for its strong placements and beautiful coastal campus.",
    strengths: [
      "Top 20 NIRF ranking",
      "Coastal campus — unique lifestyle",
      "Extremely affordable fees",
      "Strong electronics and CS programs",
    ],
  },
];
