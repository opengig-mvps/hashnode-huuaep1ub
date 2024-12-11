"use client";

import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/blogs?page=${currentPage}`);
        setBlogs(res?.data?.data?.blogs);
        setTotalPages(res?.data?.data?.totalPages);
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const viewBlogDetails = (id: string) => {
    router.push(`/dashboard/blogs/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircleIcon className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog: any) => (
              <Card
                key={blog?.id}
                className="cursor-pointer"
                onClick={() => viewBlogDetails(blog?.id)}
              >
                <CardHeader>
                  <CardTitle>{blog?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{blog?.snippet}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default BlogListPage;