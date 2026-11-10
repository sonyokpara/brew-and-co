"use server";

import type { OrderField, OrderState } from "@/docs/design/components";
import { getMenu } from "@/lib/menu";
import { saveOrder } from "@/lib/orders";
import { shopNow, toHHMM, toMinutes } from "@/lib/shop-time";
import { MAX_ITEM_QUANTITY, formatTime, pickupSlots, site } from "@/lib/site";

/** Orders can be placed up to this close to a slot, to allow for time spent filling in the form. */
const SERVER_GRACE_MIN = 5;
const MAX_LINES = 30;

/** A short code staff can read out at the counter, without look-alike characters. */
function orderReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `BC-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

/**
 * Validate a pickup order and hand it to saveOrder.
 * Every rule the cart applies in the browser is re-checked here, and prices
 * come from the menu, not from the request.
 */
export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const pickupTime = String(formData.get("pickupTime") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Partial<Record<OrderField, string>> = {};
  const { today, weekday, minutes } = shopNow();

  // Items
  const menu = (await getMenu()).flatMap((c) => c.items);
  const bySlug = new Map(menu.map((i) => [i.slug, i]));
  let requested: unknown;
  try {
    requested = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    requested = null;
  }
  const lines: { slug: string; quantity: number }[] = [];
  if (Array.isArray(requested) && requested.length <= MAX_LINES) {
    for (const r of requested) {
      const slug = typeof r?.slug === "string" ? r.slug : "";
      const quantity = Number(r?.quantity);
      if (!bySlug.has(slug) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
        errors.items = "Something in your order is no longer on the menu. Remove it and try again.";
        break;
      }
      lines.push({ slug, quantity });
    }
  }
  if (!errors.items && lines.length === 0) {
    errors.items = "Your order is empty. Add something from the menu first.";
  }

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter your name so we know whose order it is.";
  }

  const digits = phone.replace(/\D/g, "");
  if (!/^[+\d\s()-]+$/.test(phone) || digits.length < 9 || digits.length > 15) {
    errors.phone = "Enter a phone number we can call if there's a problem, e.g. 024 555 0142.";
  }

  if (!pickupTime) {
    errors.pickupTime = "Choose a pickup time.";
  } else if (!pickupSlots(weekday).includes(pickupTime)) {
    errors.pickupTime = "We can't have it ready then. Choose a time from the list.";
  } else if (toMinutes(pickupTime) < minutes + SERVER_GRACE_MIN) {
    errors.pickupTime = "That time has passed. Choose a later time.";
  } else {
    const late = lines
      .map((l) => bySlug.get(l.slug)!)
      .find((i) => i.availableUntil !== undefined && toMinutes(pickupTime) >= i.availableUntil);
    if (late) {
      errors.pickupTime = `${late.name} is served until ${formatTime(toHHMM(late.availableUntil!))}. Choose an earlier time or remove it.`;
    }
  }

  if (notes.length > 300) {
    errors.notes = "Keep notes under 300 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Check the highlighted details and try again.", fieldErrors: errors };
  }

  const items = lines.map((l) => {
    const item = bySlug.get(l.slug)!;
    return { slug: item.slug, name: item.name, quantity: l.quantity, unitPrice: item.price };
  });
  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const reference = orderReference();

  await saveOrder({ reference, name, phone, date: today, pickupTime, notes, items, total });

  return {
    status: "success",
    reference,
    pickupTime: formatTime(pickupTime),
    total,
    message: `Thanks, ${name.split(" ")[0]}. Your order will be ready at ${formatTime(
      pickupTime,
    )}. Give your name or ${reference} at the counter on ${site.address[0]} and pay when you collect.`,
  };
}
