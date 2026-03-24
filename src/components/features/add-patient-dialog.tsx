/**
 * Client Component — Dialog form for adding a new patient.
 *
 * This is a Client Component because it manages form state (react-hook-form),
 * handles user interactions (input changes, submit), and controls dialog
 * open/close state. It calls a Server Action for the actual data mutation.
 *
 * Data: None inbound. Calls `createPatient` Server Action on submit.
 *
 * KEY CONCEPTS FOR LEARNING:
 *
 * 1. react-hook-form + Zod resolver:
 *    The form library manages field registration, validation, error display,
 *    and dirty/touched state. The Zod resolver bridges your schema to the
 *    form — one schema validates both client-side (instant feedback) and
 *    server-side (security boundary in the Server Action).
 *
 * 2. Server Actions from Client Components:
 *    `createPatient` is imported from a "use server" file. When called,
 *    Next.js serializes the arguments, sends a POST to the server,
 *    executes the function there, and returns the result. No fetch() or
 *    API route needed. The `useTransition` hook gives us a `pending` state
 *    so we can show a loading indicator.
 *
 * 3. Controlled vs Uncontrolled:
 *    react-hook-form is "uncontrolled by default" (uses refs, not state)
 *    for performance. But shadcn's Select component needs a controlled
 *    value, so we use the `Controller` wrapper for the gender field.
 */
"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  patientFormSchema,
  type PatientFormValues,
} from "@/lib/schemas/patient";
import { createPatient } from "@/app/dashboard/patients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // react-hook-form setup:
  // - mode: "onBlur" validates each field when the user leaves it (not on every keystroke)
  // - resolver: connects the Zod schema so validation rules come from one source
  // - defaultValues: required for controlled components (Select) to work properly
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: "",
      last_name: "",
      dob: "",
      gender: "male",
      email: "",
      phone: "",
    },
  });

  const {
    register,     // Connects an input to react-hook-form (name, ref, onChange, onBlur)
    control,      // For controlled components (Select) that can't use register
    handleSubmit, // Wraps your submit fn — only calls it if validation passes
    formState: { errors }, // Field-level error messages from Zod
    reset,        // Clears form back to defaultValues
  } = form;

  function onSubmit(values: PatientFormValues) {
    // useTransition: wraps the async work so React can show `isPending`
    // without blocking the UI. The button shows "Adding..." while this runs.
    startTransition(async () => {
      // Convert our typed values to FormData for the Server Action.
      // Server Actions accept FormData, plain objects, or individual args.
      // FormData is the most common pattern because it works with
      // progressive enhancement (forms work even without JavaScript).
      const formData = new FormData();
      formData.set("first_name", values.first_name);
      formData.set("last_name", values.last_name);
      formData.set("dob", values.dob);
      formData.set("gender", values.gender);
      if (values.email) formData.set("email", values.email);
      if (values.phone) formData.set("phone", values.phone);

      const result = await createPatient(formData);

      if (!result.ok) {
        // Server-side validation failed — show errors via toast.
        // In a production app, you'd map these back to field-level errors
        // using form.setError() for each field.
        const messages = Object.values(result.errors)
          .flat()
          .join(", ");
        toast.error(`Validation failed: ${messages}`);
        return;
      }

      toast.success("Patient added successfully");
      reset();
      setOpen(false);
      // Refresh the current route's Server Component data
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add Patient</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient&apos;s information below.
          </DialogDescription>
        </DialogHeader>

        {/*
          handleSubmit(onSubmit) — react-hook-form validates all fields
          against the Zod schema FIRST. If validation passes, onSubmit
          is called with typed values. If it fails, errors are populated
          and onSubmit is NOT called.
        */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="first_name">First Name *</Label>
              {/*
                register("first_name") returns { name, ref, onChange, onBlur }
                and spreads them onto the input. This is how react-hook-form
                tracks the field without useState — it reads the DOM directly.
              */}
              <Input
                id="first_name"
                placeholder="Sarah"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-destructive text-xs">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                placeholder="Johnson"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-destructive text-xs">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input id="dob" type="date" {...register("dob")} />
              {errors.dob && (
                <p className="text-destructive text-xs">
                  {errors.dob.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender">Gender *</Label>
              {/*
                Controller is needed for shadcn's Select because it's a
                custom component that doesn't expose a native <input> ref.
                Controller bridges react-hook-form's ref-based tracking
                to components that need value/onChange props instead.
              */}
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      if (val) field.onChange(val);
                    }}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-destructive text-xs">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah.johnson@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 234-5678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-xs">
                {errors.phone.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Adding..." : "Add Patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
