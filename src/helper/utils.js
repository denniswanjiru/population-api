import mongoose from "mongoose";
import jwtDecode from "jwt-decode";

export default class Utils {
  static generateUniqId() {
    return new mongoose.Types.ObjectId();
  }

  static async getLoggedInUser(req, res) {
    try {
      const token = req.headers.authorization;
      if(!token) {
        res.status(401).json({
          message: 'You must be logged in to perform this action'
        })
      }

      return jwtDecode(token);
    } catch (error) {
      res.status(500).json({
        message: 'Server Error'
      });
    }
  }
}
