import { useQuery } from "@tanstack/react-query";
import { fetchBrands, urlFor, type SanityBrand } from "@/lib/sanity";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Loader2, Building2 } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Brands() {
  const { data: brands, isLoading } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4">Our Brands</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We partner with the finest European baby clothing brands, each selected for their commitment
            to quality, sustainability, and timeless design.
          </p>
        </div>

        {/* Brands Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-8">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </Card>
            ))}
          </div>
        ) : brands?.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-neutral-900 mb-2">No brands yet</h2>
            <p className="text-neutral-600">Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brands?.map((brand) => (
              <Link key={brand._id} href={`/catalog?brand=${encodeURIComponent(brand.name)}`}>
                <Card className="group p-8 hover:shadow-lg transition-all cursor-pointer border-neutral-200 h-full">
                  <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden group-hover:ring-2 ring-neutral-900 transition-all">
                      {brand.logo ? (
                        <img
                          src={urlFor(brand.logo).width(96).height(96).auto("format").url()}
                          alt={brand.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-3xl font-light text-neutral-400">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h2 className="text-xl font-medium text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                      {brand.name}
                    </h2>

                    {/* Description */}
                    {brand.description && (
                      <p className="text-sm text-neutral-600 line-clamp-3">
                        {brand.description}
                      </p>
                    )}

                    {/* CTA */}
                    <span className="mt-4 text-sm text-neutral-500 group-hover:text-neutral-900 transition-colors">
                      View Collection →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Brand Story Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light text-neutral-900 mb-4">
              Why We Choose These Brands
            </h2>
            <p className="text-neutral-600 mb-8">
              Every brand in our collection meets our rigorous standards for quality, ethics, and design.
              We look for partners who share our vision of sustainable fashion and understand that
              baby clothes should be made to last – even if they're only worn for a few months.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Quality Materials</h3>
                <p className="text-sm text-neutral-600">
                  Organic cottons, natural fibers, and fabrics that are gentle on sensitive skin.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Ethical Production</h3>
                <p className="text-sm text-neutral-600">
                  Fair wages, safe working conditions, and transparent supply chains.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Timeless Design</h3>
                <p className="text-sm text-neutral-600">
                  Classic aesthetics that transcend trends and pass beautifully between children.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
