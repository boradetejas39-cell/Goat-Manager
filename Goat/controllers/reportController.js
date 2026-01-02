const Goat = require('../models/Goat');
const DailyLog = require('../models/DailyLog');

// Get financial summary
exports.getSummary = async (req, res) => {
  try {
    // Total number of goats
    const totalGoats = await Goat.countDocuments();

    // Total purchase cost of all goats
    const purchaseResult = await Goat.aggregate([
      { $group: { _id: null, total: { $sum: '$purchasePrice' } } }
    ]);
    const totalPurchaseCost = purchaseResult[0]?.total || 0;

    // Total feed expenses
    const feedResult = await DailyLog.aggregate([
      { $group: { _id: null, total: { $sum: '$feed_cost' } } }
    ]);
    const totalFeedCost = feedResult[0]?.total || 0;

    // Total milk produced
    const milkResult = await DailyLog.aggregate([
      { $group: { _id: null, total: { $sum: '$milk_produced' } } }
    ]);
    const totalMilk = milkResult[0]?.total || 0;

    // Financial calculations
    const MILK_PRICE = 50; // ₹ per liter
    const totalRevenue = totalMilk * MILK_PRICE;
    const totalExpense = totalPurchaseCost + totalFeedCost;
    const netProfit = totalRevenue - totalExpense;
    const avgCostPerGoat = totalGoats > 0 ? totalExpense / totalGoats : 0;

    res.json({
      totalGoats,
      totalPurchaseCost,
      totalFeedCost,
      totalExpense,
      totalMilk,
      totalRevenue,
      netProfit,
      avgCostPerGoat,
      milkPrice: MILK_PRICE
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get detailed report
exports.getDetailed = async (req, res) => {
  try {
    const goats = await Goat.find().sort({ created_at: -1 });
    
    const detailedReport = await Promise.all(goats.map(async (goat) => {
      const logs = await DailyLog.aggregate([
        { $match: { goat_id: goat._id } },
        {
          $group: {
            _id: null,
            totalFeedCost: { $sum: '$feed_cost' },
            totalMilk: { $sum: '$milk_produced' }
          }
        }
      ]);

      const totalFeedCost = logs[0]?.totalFeedCost || 0;
      const totalMilk = logs[0]?.totalMilk || 0;
      const MILK_PRICE = 50;

      return {
        id: goat._id,
        goatId: goat.goatId,
        name: goat.name,
        purchasePrice: goat.purchasePrice,
        totalFeedCost,
        totalMilk,
        milkRevenue: totalMilk * MILK_PRICE,
        totalCost: goat.purchasePrice + totalFeedCost,
        netPL: (totalMilk * MILK_PRICE) - (goat.purchasePrice + totalFeedCost)
      };
    }));

    res.json(detailedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

