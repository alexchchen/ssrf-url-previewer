import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow internal access if a special header is present.
  // This is not a secure access control mechanism, but it is used here to demonstrate how SSRF
  // can reach endpoints that are not intended to be exposed. In a real application,
  // internal pages would only be accessible from within a private network.
  // However, this app does not have a private network setup, so this is just for demonstration.
  const internalHeader = request.headers.get("x-internal-request");

  if (path.startsWith("/internal") && internalHeader !== "1") {
    return new NextResponse("403 Forbidden - Internal Only", { status: 403 });
  }

  return NextResponse.next();
}
