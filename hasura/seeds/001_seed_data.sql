-- Seed data for helix-ehr local development.
-- Run after applying migrations.

-- Users (passwords are bcrypt hashes of "password")
-- For dev convenience, using a pre-computed hash.
INSERT INTO users (id, email, password_hash, name, role) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@helix.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dr. Admin', 'admin'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'provider@helix.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dr. Emily Smith', 'provider'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'nurse@helix.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'James Rivera', 'staff')
ON CONFLICT (id) DO NOTHING;

-- Patients
INSERT INTO patients (id, first_name, last_name, dob, gender, email, phone) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Sarah',   'Johnson',    '1985-03-12', 'female', 'sarah.johnson@email.com', '(555) 234-5678'),
  ('d1000000-0000-0000-0000-000000000002', 'Marcus',  'Chen',       '1972-08-24', 'male',   'm.chen@email.com',        '(555) 345-6789'),
  ('d1000000-0000-0000-0000-000000000003', 'Amara',   'Okafor',     '1990-11-05', 'female', 'amara.o@email.com',       '(555) 456-7890'),
  ('d1000000-0000-0000-0000-000000000004', 'David',   'Martinez',   '1968-01-30', 'male',   'david.m@email.com',       '(555) 567-8901'),
  ('d1000000-0000-0000-0000-000000000005', 'Priya',   'Patel',      '1995-06-18', 'female', 'priya.patel@email.com',   '(555) 678-9012'),
  ('d1000000-0000-0000-0000-000000000006', 'Robert',  'Kim',        '1958-12-03', 'male',   NULL,                      '(555) 789-0123'),
  ('d1000000-0000-0000-0000-000000000007', 'Elena',   'Vasquez',    '1982-04-22', 'female', 'elena.v@email.com',       '(555) 890-1234'),
  ('d1000000-0000-0000-0000-000000000008', 'Thomas',  'Wright',     '1975-09-14', 'male',   't.wright@email.com',      NULL),
  ('d1000000-0000-0000-0000-000000000009', 'Fatima',  'Al-Hassan',  '1988-07-08', 'female', 'fatima.ah@email.com',     '(555) 012-3456'),
  ('d1000000-0000-0000-0000-000000000010', 'James',   'O''Brien',   '1952-02-28', 'male',   'james.obrien@email.com',  '(555) 123-4567')
ON CONFLICT (id) DO NOTHING;

-- Visits
INSERT INTO visits (id, patient_id, date, provider, chief_complaint, notes) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', '2026-03-24', 'Dr. Emily Smith',
    'Annual wellness exam',
    'Patient in good health. BMI within normal range. Updated immunizations. Recommended continued exercise regimen and follow-up in 12 months.'),

  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', '2026-03-22', 'Dr. Emily Smith',
    'Elevated blood pressure follow-up',
    'BP 142/88. Adjusted lisinopril dosage from 10mg to 20mg daily. Patient advised on low-sodium diet. Recheck in 4 weeks.'),

  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000007', '2026-03-21', 'Dr. Emily Smith',
    'Persistent lower back pain',
    'Pain rated 6/10, radiating to left leg. No red flags. Ordered lumbar X-ray. Prescribed physical therapy 2x/week for 6 weeks. Ibuprofen 400mg as needed.'),

  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', '2026-03-20', 'Dr. Emily Smith',
    'Sore throat and fatigue',
    'Rapid strep test positive. Prescribed amoxicillin 500mg TID for 10 days. Rest and fluids recommended. Follow up if symptoms worsen.'),

  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000009', '2026-03-19', 'Dr. Emily Smith',
    'Prenatal checkup — 28 weeks',
    'Fetal heartbeat strong at 145 bpm. Fundal height appropriate for gestational age. Glucose tolerance test results normal. Next appointment in 2 weeks.'),

  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', '2026-03-18', 'Dr. Emily Smith',
    'Diabetes management review',
    'HbA1c 7.2%, slightly above target. Reviewed carb counting and meal planning. Increased metformin to 1000mg BID. Referral to nutritionist placed.'),

  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000010', '2026-03-23', 'Dr. Emily Smith',
    'Knee pain and swelling',
    'Right knee swollen, limited ROM. X-ray shows moderate osteoarthritis. Cortisone injection administered. Recommended low-impact exercise. Orthopedic referral if no improvement in 6 weeks.'),

  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000006', '2026-03-15', 'Dr. Emily Smith',
    'Chest tightness during exertion',
    'EKG normal sinus rhythm. No acute findings. Ordered stress test and lipid panel. Patient advised to avoid strenuous activity until results reviewed. Urgent follow-up scheduled.'),

  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000005', '2026-02-28', 'Dr. Emily Smith',
    'Anxiety and insomnia',
    'Patient reports increased work stress. PHQ-9 score 8 (mild). Discussed sleep hygiene strategies. Started on low-dose sertraline 25mg. CBT referral provided. Follow up in 4 weeks.'),

  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000001', '2026-01-10', 'Dr. Emily Smith',
    'Migraine with aura',
    'Third episode in 2 months. Visual aura lasting ~20 min followed by unilateral headache. Started sumatriptan 50mg PRN. Migraine diary recommended. Neurology referral if frequency increases.')
ON CONFLICT (id) DO NOTHING;
