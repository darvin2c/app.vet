-- Crear enum para tipos de archivos
CREATE TYPE attachment_type AS ENUM (
  'image',
  'document', 
  'video',
  'audio',
  'other'
);

-- Crear enum para categorías de attachments médicos
CREATE TYPE attachment_category AS ENUM (
  'xray',
  'ultrasound',
  'blood_test',
  'urine_test',
  'biopsy',
  'vaccination_record',
  'medical_report',
  'prescription',
  'consent_form',
  'insurance_document',
  'other'
);

-- Crear tabla de attachments
CREATE TABLE IF NOT EXISTS public.treatment_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_id UUID NOT NULL REFERENCES public.treatments(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 52428800), -- 50MB máximo
  file_type VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  attachment_type attachment_type NOT NULL,
  category attachment_category,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_sensitive BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES auth.users(id),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_treatment_attachments_treatment_id ON public.treatment_attachments(treatment_id);
CREATE INDEX idx_treatment_attachments_tenant_id ON public.treatment_attachments(tenant_id);
CREATE INDEX idx_treatment_attachments_attachment_type ON public.treatment_attachments(attachment_type);
CREATE INDEX idx_treatment_attachments_category ON public.treatment_attachments(category);
CREATE INDEX idx_treatment_attachments_is_sensitive ON public.treatment_attachments(is_sensitive);
CREATE INDEX idx_treatment_attachments_uploaded_by ON public.treatment_attachments(uploaded_by);
CREATE INDEX idx_treatment_attachments_created_at ON public.treatment_attachments(created_at);
CREATE INDEX idx_treatment_attachments_tags ON public.treatment_attachments USING GIN(tags);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.treatment_attachments ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS
CREATE POLICY "Users can view attachments from their tenant" ON public.treatment_attachments
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments in their tenant" ON public.treatment_attachments
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update attachments in their tenant" ON public.treatment_attachments
  FOR UPDATE USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete attachments in their tenant" ON public.treatment_attachments
  FOR DELETE USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_treatment_attachments_updated_at 
  BEFORE UPDATE ON public.treatment_attachments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear trigger para establecer created_by y updated_by automáticamente
CREATE OR REPLACE FUNCTION set_user_tracking()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
    NEW.uploaded_by = COALESCE(NEW.uploaded_by, auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    NEW.created_by = OLD.created_by; -- Preservar created_by original
    NEW.uploaded_by = OLD.uploaded_by; -- Preservar uploaded_by original
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_treatment_attachments_user_tracking
  BEFORE INSERT OR UPDATE ON public.treatment_attachments
  FOR EACH ROW EXECUTE FUNCTION set_user_tracking();

-- Otorgar permisos a los roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatment_attachments TO authenticated;
GRANT SELECT ON public.treatment_attachments TO anon;

-- Comentarios para documentación
COMMENT ON TABLE public.treatment_attachments IS 'Tabla para almacenar archivos adjuntos relacionados con tratamientos médicos';
COMMENT ON COLUMN public.treatment_attachments.treatment_id IS 'ID del tratamiento al que pertenece el archivo';
COMMENT ON COLUMN public.treatment_attachments.file_name IS 'Nombre original del archivo';
COMMENT ON COLUMN public.treatment_attachments.file_size IS 'Tamaño del archivo en bytes (máximo 50MB)';
COMMENT ON COLUMN public.treatment_attachments.file_type IS 'Tipo MIME del archivo';
COMMENT ON COLUMN public.treatment_attachments.file_url IS 'URL donde está almacenado el archivo';
COMMENT ON COLUMN public.treatment_attachments.attachment_type IS 'Tipo general del archivo (imagen, documento, etc.)';
COMMENT ON COLUMN public.treatment_attachments.category IS 'Categoría médica específica del archivo';
COMMENT ON COLUMN public.treatment_attachments.description IS 'Descripción opcional del archivo';
COMMENT ON COLUMN public.treatment_attachments.tags IS 'Array de tags para categorización adicional';
COMMENT ON COLUMN public.treatment_attachments.is_sensitive IS 'Indica si el archivo contiene información médica sensible';
COMMENT ON COLUMN public.treatment_attachments.uploaded_by IS 'Usuario que subió el archivo';