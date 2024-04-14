import { Request, Response } from "express";
import Post from "../models/posts.model.js";

const post = Post.getInstance();

export const getPosts = async (req: Request, res: Response) => {
  const results = await post.getPosts();

  const posts = results.map((result) => {
    return {
      title: result.title,
      summary: result.summary,
      status: result.current_status,
      slug_url: result.slug_url,
      author: {
        username: result.username,
        full_name: result.full_name,
        avatar_url: result.avatar_url,
      },
      created_at: result.created_at,
      modified_at: result.modified_at,
    };
  });
  res.json({
    success: true,
    message: `${posts.length} posts retrieved successfully`,
    posts: posts,
  });
};

export const getPost = async (req: Request, res: Response) => {
  const { slug_url } = req.params;
  const result = await post.getPost(slug_url);
  res.json({
    success: true,
    message: "post retrieved successfully",
    post: {
      title: result.title,
      meta_title: result.meta_title,
      summary: result.summary,
      body: result.body,
      status: result.current_status,
      banner_url: result.banner_url,
      slug_url: result.slug_url,
      author: {
        username: result.username,
        full_name: result.full_name,
        avatar_url: result.avatar_url,
      },
      created_at: result.created_at,
      modified_at: result.modified_at,
    },
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { slug_url } = req.params;
  const status = req.query.status ? String(req.query.status) : "";

  // validate input data

  // check current status not same as incoming
  // only approved post will be published
  // only published post will be archived

  const result = await post.updateStatus(status, slug_url);
  if (result.affectedRows === 0)
    return res.json({
      success: true,
      message: `failed to ${status} a post`,
    });

  res.json({
    success: true,
    message: `post ${status} successfully`,
  });
};

export const getPostComments = async (req: Request, res: Response) => {
  const { slug_url } = req.params;
  const comments = await post.getCommentsByPost(slug_url).then((results) =>
    results.map((result) => {
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
        parent_id: result.parent_id,
        totalReplies: 0,
      };
    })
  );

  return res.json({
    success: true,
    message: "post retrieved successfully",
    comments: comments,
  });
};
