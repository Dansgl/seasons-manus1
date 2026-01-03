/**
 * BlogPostV6 - Single blog post page with V6 design system
 */

import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, getPostImageUrl, urlFor, type SanityPost } from "@/lib/sanity";
import PortableText from "@/components/PortableText";
import { Link, useParams } from "wouter";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowLeft, User, Twitter, Facebook, Linkedin } from "lucide-react";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function BlogPostV6() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery<SanityPost>({
    queryKey: ["sanity", "post", params.slug],
    queryFn: () => fetchPostBySlug(params.slug || ""),
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4" style={{ color: C.darkBrown }}>
              Post not found
            </h1>
            <Link href="/blog">
              <button
                className="flex items-center gap-2 px-6 py-2  text-sm font-medium border-2 hover:opacity-70 transition-opacity mx-auto"
                style={{ borderColor: C.darkBrown, color: C.darkBrown }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = getPostImageUrl(post, { width: 800, height: 400 });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: C.textBrown }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <span
                  key={category._id}
                  className="px-3 py-1  text-xs font-medium"
                  style={{ backgroundColor: C.lavender, color: C.darkBrown }}
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-8" style={{ color: C.textBrown }}>
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" style={{ color: C.red }} />
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <img
                    src={urlFor(post.author.image).width(32).height(32).url()}
                    alt={post.author.name}
                    className="w-6 h-6 "
                  />
                ) : (
                  <User className="w-4 h-4" style={{ color: C.red }} />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="aspect-[2/1]  overflow-hidden mb-8" style={{ backgroundColor: C.white }}>
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.body && (
            <div
              className="prose prose-lg max-w-none"
              style={{
                "--tw-prose-body": C.textBrown,
                "--tw-prose-headings": C.darkBrown,
                "--tw-prose-links": C.red,
              } as React.CSSProperties}
            >
              <PortableText value={post.body} />
            </div>
          )}

          {/* Share */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: C.lavender }}>
            <h3 className="text-lg font-medium mb-4" style={{ color: C.darkBrown }}>
              Share this article
            </h3>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10  flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ backgroundColor: C.lavender }}
              >
                <Twitter className="w-4 h-4" style={{ color: C.darkBrown }} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10  flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ backgroundColor: C.lavender }}
              >
                <Facebook className="w-4 h-4" style={{ color: C.darkBrown }} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  window.location.href
                )}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10  flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ backgroundColor: C.lavender }}
              >
                <Linkedin className="w-4 h-4" style={{ color: C.darkBrown }} />
              </a>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
