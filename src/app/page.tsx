"use client";

import { useEffect, useState } from "react";
import { PostService, type PostItem } from "@/services/post.service";
import { Header } from "@/components/blog/header";
import { Hero } from "@/components/blog/hero";
import { PostList } from "@/components/blog/post-list";
import { Footer } from "@/components/blog/footer";
import { useRouter } from "next/navigation";
import { PostForm } from "@/components/blog/post-form";

export default function HomePage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await PostService.findAll({ published: "true" });
        setPosts(response.items);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleViewPost = (post: PostItem) => {
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
        {/* <Hero /> */}

        <section id="posts" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">new posts today</h2>
              <p className="text-muted-foreground">
                Discover the latest articles and insights from our community
              </p>
            </div>

            {posts.length > 0 ? (
              <PostList posts={posts} onView={handleViewPost} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No posts published today.
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
