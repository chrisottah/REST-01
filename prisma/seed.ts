import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const hosts = [
  { id: "host_amara_001", name: "Amara Okafor", email: "amara@example.com" },
  { id: "host_liam_002", name: "Liam Chen", email: "liam@example.com" },
  { id: "host_sofia_003", name: "Sofia Rossi", email: "sofia@example.com" },
  { id: "host_noah_004", name: "Noah Williams", email: "noah@example.com" },
];

const myListings = [
  { title: "Sunny Beachfront Villa", description: "Wake up to the sound of waves. Spacious villa with direct beach access, perfect for families.", imageSrc: "/images/image1.jpeg", category: "beach", roomCount: 4, guestCount: 8, bathroomCount: 3, price: 320, locationValue: "PT" },
  { title: "Modern Downtown Apartment", description: "Sleek apartment in the heart of the city. Walking distance to restaurants, museums, and nightlife.", imageSrc: "/images/image2.jpeg", category: "apartment", roomCount: 2, guestCount: 4, bathroomCount: 1, price: 140, locationValue: "US" },
  { title: "Mountain Cabin Retreat", description: "Cozy cabin tucked into the pines. Wood-burning fireplace, hot tub, and stunning mountain views.", imageSrc: "/images/image3.jpeg", category: "cabin", roomCount: 3, guestCount: 6, bathroomCount: 2, price: 210, locationValue: "CA" },
  { title: "Historic Castle Suite", description: "Stay in a restored 16th-century castle. Original stone walls, modern amenities, unforgettable experience.", imageSrc: "/images/image4.jpeg", category: "castle", roomCount: 5, guestCount: 10, bathroomCount: 4, price: 580, locationValue: "FR" },
  { title: "Lakeside Family House", description: "Spacious family home with a private dock. Canoe, kayak, and fishing gear included.", imageSrc: "/images/image5.jpeg", category: "house", roomCount: 4, guestCount: 9, bathroomCount: 2, price: 260, locationValue: "NG" },
  { title: "Forest Camping Escape", description: "Off-grid camping experience with all the essentials. Starry skies, campfires, and total peace.", imageSrc: "/images/image6.jpeg", category: "camping", roomCount: 1, guestCount: 3, bathroomCount: 1, price: 75, locationValue: "AU" },
  { title: "Tranquil Garden Apartment", description: "Ground-floor apartment with a private garden. Quiet neighborhood, close to public transport.", imageSrc: "/images/image7.jpeg", category: "apartment", roomCount: 2, guestCount: 4, bathroomCount: 1, price: 120, locationValue: "GB" },
  { title: "Cliffside Beach House", description: "Perched on a cliff with panoramic ocean views. Private pool and sunset-facing terrace.", imageSrc: "/images/image8.jpeg", category: "beach", roomCount: 3, guestCount: 7, bathroomCount: 2, price: 410, locationValue: "IT" },
];

const hostListings = [
  { title: "Kyoto Traditional House", description: "Authentic Japanese machiya with tatami rooms and a small zen garden.", imageSrc: "/images/image9.jpeg", category: "house", roomCount: 3, guestCount: 5, bathroomCount: 2, price: 230, locationValue: "JP" },
  { title: "Bali Jungle Cabin", description: "Bamboo cabin surrounded by rice terraces. Outdoor shower, hammock, and morning yoga deck.", imageSrc: "/images/image10.jpeg", category: "cabin", roomCount: 2, guestCount: 4, bathroomCount: 1, price: 160, locationValue: "TH" },
  { title: "Barcelona City Apartment", description: "Bright apartment in Eixample. Balcony overlooking the street, steps from Sagrada Familia.", imageSrc: "/images/image11.jpeg", category: "apartment", roomCount: 2, guestCount: 4, bathroomCount: 1, price: 180, locationValue: "ES" },
  { title: "Scottish Highland Castle", description: "Grand castle on a loch. Four-poster beds, roaring fireplaces, and acres of private grounds.", imageSrc: "/images/image12.jpeg", category: "castle", roomCount: 6, guestCount: 12, bathroomCount: 5, price: 720, locationValue: "GB" },
];

async function main() {
  const me = await prisma.user.findFirst({
    where: { email: { notIn: hosts.map((h) => h.email) } },
    orderBy: { createdAt: "asc" },
  });

  if (!me) {
    throw new Error("No non-seed user found. Register a user in the app first, then run the seed.");
  }

  console.log(`Seeding listings for user: ${me.email} (${me.id})`);

  await prisma.listing.deleteMany({
    where: { userId: { in: [me.id, ...hosts.map((h) => h.id)] } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: hosts.map((h) => h.id) } },
  });

  for (const host of hosts) {
    await prisma.user.create({
      data: { id: host.id, name: host.name, email: host.email, emailVerified: true },
    });
  }
  console.log(`Created ${hosts.length} fake host users.`);

  for (const listing of myListings) {
    await prisma.listing.create({ data: { ...listing, userId: me.id } });
  }
  console.log(`Created ${myListings.length} listings for you.`);

  for (let i = 0; i < hosts.length; i++) {
    await prisma.listing.create({ data: { ...hostListings[i], userId: hosts[i].id } });
  }
  console.log(`Created ${hostListings.length} listings for fake hosts.`);

  const total = await prisma.listing.count();
  console.log(`Seed complete. ${total} listings now in the database.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });