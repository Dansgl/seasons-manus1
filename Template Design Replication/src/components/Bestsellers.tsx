import { Plus } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Balm Trio',
    price: '$55.00',
    originalPrice: '$68.00',
    image: 'https://images.unsplash.com/photo-1629051192969-c1502f46135e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwY3JlYW0lMjBtb2lzdHVyaXplciUyMHByb2R1Y3R8ZW58MXx8fHwxNzY3NDQxMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
  },
  {
    id: 2,
    name: 'Age Serum',
    price: '$31.00',
    image: 'https://images.unsplash.com/photo-1765149431346-e7de7d4a3198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlJTIwcHVycGxlfGVufDF8fHx8MTc2NzQ0MTM2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Rich Brightening Mask',
    price: '$28.00',
    image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG1hc2slMjBzaGVldHxlbnwxfHx8fDE3Njc0NDEzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'Lip Balm',
    price: '$19.00',
    image: 'https://images.unsplash.com/photo-1714387998948-bd124e5580b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXAlMjBiYWxtJTIwcHJvZHVjdHxlbnwxfHx8fDE3Njc0NDEzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 5,
    name: 'Face Serum',
    price: '$80.00',
    originalPrice: '$95.00',
    image: 'https://images.unsplash.com/photo-1712145176765-cc1a308331e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwc2VydW0lMjBkcm9wcGVyJTIwcmVkfGVufDF8fHx8MTc2NzQ0MTM3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
  },
];

export function Bestsellers() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#5C1A11] text-3xl md:text-4xl mb-12">
          Bestsellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#FF3C1F] text-white px-3 py-1 rounded-full text-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative aspect-square bg-[#F5F1ED] rounded-lg overflow-hidden mb-4">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Add Button - Shows on Hover */}
                <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-[#5C1A11] rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-[#5C1A11] text-base mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#5C1A11]">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
