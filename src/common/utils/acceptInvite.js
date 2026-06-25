// Calls the backend to accept a pending invite, assigning the user to the program.
// Throws on failure so callers can surface the error instead of silently dropping it.
export async function acceptInvite(token, uid) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, uid }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to accept invite');
  }
}
