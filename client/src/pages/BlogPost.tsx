import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.postBySlug.useQuery({ slug: params.slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
          <Link href="/blog">
            <span className="text-amber-700 hover:text-amber-900">← Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || post.title} | Seasons Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.excerpt || post.content.substring(0, 160)}
        />
        <meta property="og:type" content="article" />
        {post.ogImage && <meta property="og:image" content={post.ogImage} />}
        {post.featuredImage && !post.ogImage && <meta property="og:image" content={post.featuredImage} />}
        {post.canonicalUrl ? (
          <link rel="canonical" href={post.canonicalUrl} />
        ) : (
          <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
        )}
        <meta property="article:published_time" content={post.publishedAt?.toString()} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Back link */}
          <Link href="/blog">
            <span className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            )}
          </div>

          {/* Categories & Tags */}
          {(post.categories?.length > 0 || post.tags?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.categories?.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
              {post.tags?.map((tag) => (
                <Badge key={tag.id} variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg mb-8 object-cover max-h-96"
            />
          )}

          {/* Content */}
          <div
            className="prose prose-lg prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  window.location.href
                )}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
