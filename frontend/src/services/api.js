const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {}

export async function generateActivity(preferences) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/generate-activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
  } catch {
    throw new ApiError(
      "Can't reach the TouchGrass backend. Please make sure it is running on http://localhost:8000 and try again."
    );
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    /* ignore */
  }
  if (!response.ok) {
    if (response.status === 422) throw new ApiError("Please fill in every required choice and try again.");
    throw new ApiError(data?.detail?.message || "Something went wrong. Please try again.");
  }
  return data;
}
