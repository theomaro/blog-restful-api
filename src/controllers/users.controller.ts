import { Request, RequestHandler, Response } from "express";
import User from "../models/users.model.js";

const user = User.getInstance();

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  let users = await user.getUsers(req.body.id);
  if (users.length === 0) throw new Error(`${users.length} users found`);

  return res.status(200).json({
    success: true,
    message: `${users.length} users retrieved`,
    totalCounts: users.length,
    users,
  });
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const userData = await user.getUser(req.params.username);
  if (!userData) throw new Error(`no user have been found`);

  return res.status(200).json({
    success: true,
    message: `user data retrieved`,
    user: userData,
  });
};

export const getUserPosts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const username = req.params.username;

  const userPosts = await user.getUserPosts(username).then((results) =>
    results.map((result) => {
      return {
        title: result.title,
        summary: result.summary,
        status: result.status,
        slug_url: result.slug_url,
        author: {
          full_name: result.full_name,
          username: result.username,
          avatar_url: result.avatar_url,
        },
        created_at: result.created_at,
        modified_at: result.modified_at,
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: `${userPosts.length} posts have been found for ${username}`,
    posts: userPosts,
  });
};
