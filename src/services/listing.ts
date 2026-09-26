import prisma from "@/lib/prisma";

export type GetListingsParams = {
  category?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function getListings(params?: GetListingsParams) {
  try {
    const { category, locationValue, minPrice, maxPrice } = params ?? {};

    const listings = await prisma.listing.findMany({
      where: {
        ...(category && { category }),
        ...(locationValue && { locationValue }),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined ? { gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return listings;
  } catch (error) {
    console.error("getListings failed:", error);
    throw new Error("Failed to fetch listings");
  }
}