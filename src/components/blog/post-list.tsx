"use client";

import type { PostItem } from "@/services/post.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface PostListProps {
  posts: PostItem[];
  onEdit?: (post: PostItem) => void;
  onDelete?: (post: PostItem) => void;
  onView?: (post: PostItem) => void;
  showActions?: boolean;
}

export function PostList({
  posts,
  onEdit,
  onDelete,
  onView,
  showActions = false,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>
                  By{" "}
                  {typeof post.author === "string"
                    ? post.author
                    : post.author?.name || "Unknown"}{" "}
                  •{" "}
                  {post.createdAt &&
                    formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {post.content.substring(0, 150)}...
            </p>

            {showActions && (
              <div className="flex gap-2">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(post)}
                  >
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(post)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(post)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}

            {!showActions && onView && (
              <Button variant="outline" onClick={() => onView(post)}>
                Read More
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
