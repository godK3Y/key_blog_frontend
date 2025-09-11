"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { BlogService, type BlogPost } from "@/lib/blog";
import { PostForm } from "@/components/blog/post-form";
import { PostList } from "@/components/blog/post-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockUser = { id: "demo-user", name: "Demo User" };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      // Initialize demo posts on first load
      BlogService.initializeDemoPosts();
      loadPosts();
    }
  }, [user]);

  const loadPosts = () => {
    if (user) {
      const userPosts = BlogService.getPostsByAuthor(user.id);
      setPosts(userPosts);
    } else {
      const userPosts = BlogService.getPostsByAuthor(mockUser.id);
      setPosts(userPosts);
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      BlogService.createPost({
        ...data,
        author: { id: user.id, name: user.name },
      });
      loadPosts();
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (data: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }) => {
    if (!editingPost) return;

    setIsSubmitting(true);
    try {
      BlogService.updatePost(editingPost.id, data);
      loadPosts();
      setEditingPost(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = (post: BlogPost) => {
    if (confirm("Are you sure you want to delete this post?")) {
      BlogService.deletePost(post.id);
      loadPosts();
    }
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || mockUser.name}
            </span>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              View Blog
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm || editingPost ? (
          <PostForm
            post={editingPost || undefined}
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
            isLoading={isSubmitting}
          />
        ) : (
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Posts</h2>
                <Button onClick={() => setShowForm(true)}>
                  Create New Post
                </Button>
              </div>

              <PostList
                posts={posts}
                onEdit={setEditingPost}
                onDelete={handleDeletePost}
                onView={handleViewPost}
                showActions={true}
              />
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{posts.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Published</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {posts.filter((p) => p.published).length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Drafts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {posts.filter((p) => !p.published).length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
