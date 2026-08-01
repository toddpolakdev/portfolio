"use server";

import { gql } from "@/lib/gql";
import { SUBMIT_CONTACT } from "@/lib/queries";

export type ContactState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

const MAX_MESSAGE = 1000;

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: a real user never sees this field, so anything in it is a bot.
  // Report success so the bot does not learn it was filtered.
  if ((formData.get("website") as string)?.trim()) {
    return { status: "ok", message: "Message sent. I'll get back to you soon." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { status: "error", message: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address looks invalid." };
  }

  if (message.length > MAX_MESSAGE) {
    return {
      status: "error",
      message: `Message must be ${MAX_MESSAGE} characters or fewer.`,
    };
  }

  try {
    await gql(SUBMIT_CONTACT, {
      variables: { name, email, subject, message },
      revalidate: 0,
    });

    return {
      status: "ok",
      message: "Message sent. I'll get back to you soon.",
    };
  } catch (err) {
    console.error("[contact] submit failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again.",
    };
  }
}
