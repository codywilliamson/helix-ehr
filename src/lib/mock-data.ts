/**
 * Mock data for local development without Hasura/PostgreSQL.
 *
 * This module provides realistic seed data for the UI while the backend
 * is not connected. Import from here in components that need data.
 * Remove this file once the Hasura backend is live.
 */

import type { Patient, Visit, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "u-001",
    email: "admin@helix.dev",
    name: "Dr. Admin",
    role: "admin",
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "u-002",
    email: "provider@helix.dev",
    name: "Dr. Emily Smith",
    role: "provider",
    created_at: "2025-02-01T09:30:00Z",
  },
  {
    id: "u-003",
    email: "nurse@helix.dev",
    name: "James Rivera",
    role: "staff",
    created_at: "2025-02-10T10:00:00Z",
  },
];

export const mockPatients: Patient[] = [
  {
    id: "p-001",
    first_name: "Sarah",
    last_name: "Johnson",
    dob: "1985-03-12",
    gender: "female",
    email: "sarah.johnson@email.com",
    phone: "(555) 234-5678",
    created_at: "2025-06-01T10:00:00Z",
    updated_at: "2026-03-10T14:30:00Z",
  },
  {
    id: "p-002",
    first_name: "Marcus",
    last_name: "Chen",
    dob: "1972-08-24",
    gender: "male",
    email: "m.chen@email.com",
    phone: "(555) 345-6789",
    created_at: "2025-06-15T11:00:00Z",
    updated_at: "2026-03-18T09:15:00Z",
  },
  {
    id: "p-003",
    first_name: "Amara",
    last_name: "Okafor",
    dob: "1990-11-05",
    gender: "female",
    email: "amara.o@email.com",
    phone: "(555) 456-7890",
    created_at: "2025-07-20T08:30:00Z",
    updated_at: "2026-03-20T11:00:00Z",
  },
  {
    id: "p-004",
    first_name: "David",
    last_name: "Martinez",
    dob: "1968-01-30",
    gender: "male",
    email: "david.m@email.com",
    phone: "(555) 567-8901",
    created_at: "2025-08-10T13:00:00Z",
    updated_at: "2026-03-22T16:45:00Z",
  },
  {
    id: "p-005",
    first_name: "Priya",
    last_name: "Patel",
    dob: "1995-06-18",
    gender: "female",
    email: "priya.patel@email.com",
    phone: "(555) 678-9012",
    created_at: "2025-09-01T09:00:00Z",
    updated_at: "2026-02-28T10:30:00Z",
  },
  {
    id: "p-006",
    first_name: "Robert",
    last_name: "Kim",
    dob: "1958-12-03",
    gender: "male",
    email: null,
    phone: "(555) 789-0123",
    created_at: "2025-09-15T14:00:00Z",
    updated_at: "2026-03-15T08:00:00Z",
  },
  {
    id: "p-007",
    first_name: "Elena",
    last_name: "Vasquez",
    dob: "1982-04-22",
    gender: "female",
    email: "elena.v@email.com",
    phone: "(555) 890-1234",
    created_at: "2025-10-05T10:30:00Z",
    updated_at: "2026-03-21T13:20:00Z",
  },
  {
    id: "p-008",
    first_name: "Thomas",
    last_name: "Wright",
    dob: "1975-09-14",
    gender: "male",
    email: "t.wright@email.com",
    phone: null,
    created_at: "2025-11-01T11:00:00Z",
    updated_at: "2026-01-15T09:45:00Z",
  },
  {
    id: "p-009",
    first_name: "Fatima",
    last_name: "Al-Hassan",
    dob: "1988-07-08",
    gender: "female",
    email: "fatima.ah@email.com",
    phone: "(555) 012-3456",
    created_at: "2025-11-20T08:00:00Z",
    updated_at: "2026-03-19T15:10:00Z",
  },
  {
    id: "p-010",
    first_name: "James",
    last_name: "O'Brien",
    dob: "1952-02-28",
    gender: "male",
    email: "james.obrien@email.com",
    phone: "(555) 123-4567",
    created_at: "2025-12-01T12:00:00Z",
    updated_at: "2026-03-23T10:00:00Z",
  },
];

export const mockVisits: (Visit & { patient_name: string })[] = [
  {
    id: "v-001",
    patient_id: "p-001",
    patient_name: "Sarah Johnson",
    date: "2026-03-24",
    provider: "Dr. Emily Smith",
    chief_complaint: "Annual wellness exam",
    notes:
      "Patient in good health. BMI within normal range. Updated immunizations. Recommended continued exercise regimen and follow-up in 12 months.",
    created_at: "2026-03-24T09:00:00Z",
    updated_at: "2026-03-24T09:45:00Z",
  },
  {
    id: "v-002",
    patient_id: "p-004",
    patient_name: "David Martinez",
    date: "2026-03-22",
    provider: "Dr. Emily Smith",
    chief_complaint: "Elevated blood pressure follow-up",
    notes:
      "BP 142/88. Adjusted lisinopril dosage from 10mg to 20mg daily. Patient advised on low-sodium diet. Recheck in 4 weeks.",
    created_at: "2026-03-22T14:00:00Z",
    updated_at: "2026-03-22T14:30:00Z",
  },
  {
    id: "v-003",
    patient_id: "p-007",
    patient_name: "Elena Vasquez",
    date: "2026-03-21",
    provider: "Dr. Emily Smith",
    chief_complaint: "Persistent lower back pain",
    notes:
      "Pain rated 6/10, radiating to left leg. No red flags. Ordered lumbar X-ray. Prescribed physical therapy 2x/week for 6 weeks. Ibuprofen 400mg as needed.",
    created_at: "2026-03-21T10:00:00Z",
    updated_at: "2026-03-21T10:40:00Z",
  },
  {
    id: "v-004",
    patient_id: "p-003",
    patient_name: "Amara Okafor",
    date: "2026-03-20",
    provider: "Dr. Emily Smith",
    chief_complaint: "Sore throat and fatigue",
    notes:
      "Rapid strep test positive. Prescribed amoxicillin 500mg TID for 10 days. Rest and fluids recommended. Follow up if symptoms worsen.",
    created_at: "2026-03-20T11:00:00Z",
    updated_at: "2026-03-20T11:20:00Z",
  },
  {
    id: "v-005",
    patient_id: "p-009",
    patient_name: "Fatima Al-Hassan",
    date: "2026-03-19",
    provider: "Dr. Emily Smith",
    chief_complaint: "Prenatal checkup — 28 weeks",
    notes:
      "Fetal heartbeat strong at 145 bpm. Fundal height appropriate for gestational age. Glucose tolerance test results normal. Next appointment in 2 weeks.",
    created_at: "2026-03-19T13:00:00Z",
    updated_at: "2026-03-19T13:45:00Z",
  },
  {
    id: "v-006",
    patient_id: "p-002",
    patient_name: "Marcus Chen",
    date: "2026-03-18",
    provider: "Dr. Emily Smith",
    chief_complaint: "Diabetes management review",
    notes:
      "HbA1c 7.2%, slightly above target. Reviewed carb counting and meal planning. Increased metformin to 1000mg BID. Referral to nutritionist placed.",
    created_at: "2026-03-18T09:00:00Z",
    updated_at: "2026-03-18T09:35:00Z",
  },
  {
    id: "v-007",
    patient_id: "p-010",
    patient_name: "James O'Brien",
    date: "2026-03-23",
    provider: "Dr. Emily Smith",
    chief_complaint: "Knee pain and swelling",
    notes:
      "Right knee swollen, limited ROM. X-ray shows moderate osteoarthritis. Cortisone injection administered. Recommended low-impact exercise. Orthopedic referral if no improvement in 6 weeks.",
    created_at: "2026-03-23T10:00:00Z",
    updated_at: "2026-03-23T10:50:00Z",
  },
  {
    id: "v-008",
    patient_id: "p-006",
    patient_name: "Robert Kim",
    date: "2026-03-15",
    provider: "Dr. Emily Smith",
    chief_complaint: "Chest tightness during exertion",
    notes:
      "EKG normal sinus rhythm. No acute findings. Ordered stress test and lipid panel. Patient advised to avoid strenuous activity until results reviewed. Urgent follow-up scheduled.",
    created_at: "2026-03-15T08:00:00Z",
    updated_at: "2026-03-15T08:50:00Z",
  },
  {
    id: "v-009",
    patient_id: "p-005",
    patient_name: "Priya Patel",
    date: "2026-02-28",
    provider: "Dr. Emily Smith",
    chief_complaint: "Anxiety and insomnia",
    notes:
      "Patient reports increased work stress. PHQ-9 score 8 (mild). Discussed sleep hygiene strategies. Started on low-dose sertraline 25mg. CBT referral provided. Follow up in 4 weeks.",
    created_at: "2026-02-28T10:00:00Z",
    updated_at: "2026-02-28T10:40:00Z",
  },
  {
    id: "v-010",
    patient_id: "p-001",
    patient_name: "Sarah Johnson",
    date: "2026-01-10",
    provider: "Dr. Emily Smith",
    chief_complaint: "Migraine with aura",
    notes:
      "Third episode in 2 months. Visual aura lasting ~20 min followed by unilateral headache. Started sumatriptan 50mg PRN. Migraine diary recommended. Neurology referral if frequency increases.",
    created_at: "2026-01-10T15:00:00Z",
    updated_at: "2026-01-10T15:30:00Z",
  },
];

/** Visits occurring in the last 7 days from today's date (2026-03-24). */
export const recentVisits = mockVisits.filter((v) => {
  const visitDate = new Date(v.date);
  const sevenDaysAgo = new Date("2026-03-17");
  return visitDate >= sevenDaysAgo;
});
