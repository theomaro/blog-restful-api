import { Request, response, Response } from "express";
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
      totalReplies: 0,
    };
  });

  return res.json({
    success: true,
    message: `${comments.length} comments retrieved successfully`,
    comments: comments,
  });
};

export const getComment = async (req: Request, res: Response) => {
  let result = await comment.getComment(req.params.id);

  const mainComment = {
    id: result.id,
    content: result.body,
    status: result.current_status,
    author: {
      username: result.username,
      full_name: result.full_name,
      avatar_url: result.avatar_url,
      bio: result.biography,
    },
    post: {
      title: result.title,
      summary: result.summary,
      slug_url: result.slug_url,
    },
    created_at: result.created_at,
    modified_at: result.modified_at,
  };

  res.json({
    success: true,
    message: `comment retrieved successfully`,
    comment: mainComment,
    replies: await getReplies(mainComment.id),
  });
};

const getReplies = async (id: string) => {
  return await comment.getReplies(id).then((data) =>
    data.map((result) => {
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
    })
  );
};

export const deleteComment = async (req: Request, res: Response) => {
  const result = await comment.deleteComment(req.params.id);
  if (result.affectedRows === 0)
    return res.json({
      success: true,
      message: `failed to delete a comment`,
    });

  res.json({
    success: true,
    message: `comment deleted successfully`,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const status = req.query.status ? String(req.query.status) : "";

  const result = await comment.updateStatus(id, status);
  if (result.affectedRows === 0)
    return res.json({
      success: true,
      message: `failed to ${status} a comment`,
    });

  res.json({
    success: true,
    message: `comment ${status} successfully`,
  });
};
