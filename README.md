# Moving sale

Static inventory page for a household sale. Hosted with GitHub Pages.

Live site, once Pages is enabled: https://sachinmalik2496.github.io/moving/

## Update an item

Edit [`inventory.json`](inventory.json), commit, and push. The page reads that file.

Each item:

| Field | Meaning |
| --- | --- |
| `name` | What buyers see |
| `mrp` | Original price, shown struck through |
| `price` | Asking price |
| `condition` | `Like new`, `Good`, `Fair`, `Used`, or `For parts` |
| `sold` | `true` moves the item under Sold |
| `images` | List of photo paths or URLs |
| `note` | Optional extra line |
| `contact` | Optional phone or handle, shown in the header |

Photos live in [`images/`](images/). Example:

```json
"images": ["images/king-bed.jpg", "images/king-bed-2.jpg"]
```

Clicking a photo opens it larger. Several photos can be stepped through in that view.

Set `"sold": true` on an item and push. It shows under Sold at the bottom. The page does not edit the list itself.

## GitHub Pages

In the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)`**.
