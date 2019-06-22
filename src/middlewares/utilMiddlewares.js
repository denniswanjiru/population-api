import jwtDecode from "jwt-decode";
import Utils from "../helper/utils";

export default class UtilMiddleware {
  static async authenticate(req, res, next) {
    try {
      const user = await Utils.getLoggedInUser(req, res);
      next();
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }
}
