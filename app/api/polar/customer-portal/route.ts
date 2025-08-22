// customer-portal/route.ts
import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_SANDBOX_ACCESS_TOKEN as string,
  getCustomerId: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    return searchParams.get("customerId") || "";
  }, // Function to resolve a Polar Customer ID
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
