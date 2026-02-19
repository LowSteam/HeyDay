import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        menuItems: {
          orderBy: [{ category: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            description: true,
            ingredients: true,
            price: true,
            category: true,
            tags: true,
            restaurantId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Failed to fetch restaurant menu:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
