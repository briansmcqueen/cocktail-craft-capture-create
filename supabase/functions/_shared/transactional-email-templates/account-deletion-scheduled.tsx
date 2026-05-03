/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import {
  button,
  callout,
  container,
  footer,
  h1,
  main,
  subtle,
  text,
  wordmark,
} from './_styles.ts'

interface Props {
  scheduledFor?: string
  cancelUrl?: string
}

const SITE_NAME = 'BARBOOK'

function formatDate(iso?: string) {
  if (!iso) return 'in 7 days'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'in 7 days'
  }
}

const AccountDeletionScheduledEmail = ({ scheduledFor, cancelUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} account is scheduled for deletion</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>{SITE_NAME}</Text>
        <Heading style={h1}>Account scheduled for deletion</Heading>
        <Text style={text}>
          We've received your request to delete your {SITE_NAME} account. Your
          account is scheduled for permanent removal on{' '}
          <strong>{formatDate(scheduledFor)}</strong>.
        </Text>
        <div style={callout}>
          <Text style={{ ...subtle, margin: 0 }}>
            <strong>Changed your mind?</strong> Sign back in any time before the
            scheduled date and cancel the request from Settings → Danger Zone.
          </Text>
        </div>
        {cancelUrl ? (
          <Button style={button} href={cancelUrl}>
            Cancel deletion
          </Button>
        ) : null}
        <Text style={footer}>
          After the scheduled date, your profile, recipes, ratings, comments,
          favorites, follows, bar inventory, and uploaded images will be
          permanently erased. Encrypted backups are overwritten on rolling
          rotation and we cannot restore deleted accounts.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AccountDeletionScheduledEmail,
  subject: `Your ${SITE_NAME} account is scheduled for deletion`,
  displayName: 'Account deletion scheduled',
  previewData: {
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    cancelUrl: 'https://barbook.io/settings',
  },
} satisfies TemplateEntry