import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.posts.useQuery();

  return (
    <>
      <Helmet>
        <title>Blog | Seasons - Luxury Baby Clothing</title>
        <meta
          name="description"
          content="Discover tips on sustainable baby fashion, parenting advice, and the latest from Seasons luxury baby clothing subscription."
        />
        <meta property="og:title" content="Blog | Seasons" />
        <meta
          property="og:description"
          content="Discover tips on sustainable baby fashion, parenting advice, and the latest from Seasons."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        {/* Header */}
        <div className="bg-amber-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Seasons Blog</h1>
            <p className="text-amber-100 text-lg max-w-2xl mx-auto">
              Tips on sustainable baby fashion, parenting advice, and the latest from our luxury baby clothing
              subscription.
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600">No blog posts yet</h2>
              <p className="text-gray-500 mt-2">Check back soon for articles!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-48 w-full object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl hover:text-amber-700 transition-colors">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{post.excerpt || post.content.substring(0, 150)}...</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="container mx-auto px-4 pb-12 text-center">
          <Link href="/">
            <span className="text-amber-700 hover:text-amber-900 font-medium">← Back to Home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
