// Comment Item Component
import { type CommentItem } from "@/services/comments.service";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Reply } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function Comments({
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
