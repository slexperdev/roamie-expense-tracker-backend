const CategoryController = require("../controllers/category.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

exports.routesConfig = function (app) {
  app.post("/category/add", [
    AuthMiddleware.validJWTNeeded,
    CategoryController.add,
  ]);
  app.get("/category/:id", [
    AuthMiddleware.validJWTNeeded,
    CategoryController.getCategory,
  ]);
  app.put("/category/update", [
    AuthMiddleware.validJWTNeeded,
    CategoryController.update,
  ]);
  app.delete("/category/delete/:id", [
    AuthMiddleware.validJWTNeeded,
    CategoryController.delete,
  ]);
};
