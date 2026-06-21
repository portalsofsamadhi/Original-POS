/** User-facing fallback when a contact/booking form cannot reach the server. */
export const FORM_SUBMISSION_FALLBACK =
  "We could not send your request. Please try again or contact us directly at info@portalsofsamadhi.com or (510) 291-9399.";

/** Map technical errors (network, HTTP, SMTP) to a clear message for visitors. */
export function getFormSubmissionErrorMessage(error: unknown): string {
  if (!(error instanceof Error) || !error.message.trim()) {
    return FORM_SUBMISSION_FALLBACK;
  }

  const msg = error.message.toLowerCase();

  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed") ||
    msg.startsWith("http ") ||
    msg.startsWith("http/") ||
    msg.includes("internal server error") ||
    msg.includes("smtp") ||
    msg.includes("email service not configured")
  ) {
    return FORM_SUBMISSION_FALLBACK;
  }

  return error.message;
}