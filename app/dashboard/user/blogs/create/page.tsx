"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface BlogFormData {
  title: string;
  content: string;
}

const BlogCreationPage: React.FC = () => {
  const { data: session } = useSession();
  const [autoSave, setAutoSave] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      content: "",
    }
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      const payload = {
        title: data?.title,
        content: data?.content,
        authorId: session?.user?.id,
      };

      const response = await api.post(`/api/users/${session?.user?.id}/blogs`, payload);

      if (response?.data?.success) {
        toast.success("Blog post published successfully!");
        reset();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const autoSaveDraft = async (data: BlogFormData) => {
    if (!autoSave) return;
    try {
      const payload = {
        title: data?.title,
        content: data?.content,
        authorId: session?.user?.id,
      };

      await api.post(`/api/users/${session?.user?.id}/blogs/drafts`, payload);
      toast.success("Draft saved automatically!");
    } catch (error) {
      console.error("Auto-save failed", error);
    }
  };

  useEffect(() => {
    const subscription = watch((value: BlogFormData) => {
      autoSaveDraft(value);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Blog</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input {...register("title", { required: "Title is required" })} placeholder="Enter blog title" />
              {errors?.title && <p className="text-red-500 text-sm">{errors?.title?.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea {...register("content", { required: "Content is required" })} placeholder="Write your blog content here..." />
              {errors?.content && <p className="text-red-500 text-sm">{errors?.content?.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="space-y-4">
            <div className="flex items-center justify-between">
              <Button type="button" onClick={() => setAutoSave(!autoSave)}>
                {autoSave ? "Disable Autosave" : "Enable Autosave"}
              </Button>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Blog"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BlogCreationPage;