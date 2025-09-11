// Blog post management system using localStorage for demo purposes
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  published: boolean;
  slug: string;
}

export class BlogService {
  private static readonly POSTS_KEY = "blog_posts";

  static getAllPosts(): BlogPost[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.POSTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getPublishedPosts(): BlogPost[] {
    return this.getAllPosts().filter((post) => post.published);
  }

  static getPostBySlug(slug: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find((post) => post.slug === slug) || null;
  }

  static getPostsByAuthor(authorId: string): BlogPost[] {
    return this.getAllPosts().filter((post) => post.author.id === authorId);
  }

  static createPost(
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "slug">
  ): BlogPost {
    const posts = this.getAllPosts();
    const slug = this.generateSlug(postData.title);

    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    posts.push(newPost);
    this.savePosts(posts);
    return newPost;
  }

  static updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, "id" | "createdAt" | "author">>
  ): BlogPost | null {
    const posts = this.getAllPosts();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) return null;

    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update slug if title changed
    if (updates.title) {
      updatedPost.slug = this.generateSlug(updates.title);
    }

    posts[index] = updatedPost;
    this.savePosts(posts);
    return updatedPost;
  }

  static deletePost(id: string): boolean {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);

    if (filteredPosts.length === posts.length) return false;

    this.savePosts(filteredPosts);
    return true;
  }

  private static savePosts(posts: BlogPost[]): void {
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Initialize with some demo posts
  static initializeDemoPosts(): void {
    const existingPosts = this.getAllPosts();
    if (existingPosts.length > 0) return;

    const demoPosts: BlogPost[] = [
      {
        id: "1",
        title: "Welcome to Our Blog",
        content: `# Welcome to Our Blog

This is our first blog post! We're excited to share our thoughts and ideas with you.

## What to Expect

- Regular updates on web development
- Tips and tricks for developers
- Industry insights and trends

Stay tuned for more content!`,
        excerpt:
          "Welcome to our blog! This is our first post where we introduce what you can expect from our content.",
        author: { id: "1", name: "Demo User" },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        published: true,
        slug: "welcome-to-our-blog",
      },
      {
        id: "2",
        title: "Getting Started with Next.js",
        content: `# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications a breeze.

## Key Features

- **Server-side rendering** for better performance
- **File-based routing** for easy navigation
- **Built-in optimization** for images and fonts
- **API routes** for backend functionality

Let's dive into how to get started!`,
        excerpt:
          "Learn the basics of Next.js and why it's become the go-to framework for React developers.",
        author: { id: "2", name: "Admin" },
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
        published: true,
        slug: "getting-started-with-nextjs",
      },
    ];

    this.savePosts(demoPosts);
  }
}
