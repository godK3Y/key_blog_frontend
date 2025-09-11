export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">BlogSpace</h3>
            <p className="text-sm text-muted-foreground">
              A modern blogging platform built with Next.js and TypeScript.
              Share your thoughts and connect with the community.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="hover:text-foreground transition-colors"
                >
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">About</h4>
            <p className="text-sm text-muted-foreground">
              Built as a demo project showcasing modern web development with
              authentication and content management.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BlogSpace. Built with Next.js and shadcn/ui.</p>
        </div>
      </div>
    </footer>
  );
}
