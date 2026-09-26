export type GetListingsParams = {
  category?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function getListings(params?: GetListingsParams) {
  try {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.set("category", params.category);
    if (params?.locationValue) searchParams.set("locationValue", params.locationValue);
    if (params?.minPrice !== undefined) searchParams.set("minPrice", String(params.minPrice));
    if (params?.maxPrice !== undefined) searchParams.set("maxPrice", String(params.maxPrice));

    const query = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/listings${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("getListings failed:", error);
    throw new Error("Failed to fetch listings");
  }
}