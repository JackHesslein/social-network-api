import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import User from "../models/User.js";

/**
 * GET All Users /users
 * @returns an array of Users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET User by ID /users/:id
 * @param string id
 * @returns a single User
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.json({
        username: user.username,
        thoughts: user.thoughts,
        friends: user.friends,
      });
    } else {
      res.status(404).json({ message: "No user found with this id!" });
    }
    } catch (error: any) {
    res.status(500).json({ message: error.message });
    }
};

/**
 * POST Create a User /users
 * @param string username
 * @param string email
 * @returns a single User
 */
export const createUser = async (req: Request, res: Response) => {
  const { username, email } = req.body;
  try {
    const newUser = await User.create({ username, email });
    res.json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT Update a User /users/:id
 * @param object id, username, email
 * @returns a single User object
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "No user found with this id!" });
    }
    } catch (error: any) {
    res.status(500).json({ message: error.message });
    }
};

/**
 * DELETE User /users/:id
 * @param string id
 * @returns a message
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: "User deleted!" });
    } else {
      res.status(404).json({ message: "No user found with this id!" });
    }
    } catch (error: any) {
    res.status(500).json({ message: error.message });
    }
};

/**
 * POST Add a Friend /users/:userId/friends/:friendId
 * @param string userId, friendId
 * @returns a single User object
 */
export const addFriend = async (req: Request, res: Response) => {
    //@ts-ignore
    const { userId, friendId }: { userId: number, friendId:ObjectId } = req.params;
    try {
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
      
      if (!user || !friend) {
        res.status(404).json({ message: "User or friend not found!" });
        return;
      }
      
      if (user.friends.includes(friendId)) {
        res.status(400).json({ message: "Friend already added!" });
        return;
      }
      
      user.friends.push(friendId);
      await user.save();
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * DELETE Remove a Friend /users/:userId/friends/:friendId
   * @param string userId, friendId
   * @returns a single User object
   */
  export const removeFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({ message: "User not found!" });
        return;
      }
      
      user.friends = user.friends.filter((id: ObjectId) => id.toString() !== friendId);
      await user.save();
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  