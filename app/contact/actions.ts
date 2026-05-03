"use server";
import { z } from "zod";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(1, "Message is required."),
  agency: z.string().optional() // Honeypot anti-spam
});

export async function sendContactMessage(data: any) {
  // Validate
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  // Spam check
  if (parsed.data.agency && parsed.data.agency.length > 0) throw new Error("Spam detected.");

  // Send email via Resend
  await resend.emails.send({
    from: 'Contact Form <your@domain.com>',
    to: process.env.CONTACT_EMAIL!,
    subject: `New Contact Form submission from ${parsed.data.name}`,
    reply_to: parsed.data.email,
    text: `\n      Name: ${parsed.data.name}\n      Email: ${parsed.data.email}\n      Message:\n      ${parsed.data.message}\n    `
  });

  return true;
}
