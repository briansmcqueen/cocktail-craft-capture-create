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
import { container, footer, h1, main, text, wordmark } from './_styles.ts'

const SITE_NAME = 'BARBOOK'

const AccountDeletionCancelledEmail = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} account deletion has been cancelled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>{SITE_NAME}</Text>
        <Heading style={h1}>Deletion cancelled</Heading>
        <Text style={text}>
          Welcome back. We've cancelled the pending deletion of your{' '}
          {SITE_NAME} account — nothing was removed and your recipes, bar, and
          social activity are intact.
        </Text>
        <Text style={text}>
          If you didn't request this, change your password right away and reach
          out to <a href="mailto:hello@barbook.io">hello@barbook.io</a>.
        </Text>
        <Text style={footer}>Cheers from the {SITE_NAME} team.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AccountDeletionCancelledEmail,
  subject: `Your ${SITE_NAME} account deletion was cancelled`,
  displayName: 'Account deletion cancelled',
  previewData: {},
} satisfies TemplateEntry