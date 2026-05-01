/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>BARBOOK</Text>
        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px' }
const wordmark = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.25em',
  color: '#065F46',
  textTransform: 'uppercase' as const,
  margin: '0 0 28px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#111827',
  margin: '0 0 20px',
  letterSpacing: '-0.01em',
}
const text = {
  fontSize: '15px',
  color: '#4B5563',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const link = { color: '#065F46', textDecoration: 'underline' }
const button = {
  backgroundColor: '#065F46',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500' as const,
  borderRadius: '8px',
  padding: '12px 24px',
  textDecoration: 'none',
  letterSpacing: '0.025em',
}
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#065F46',
  letterSpacing: '0.15em',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '32px 0 0', lineHeight: '1.5' }
