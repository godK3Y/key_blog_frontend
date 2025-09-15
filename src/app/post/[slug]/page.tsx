"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService, type PostItem } from "@/services/post.service";
import { Header } from "@/components/blog/header";
import { Footer } from "@/components/blog/footer";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      const loadPost = async () => {
        try {
          const foundPost = await PostService.findOneBySlug(slug);
          if (foundPost && foundPost.published) {
            setPost(foundPost);
          } else {
            setNotFound(true);
          }
        } catch (error) {
          console.error("Failed to load post:", error);
          setNotFound(true);
        } finally {
          setIsLoading(false);
        }
      };

      loadPost();
    } else {
      setIsLoading(false);
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="pl-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </div>

          {/* Post header */}
          <header className="mb-8 pb-8 border-b">
            <div className="mb-4">
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  By{" "}
                  {typeof post.author === "string"
                    ? post.author
                    : post.author?.name || "Unknown"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.createdAt &&
                    format(new Date(post.createdAt), "MMMM d, yyyy")}{" "}
                  •{" "}
                  {post.createdAt &&
                    formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                </span>
              </div>
            </div>

            {post.content && (
              <p className="text-xl text-muted-foreground mt-6 leading-relaxed text-balance">
                {post.content.substring(0, 200)}...
              </p>
            )}
          </header>

          {/* Post content */}
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Post footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {post.updatedAt &&
                  format(new Date(post.updatedAt), "MMMM d, yyyy")}
              </div>

              <Button variant="outline" onClick={() => router.push("/")}>
                View More Posts
              </Button>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
