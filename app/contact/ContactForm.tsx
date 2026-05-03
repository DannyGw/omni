"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { sendContactMessage } from "./actions";
import { z } from "zod";

import { Form, FormField, Input, Textarea, Button, FormLabel } from "@/components/ui";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  message: z.string().min(1, "Message can’t be empty"),
  agency: z.string().optional(), // honeypot
});

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const [result, setResult] = useState<{ ok: boolean, message: string }|null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (data: any) => {
    if (data.agency) return; // Honeypot triggered (bots)
    startTransition(async () => {
      try {
        await sendContactMessage(data);
        setResult({ ok: true, message: "Your message was sent successfully!" });
        reset();
      } catch (e: any) {
        setResult({ ok: false, message: e.message || "Something went wrong. Try again." });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} aria-live="polite" className="space-y-4">
      {/* Hidden Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" style={{ display: "none" }} {...register("agency")} />

      <FormField>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && <span role="alert" className="text-sm text-red-600">{errors.name.message}</span>}
      </FormField>

      <FormField>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email}/>
        {errors.email && <span role="alert" className="text-sm text-red-600">{errors.email.message}</span>}
      </FormField>

      <FormField>
        <FormLabel htmlFor="message">Message</FormLabel>
        <Textarea id="message" {...register("message")} aria-invalid={!!errors.message}/>
        {errors.message && <span role="alert" className="text-sm text-red-600">{errors.message.message}</span>}
      </FormField>

      <Button type="submit" disabled={pending}>Send</Button>

      {result && 
        <div role="alert" className={result.ok ? "text-green-700" : "text-red-700"}>{result.message}</div>
      }
    </Form>
  );
}
