const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expensesSchema = new Schema({
  title: String,
  note: String,
  amount: Number,
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  status: String,
  balance: Number,
  date: Number,
  currency: String,
});
const ExpensesSchema = mongoose.model("transaction", expensesSchema);
module.exports = ExpensesSchema;
