import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/vehicles-db";
import { dealer } from "@/lib/dealership";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/collection", "/import", "/financing", "/sell", "/book", "/faq", "/contact"].map(
    (p) => ({
      url: `${dealer.siteUrl}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    }),
  );

  const vehicles = await getVehicles();
  const vehiclePages = vehicles.map((v) => ({
    url: `${dealer.siteUrl}/collection/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...vehiclePages];
}