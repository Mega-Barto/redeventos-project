export const reportContent = {
  triggerLabel: 'Reportar contenido',
  triggerAriaLabel: 'Reportar este contenido',
  title: 'Reportar contenido',
  description: 'Cuéntanos qué ocurre. Un moderador revisará el reporte.',
  reasonLabel: 'Motivo',
  placeholder: 'Describe qué ocurre',
  cancelLabel: 'Cancelar',
  submitLabel: 'Enviar reporte',
  success: 'Reporte enviado. El moderador puede ocultar el contenido.',
  validationFallback: 'Revisa el reporte',
} as const

export type ReportContent = typeof reportContent
