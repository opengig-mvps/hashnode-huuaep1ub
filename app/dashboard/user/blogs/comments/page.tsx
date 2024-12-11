"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios, { isAxiosError } from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, LoaderCircleIcon } from "lucide-react";

const CommentsPage: React.FC = () => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get('/api/blogs/comments');
        setComments(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, []);

  const submitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const payload = { comment: newComment, userId: session?.user?.id };
      const res = await axios.post('/api/blogs/comments', payload);

      if (res?.data?.success) {
        toast.success("Comment submitted successfully");
        setComments([...comments, res?.data?.data]);
        setNewComment("");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Failed to submit comment");
      } else {
        console.error("Unexpected error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await axios.delete(`/api/blogs/comments/${commentId}`);

      if (res?.data?.success) {
        toast.success("Comment deleted successfully");
        setComments(comments?.filter(comment => comment?.id !== commentId));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Failed to delete comment");
      } else {
        console.error("Unexpected error", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div className="space-y-6">
        {comments?.map(comment => (
          <Card key={comment?.id}>
            <CardHeader>
              <CardTitle>{comment?.user?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{comment?.comment}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your comment.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() => deleteComment(comment?.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
        <Textarea
          value={newComment}
          onChange={(e: any) => setNewComment(e?.target?.value)}
          placeholder="Write your comment here..."
        />
        <Button className="mt-4" onClick={submitComment} disabled={loading}>
          {loading ? <LoaderCircleIcon className="animate-spin" /> : "Submit Comment"}
        </Button>
      </div>
    </div>
  );
};

export default CommentsPage;