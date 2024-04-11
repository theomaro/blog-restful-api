import { Request, Response } from "express";
import PostComment from "../models/comments.model.js";

const comment = PostComment.getInstance();

export const getComments = async (req: Request, res: Response) => {
  const results = await comment.getComments();

  const comments = results.map((result) => {
    return {
      id: result.id,
      content: result.body,
      status: result.current_status,
      author: {
        username: result.username,
        full_name: result.full_name,
        avatar_url: result.avatar_url,
      },
      post: {
        title: result.title,
        slug_url: result.slug_url,
      },
      created_at: result.created_at,
      modified_at: result.modified_at,
    };
  });

  res.json({
    success: true,
    message: `${comments.length} comments retrieved successfully`,
    comments: comments,
  });
};
