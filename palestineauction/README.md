# PalestineAuction

*(not Palestine Action)*

A dead-simple, static listings board. Supporters sell belongings — often on
behalf of people in prison — at a fixed price, and buyers can make a **best
offer** to bargain. No server, no database, no accounts, no tracking.

## Files

| File         | What it is                                             |
| ------------ | ------------------------------------------------------ |
| `index.html` | The listings page                                      |
| `smcf.html`  | SMCF — Sean Middlebrough Charity Foundation            |
| `money.html` | "Where the money goes?" — transparency page            |
| `legal.html` | Legality & disclaimer (linked from every page)         |
| `data.js`    | **The only file you edit to add/remove items**         |
| `styles.css` | Styling                                                |
| `app.js`     | Renders listings + the buy / best-offer flow           |

## Adding an item

Edit `data.js` and add an object to the `LISTINGS` array:

```js
{
  id: "unique-id",
  title: "What it is",
  price: 40,                 // fixed asking price in GBP
  emoji: "📦",               // shown if no `image`
  image: "photos/thing.jpg", // optional photo path/URL
  area: "M1",                // FIRST PART of the postcode only — never a full address
  description: "Condition, collection notes, etc.",
  contact: "seller@example.org",
  forWhom: "Supports someone on remand.", // optional
}
```

Only list goods that are legally owned and legal to sell. See `legal.html`.

## How "Buy now or make an offer" works

Each card has one button. It opens a small form (amount prefilled with the
asking price — lower it to make an offer), which is submitted to Formspree
(`FORM_ENDPOINT` at the top of `app.js`). The submission includes the item,
the amount, the buyer's email, and the seller's `contact` address so whoever
receives the Formspree email can forward it on. If the amount is at or above
the asking price it's flagged as "buy now", otherwise as an "offer".

## Running locally

It's just static files. Either open `index.html` directly, or:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Upload the folder to any static host — GitHub Pages, Netlify, Cloudflare Pages,
etc. No build step.
