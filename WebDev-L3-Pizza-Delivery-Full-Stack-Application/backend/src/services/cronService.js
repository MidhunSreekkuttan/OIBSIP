import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import { sendLowStockAlertEmail } from './emailService.js';

let cronJob = null;

export const checkLowStockAndAlert = async (forceAlert = false) => {
  try {
    const globalThreshold = Number(process.env.LOW_STOCK_THRESHOLD) || 20;

    // Find all items where stock is at or below threshold (item-specific threshold or global default)
    const items = await Inventory.find({});
    const lowStockItems = items.filter((item) => {
      const threshold = item.threshold || globalThreshold;
      return item.stockQuantity <= threshold;
    });

    if (lowStockItems.length === 0) {
      console.log('📦 [Cron Inventory] All inventory items are well-stocked.');
      return { count: 0, items: [], alertSent: false };
    }

    console.log(`⚠️ [Cron Inventory] Found ${lowStockItems.length} low-stock items!`);

    // Check if an alert was sent recently (debounce to avoid spamming admin every few minutes)
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const now = new Date();

    const itemsNeedingAlert = lowStockItems.filter((item) => {
      if (forceAlert) return true;
      if (!item.lastAlertSentAt) return true;
      return now - new Date(item.lastAlertSentAt) > ONE_HOUR_MS;
    });

    if (itemsNeedingAlert.length > 0) {
      console.log(`📧 [Cron Inventory] Sending low stock email alert for ${itemsNeedingAlert.length} items...`);
      const emailResult = await sendLowStockAlertEmail(itemsNeedingAlert);

      // Update lastAlertSentAt for alerted items
      await Inventory.updateMany(
        { _id: { $in: itemsNeedingAlert.map((i) => i._id) } },
        { $set: { lastAlertSentAt: now } }
      );

      console.log('✅ [Cron Inventory] Low-stock alert email successfully processed.');
      return {
        count: lowStockItems.length,
        items: lowStockItems,
        alertSent: true,
        previewUrl: emailResult.previewUrl,
      };
    } else {
      console.log('ℹ️ [Cron Inventory] Low stock detected, but alert was sent recently (debounce active).');
      return {
        count: lowStockItems.length,
        items: lowStockItems,
        alertSent: false,
        debounced: true,
      };
    }
  } catch (error) {
    console.error('❌ [Cron Inventory] Error during stock check:', error.message);
    return { error: error.message };
  }
};

export const initStockCronJob = () => {
  const schedule = process.env.ALERT_CRON_SCHEDULE || '*/5 * * * *'; // Default every 5 minutes

  if (cronJob) {
    cronJob.stop();
  }

  cronJob = cron.schedule(schedule, async () => {
    console.log(`⏰ [Cron] Running scheduled low-stock inventory check (${new Date().toLocaleTimeString()})...`);
    await checkLowStockAndAlert(false);
  });

  console.log(`⏰ [Cron] Inventory monitor scheduled with pattern: "${schedule}"`);
};

