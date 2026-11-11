import { z } from "zod";
import { jobStages, jobTypes, salesReps } from "./constants";

export const customerFormSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  first: z.string().trim().min(1, "First name is required"),
  last: z.string().trim().min(1, "Last name is required"),
  address: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  email: z.string().trim().optional().default(""),
  price: z.coerce.number().nonnegative().optional().default(0),
  stage: z.enum(jobStages),
  jobType: z.enum(jobTypes),
  salesperson: z.enum(salesReps),
  sortorder: z.string().trim().optional().default("5"),
  notes: z.string().trim().optional().default(""),
  gdrive: z.string().trim().optional().default(""),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const noteFormSchema = z.object({
  noteId: z.coerce.number().int().positive().optional(),
  customerId: z.coerce.number().int().positive(),
  title: z.string().trim().optional().default(""),
  content: z.string().trim().min(1, "Note content is required"),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export const contactFormSchema = z.object({
  first: z.string().trim().min(1, "First name is required"),
  last: z.string().trim().min(1, "Last name is required"),
  address: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  email: z.string().trim().optional().default(""),
});
