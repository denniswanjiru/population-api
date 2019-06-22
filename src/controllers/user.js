import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import User from '../models/user';
import Utils from "../helper/utils";

export default class UserController {
  static async signup(req, res) {
    try {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          res.status(500).json({
            error: {
              message: err
            }
          });
        } else {
          const user = await new User({
            _id: Utils.generateUniqId(),
            name: req.body.name,
            email: req.body.email,
            password: hash
          });

          await user.save();
          res.status(201).json({
            message: 'Account was created successfully'
          });
        }
      })
    } catch (error) {
      res.status(500).json({
        error: {
          message: error
        }
      });
    }
  }

  static async signin(user, req, res, next) {
    try {
      const token = await jwt.sign({
        name: user[0].name,
        email: user[0].email,
        userId: user[0]._id,
        role: user[0].role,
      },
        process.env.JWT_SECRET_KEY || 'fwvbschvr32efvfrv',
        { expiresIn: "1h" }
      );

      const { email, name, role } = jwtDecode(token);
      res.status(200).json({
        name,
        email,
        role,
        token
      });
    } catch (error) {
      console.log(error);
    }
  }
}
