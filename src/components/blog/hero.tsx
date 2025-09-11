export function Hero() {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Welcome to <span className="text-primary">BlogSpace</span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
          Discover insightful articles, tutorials, and thoughts from our
          community of writers. Share your own stories and connect with fellow
          creators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#posts"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Explore Posts
          </a>
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Start Writing
          </a>
        </div>
      </div>
    </section>
  );
}
