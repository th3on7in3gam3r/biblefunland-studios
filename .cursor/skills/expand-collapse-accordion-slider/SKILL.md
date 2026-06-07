---
name: expand-collapse-accordion-slider
description: >-
  Add or extend the Stripe-style expand-collapse accordion carousel on BibleFunLand
  Studios pages. Use when implementing accordion sliders for brands, partners, or
  work projects on index.html or work.html.
---

# Expand-Collapse Accordion Slider

## Assets

| File | Purpose |
|------|---------|
| `accordion-carousel.css` | Layout, expand/collapse animation, nav buttons |
| `accordion-carousel.js` | Multi-instance init via `[data-accordion-carousel]` |

## HTML pattern

```html
<link rel="stylesheet" href="/accordion-carousel.css">
<!-- ... -->
<div class="accordion-carousel" id="uniqueId" data-accordion-carousel data-interval="5000">
  <ul class="accordion-carousel__list" role="list">
    <li class="accordion-carousel__item" tabindex="0" data-active>
      <a class="accordion-carousel__box" href="URL" target="_blank" rel="noopener noreferrer">
        <div class="accordion-carousel__image"><img loading="lazy" src="..." alt="..."></div>
        <div class="accordion-carousel__contents">
          <p class="accordion-carousel__tag">Category</p>
          <h3 class="accordion-carousel__title">Name</h3>
          <p class="accordion-carousel__desc">Short description.</p>
        </div>
      </a>
    </li>
    <!-- more items -->
  </ul>
  <div class="accordion-carousel__nav">
    <button type="button" class="accordion-carousel__prev" aria-label="Previous">...</button>
    <button type="button" class="accordion-carousel__next" aria-label="Next">...</button>
  </div>
</div>
<script src="/accordion-carousel.js"></script>
```

## Variants

- **7+ items**: default `.accordion-carousel`
- **3 items**: add `.accordion-carousel--compact`
- **Disable autoplay**: `data-autoplay="false"`
- **Interval**: `data-interval="5500"` (ms)

## Behavior

- Hover or focus expands a panel; click inactive panel expands (second click follows link)
- Prev/Next buttons and arrow keys when list is focused
- Autoplay pauses on hover/focus; respects `prefers-reduced-motion`
- Only one `[data-active]` item per carousel on load

## Existing instances

| Page | ID | Items |
|------|-----|-------|
| `index.html` | `brandsCarousel` | 7 brands |
| `index.html` | `partnersCarousel` | 3 partners (compact) |
| `work.html` | `workBrandsCarousel` | 7 brands |
| `work.html` | `workPartnersCarousel` | 3 partners (compact) |

## Checklist after changes

1. Link CSS/JS with root-relative paths (`/accordion-carousel.css`)
2. `.accordion-carousel__box` must wrap image + contents (absolute positioning)
3. Images live under `brands/` with `loading="lazy"`
4. Test expand, nav buttons, link click on active panel, mobile layout
