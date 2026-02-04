import DistributorDay from "@/lib/models/DistributorDay";

export async function autoClosePreviousDay(userId) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: userId,
    date,
    endTime: null,
  });

  if (day) {
    day.endTime = new Date(`${date}T23:59:59`);
    await day.save();
  }
}
