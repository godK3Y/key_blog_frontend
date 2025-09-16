"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService, type PostItem } from "@/services/post.service";
import {
  CommentsService,
  type CommentItem,
  type CreateCommentRequest,
} from "@/services/comments.service";
import { AuthService } from "@/services/auth.service";
import { Header } from "@/components/blog/header";
import { Footer } from "@/components/blog/footer";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  User,
  MessageCircle,
  Heart,
  Reply,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [user, setUser] = useState<{ userId: string; email: string } | null>(
    null
  );

  // Load user authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AuthService.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Load post and comments
  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      const loadPost = async () => {
        try {
          const foundPost = await PostService.findOneBySlug(slug);
          if (foundPost && foundPost.published) {
            setPost(foundPost);
            // Load comments for this post
            loadComments(foundPost._id);
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

  const loadComments = async (postId: string) => {
    setIsLoadingComments(true);
    try {
      const [commentsData, countData] = await Promise.all([
        CommentsService.findByPost(postId, { approved: true }),
        CommentsService.getCommentCount(postId, true),
      ]);
      setComments(commentsData.items);
      setCommentCount(countData.count);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const commentData: CreateCommentRequest = {
        content: newComment.trim(),
        post: post._id,
      };

      await CommentsService.create(commentData);
      setNewComment("");
      // Reload comments
      loadComments(post._id);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!post || !replyContent.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const commentData: CreateCommentRequest = {
        content: replyContent.trim(),
        post: post._id,
        parentComment: parentCommentId,
      };

      await CommentsService.create(commentData);
      setReplyContent("");
      setReplyingTo(null);
      // Reload comments
      loadComments(post._id);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!user) {
      router.push(
        "/auth?redirect=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    try {
      await CommentsService.toggleLike(commentId);
      // Reload comments to get updated like count
      if (post) loadComments(post._id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

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

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Comments ({commentCount})</h2>
            </div>

            {/* Add Comment Form */}
            {user ? (
              <div className="mb-8 p-6 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4 min-h-[100px]"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            ) : (
              <div className="mb-8 p-6 border rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground mb-4">
                  Please log in to leave a comment
                </p>
                <Button
                  onClick={() =>
                    router.push(
                      "/auth?redirect=" +
                        encodeURIComponent(window.location.pathname)
                    )
                  }
                >
                  Log In
                </Button>
              </div>
            )}

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading comments...
                </p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    user={user}
                    onReply={() => setReplyingTo(comment._id)}
                    onLike={() => handleToggleLike(comment._id)}
                    isReplying={replyingTo === comment._id}
                    replyContent={replyContent}
                    onReplyContentChange={setReplyContent}
                    onSubmitReply={() => handleSubmitReply(comment._id)}
                    onCancelReply={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    isSubmitting={isSubmittingComment}
                  />
                ))}
              </div>
            )}
          </section>

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

// Comment Item Component
function CommentItem({
  comment,
  user,
  onReply,
  onLike,
  isReplying,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply,
  isSubmitting,
}: {
  comment: CommentItem;
  user: { userId: string; email: string } | null;
  onReply: () => void;
  onLike: () => void;
  isReplying: boolean;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isSubmitting: boolean;
}) {
  const author =
    typeof comment.author === "string"
      ? { name: comment.author }
      : comment.author;
  const isLiked = user && comment.likedBy?.includes(user.userId);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{author?.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {comment.createdAt &&
                formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm leading-relaxed">{comment.content}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onLike} className="h-8 px-2">
          <Heart
            className={`w-4 h-4 mr-1 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {comment.likes || 0}
        </Button>

        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReply}
            className="h-8 px-2"
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && user && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              Replying to {author?.name || "Anonymous"}
            </span>
          </div>
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            className="mb-3 min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSubmitReply}
              disabled={!replyContent.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelReply}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
