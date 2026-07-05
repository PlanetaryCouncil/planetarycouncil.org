// PalestineAuction — listings data
// Edit this file to add / remove items. No build step, no server needed.
//
// Fields:
//   id          unique string
//   title       short item name
//   price       fixed asking price in GBP (number)
//   emoji       placeholder shown when no `image` is set
//   image       optional path/URL to a photo (overrides emoji)
//   area        FIRST PART of the UK postcode only (outward code, e.g. "M1", "SW9")
//               Never put a full postcode or address here.
//   description free text
//   contact     email the buyer's message is sent to
//   forWhom     optional: who this listing supports
//
// Every item gets one "Buy now or make an offer" button.

const LISTINGS = [
  {
    id: "guitar-01",
    title: "Acoustic guitar (well loved)",
    price: 80,
    emoji: "🎸",
    area: "M1",
    description:
      "Steel-string acoustic, a few scratches, plays and tunes fine. Comes with a soft case.",
    contact: "listings@example.org",
    forWhom: "Supports a supporter currently on remand.",
  },
  {
    id: "bike-01",
    title: "Commuter bike, 54cm frame",
    price: 140,
    emoji: "🚲",
    area: "E8",
    description:
      "Hybrid bike, recently serviced, new brake pads. Rides great. Collection only.",
    contact: "listings@example.org",
    forWhom: "Selling on behalf of someone inside.",
  },
  {
    id: "books-01",
    title: "Box of paperbacks (~40 books)",
    price: 25,
    emoji: "📚",
    area: "LS6",
    description:
      "Mixed fiction and non-fiction. Good condition. Bundle only, no splitting.",
    contact: "listings@example.org",
    forWhom: "",
  },
  {
    id: "camera-01",
    title: "35mm film camera + 50mm lens",
    price: 110,
    emoji: "📷",
    area: "BS3",
    description:
      "Fully working manual SLR. Light meter reads correctly. Battery included.",
    contact: "listings@example.org",
    forWhom: "",
  },
  {
    id: "amp-01",
    title: "Small practice amp",
    price: 45,
    emoji: "🔈",
    area: "G42",
    description: "15W combo amp, clean and overdrive channels. Loud enough for a room.",
    contact: "listings@example.org",
    forWhom: "",
  },
  {
    id: "coat-01",
    title: "Winter parka, size L",
    price: 30,
    emoji: "🧥",
    area: "NE1",
    description: "Warm, waterproof, barely worn. Detachable hood.",
    contact: "listings@example.org",
    forWhom: "",
  },
];
