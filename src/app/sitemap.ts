import type { MetadataRoute } from "next";
import { colleges } from "../data/colleges";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://collegefit.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/predictor", "/scholarships", "/compare", "/analytics", "/account"];
  return [
    ...staticRoutes.map((path, index) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: index === 0 ? 1 : 0.8 })),
    ...colleges.map((college) => ({ url: `${baseUrl}/college/${college.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
