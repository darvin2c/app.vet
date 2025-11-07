import type { Metadata } from 'next'

export function generateReferenceMetadata({
  title,
  description,
}: {
  title: string
  description: string
}): Metadata {
  return {
    title: `${title} - Referencias`,
    description,
  }
}
