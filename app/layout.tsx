import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Générateur de Scénarios Make.com',
  description: 'Créez des scénarios Make.com avec des agents IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
