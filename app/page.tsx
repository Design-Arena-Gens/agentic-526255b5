'use client'

import { useState } from 'react'
import { Wand2, Download, Copy, CheckCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [scenario, setScenario] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateScenario = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      setScenario(data.scenario)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération du scénario')
    } finally {
      setLoading(false)
    }
  }

  const downloadJSON = () => {
    if (!scenario) return

    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scenario-make.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    if (!scenario) return

    navigator.clipboard.writeText(JSON.stringify(scenario, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '3rem',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
            }}>
              🤖 Générateur de Scénarios Make.com
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Décrivez votre automatisation et l'IA créera un scénario Make.com complet avec des agents IA intégrés
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333',
            }}>
              Décrivez votre scénario :
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Je veux un scénario qui surveille mes emails Gmail, extrait les informations importantes avec un agent IA, puis crée des tâches dans Notion avec les détails analysés..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '1rem',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            onClick={generateScenario}
            disabled={loading || !prompt.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading && prompt.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Générer le Scénario
              </>
            )}
          </button>

          {scenario && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <h2 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#333',
                }}>
                  📋 Scénario Généré
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '0.5rem 1rem',
                      background: copied ? '#10b981' : '#667eea',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} />
                        Copié!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copier
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadJSON}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#764ba2',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Download size={16} />
                    Télécharger
                  </button>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {JSON.stringify(scenario, null, 2)}
                </pre>
              </div>

              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#e0f2fe',
                borderRadius: '8px',
                border: '1px solid #0ea5e9',
              }}>
                <p style={{ fontSize: '0.9rem', color: '#0c4a6e', margin: 0 }}>
                  💡 <strong>Pour importer :</strong> Copiez le JSON ci-dessus, allez dans Make.com, créez un nouveau scénario et utilisez l'option "Import Blueprint" pour coller ce contenu.
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>
            ✨ Exemples de prompts :
          </h3>
          <ul style={{ color: 'white', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li>Surveiller mes emails et créer des tickets de support dans Notion avec un agent IA qui catégorise l'urgence</li>
            <li>Extraire les données d'un formulaire Typeform, les analyser avec l'IA et envoyer des réponses personnalisées par email</li>
            <li>Surveiller Twitter pour des mots-clés, analyser le sentiment avec l'IA et sauvegarder dans Airtable</li>
            <li>Récupérer des factures depuis Gmail, extraire les données avec l'IA et les enregistrer dans Google Sheets</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  )
}
