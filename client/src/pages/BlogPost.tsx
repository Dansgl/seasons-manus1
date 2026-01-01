import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, urlFor, type SanityPost } from "@/lib/sanity";
import PortableText from "@/components/PortableText";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery<SanityPost>({
    queryKey: ["sanity", "post", params.slug],
    queryFn: () => fetchPostBySlug(params.slug || ""),
    enabled: !!params.slug,
  });

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

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt || "";
  const ogImageUrl = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined;

  return (
    <>
      <Helmet>
        <title>{metaTitle} | Seasons Blog</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        {post.seo?.canonicalUrl ? (
          <link rel="canonical" href={post.seo.canonicalUrl} />
        ) : (
          <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
        )}
        {post.publishedAt && (
          <meta property="article:published_time" content={post.publishedAt} />
        )}
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
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <img
                    src={urlFor(post.author.image).width(32).height(32).url()}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>by {post.author.name}</span>
              </div>
            )}
          </div>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.categories.map((category) => (
                <Badge key={category._id} variant="secondary">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(800).auto("format").url()}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg mb-8 object-cover max-h-96"
            />
          )}

          {/* Content */}
          {post.body && <PortableText value={post.body} />}

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
