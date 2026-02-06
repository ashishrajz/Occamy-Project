import DistributorDay from "../../src/lib/models/DistributorDay.js";

import { randomDate, randomInt, jitter } from "./utils.js";
import { REGIONS } from "./regions.js";

export async function seedDistributorDays(distributors) {
  await DistributorDay.deleteMany({});

  const days = [];

  for (const dist of distributors) {
    for (let i = 0; i < randomInt(3, 6); i++) {
      const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      const district = region.districts[0];

      days.push({
        distributor: dist._id,
        date: randomDate(15).toISOString().split("T")[0],
        startTime: new Date(),
        startLocation: {
          lat: jitter(district.lat),
          lng: jitter(district.lng),
        },
        startAddress: `${district.name}, ${region.state}`,
        endTime: new Date(),
        endLocation: {
          lat: jitter(district.lat),
          lng: jitter(district.lng),
        },
        endAddress: `${district.name}, ${region.state}`,
        totalDistanceKm: randomInt(5, 40),
      });
    }
  }

  return DistributorDay.insertMany(days);
}
