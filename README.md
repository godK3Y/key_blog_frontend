# Mini Blog — Next.js + NestJS Design v1

A small but real-world **Mini Blog** built with **Next.js (App Router)** on the frontend and **NestJS + MongoDB (Mongoose)** on the backend. This doc captures goals, architecture, data models, API, UI, and a build plan you can iterate on.

---

## 1) Goals & Non‑Goals

**Goals**

- CRUD blog posts with rich text (Markdown), tags, and published/draft states.
- Public pages: Home (list), Post detail, Tag filter.
- Auth: simple email/password for admin authoring.
- Admin pages: New Post, Edit Post, Post List.
- Comments (optional toggle) with basic moderation.

**Non-Goals (v1)**

- Multi-user roles beyond `admin` and `reader`.
- Image uploads/CDN (can stub with URLs first).
- WYSIWYG collaboration, SEO wizardry, or complex analytics (add later).

---

## 2) Tech Stack

**Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui, Lucide icons, **TanStack Query** (fetch/cache), Zod (validation), React Hook Form.

**Backend**: NestJS 10+, TypeScript, Mongoose, class‑validator, class‑transformer, JWT (passport-jwt), bcrypt.

**Database**: MongoDB (Atlas or local).

**Tooling**: ESLint, Prettier, Husky + lint-staged, Vitest/Jest, Playwright (optional e2e).

---

## 3) High‑Level Architecture

```
[Next.js App Router]  ── fetch ──>  [NestJS REST API]
   UI, routing, SSR/ISR           Controllers → Services → Mongoose Models
   TanStack Query                 Auth (JWT) / DTO validation

[MongoDB] <── Mongoose models from NestJS
```

**Auth Flow**

1. User logs in via `/auth/login` with email/password.
2. Nest issues **JWT** (access token). Frontend stores token in httpOnly cookie (preferred) or memory.
3. Protected routes (create/edit/delete post, moderate comments) require `Authorization: Bearer <token>`.

---

## 4) Data Model (Mongo/Mongoose)

### 4.1 User

- `_id: ObjectId`
- `name: string`
- `email: string (unique)`
- `passwordHash: string`
- `role: 'admin' | 'reader'` (default `reader`)
- `createdAt: Date`, `updatedAt: Date`

### 4.2 Post

- `_id: ObjectId`
- `title: string`
- `slug: string (unique, derived from title)`
- `content: string` (Markdown)
- `excerpt: string` (first \~160 chars or manual)
- `tags: string[]`
- `coverImageUrl?: string`
- `status: 'draft' | 'published'`
- `authorId: ObjectId (→ User)`
- `publishedAt?: Date`
- `createdAt: Date`, `updatedAt: Date`

### 4.3 Comment (v1 optional)

- `_id: ObjectId`
- `postId: ObjectId (→ Post)`
- `authorName: string`
- `authorEmail?: string`
- `content: string`
- `isApproved: boolean` (default false)
- `createdAt: Date`

> **Indexing**: `Post.slug`, `Post.tags`, `Post.status + publishedAt`, `Comment.postId`.

---

## 5) API Design (NestJS)

### Auth

- `POST /auth/register` — (admin bootstrap or disabled in prod)

  - body: `{ name, email, password }`

- `POST /auth/login`

  - body: `{ email, password }`
  - resp: `{ accessToken }`

### Posts

- `GET /posts?status=published|draft&tag=&q=&limit=&cursor=` — list with filters + cursor pagination
- `GET /posts/:slug` — fetch single post by slug
- `POST /posts` (auth: admin)

  - body: `{ title, content, tags?, coverImageUrl?, status? }`

- `PUT /posts/:id` (auth: admin)
- `DELETE /posts/:id` (auth: admin)

### Comments (optional)

- `GET /posts/:postId/comments` — public
- `POST /posts/:postId/comments` — public create (held for moderation)
- `PATCH /comments/:id/approve` (auth: admin)
- `DELETE /comments/:id` (auth: admin)

**Common Response Shapes**

```json
// GET /posts (published list)
{
  "items": [
    {
      "_id": "...",
      "title": "First Post",
      "slug": "first-post",
      "excerpt": "...",
      "tags": ["nextjs", "nest"],
      "coverImageUrl": null,
      "publishedAt": "2025-08-27T12:00:00.000Z"
    }
  ],
  "nextCursor": null
}
```

---

## 6) Validation (DTOs) — NestJS

```ts
// posts/dto/create-post.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  MaxLength,
} from "class-validator";

export class CreatePostDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  content: string; // markdown

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(["draft", "published"] as const)
  status?: "draft" | "published";
}
```

---

## 7) Mongoose Schemas — NestJS

```ts
// posts/schemas/post.schema.ts
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true }) title: string;
  @Prop({ required: true, unique: true, index: true }) slug: string;
  @Prop({ required: true }) content: string; // markdown
  @Prop({ default: "" }) excerpt: string;
  @Prop({ type: [String], default: [], index: true }) tags: string[];
  @Prop() coverImageUrl?: string;
  @Prop({ enum: ["draft", "published"], default: "draft", index: true })
  status: "draft" | "published";
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  authorId: Types.ObjectId;
  @Prop({}) publishedAt?: Date;
}
export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ status: 1, publishedAt: -1 });
```

> **Slugging**: generate `slugify(title)` in service; on title change, optionally keep a `redirects` collection for old slugs (v2).

---

## 8) Frontend Pages (Next.js App Router)

```
app/
├─ layout.tsx
├─ page.tsx                   # Home (list published posts)
├─ (blog)/
│  └─ [slug]/page.tsx         # Post detail (MD → HTML)
├─ (tags)/
│  └─ tag/[tag]/page.tsx      # Filtered by tag
├─ (auth)/
│  ├─ login/page.tsx
│  └─ register/page.tsx (dev only)
└─ (admin)/
   ├─ posts/page.tsx          # Admin list
   ├─ posts/new/page.tsx      # New post
   └─ posts/[id]/edit/page.tsx
```

**UI Components**

- `PostCard`, `PostList`, `MarkdownRenderer` (using `react-markdown`), `TagPill`, `EmptyState`, `Pagination`.
- Forms with `react-hook-form` + Zod.
- shadcn/ui: `Card`, `Button`, `Badge`, `Input`, `Textarea`, `DropdownMenu`, `Dialog`.

**Data Fetching**

- Public pages can use **SSR** for SEO: fetch published posts from API on the server.
- Admin pages use **TanStack Query** + client-side mutations.

---

## 9) Folder Structures

**NestJS**

```
backend/
├─ src/
│  ├─ app.module.ts
│  ├─ common/
│  │  ├─ guards/jwt-auth.guard.ts
│  │  └─ pipes/
│  ├─ auth/
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  └─ strategies/jwt.strategy.ts
│  ├─ users/
│  ├─ posts/
│  │  ├─ posts.module.ts
│  │  ├─ posts.controller.ts
│  │  ├─ posts.service.ts
│  │  └─ schemas/post.schema.ts
│  └─ comments/ (optional)
├─ test/
└─ main.ts
```

**Next.js**

```
frontend/
├─ app/
├─ components/
│  ├─ ui/ (shadcn)
│  ├─ blog/
│  └─ forms/
├─ lib/
│  ├─ api.ts (fetch helpers)
│  └─ auth.ts (token utils)
├─ hooks/
├─ styles/
└─ types/
```

---

## 10) API Contracts (Frontend Types)

```ts
// types/post.ts
export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  coverImageUrl?: string;
  publishedAt?: string; // ISO
}

export interface PostDetail extends PostListItem {
  content: string; // markdown
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}
```

---

## 11) Env & Config

**Backend (.env)**

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/mini_blog
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)**

```
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

---

## 12) Security & Error Handling

- Store JWT in **httpOnly, secure cookie** if you control API + domain; otherwise keep token in memory, never in localStorage.
- Rate-limit `/auth/*` and comment creation.
- Validate all DTOs with class-validator.
- Central error filter in Nest to normalize error shape `{ statusCode, message, error }`.

---

## 13) SEO & Performance (v1)

- `<meta>` tags from post title/excerpt; Open Graph image (static for v1).
- Use `generateMetadata` in Next routes.
- Incremental Static Regeneration (ISR) for public pages if desired.

---

## 14) Testing Plan

- **Unit (Nest)**: services + utils with Jest.
- **E2E (Nest)**: supertest against in-memory Mongo (mongodb-memory-server).
- **E2E (Frontend)**: Playwright for core flows (view list, open post, admin login, create post).

---

## 15) Implementation Roadmap

**Phase A — Backend MVP**

1. Nest project, connect Mongo, Users + Auth (register seed admin, login).
2. Posts module: create/list/get/update/delete with slug + excerpt generation.
3. Public endpoints allow only published posts.

**Phase B — Frontend MVP**

1. Home list (SSR) + Post detail (SSR) using API.
2. Admin login (client) + Protected admin routes (client guard).
3. New/Edit post forms (markdown textarea), publish toggle.

**Phase C — Extras**

- Tags page, search, comments (moderation), pagination, SEO polish.
- Replace textarea with markdown editor (e.g., `@uiw/react-md-editor`) later.

---

## 16) Wireframes (ASCII)

**Home**

```
+--------------------------------------------------+
|  Mini Blog                                       |
|  [Search____] [Tags: nextjs nestjs mongo]        |
|                                                  |
|  [Card] Title — excerpt…  [Read more]            |
|  [Card] Title — excerpt…  [Read more]            |
|                                                  |
|                      [Prev]  1  2  [Next]        |
+--------------------------------------------------+
```

**Post Detail**

```
Title (tags)
by Author • 27 Aug 2025
[cover image]
<markdown content rendered>
```

**Admin List**

```
[New Post]
| Title            | Status    | Updated        | Actions |
|------------------|-----------|----------------|---------|
| First Post       | published | 2025-08-27     | Edit ✎  |
| Draft Idea       | draft     | 2025-08-28     | Edit ✎  |
```

---

## 17) Nice-to-Haves Later

- Image upload (S3 or UploadThing), OG image generation.
- Role-based access if you add multiple authors.
- RSS feed, sitemap, analytics.
- Soft-deletes + history (versioning of posts).

---

## 18) Definition of Done (v1)

- Can create, edit, publish, and delete posts via admin UI.
- Public can view list and post detail (SSR), filter by tag, paginate.
- All inputs validated; errors surfaced to users.
- Basic tests passing; lint/format hooks in place.

---

**Next step**: pick **Phase A — Backend MVP** and I’ll generate the NestJS modules (schemas, DTOs, controller, service) + a simple seed script for an admin user. Then we wire the frontend pages.
