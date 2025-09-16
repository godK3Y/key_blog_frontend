// comments.service.ts
import { api } from "./api.service";

export type CommentItem = {
  _id: string;
  content: string;
  post: string | { _id: string; title: string; slug: string };
  author: string | { _id: string; name: string; email: string };
  parentComment?: string | CommentItem;
  approved?: boolean;
  likes?: number;
  likedBy?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCommentRequest = {
  content: string;
  post: string;
  parentComment?: string;
};

export type UpdateCommentRequest = {
  content: string;
};

export type PaginatedComments = {
  page: number;
  limit: number;
  total: number;
  items: CommentItem[];
};

export type FindByPostParams = {
  page?: number;
  limit?: number;
  approved?: boolean;
};

export type CommentCountResponse = {
  count: number;
};

export type ToggleLikeResponse = {
  liked: boolean;
};

async function create(payload: CreateCommentRequest): Promise<CommentItem> {
  const { data } = await api.post<CommentItem>("/comments", payload);
  return data;
}

async function findByPost(
  postId: string,
  params: FindByPostParams = {}
): Promise<PaginatedComments> {
  const { data } = await api.get<PaginatedComments>(
    `/comments/post/${postId}`,
    { params }
  );
  return data;
}

async function getCommentCount(
  postId: string,
  approved?: boolean
): Promise<CommentCountResponse> {
  const params =
    approved !== undefined ? { approved: approved.toString() } : {};
  const { data } = await api.get<CommentCountResponse>(
    `/comments/post/${postId}/count`,
    { params }
  );
  return data;
}

async function findOne(id: string): Promise<CommentItem> {
  const { data } = await api.get<CommentItem>(`/comments/${id}`);
  return data;
}

async function update(
  id: string,
  payload: UpdateCommentRequest
): Promise<CommentItem> {
  const { data } = await api.put<CommentItem>(`/comments/${id}`, payload);
  return data;
}

async function remove(id: string): Promise<{ deleted: boolean }> {
  const { data } = await api.delete<{ deleted: boolean }>(`/comments/${id}`);
  return data;
}

async function toggleLike(id: string): Promise<ToggleLikeResponse> {
  const { data } = await api.post<ToggleLikeResponse>(`/comments/${id}/like`);
  return data;
}

export const CommentsService = {
  create,
  findByPost,
  getCommentCount,
  findOne,
  update,
  remove,
  toggleLike,
};

export default CommentsService;
