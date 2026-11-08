/**
 * Feature switches for parts of the platform that are not live yet.
 *
 * Email sending is not built. Until it ships, email balances, email prices and email
 * credit options stay hidden. Set NEXT_PUBLIC_EMAIL_CHANNEL_ENABLED=true (and
 * EMAIL_CHANNEL_ENABLED=True on the API) to show them again.
 */
export const EMAIL_CHANNEL_ENABLED = process.env.NEXT_PUBLIC_EMAIL_CHANNEL_ENABLED === "true";
