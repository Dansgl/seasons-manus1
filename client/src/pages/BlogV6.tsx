/**
 * BlogV6 - Blog page with V6 design system
 */

import { useQuery } from "@tanstack/react-query";
import { fetchPosts, getPostImageUrl, type SanityPost } from "@/lib/sanity";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2, FileText } from "lucide-react";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function BlogV6() {
  const { data: posts, isLoading } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl mb-4" style={{ color: C.darkBrown }}>
              Blog
            </h1>
            <p style={{ color: C.textBrown }}>
              Povești, sfaturi și inspirație pentru părinți moderni
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: C.lavender }} />
              <h2 className="text-xl font-medium mb-2" style={{ color: C.darkBrown }}>
                No blog posts yet
              </h2>
              <p style={{ color: C.textBrown }}>Check back soon for articles!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {posts?.map((post) => {
                const imageUrl = getPostImageUrl(post, { width: 400, height: 300 });

                return (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <div
                      className="group  overflow-hidden h-full flex flex-col cursor-pointer transition-all hover:shadow-lg"
                      style={{ backgroundColor: C.white }}
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] relative overflow-hidden" style={{ backgroundColor: C.beige }}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12" style={{ color: C.lavender }} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Date */}
                        {post.publishedAt && (
                          <p className="text-xs mb-2" style={{ color: C.red }}>
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </p>
                        )}

                        {/* Title */}
                        <h2
                          className="text-lg font-medium mb-2 group-hover:opacity-70 transition-colors line-clamp-2"
                          style={{ color: C.darkBrown }}
                        >
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-sm line-clamp-2 flex-grow" style={{ color: C.textBrown }}>
                          {post.excerpt || "Citește mai mult..."}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
