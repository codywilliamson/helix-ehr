-- Create the patients table for core EHR patient records.
-- Stores demographic and contact information for each patient.

CREATE TABLE patients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  dob        DATE NOT NULL,
  gender     TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'unknown')),
  email      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patients_last_name ON patients (last_name);
CREATE INDEX idx_patients_dob ON patients (dob);

-- Automatically update the updated_at timestamp on row modification.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
