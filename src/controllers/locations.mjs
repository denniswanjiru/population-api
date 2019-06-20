import Location from '../models/location';
import Utils from "../helper/utils.mjs";

export default class LocationsController {
  static async getLocations(req, res) {
    try {
      const locations = await Location.find().exec();

      res.status(200).json({
        locations
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getLocation(req, res) {
    try {
      const id = req.params.id;
      const { userId } = await Utils.getLoggedInUser(req, res);
      const location = await Location.findById(id).exec();

      if (location) {
        res.status(200).json({
          location: "Location retrived successfully",
          location
        });
      } else {
        res.status(404).json({
          location: "Location does not exists"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async createLocation(req, res) {
    try {
      const location = await new Location({
        _id: Utils.generateUniqId(),
        name: req.body.name,
        females: req.body.females,
        males: req.body.males,
        parentLocation: req.body.parentLocation
      });

      const doc = await location.save();
      res.status(201).json({
        message: 'Location was created successfully',
        doc
      });
    } catch (error) {
      res.status(403).json({
        message: 'Name of the location must e unique'
      });
    }
  }

  static async updateLocation(req, res) {
    try {
      const id = req.params.id;
      const location = await Location.findById(id);

      if (location) {
        await Location.updateOne({ _id: id }, { $set: req.body }, { new: true }).exec();
        const updatedLocation = await Location.findById(id);
        res.status(200).json({
          message: 'Location was updated successfully',
          updatedLocation
        });
      } else {
        res.status(404).json({
          message: 'Message was not found'
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteLocation(req, res) {
    try {
      const id = req.params.id;
      const location = await Location.findById(id);

      if (location) {
        await Location.remove({ _id: id }).exec();
        res.status(200).json({
          location: 'Location was deleted successfully'
        });
      } else {
        res.status(404).json({
          location: 'Location was not found'
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
