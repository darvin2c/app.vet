import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type InviteEmailProps = {
  company: string
  recipientEmail: string
  roleName: string
  expiresAt: string
  acceptUrl: string
  message?: string
}

export default function InviteEmail({
  company,
  recipientEmail,
  roleName,
  expiresAt,
  acceptUrl,
  message,
}: InviteEmailProps) {
  const previewText = `Invitación a ${company}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body className="bg-white m-auto font-sans">
        <Container className="mx-auto p-6 max-w-[560px]">
          <Heading className="text-xl font-semibold mb-2">
            Te han invitado a {company}
          </Heading>
          <Text className="text-sm text-gray-700 mb-2">
            Hola, {recipientEmail}
          </Text>
          <Text className="text-sm text-gray-700 mb-4">
            Has sido invitado con el rol <strong>{roleName}</strong>.
          </Text>
          {message && (
            <Section className="mb-4">
              <Text className="text-sm text-gray-700 whitespace-pre-wrap">
                {message}
              </Text>
            </Section>
          )}
          <Section className="mb-6">
            <Button
              className="py-2.5 px-5 bg-black rounded-md text-white text-sm font-semibold no-underline text-center"
              href={acceptUrl}
            >
              Aceptar invitación
            </Button>
          </Section>
          <Text className="text-xs text-gray-600">
            Esta invitación expira el {new Date(expiresAt).toLocaleString()}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
