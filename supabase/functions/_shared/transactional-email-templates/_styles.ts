// Shared brand styles for BARBOOK transactional email templates.
// Email body background must always be #ffffff.

export const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}
export const container = { padding: '32px 28px', maxWidth: '520px' }
export const wordmark = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.25em',
  color: '#065F46',
  textTransform: 'uppercase' as const,
  margin: '0 0 28px',
}
export const h1 = {
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#111827',
  margin: '0 0 20px',
  letterSpacing: '-0.01em',
}
export const text = {
  fontSize: '15px',
  color: '#4B5563',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
export const subtle = {
  fontSize: '13px',
  color: '#6B7280',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
export const link = { color: '#065F46', textDecoration: 'underline' }
export const button = {
  backgroundColor: '#065F46',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500' as const,
  borderRadius: '8px',
  padding: '12px 24px',
  textDecoration: 'none',
  letterSpacing: '0.025em',
}
export const callout = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '0 0 24px',
}
export const footer = {
  fontSize: '12px',
  color: '#9CA3AF',
  margin: '32px 0 0',
  lineHeight: '1.5',
}