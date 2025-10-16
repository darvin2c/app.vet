import { useQuery } from '@tanstack/react-query'
import { AttachmentFilters } from '@/schemas/attachments.schema'

// Mock data para attachments
const mockAttachments = [
  {
    id: 'att_001',
    medical_record_id: 'medical_record_001',
    file_name: 'radiografia_torax.jpg',
    file_size: 2048576, // 2MB
    file_type: 'image/jpeg',
    file_url:
      'https://mock-storage.example.com/attachments/radiografia_torax.jpg',
    attachment_type: 'image' as const,
    category: 'xray' as const,
    description: 'Radiografía de tórax - control post-operatorio',
    tags: ['radiografia', 'torax', 'postoperatorio'],
    is_sensitive: true,
    uploaded_by: 'user_001',
    tenant_id: 'mock-tenant-id',
    created_at: '2024-12-19T10:30:00Z',
    created_by: 'user_001',
    updated_at: '2024-12-19T10:30:00Z',
    updated_by: 'user_001',
  },
  {
    id: 'att_002',
    medical_record_id: 'medical_record_001',
    file_name: 'analisis_sangre.pdf',
    file_size: 512000, // 500KB
    file_type: 'application/pdf',
    file_url:
      'https://mock-storage.example.com/attachments/analisis_sangre.pdf',
    attachment_type: 'document' as const,
    category: 'blood_test' as const,
    description: 'Análisis de sangre completo - hemograma',
    tags: ['analisis', 'sangre', 'hemograma'],
    is_sensitive: true,
    uploaded_by: 'user_002',
    tenant_id: 'mock-tenant-id',
    created_at: '2024-12-19T09:15:00Z',
    created_by: 'user_002',
    updated_at: '2024-12-19T09:15:00Z',
    updated_by: 'user_002',
  },
  {
    id: 'att_003',
    medical_record_id: 'medical_record_002',
    file_name: 'ecografia_abdominal.mp4',
    file_size: 15728640, // 15MB
    file_type: 'video/mp4',
    file_url:
      'https://mock-storage.example.com/attachments/ecografia_abdominal.mp4',
    attachment_type: 'video' as const,
    category: 'ultrasound' as const,
    description: 'Ecografía abdominal - evaluación de órganos internos',
    tags: ['ecografia', 'abdomen', 'ultrasonido'],
    is_sensitive: true,
    uploaded_by: 'user_001',
    tenant_id: 'mock-tenant-id',
    created_at: '2024-12-19T08:45:00Z',
    created_by: 'user_001',
    updated_at: '2024-12-19T08:45:00Z',
    updated_by: 'user_001',
  },
  {
    id: 'att_004',
    medical_record_id: 'medical_record_001',
    file_name: 'consentimiento_cirugia.pdf',
    file_size: 256000, // 250KB
    file_type: 'application/pdf',
    file_url:
      'https://mock-storage.example.com/attachments/consentimiento_cirugia.pdf',
    attachment_type: 'document' as const,
    category: 'consent_form' as const,
    description: 'Formulario de consentimiento firmado para cirugía',
    tags: ['consentimiento', 'cirugia', 'formulario'],
    is_sensitive: false,
    uploaded_by: 'user_003',
    tenant_id: 'mock-tenant-id',
    created_at: '2024-12-19T07:20:00Z',
    created_by: 'user_003',
    updated_at: '2024-12-19T07:20:00Z',
    updated_by: 'user_003',
  },
]

// Mock function para simular la consulta de attachments
const mockFetchAttachments = async (filters: AttachmentFilters = {}) => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredAttachments = [...mockAttachments]

  // Aplicar filtros
  if (filters.medical_record_id) {
    filteredAttachments = filteredAttachments.filter(
      (att) => att.medical_record_id === filters.medical_record_id
    )
  }

  if (filters.attachment_type) {
    filteredAttachments = filteredAttachments.filter(
      (att) => att.attachment_type === filters.attachment_type
    )
  }

  if (filters.category) {
    filteredAttachments = filteredAttachments.filter(
      (att) => att.category === filters.category
    )
  }

  if (filters.is_sensitive !== undefined) {
    filteredAttachments = filteredAttachments.filter(
      (att) => att.is_sensitive === filters.is_sensitive
    )
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredAttachments = filteredAttachments.filter(
      (att) =>
        att.file_name.toLowerCase().includes(searchLower) ||
        att.description?.toLowerCase().includes(searchLower) ||
        att.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredAttachments = filteredAttachments.filter((att) =>
      filters.tags!.some((tag) => att.tags.includes(tag))
    )
  }

  // Ordenar por fecha de creación (más recientes primero)
  filteredAttachments.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return filteredAttachments
}

export function useAttachmentList(filters: AttachmentFilters = {}) {
  return useQuery({
    queryKey: ['mock-tenant-id', 'attachments', filters],
    queryFn: () => mockFetchAttachments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
