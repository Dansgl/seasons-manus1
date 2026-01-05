import { PortableText as BasePortableText, type PortableTextComponents } from "@portabletext/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

interface PortableTextProps {
  value: any[];
  className?: string;
}

// Gallery image type
interface GalleryImage {
  _key?: string;
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
}

// Gallery component for different layouts
function Gallery({ value }: { value: { images?: GalleryImage[]; layout?: string; caption?: string } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = value?.images || [];
  const layout = value?.layout || "grid-2";

  // Debug log
  console.log("Gallery rendering:", { imageCount: images.length, layout, value });

  if (images.length === 0) {
    console.log("Gallery: No images found in value:", value);
    return null;
  }

  // Carousel layout
  if (layout === "carousel") {
    const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
      <figure className="my-8">
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <img
              src={urlFor(images[currentIndex]).width(1000).height(700).fit("crop").quality(90).auto("format").url()}
              alt={images[currentIndex].alt || ""}
              className="w-full h-auto object-cover"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {images[currentIndex].caption && (
          <figcaption className="text-center text-gray-600 mt-2 text-sm">
            {images[currentIndex].caption}
          </figcaption>
        )}
        {value.caption && (
          <figcaption className="text-center text-gray-500 mt-2 text-sm italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Grid and masonry layouts
  const gridClass = {
    "grid-2": "grid-cols-2",
    "grid-3": "grid-cols-2 md:grid-cols-3",
    masonry: "grid-cols-2 md:grid-cols-3",
  }[layout] || "grid-cols-2";

  // Helper to safely get image URL
  const getImageUrl = (image: GalleryImage, width: number, height: number) => {
    try {
      if (!image?.asset) {
        console.log("Gallery image missing asset:", image);
        return null;
      }
      const url = urlFor(image).width(width).height(height).fit("crop").quality(90).auto("format").url();
      console.log("Generated URL:", url);
      return url;
    } catch (err) {
      console.error("Error generating image URL:", err, image);
      return null;
    }
  };

  return (
    <figure className="my-8">
      <div className={`grid ${gridClass} gap-4`}>
        {images.map((image, idx) => {
          const imgHeight = layout === "masonry" && idx % 3 === 0 ? 800 : 400;
          const imgUrl = getImageUrl(image, 600, imgHeight);

          if (!imgUrl) return null;

          return (
            <div
              key={image._key || idx}
              className={layout === "masonry" && idx % 3 === 0 ? "row-span-2" : ""}
            >
              <img
                src={imgUrl}
                alt={image.alt || ""}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              {image.caption && (
                <p className="text-center text-gray-600 mt-1 text-xs">
                  {image.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {value.caption && (
        <figcaption className="text-center text-gray-500 mt-3 text-sm italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).quality(90).auto("format").url()}
            alt={value.alt || ""}
            className="rounded-lg shadow-md w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-gray-600 mt-2 text-sm">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    gallery: ({ value }) => <Gallery value={value} />,
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-amber-700 hover:text-amber-900 underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => <span className="line-through">{children}</span>,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-500 pl-4 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },
};

export default function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value) {
    return null;
  }

  return (
    <div className={`prose prose-lg prose-amber max-w-none ${className}`}>
      <BasePortableText value={value} components={components} />
    </div>
  );
}
