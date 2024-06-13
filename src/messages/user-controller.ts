import { Request, Response } from "express";
import User from "../auth/models/User";

class userController {
  async list(req: Request, res: Response) {
    try {
      const userList = await User.find();
      res.status(200).json(userList);
    } catch (error) {
        console.log("here");
      res.status(400).json(error);
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.params },
        {
          username: req.body.username,
          password: req.body.password,
        },
        { new: true } // return the updated document
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async search(req: Request, res: Response) {
    try {
      const regex = new RegExp(req.body.fullname, "i");
      const user = await User.find({
        fullname: regex,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const user = await User.deleteOne({ _id: req.body.params });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async destroyAll(req: Request, res: Response) {
    try {
      const deletedUser = await User.deleteMany({});
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(400).json(error);
    }
  }
}

export default new userController();
