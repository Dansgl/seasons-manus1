export function Hero() {
  return (
    <section className="bg-[#F5F1ED] py-16 px-6 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Large Logo and Tagline */}
        <div>
          <h1 className="text-[#FF3C1F] text-[120px] md:text-[180px] leading-[0.85] tracking-tighter mb-4" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
            PITCH
          </h1>
          <p className="text-[#B85C4A] text-lg">
            Skincare, simplified.
          </p>
        </div>

        {/* Right Side - Image and Text */}
        <div className="relative">
          <div className="bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
          </div>
          <div className="mt-6 text-right">
            <p className="text-[#B85C4A] text-sm">
              Only clean, caring ingredients,
              <br />
              and nothing more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
