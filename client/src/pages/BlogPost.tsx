import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, getPostImageUrl, urlFor, type SanityPost } from "@/lib/sanity";
import PortableText from "@/components/PortableText";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { format } from "date-fns";
import { Calendar, ArrowLeft, User } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery<SanityPost>({
    queryKey: ["sanity", "post", params.slug],
    queryFn: () => fetchPostBySlug(params.slug || ""),
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navigation />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8 rounded-lg" />
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
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-neutral-900 mb-4">Post not found</h1>
            <Link href="/blog">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getPostImageUrl(post, { width: 800, height: 400 });

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      <article className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-3xl">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <Badge key={category._id} variant="secondary" className="text-xs">
                {category.title}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </span>
          )}
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image ? (
                <img
                  src={urlFor(post.author.image).width(32).height(32).url()}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <div className="aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden mb-8">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        {post.body && (
          <div className="prose prose-neutral prose-lg max-w-none">
            <PortableText value={post.body} />
          </div>
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.href
              )}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 text-sm"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 text-sm"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                window.location.href
              )}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
