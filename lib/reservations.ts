import "server-only";

export type Reservation = {
  name: string;
  partySize: number;
  /** "YYYY-MM-DD", Kumasi local date */
  date: string;
  /** "HH:MM", Kumasi local time */
  time: string;
};

/**
 * Persist a validated reservation request.
 *
 * Nothing is stored yet: this is the single place to connect a database,
 * booking system or email notification later. Keep it async so callers
 * don't change when that happens.
 */
export async function saveReservation(reservation: Reservation): Promise<void> {
  console.info("[reservation] requested", reservation);
}
