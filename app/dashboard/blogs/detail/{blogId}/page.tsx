"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import { Heart, MessageSquare, LoaderCircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const { data: session } = useSession();
  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/blogs/${blogId}`);
        setBlog(response?.data?.data);
        setComments(response?.data?.data?.comments || []);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [blogId]);

  const handleLike = async () => {
    if (!session) {
      toast.error("You need to be logged in to like this post.");
      return;
    }

    setLikeLoading(true);
    try {
      const response = await api.post(`/api/blogs/${blogId}/like`);
      if (response?.data?.success) {
        toast.success("Liked the post!");
        setBlog((prevBlog: any) => ({
          ...prevBlog,
          likes: prevBlog?.likes + 1,
        }));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("You need to be logged in to comment.");
      return;
    }

    if (commentText.trim() === "") {
      toast.error("Comment text cannot be empty.");
      return;
    }

    try {
      const response = await api.post(`/api/blogs/${blogId}/comments`, {
        text: commentText,
      });
      if (response?.data?.success) {
        toast.success("Comment added!");
        setComments((prevComments) => [...prevComments, response?.data?.data]);
        setCommentText("");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto p-4">
        {blog ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{blog?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{blog?.content}</p>
            </CardContent>
            <CardFooter className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                disabled={likeLoading}
              >
                {likeLoading ? (
                  <LoaderCircleIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
                <span className="sr-only">Like</span>
              </Button>
              <span>{blog?.likes} Likes</span>
            </CardFooter>
          </Card>
        ) : (
          <p className="text-center">Blog not found.</p>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="comment">Add a Comment</Label>
              <Textarea
                id="comment"
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e?.target?.value)}
                placeholder="Write your comment here..."
              />
              <Button type="submit">Submit Comment</Button>
            </div>
          </form>
          <div className="space-y-4">
            {comments?.map((comment: any, index: number) => (
              <Card key={index}>
                <CardContent>
                  <p>{comment?.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDetailPage;