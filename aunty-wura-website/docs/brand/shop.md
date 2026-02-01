# Shop

The Shop is where Aunty Wúrà's books, resources, and merchandise are sold. It should feel like an extension of the learning experience, not a separate e-commerce bolt-on.

## Design Principles

### Warmth Over Transaction

The shop should feel like browsing a well-curated bookshop, not a marketplace. Emphasis on:

- Generous imagery and breathing room
- Product stories, not just specs
- Browsing encouraged, not just searching

### Educational Context

Every product connects back to learning:

- Books show sample pages and vocabulary previews
- Resources explain what they teach
- Bundles make sense pedagogically, not just as discounts

### Trust Signals

Parents are the buyers. Build confidence through:

- Clear age/level recommendations
- Honest product descriptions
- Easy returns messaging
- Secure checkout indicators

---

## Product Categories

### Books

The core offering. Illustrated books teaching Yoruba vocabulary through nature and science.

**Product Page Elements**
- Hero image: Book cover (scientific illustration style)
- Gallery: Sample interior spreads (3-5 images)
- Title with Yoruba subtitle where applicable
- Age/level indicator badge
- Price (clear, no hidden costs)
- "What You'll Learn" - vocabulary and concepts covered
- "Inside This Book" - page count, illustration style, format
- Sample audio pronunciation (if available)
- Related books in series
- Reviews/testimonials

**Book Formats**
- Physical (paperback, hardcover where applicable)
- Digital PDF (for print-at-home worksheets)
- Bundle (book + flashcards + worksheet pack)

### Flashcards

Vocabulary cards matching the book illustration style.

**Product Page Elements**
- Card fan or spread image
- Card count and size
- Topics/vocabulary covered
- Sample card front and back
- Matches with: [related book]
- Printing quality notes (cardstock, lamination)

### Worksheets & Activity Packs

Printable learning materials.

**Product Page Elements**
- Sample worksheet preview
- Page count
- Skills practiced (reading, writing, matching, etc.)
- Age/level indicator
- Instant download badge (for digital)
- Print recommendations (paper type)

### Bundles

Curated sets that make sense together.

**Bundle Logic**
- Series bundles (all books in a series)
- Topic bundles (book + flashcards + worksheets on same topic)
- Starter kits (first book + foundational resources)
- Gift sets (premium packaging for gifting)

**Bundle Page Elements**
- All included items with individual images
- Combined value vs. bundle price
- "Perfect for..." use case
- Savings amount (understated, not screaming)

### Merchandise

Apparel and items that extend the brand.

**Categories**
- Apparel (t-shirts, tote bags)
- Stationery (notebooks, pencils)
- Posters (scientific illustrations)

**Merchandise Guidelines**
- Quality over quantity - fewer items, done well
- Designs should work standalone (not require explanation)
- Yoruba vocabulary featured authentically
- Apparel on warm-toned blanks matching brand palette

---

## Shop UX Patterns

### Navigation

```
Shop
├── Books
│   ├── By Age (7-9, 10-12, 13-16)
│   ├── By Topic (Animals, Plants, etc.)
│   └── By Series
├── Flashcards
├── Worksheets
├── Bundles
└── Merch
```

### Product Cards

Consistent card design across shop:

```
┌─────────────────────────┐
│                         │
│      [Product Image]    │
│                         │
├─────────────────────────┤
│ Product Title           │
│ Yoruba subtitle         │
│                         │
│ ★★★★☆ (12 reviews)      │
│                         │
│ ₦2,500 / $15            │
│                         │
│ [Age 7-9] [Animals]     │
└─────────────────────────┘
```

### Cart Experience

- Slide-out cart (don't navigate away from browsing)
- Clear item summaries with thumbnails
- Easy quantity adjustment
- Suggested additions ("Complete the set with...")
- Shipping estimate before checkout

### Checkout

- Guest checkout available (don't force account creation)
- Nigerian payment options (Paystack, bank transfer, USSD)
- International options (Stripe, PayPal)
- Clear shipping timeline
- Order confirmation with download links (for digital)

---

## Pricing Display

### Currency

- Default: Nigerian Naira (₦)
- Secondary: USD ($) for diaspora
- Auto-detect by location, allow manual switch

### Price Formatting

```
₦2,500          (primary)
~$15 USD        (secondary, approximate)
```

### Discounts

- Bundle savings shown as "Save ₦X" not percentage
- No fake urgency ("Only 3 left!" when not true)
- Seasonal sales clearly time-bounded

---

## Visual Treatment

### Product Photography

**Books**
- Hero: 3/4 angle showing cover and spine
- Supporting: Flat lay with props (pencils, leaves, etc.)
- Interior: Spread shots showing illustrations

**Flashcards**
- Fan arrangement showing variety
- Single card detail shots
- In-use context (hands holding cards)

**Merchandise**
- Clean product shots on neutral backgrounds
- Lifestyle shots showing use
- Detail shots of print quality

### Color in Shop Context

| Element | Color | Notes |
|---------|-------|-------|
| Background | Off-White `#FAFAF7` | Clean, doesn't compete |
| Product cards | Warm Cream `#F5E6D3` | Subtle warmth |
| CTAs (Add to Cart) | Terracotta `#A0522D` | Primary action |
| Price | Deep Forest `#2D4A3E` | Grounded, trustworthy |
| Sale/Badge | Wura Gold `#D4A84B` | Draws attention |
| Borders/Dividers | Warm Sand `#E8B87D` | Soft separation |

### Typography in Shop

| Element | Font | Size |
|---------|------|------|
| Product title | Charis SIL | text-xl (20px) |
| Yoruba subtitle | Ojuju | text-lg (18px) |
| Price | Inter | text-xl (20px), semibold |
| Description | Andika | text-base (16px) |
| Badges/Labels | Inter | text-sm (14px), medium |

---

## Empty States

### Empty Cart
```
Your cart is empty

Browse our books and find your next Yoruba learning adventure.

[Browse Books]
```

### No Search Results
```
No results for "xyz"

Try searching for:
• Animals (Àwọn Ẹranko)
• Plants (Àwọn Ewéko)  
• Colors (Àwọn Àwọ̀)

Or [browse all products]
```

---

## Order Confirmation

### Email Template

Subject: `Ẹ kú owó! Your Aunty Wúrà order is confirmed`

Content:
- Order number and date
- Items purchased with thumbnails
- Digital download links (if applicable)
- Shipping info and timeline (if physical)
- "What's next" - how to use the materials
- Social sharing prompt

---

## Future Considerations

### Subscriptions
Monthly learning packs delivered (physical or digital). Not for v1, but architecture should accommodate.

### Gift Cards
Allow purchasing credits for others. Consider for v2.

### Affiliate/Teacher Discounts
Bulk ordering for schools. Manual process initially, systematize later.

### Reviews & Ratings
Start with curated testimonials, add user reviews when volume justifies moderation effort.
