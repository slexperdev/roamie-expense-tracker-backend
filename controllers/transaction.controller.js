const db = require("../config/mongo.init");
const Transaction = require("../models/transaction");
const Category = require("../models/category");

//function to add income or expenses based on the status to the transaction document
exports.add = async (req, res) => {
  // Extract status from the request body
  let { status } = req.body;

  if (status == "expenses") {
    // Extract expense-related fields from the request body
    let { title, note, amount, userId, categoryId, status, date, currency } =
      req.body;

    // Validate required fields for expenses
    if (
      !title ||
      !note ||
      !amount ||
      !userId ||
      !categoryId ||
      !status ||
      !date ||
      !currency
    ) {
      return res
        .status(200)
        .json({ status: "FAILED", message: "Missing required fields" });
    }

    try {
      const newExpense = new Transaction({
        title,
        note,
        amount,
        userId,
        categoryId,
        status,
        date,
        currency,
      });

      // Save the new expense and update income balance
      newExpense
        .save()
        .then(async (result) => {
          console.log("result", result);
          // const updatedIncome = await Transaction.findOneAndUpdate(
          //   { _id: accountId },
          //   { $inc: { balance: -amount } }, // Subtract the expense amount from the balance
          //   { new: true } // Return the updated document
          // );

          res.status(200).json({
            status: "SUCCESS",
            message: "New expense added successfully",
            data: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "FAILED",
            message: "An error occurred while saving expense!",
          });
        });
    } catch (error) {
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred while fetching income!",
      });
    }
  } else if (status == "income") {
    // Extract income-related fields from the request body
    let { title, note, amount, userId, status, date, categoryId, currency } =
      req.body;

    // Validate required fields for income
    if (
      !title ||
      !note ||
      !amount ||
      !userId ||
      !date ||
      !categoryId ||
      !currency
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new income transaction
    const income = new Transaction({
      title,
      note,
      amount,
      userId,
      balance: amount, // Set initial balance equal to the income amount
      status,
      date,
      categoryId,
      currency,
    });

    // Save the new income transaction
    income
      .save()
      .then((result) => {
        res.status(200).json({
          status: "SUCCESS",
          message: "New income added successfully",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "FAILED",
          message: "An error occurred while saving income!",
        });
      });
  } else {
    res.status(200).json({
      status: "FAILED",
      message: "Please select transaction type",
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Define the status to filter transactions as "expenses"
    const status = "expenses";

    // Attempt to find an expense transaction for the specified user
    const expenseTransactions = await Transaction.find({ userId, status });

    // Check if any expense transactions were found
    if (expenseTransactions.length > 0) {
      // Create an array to store the modified expense transactions
      const modifiedExpenseTransactions = [];

      // Iterate through each expense transaction
      for (const expense of expenseTransactions) {
        // Fetch the account details using the accountId

        // Fetch the category details using the categoryId
        const categoryDetails = await Category.findById(expense.categoryId);

        // Check if accountDetails and categoryDetails are not null before converting to objects
        const modifiedExpense = {
          ...expense.toObject(), // Convert expense to plain JavaScript object
          categoryDetails: categoryDetails ? categoryDetails.toObject() : null, // Convert categoryDetails to plain JavaScript object or set to null
        };

        // Add the modified expense to the array
        modifiedExpenseTransactions.push(modifiedExpense);
      }

      // Return the modified list of expense transactions in the response
      return res.status(200).json(modifiedExpenseTransactions);
    } else {
      // Return a not found response if no expense transactions were found
      return res
        .status(404)
        .json({ message: "No expense found for the specified user." });
    }
  } catch (error) {
    // Handle any unexpected errors and return a generic server error response
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getIncome = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Define the status to filter transactions as "income"
    const status = "income";

    // Attempt to find income transactions for the specified user
    const incomeTransactions = await Transaction.find({ userId, status });

    // Check if any income transactions were found
    if (incomeTransactions.length > 0) {
      // Create an array to store the modified income transactions
      const modifiedIncomeTransactions = [];

      // Iterate through each income transaction
      for (const income of incomeTransactions) {
        // Fetch the account details using the accountId

        // Fetch the category details using the categoryId
        const categoryDetails = await Category.findById(income.categoryId);

        // Combine income, account details, and category details into a single object
        const modifiedIncome = {
          ...income.toObject(), // Convert income to plain JavaScript object
          categoryDetails: categoryDetails ? categoryDetails.toObject() : null, // Convert categoryDetails to plain JavaScript object
        };

        // Add the modified income to the array
        modifiedIncomeTransactions.push(modifiedIncome);
      }

      // Return the modified list of income transactions in the response
      return res.status(200).json(modifiedIncomeTransactions);
    } else {
      // Return a not found response if no income transactions were found
      return res
        .status(404)
        .json({ message: "No income found for the specified user." });
    }
  } catch (error) {
    // Handle any unexpected errors and return a generic server error response
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    // Attempt to find and update an income transaction for the specified user
    const updatedIncome = await Transaction.findOneAndUpdate(
      { userId: req.params.id, status: "income" }, // Query to find the income transaction
      {
        $set: {
          // Set the new values for the specified fields
          title: req.body.title, // Update the title with the value from the request body
          note: req.body.note, // Update the note with the value from the request body
          amount: req.body.amount, // Update the amount with the value from the request body
        },
      },
      { new: true } // Return the updated document after the update
    );

    // Check if the income transaction was successfully updated
    if (updatedIncome) {
      // Return a success response if the income transaction was updated
      return res.status(200).send({ status: true, message: "Income updated." });
    } else {
      // Return an error response if the income transaction update failed
      return res
        .status(400)
        .send({ status: false, message: "Income update failed." });
    }
  } catch (error) {
    // Handle any unexpected errors and return a generic server error response
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    // Attempt to find and delete a transaction by its ID
    const deletedTransaction = await Transaction.findOneAndDelete(
      { _id: req.params.id },
      { new: true } // Return the updated document after deletion
    );

    // Check if the transaction was successfully deleted
    if (deletedTransaction) {
      // Check the status of the deleted transaction
      if (deletedTransaction.status === "income") {
        // Return a success response if it was an income transaction
        return res
          .status(200)
          .send({ status: true, message: "Income deleted." });
      } else if (deletedTransaction.status === "expenses") {
        // Update the balance for expense transactions
        // Assuming you have a balance field in the income transaction, update it accordingly
        const incomeTransaction = await Transaction.findOneAndUpdate(
          { userId: deletedTransaction.userId, status: "income" },
          { $inc: { balance: +deletedTransaction.amount } }, // Subtract the amount from the balance
          { new: true }
        );

        // Check if the balance update was successful
        if (incomeTransaction) {
          return res.status(200).send({
            status: true,
            message: "Expense deleted. Balance updated.",
          });
        } else {
          return res.status(400).send({
            status: false,
            message: "Expense delete failed. Balance update failed.",
          });
        }
      }
    }

    // Return an error response if the transaction deletion failed
    return res
      .status(400)
      .send({ status: false, message: "Transaction delete failed." });
  } catch (error) {
    // Handle any unexpected errors and return a generic server error response
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    const expensesStatus = "expenses";
    const incomeStatus = "income";

    // Find all expense transactions with the specified userId and status
    const expenses = await Transaction.find({ userId, status: expensesStatus });

    // Find all income transactions with the specified userId and status
    const incomes = await Transaction.find({ userId, status: incomeStatus });

    // If there are expenses or incomes, fetch additional details for each transaction
    if (expenses.length > 0 || incomes.length > 0) {
      // Create an array to store promises for each transaction
      const transactionPromises = [];

      // Process expenses
      for (const expense of expenses) {
        const categoryId = expense.categoryId;

        // Fetch details from the Category collection using categoryId
        const categoryDetailsPromise = Category.findById(categoryId);

        // Add promises to the array
        transactionPromises.push(
          Promise.all([categoryDetailsPromise]).then(([categoryDetails]) => {
            // Return details for the expense
            return {
              ...expense.toObject(),
              categoryDetails,
            };
          })
        );
      }

      // Process incomes
      for (const income of incomes) {
        const categoryId = income.categoryId; // Assuming you have a categoryId for incomes

        // Fetch details from the Category collection using categoryId
        const categoryDetailsPromise = Category.findById(categoryId);

        // Add promises to the array
        transactionPromises.push(
          Promise.all([categoryDetailsPromise]).then(([categoryDetails]) => {
            // Return details for the income
            return {
              ...income.toObject(),
              categoryDetails,
            };
          })
        );
      }

      // Wait for all promises to resolve
      const transactionResults = await Promise.all(transactionPromises);

      // Combine results for expenses and incomes into a single "Transaction" array
      const result = {
        Transaction: transactionResults,
      };

      return res.status(200).json(result);
    } else {
      // Handle the case where no transactions are found
      return res.status(404).json({ message: "No transactions found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const expensesStatus = "expenses";
    const incomeStatus = "income";

    // Find all transactions with the specified userId and status for expenses
    const expenses = await Transaction.find({ userId, status: expensesStatus });

    // Calculate the total amount of expenses
    const totalExpenses = expenses.reduce((total, expense) => {
      return total + parseInt(expense.amount);
    }, 0);

    // Find all transactions with the specified userId and status for income
    const incomes = await Transaction.find({ userId, status: incomeStatus });

    // Calculate the total amount of income
    const totalIncome = incomes.reduce((total, income) => {
      return total + parseInt(income.amount);
    }, 0);

    // Calculate the total balance (income - expenses)
    const totalBalance = totalIncome - totalExpenses;

    const result = {
      totalExpenses,
      totalIncome,
      totalBalance,
    };

    // Return the combined JSON object in the response
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
