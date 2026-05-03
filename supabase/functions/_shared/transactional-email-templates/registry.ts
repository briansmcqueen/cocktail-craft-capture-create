/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as accountDeletionScheduled } from './account-deletion-scheduled.tsx'
import { template as accountDeletionCancelled } from './account-deletion-cancelled.tsx'
import { template as dataExportCompleted } from './data-export-completed.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'account-deletion-scheduled': accountDeletionScheduled,
  'account-deletion-cancelled': accountDeletionCancelled,
  'data-export-completed': dataExportCompleted,
}
