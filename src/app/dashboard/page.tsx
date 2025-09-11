"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostService, type PostItem } from "@/services/post.service";
import { PostForm } from "@/components/blog/post-form";
import { PostList } from "@/components/blog/post-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockUser = { id: "demo-user", name: "Demo User" };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await PostService.findAll({ author: mockUser.id });
      setPosts(response.items);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setPosts([]);
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      await PostService.create({
        title: data.title,
        slug: slug,
        content: data.content,
        published: data.published,
        tags: [],
      });
      await loadPosts();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create post:", error);
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
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      await PostService.update(editingPost._id, {
        title: data.title,
        slug: slug,
        content: data.content,
        published: data.published,
        tags: editingPost.tags || [],
      });
      await loadPosts();
      setEditingPost(null);
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post: PostItem) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await PostService.remove(post._id);
        await loadPosts();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleViewPost = (post: PostItem) => {
    router.push(`/post/${post.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {mockUser.name}
            </span>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              View Blog
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
