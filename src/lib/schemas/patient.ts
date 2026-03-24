import { z } from 'zod';

export const patientFormSchema = z.object({
    first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    last_name: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
    dob: z.string().min(1, "Date of birth is required").refine((date) => {
        const parsed = Date.parse(date);
        return !isNaN(parsed) && parsed < Date.now();
    }, "Date of birth must be a valid date in the past"),
    gender: z.enum(["male", "female"]),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;