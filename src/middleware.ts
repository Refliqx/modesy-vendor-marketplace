import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Match root path
    "/",
    // Match locales (en, ar) with optional path suffix
    "/(ar|en)/:path*",
    // Exclude static assets/internal routes, but match everything else
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
