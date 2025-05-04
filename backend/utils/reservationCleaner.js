const cron = require("node-cron");
const Reservation = require("../models/reservationModel");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const result = await Reservation.deleteMany({
      date: { $lt: today }
    });

    console.log(`🧹 Auto-cleanup: Deleted ${result.deletedCount} past reservations.`);
  } catch (error) {
    console.error("❌ Error cleaning up old reservations:", error.message);
  }
});
