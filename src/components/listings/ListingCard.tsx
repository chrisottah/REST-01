"use client";

import useCountries from "@/custom-hooks/useCountries";

import Image from "next/image";
import HeartButton from "../favorites/HeartButton";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { format } from "date-fns";
import CancelReservationButton from "../reservations/CancelReservationButton";

interface ListingCardProps {
  listing: Listing;
  currentUser?: {
    id: string;
    favoriteIds: string[];
  } | null;

  hideFavoriteButton?: boolean;
  property?: boolean;
  reservation?: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  };

  trip?: boolean;
  actionLabel?: string;
}

export default function ListingCard({
  listing,
  currentUser,
  hideFavoriteButton,
  property,
  reservation,
  actionLabel,
  trip,
}: ListingCardProps) {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(listing.locationValue);
  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/listings/${listing.id}`)}
    >
      {/* image */}
      <div className="relative aspect-square rounded-xl overflow-hidden">
        <Image
          src={listing.imageSrc || ""}
          alt={listing.title}
          fill
          className="object-cover transition group-hover:scale-105"
        />

        {!hideFavoriteButton && (
          <HeartButton listingId={listing.id} currentUser={currentUser} />
        )}
      </div>

      <div className="mt-3 space-y-1 px-1">
  {/* Location — primary info, brightest */}
  <p className="truncate text-sm font-medium text-white/90">
    {listing.location}
  </p>

  {/* Title — secondary, italic, muted */}
  <p className="truncate text-sm italic text-white/60">
    {listing.title}
  </p>

  {/* Price — brightest, anchors the card */}
  <p className="pt-1 text-base font-semibold text-white">
    {listing.price}
    <span className="ml-1 text-sm font-normal text-white/70">/ night</span>
  </p>
</div>
    </div>
  );
}
