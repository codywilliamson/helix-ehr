-- Create the visits table for clinical encounter notes.
-- Each visit is linked to a patient and records the clinical interaction.

CREATE TABLE visits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  provider        TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visits_patient_id ON visits (patient_id);
CREATE INDEX idx_visits_date ON visits (date);

CREATE TRIGGER trg_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
