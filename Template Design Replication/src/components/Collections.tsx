export function Collections() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* The Hydration Collection */}
      <div className="bg-[#5C1A11] p-12 md:p-16 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
        <div className="relative z-10 mb-8 w-full max-w-sm">
          <div className="aspect-square rounded-full overflow-hidden bg-gradient-to-br from-teal-300 to-cyan-400 relative">
            <img 
              src="https://images.unsplash.com/photo-1562016600-ece13e8ba570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2wlMjB3YXRlcnxlbnwxfHx8fDE3NjczNDgyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Pool water"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Cream Jar in Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1763503836825-97f5450d155a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNyZWFtJTIwamFyJTIwd2hpdGV8ZW58MXx8fHwxNzY3NDQxMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Cream jar"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-white text-2xl md:text-3xl text-center">
          The hydration collection
        </h2>
      </div>

      {/* Bundles */}
      <div className="bg-[#D4B8F0] p-12 md:p-16 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative mb-8 w-full max-w-sm">
          <div className="aspect-square rounded-[40%] bg-[#F5F1ED] flex items-center justify-center p-8 relative overflow-hidden">
            {/* Abstract shapes background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#E8D5F0] rounded-[40%] opacity-60"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#E8D5F0] rounded-[40%] opacity-60"></div>
              </div>
            </div>
            
            {/* Product bottles */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <img 
                src="https://images.unsplash.com/photo-1667872782781-0b1eb070b018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGJvdHRsZXMlMjBwaW5rJTIwYmVpZ2V8ZW58MXx8fHwxNzY3NDQxMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Skincare bottles"
                className="w-48 h-auto object-contain"
              />
            </div>
          </div>
        </div>
        <h2 className="text-[#5C1A11] text-2xl md:text-3xl text-center">
          Bundles
        </h2>
      </div>
    </section>
  );
}
