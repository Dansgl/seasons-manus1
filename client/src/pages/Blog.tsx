import { useQuery } from "@tanstack/react-query";
import { fetchPosts, getPostImageUrl, type SanityPost } from "@/lib/sanity";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-neutral-900 mb-2">From Our Blog</h1>
          <p className="text-neutral-600">Stories, tips, and insights on sustainable parenting</p>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-neutral-900 mb-2">No blog posts yet</h2>
            <p className="text-neutral-600">Check back soon for articles!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {posts?.map((post) => {
              const imageUrl = getPostImageUrl(post, { width: 400, height: 300 });

              return (
                <Link key={post._id} href={`/blog/${post.slug}`}>
                  <Card className="group overflow-hidden border-neutral-200 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-12 h-12 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Date */}
                      {post.publishedAt && (
                        <p className="text-xs text-neutral-500 mb-2">
                          {format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </p>
                      )}

                      {/* Title */}
                      <h2 className="text-lg font-medium text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-neutral-600 line-clamp-2 flex-grow">
                        {post.excerpt || "Read more..."}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
