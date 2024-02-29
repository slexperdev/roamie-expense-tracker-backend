const TransactionController = require("../controllers/transaction.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

exports.routesConfig = function (app) {
  app.post("/transaction/add", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.add,
  ]);

  //expenses routes

  app.get("/expense/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.getExpense,
  ]);

  //income routes
  app.get("/income/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.getIncome,
  ]);
  app.put("/income/update/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.update,
  ]);
  app.delete("/income/delete/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.delete,
  ]);

  //get all transactions
  app.get("/transaction/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.getHistory,
  ]);

  //get summery

  app.get("/transaction/summery/:id", [
    AuthMiddleware.validJWTNeeded,
    TransactionController.getDetails,
  ]);
};
