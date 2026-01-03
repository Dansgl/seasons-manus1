export function Philosophy() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Lavender Background with Text */}
      <div className="bg-[#D4B8F0] p-12 md:p-16 flex items-center justify-center min-h-[400px]">
        <div className="max-w-md">
          <h2 className="text-[#5C1A11] text-3xl md:text-4xl mb-4">
            Our philosophy
          </h2>
          <p className="text-[#5C1A11] text-base">
            Skincare that actually works for your skin. Made with only clean, carefully-selected ingredients that leave acne and aging glowing.
          </p>
        </div>
      </div>

      {/* Right Side - Product Image */}
      <div className="bg-[#F5F1ED] p-12 md:p-16 flex items-center justify-center min-h-[400px]">
        <div className="relative w-full max-w-md">
          <img 
            src="https://images.unsplash.com/photo-1614159102625-41ceafda13e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwZmxhdGxheXxlbnwxfHx8fDE3NjczNjExODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Skincare products"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
