const Inventory = require("../../models/bloodBankModel/Inventory");

exports.updateInventory = async (bloodBankId, updates) => {
  for (let item of updates) {
    const { bloodGroup, quantity } = item;
    await Inventory.findOneAndUpdate(
      { bloodBankId, bloodGroup },
      { $set: { quantity } },
      { upsert: true }
    );
  }
};

exports.getInventoryStats = async (bloodBankId) => {
  return Inventory.find({ bloodBankId });
};
