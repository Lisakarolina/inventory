const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  native: { type: String, required: true },
  bloom: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

PlantSchema.virtual("url").get(function () {
  return `/plantcatalog/plant/${this._id}`;
});

module.exports = mongoose.model("Plant", PlantSchema);
