---
argument-hint: [...products?]
description: Update database for new product images.
---

Update @app/actions/database.js `images` according to .webp files modified today in @static/images/product/ by `id`. The numbers in `images` are width and height resolutions. Find new products don't exist in @app/actions/database.js. Default new products to be in category `gowns`. Reference @static/images/CLAUDE.md for product image file names.
