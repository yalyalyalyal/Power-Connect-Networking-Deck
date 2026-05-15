import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-glow text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <Link to="/" className="mt-6 inline-block rounded-full gradient-primary px-5 py-2 text-sm font-bold text-primary-foreground glow">
          Back to deck
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full gradient-primary px-5 py-2 text-sm font-bold text-primary-foreground glow"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "TEST-Connect" },
      { name: "description", content: "TEST TEST TEST" },
      { name: "theme-color", content: "#141040" },
      { property: "og:title", content: "TEST-Connect" },
      { name: "twitter:title", content: "TEST-Connect" },
      { property: "og:description", content: "TEST TEST TEST" },
      { name: "twitter:description", content: "TEST TEST TEST" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/694f7e8e-dabf-4da6-87c1-421a2f5550cc/id-preview-5914d6ca--3f09c9db-29ea-4564-820e-e77a33c30753.lovable.app-1778836818757.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/694f7e8e-dabf-4da6-87c1-421a2f5550cc/id-preview-5914d6ca--3f09c9db-29ea-4564-820e-e77a33c30753.lovable.app-1778836818757.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
