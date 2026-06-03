import { College, colleges, Branch, CollegeType, Location } from "../data/colleges";

export interface Preferences {
  percentile: number;
  maxFees: number;
  preferredBranches: Branch[];
  preferredLocations: Location[];
  preferredTypes: CollegeType[];
  priority: "placements" | "research" | "budget" | "balanced";
}

export interface RecommendationResult {
  college: College;
  matchScore: number; // 0 to 100
  matchReasons: string[];
  isReach: boolean; // True if student's percentile is slightly below cutoff
  isEligible: boolean; // False if student's percentile is far below cutoff
}

/**
 * Calculates the match score and reasons for a single college based on student preferences.
 */
export function calculateMatch(college: College, prefs: Preferences): RecommendationResult {
  const matchReasons: string[] = [];
  let scorePoints = 0;
  let totalWeight = 0;

  // 1. Cutoff eligibility check (Weight: Critical baseline)
  // Let's check if the user is eligible.
  const percentileDiff = prefs.percentile - college.cutoff_percentile;
  let isEligible = true;
  let isReach = false;

  if (percentileDiff < -3) {
    // If student percentile is more than 3% below cutoff, they are highly unlikely to get in.
    isEligible = false;
  } else if (percentileDiff < 0) {
    // If student percentile is within 3% below, it's a "Reach" college.
    isReach = true;
  }

  // Weight for Percentile match (25 points)
  totalWeight += 25;
  if (percentileDiff >= 0) {
    // Safe match
    scorePoints += 25;
    matchReasons.push(`Your percentile (${prefs.percentile}%) is above the historic cutoff of ${college.cutoff_percentile}%.`);
  } else if (isReach) {
    // Reach match
    scorePoints += 10; // Partial score
    matchReasons.push(`Highly aspirational: Historic cutoff is ${college.cutoff_percentile}%, which is slightly above your score.`);
  } else {
    // Ineligible
    scorePoints += 0;
    matchReasons.push(`Cutoff historic barrier: Cutoff is ${college.cutoff_percentile}%, which is significantly higher than your score.`);
  }

  // 2. Budget / Fee Fit (Weight: 20 points)
  totalWeight += 20;
  if (college.fees_per_year_lakh <= prefs.maxFees) {
    scorePoints += 20;
    matchReasons.push(`Fits your budget: Fees are ₹${college.fees_per_year_lakh} Lakhs/year (under your ₹${prefs.maxFees} Lakhs budget).`);
  } else {
    const feeExcess = college.fees_per_year_lakh - prefs.maxFees;
    if (feeExcess <= 1.0) {
      scorePoints += 10; // slightly above budget
      matchReasons.push(`Slightly exceeds budget by ₹${feeExcess.toFixed(1)} Lakhs/year.`);
    } else {
      scorePoints += 0;
      matchReasons.push(`Exceeds budget: Fees are ₹${college.fees_per_year_lakh} Lakhs/year compared to your ₹${prefs.maxFees} Lakhs budget.`);
    }
  }

  // 3. Preferred Branches Match (Weight: 20 points)
  totalWeight += 20;
  if (prefs.preferredBranches.length > 0) {
    const matchingBranches = college.branches.filter((b) => prefs.preferredBranches.includes(b));
    if (matchingBranches.length > 0) {
      const matchRatio = matchingBranches.length / prefs.preferredBranches.length;
      scorePoints += Math.min(20, Math.round(20 * matchRatio));
      matchReasons.push(`Offers preferred branches: ${matchingBranches.join(", ")}.`);
    } else {
      scorePoints += 0;
      matchReasons.push(`Does not offer any of your preferred branches.`);
    }
  } else {
    // No preference: full points
    scorePoints += 20;
  }

  // 4. Preferred Location Match (Weight: 15 points)
  totalWeight += 15;
  if (prefs.preferredLocations.length > 0) {
    if (prefs.preferredLocations.includes(college.location)) {
      scorePoints += 15;
      matchReasons.push(`Located in preferred city: ${college.location}.`);
    } else {
      scorePoints += 0;
      matchReasons.push(`Located in ${college.location}, which is not in your preferred list.`);
    }
  } else {
    scorePoints += 15;
  }

  // 5. Preferred College Type Match (Weight: 10 points)
  totalWeight += 10;
  if (prefs.preferredTypes.length > 0) {
    if (prefs.preferredTypes.includes(college.type)) {
      scorePoints += 10;
      matchReasons.push(`Matches preferred college tier/type: ${college.type}.`);
    } else {
      scorePoints += 0;
    }
  } else {
    scorePoints += 10;
  }

  // 6. Student Priority Fit (Weight: 10 points)
  totalWeight += 10;
  if (prefs.priority === "placements") {
    if (college.avg_package_lpa >= 15) {
      scorePoints += 10;
      matchReasons.push(`Excellent Placements: Average package is ₹${college.avg_package_lpa} LPA.`);
    } else if (college.avg_package_lpa >= 10) {
      scorePoints += 6;
      matchReasons.push(`Good Placements: Average package is ₹${college.avg_package_lpa} LPA.`);
    } else {
      scorePoints += 2;
    }
  } else if (prefs.priority === "research") {
    if (college.research_score >= 8.5) {
      scorePoints += 10;
      matchReasons.push(`Top-tier Research: Research score is ${college.research_score}/10.`);
    } else if (college.research_score >= 7.0) {
      scorePoints += 6;
      matchReasons.push(`Active Research: Research score is ${college.research_score}/10.`);
    } else {
      scorePoints += 2;
    }
  } else if (prefs.priority === "budget") {
    if (college.fees_per_year_lakh <= 2.0) {
      scorePoints += 10;
      matchReasons.push(`Very Low Fees: Highly matches your cost-saving preference (₹${college.fees_per_year_lakh} Lakhs/year).`);
    } else if (college.fees_per_year_lakh <= 3.5) {
      scorePoints += 6;
    } else {
      scorePoints += 1;
    }
  } else {
    // Balanced
    scorePoints += 8;
  }

  // Final Score calculation
  let finalScore = Math.round((scorePoints / totalWeight) * 100);
  
  // Cap score to 99 if reach, and 40 if ineligible to avoid misleading users
  if (!isEligible) {
    finalScore = Math.min(30, finalScore);
  } else if (isReach) {
    finalScore = Math.min(80, finalScore);
  }

  return {
    college,
    matchScore: finalScore,
    matchReasons,
    isReach,
    isEligible,
  };
}

/**
 * Gets ranked recommendations for a student based on their preferences.
 */
export function getRecommendations(prefs: Preferences): RecommendationResult[] {
  return colleges
    .map((college) => calculateMatch(college, prefs))
    // Filter out completely ineligible colleges or keep them at the bottom
    .sort((a, b) => {
      // Sort eligible first, then by match score descending, then by NIRF rank ascending
      if (a.isEligible !== b.isEligible) {
        return a.isEligible ? -1 : 1;
      }
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.college.nirf_rank - b.college.nirf_rank;
    });
}
