/** Pulls the most useful human-readable message out of a Clerk error. */
export function clerkError(err: unknown): string {
  const e = err as { errors?: { longMessage?: string; message?: string }[]; message?: string };
  return (
    e?.errors?.[0]?.longMessage ||
    e?.errors?.[0]?.message ||
    e?.message ||
    'Something went wrong. Please try again.'
  );
}
