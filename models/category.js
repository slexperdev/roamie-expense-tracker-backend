const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  color: String,
});
const CategorySchema = mongoose.model("category", categorySchema);
module.exports = CategorySchema;
