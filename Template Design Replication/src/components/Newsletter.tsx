export function Newsletter() {
  return (
    <section className="bg-[#FF3C1F] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            Join the club
          </h2>
          <p className="text-white/90 text-base">
            See what's new, hear about exclusive launches, and be the first to receive discounts.
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-full bg-white/10 border-2 border-white text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#5C1A11] text-white hover:bg-[#4A1509] transition-colors whitespace-nowrap"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}
