import User from '../models/user';
import bcrypt from 'bcrypt';

export default class UserValidator {
  static passwordMatch(req, res, next) {
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm password must be equal'
      });
    };

    next();
  }

  static async uniqEmail(req, res, next) {
    try {
      if (!/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(req.body.email)) {
        return res.status(400).json({
          message: 'Please enter a valid email'
        });
      };

      const user = await User.find({ email: req.body.email }).exec();
      if (user.length > 0) {
        return res.status(409).json({
          message: "Email is already taken"
        });
      };

      next();
    } catch (error) {
      console.log(error);
    }
  }

  static async correctCreds(req, res, next) {
    try {
      const user = await User.find({ email: req.body.email }).exec();
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email or password do not match"
        });
      }

      const match = await bcrypt.compare(req.body.password, user[0].password);
      if (!match) {
        return res.status(401).json({
          message: "Email or password do not match"
        });
      }

      next(user);
    } catch (error) {
      console.log(error);
    }
  }
}
