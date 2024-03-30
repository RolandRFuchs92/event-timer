import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e.message) return e.message;
    return e.message;
  },
});
