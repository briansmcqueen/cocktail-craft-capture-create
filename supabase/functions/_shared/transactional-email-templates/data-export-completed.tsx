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
import type { TemplateEntry } from './registry.ts'
import { container, footer, h1, main, subtle, text, wordmark } from './_styles.ts'

const SITE_NAME = 'BARBOOK'

interface Props {
  bytes?: number
  tables?: number
}

function formatBytes(b?: number) {
  if (!b || b <= 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = b
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return ` (${n.toFixed(1)} ${units[i]})`
}

const DataExportCompletedEmail = ({ bytes, tables }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} data export is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>{SITE_NAME}</Text>
        <Heading style={h1}>Your data export is ready</Heading>
        <Text style={text}>
          We just generated a copy of the personal data we hold about your
          account{formatBytes(bytes)}
          {tables ? `, covering ${tables} data categories` : ''}. The download
          should already be saved to your device.
        </Text>
        <Text style={subtle}>
          The archive contains your profile, recipes, ratings, comments,
          favorites, follows, bar inventory, and an inventory of files you've
          uploaded. Treat the file like a backup — it contains personal data.
        </Text>
        <Text style={text}>
          If you didn't request this export, please secure your account by
          changing your password and contact{' '}
          <a href="mailto:hello@barbook.io">hello@barbook.io</a>.
        </Text>
        <Text style={footer}>
          You can request a new export at any time from Settings.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DataExportCompletedEmail,
  subject: `Your ${SITE_NAME} data export is ready`,
  displayName: 'Data export ready',
  previewData: { bytes: 184320, tables: 14 },
} satisfies TemplateEntry