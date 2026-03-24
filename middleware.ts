import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerAxiosInstance } from "./lib/services/serveraxiosinstance";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname === "/"
  ) {
    return NextResponse.next();
  }

  const cookies = request.cookies.toString();
  const axiosInstance = createServerAxiosInstance(cookies);
  const hasXsrfToken = cookies.includes("XSRF-TOKEN");

  try {
    if (!hasXsrfToken) {
      await axiosInstance.get("/sanctum/csrf-cookie");
    }

    const response = await axiosInstance.get("/api/user");
    const user = response.data;

    if (
      (url.pathname.startsWith("/application") ||
        url.pathname.startsWith("/supplier")) &&
      !user
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (url.pathname.startsWith("/auth") && user) {
      const isSupplier = user.roles?.some(
        (role: Role) => role.name === "SUPPLIER",
      );
      const redirectUrl = isSupplier
        ? "/supplier/dashboard"
        : "/application/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (user) {
      const isSupplier = user.roles?.some(
        (role: Role) => role.name === "SUPPLIER",
      );
      if (isSupplier && url.pathname.startsWith("/application")) {
        return NextResponse.redirect(
          new URL("/supplier/dashboard", request.url),
        );
      }
    }
  } catch (error) {
    console.error("Error in middleware authentication check:", error);

    if (
      url.pathname.startsWith("/application") ||
      url.pathname.startsWith("/supplier")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}
