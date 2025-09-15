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
    <div className="divide-y divide-border/40">
      {posts.map((post) => (
        <article
          key={post._id}
          className="py-8 hover:bg-muted/20 transition-colors px-4 -mx-4 rounded-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {(typeof post.author === "string"
                    ? post.author
                    : post.author?.name || "Unknown"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {typeof post.author === "string"
                    ? post.author
                    : post.author?.name || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {post.createdAt &&
                    formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}{" "}
                  • 5 min read
                </p>
              </div>
            </div>
            {post.published ? null : (
              <Badge variant="secondary" className="text-xs">
                Draft
              </Badge>
            )}
          </div>

          <div className="mb-4">
            <h2
              className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight hover:text-foreground/80 cursor-pointer"
              onClick={() => onView?.(post)}
            >
              {post.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed line-clamp-2">
              {post.content.substring(0, 200)}...
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">👏 12</span>
              <span className="text-xs text-muted-foreground">💬 3</span>
            </div>

            {showActions ? (
              <div className="flex gap-2">
                {onView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(post)}
                  >
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(post)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(post)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ) : (
              onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => onView(post)}
                >
                  Read more
                </Button>
              )
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
