import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

export type MenuBadge = "Popular" | "House favorite";

export type MenuItem = {
  slug: string;
  category: string;
  name: string;
  description: string;
  /** Price in Ghana cedis. */
  price: number;
  badge?: MenuBadge;
  /** Public path, e.g. /images/menu/flat-white.jpg */
  image: string;
};

export type MenuCategory = {
  /** URL-safe id, used for the menu page anchors. */
  id: string;
  name: string;
  intro: string;
  items: MenuItem[];
};

/** Display order and the one-line intro shown above each category. */
const CATEGORIES: { name: string; intro: string }[] = [
  {
    name: "Espresso drinks",
    intro: "Pulled on our house blend: a washed Ethiopian and Colombian pairing, roasted weekly.",
  },
  { name: "Pastries", intro: "Baked in-house before sunrise. When they're gone, they're gone." },
  { name: "Sandwiches", intro: "Made to order on bread from our own oven, served until 4pm." },
  { name: "Cold drinks", intro: "For Kumasi afternoons. Ask for any espresso drink over ice." },
];

const MENU_CSV = path.join(process.cwd(), "data", "menu-items.csv");

/** Minimal RFC 4180 parser: quoted fields, escaped quotes, commas inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function loadItems(): Promise<MenuItem[]> {
  const [header, ...rows] = parseCsv(await readFile(MENU_CSV, "utf8"));
  const col = (name: string) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`menu-items.csv is missing the "${name}" column`);
    return i;
  };
  const c = {
    category: col("category"),
    slug: col("slug"),
    name: col("name"),
    description: col("description"),
    price: col("price"),
    badge: col("badge"),
    image: col("image"),
  };

  return rows.map((r, line) => {
    const price = Number(r[c.price]);
    if (!Number.isFinite(price)) {
      throw new Error(`menu-items.csv row ${line + 2}: price "${r[c.price]}" is not a number`);
    }
    const badge = r[c.badge]?.trim();
    return {
      category: r[c.category].trim(),
      slug: r[c.slug].trim(),
      name: r[c.name].trim(),
      description: r[c.description].trim(),
      price,
      badge: badge === "Popular" || badge === "House favorite" ? badge : undefined,
      image: `/images/menu/${r[c.image].trim()}`,
    };
  });
}

/** The full menu, grouped by category in display order. */
export async function getMenu(): Promise<MenuCategory[]> {
  "use cache";
  cacheLife("max");

  const items = await loadItems();
  const known = CATEGORIES.map((c) => c.name);
  const extra = [...new Set(items.map((i) => i.category))].filter((n) => !known.includes(n));

  return [...CATEGORIES, ...extra.map((name) => ({ name, intro: "" }))]
    .map((c) => ({
      id: slugify(c.name),
      name: c.name,
      intro: c.intro,
      items: items.filter((i) => i.category === c.name),
    }))
    .filter((c) => c.items.length > 0);
}

/** Items badged "Popular" or "House favorite", alternating across categories. */
export async function getFeaturedItems(limit = 6): Promise<MenuItem[]> {
  const menu = await getMenu();
  const queues = menu.map((c) => c.items.filter((i) => i.badge));
  const picked: MenuItem[] = [];
  while (picked.length < limit && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && picked.length < limit) picked.push(next);
    }
  }
  return picked;
}
