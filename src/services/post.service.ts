// post.service.ts
import { api } from "./api.service";

export type PostItem = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  author?: { _id?: string; name?: string; email?: string } | string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePostRequest = {
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  published?: boolean;
};

export type UpdatePostRequest = Partial<CreatePostRequest>;

export type PaginatedPosts = {
  page: number;
  limit: number;
  total: number;
  items: PostItem[];
};

export type FindAllParams = {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string; // ObjectId string
  published?: "true" | "false";
  q?: string;
};

async function create(payload: CreatePostRequest): Promise<PostItem> {
  const { data } = await api.post<PostItem>("/posts", payload);
  return data;
}

async function findAll(params: FindAllParams = {}): Promise<PaginatedPosts> {
  const { data } = await api.get<PaginatedPosts>("/posts", { params });
  return data;
}

async function findOneBySlug(slug: string): Promise<PostItem> {
  const { data } = await api.get<PostItem>(
    `/posts/slug/${encodeURIComponent(slug)}`
  );
  return data;
}

async function findOneById(id: string): Promise<PostItem> {
  const { data } = await api.get<PostItem>(`/posts/${id}`);
  return data;
}

async function update(
  id: string,
  payload: UpdatePostRequest
): Promise<PostItem> {
  const { data } = await api.put<PostItem>(`/posts/${id}`, payload);
  return data;
}

async function remove(id: string): Promise<{ deleted: boolean }> {
  const { data } = await api.delete<{ deleted: boolean }>(`/posts/${id}`);
  return data;
}

export const PostService = {
  create,
  findAll,
  findOneBySlug,
  findOneById,
  update,
  remove,
};

export default PostService;
