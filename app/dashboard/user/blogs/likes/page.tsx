"use client";

import React, { useState, useEffect } from "react";
import { Heart, LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BlogLikeFeature: React.FC = () => {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    const fetchLikeStatus = async () => {
      try {
        const response = await api.get(`/api/blogs/{blogId}/likes/${session?.user?.id}`);
        setLiked(response?.data?.data?.liked);
        setLikeCount(response?.data?.data?.likeCount);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikeStatus();
  }, [session]);

  const handleLikeToggle = async () => {
    if (!session) {
      toast.error("You must be logged in to like a blog.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/api/blogs/{blogId}/likes`, {
        userId: session?.user?.id,
      });
      if (response?.data?.success) {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Blog content goes here...</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleLikeToggle}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 ${liked ? "text-red-500" : ""}`} />
              )}
              <span className="ml-2">{liked ? "Unlike" : "Like"}</span>
            </Button>
            <span className="ml-4">{likeCount} Likes</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogLikeFeature;