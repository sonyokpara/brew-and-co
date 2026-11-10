import "server-only";

export type Order = {
  reference: string;
  name: string;
  phone: string;
  /** "YYYY-MM-DD", Kumasi local date */
  date: string;
  /** "HH:MM", Kumasi local time */
  pickupTime: string;
  notes: string;
  items: { slug: string; name: string; quantity: number; unitPrice: number }[];
  /** Ghana cedis, computed from the menu on the server, never trusted from the browser. */
  total: number;
};

/**
 * Persist a validated pickup order.
 *
 * Nothing is stored yet: this is the single place to connect a database,
 * a till or a kitchen printer later. Keep it async so callers don't change
 * when that happens.
 */
export async function saveOrder(order: Order): Promise<void> {
  console.info("[order] placed", order);
}
