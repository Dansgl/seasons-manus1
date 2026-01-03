export function SkincareStandard() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image */}
      <div className="bg-[#F5F1ED] p-12 md:p-16 flex items-center justify-center min-h-[500px]">
        <div className="relative w-full max-w-md">
          <img 
            src="https://images.unsplash.com/photo-1609468826499-0ec9af2fc7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFwcGx5aW5nJTIwc2tpbmNhcmV8ZW58MXx8fHwxNzY3MzMzNDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Woman with skincare"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Right Side - Dark Brown Background with Text */}
      <div className="bg-[#5C1A11] p-12 md:p-16 flex items-center justify-center min-h-[500px]">
        <div className="max-w-md text-center">
          <h2 className="text-white text-3xl md:text-4xl mb-6">
            The skincare standard
          </h2>
          <p className="text-white/90 text-base leading-relaxed">
            Cleanse, brighten, buff, and protect. We've dialled in these skincare staples that keep you glowing. Made with only the ingredients you need, and nothing extra.
          </p>
        </div>
      </div>
    </section>
  );
}
