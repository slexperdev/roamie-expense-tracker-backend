const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

exports.routesConfig = function (app) {
  app.post("/login", [
    AuthMiddleware.isPasswordAndUserMatch,
    UserController.checkLogin,
  ]);

  app.post("/register", [
    AuthMiddleware.isUserExist,
    AuthMiddleware.isPasswordsMatched,
    UserController.saveNewUser,
  ]);

  app.get("/user/:id", [AuthMiddleware.validJWTNeeded, UserController.getUser]);
};
