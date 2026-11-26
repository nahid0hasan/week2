// Every env value the app uses is read here, in one place.
// NEXT_PUBLIC_* values are inlined at build time, so they must be
// referenced as `process.env.NEXT_PUBLIC_X` (not via a variable).

export const env = {
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, ""),
};
