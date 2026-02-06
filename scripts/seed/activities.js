import Activity from "../../src/lib/models/Activity.js";

import { REGIONS } from "./regions.js";
import { randomItem, randomInt, jitter } from "./utils.js";

const PRODUCTS = ["RAKSHAK", "BOVI_BOOSTER", "JODI_NO_1", "BUCK_BOOSTER"];

export async function seedActivities(days) {
  await Activity.deleteMany({});

  const activities = [];

  for (const day of days) {
    const region = randomItem(REGIONS);
    const district = randomItem(region.districts);
    const village = randomItem(district.villages);

    // MEETING
    activities.push({
      distributor: day.distributor,
      day: day._id,
      type: "MEETING_ONE_ON_ONE",
      geo: { state: region.state, district: district.name, village },
      location: {
        lat: jitter(district.lat),
        lng: jitter(district.lng),
      },
      address: `${village}, ${district.name}`,
      meeting: {
        personName: "Farmer Ram",
        category: "FARMER",
        meetingKind: "ONE_ON_ONE",
        businessPotential: "High",
        intent: "TRIAL",
      },
      notes: "Discussed crop issues and fertilizer usage",
    });

    // SAMPLE
    activities.push({
      distributor: day.distributor,
      day: day._id,
      type: "SAMPLE_DISTRIBUTION",
      geo: { state: region.state, district: district.name, village },
      location: {
        lat: jitter(district.lat),
        lng: jitter(district.lng),
      },
      sample: {
        productId: randomItem(PRODUCTS),
        quantity: randomInt(1, 5),
        purpose: "TRIAL",
        givenTo: "Farmer",
      },
    });

    // SALE (sometimes)
    if (Math.random() > 0.4) {
      activities.push({
        distributor: day.distributor,
        day: day._id,
        type: "SALE",
        geo: { state: region.state, district: district.name, village },
        location: {
          lat: jitter(district.lat),
          lng: jitter(district.lng),
        },
        sale: {
          productId: randomItem(PRODUCTS),
          customerName: "Farmer Ram",
          customerCategory: "FARMER",
          quantity: randomInt(1, 20),
          mode: Math.random() > 0.5 ? "B2C" : "B2B",
          isFollowUpSale: Math.random() > 0.5,
          isRepeatOrder: Math.random() > 0.7,
          amount: randomInt(800, 5000),
        },
      });
    }

    // GPS PING
    activities.push({
      distributor: day.distributor,
      day: day._id,
      type: "LOCATION_PING",
      location: {
        lat: jitter(district.lat),
        lng: jitter(district.lng),
      },
    });
  }

  await Activity.insertMany(activities);
}
