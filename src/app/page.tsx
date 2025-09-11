"use client";

import { useEffect, useState } from "react";
import { BlogService, type BlogPost } from "@/lib/blog";
import { Header } from "@/components/blog/header";
import { Hero } from "@/components/blog/hero";
import { PostList } from "@/components/blog/post-list";
import { Footer } from "@/components/blog/footer";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize demo posts and load published posts
    BlogService.initializeDemoPosts();
    const publishedPosts = BlogService.getPublishedPosts();
    setPosts(
      publishedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setIsLoading(false);
  }, []);

  const handleViewPost = (post: BlogPost) => {
    router.push(`/post/${post.slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        <section id="posts" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest Posts</h2>
              <p className="text-muted-foreground">
                Discover the latest articles and insights from our community
              </p>
            </div>

            {posts.length > 0 ? (
              <PostList posts={posts} onView={handleViewPost} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No posts published yet.
                </p>
                <a
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Be the first to write!
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
