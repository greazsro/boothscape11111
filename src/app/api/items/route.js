import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma instance

export async function GET() {
  try {
    // Fetch items from the database
    const items = await prisma.items.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return NextResponse.json({ message: "Failed to fetch items" }, { status: 500 });
  }
}
