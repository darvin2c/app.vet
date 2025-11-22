import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
} from '@react-email/components'

type AppointmentWrapperProps = {
  title?: string
  contentHtml: string
}

export default function AppointmentWrapperEmail({
  title = 'Detalles de Cita',
  contentHtml,
}: AppointmentWrapperProps) {
  const previewText = title
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body className="bg-white m-auto font-sans">
        <Container className="mx-auto p-6 max-w-[560px]">
          <Heading className="text-xl font-semibold mb-4">{title}</Heading>
          <Section>
            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              className="text-sm text-gray-700"
            />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
