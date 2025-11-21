import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Tu es un expert en automatisation Make.com. Tu dois créer des scénarios Make.com détaillés au format JSON Blueprint qui peuvent être importés directement dans Make.com.

Structure d'un scénario Make.com :
- flow: tableau de modules connectés
- name: nom du scénario
- description: description du scénario

Chaque module doit avoir :
- id: identifiant unique (numéro)
- module: nom du module (ex: "gmail:watchEmails", "openai:chat", "notion:createPage", "http:makeRequest")
- version: numéro de version (généralement 3)
- parameters: paramètres spécifiques au module
- mapper: mappage des données depuis d'autres modules
- metadata: position UI et configuration

Modules AI courants :
1. "openai:chat" - Agent OpenAI GPT pour analyse, extraction, classification
2. "anthropic:claude" - Agent Claude pour traitement de texte avancé
3. "google:gemini" - Agent Google Gemini
4. "http:makeRequest" - Appels API vers n'importe quel service AI

Modules populaires :
- gmail:watchEmails, gmail:sendEmail
- notion:createPage, notion:updatePage
- airtable:createRecord, airtable:getRecords
- slack:postMessage
- googleSheets:addRow
- typeform:watchResponses
- twitter:search
- webhook:customWebhook

IMPORTANT: Tu dois créer un JSON valide qui respecte exactement ce format et inclut au moins un module AI pour traiter/analyser les données.

Exemple de structure de base:
{
  "name": "Mon Scénario",
  "flow": [
    {
      "id": 1,
      "module": "gmail:watchEmails",
      "version": 3,
      "parameters": {
        "filter": "is:unread"
      },
      "mapper": {},
      "metadata": {
        "designer": {
          "x": 0,
          "y": 0
        }
      }
    },
    {
      "id": 2,
      "module": "openai:chat",
      "version": 3,
      "parameters": {
        "model": "gpt-4",
        "messages": [
          {
            "role": "user",
            "content": "Analyse cet email et extrait les informations clés: {{1.content}}"
          }
        ]
      },
      "mapper": {},
      "metadata": {
        "designer": {
          "x": 300,
          "y": 0
        }
      }
    }
  ],
  "metadata": {
    "version": 1
  }
}

Crée maintenant un scénario complet et fonctionnel basé sur la demande de l'utilisateur.`

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Le prompt est requis' },
        { status: 400 }
      )
    }

    // Génération du scénario avec l'IA
    const scenario = await generateScenarioWithAI(prompt)

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du scénario' },
      { status: 500 }
    )
  }
}

async function generateScenarioWithAI(userPrompt: string) {
  // Si l'API Key Anthropic est disponible, utiliser l'API
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: `${SYSTEM_PROMPT}\n\nDemande de l'utilisateur: ${userPrompt}\n\nRéponds UNIQUEMENT avec le JSON du scénario Make.com, sans texte avant ou après.`
            }
          ]
        })
      })

      const data = await response.json()

      if (data.content && data.content[0] && data.content[0].text) {
        const text = data.content[0].text.trim()
        // Extraire le JSON si entouré de ```
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
        return JSON.parse(jsonMatch[1].trim())
      }
    } catch (error) {
      console.error('Erreur API Anthropic:', error)
    }
  }

  // Fallback: génération de scénario basique basé sur le prompt
  return generateFallbackScenario(userPrompt)
}

function generateFallbackScenario(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()

  // Détection des services mentionnés
  const hasGmail = lowerPrompt.includes('email') || lowerPrompt.includes('gmail')
  const hasNotion = lowerPrompt.includes('notion')
  const hasSlack = lowerPrompt.includes('slack')
  const hasAirtable = lowerPrompt.includes('airtable')
  const hasSheets = lowerPrompt.includes('sheets') || lowerPrompt.includes('google sheets')
  const hasTypeform = lowerPrompt.includes('typeform')
  const hasTwitter = lowerPrompt.includes('twitter')
  const hasWebhook = lowerPrompt.includes('webhook') || lowerPrompt.includes('formulaire')

  const modules: any[] = []
  let moduleId = 1
  let xPos = 0

  // Module de déclenchement
  if (hasGmail) {
    modules.push({
      id: moduleId++,
      module: 'gmail:watchEmails',
      version: 3,
      parameters: {
        filter: 'is:unread',
        maxResults: 10
      },
      mapper: {},
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {},
        parameters: [
          { name: 'filter', type: 'text', label: 'Filtre', required: false }
        ]
      }
    })
    xPos += 300
  } else if (hasTypeform) {
    modules.push({
      id: moduleId++,
      module: 'typeform:watchResponses',
      version: 3,
      parameters: {},
      mapper: {},
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
    xPos += 300
  } else if (hasWebhook) {
    modules.push({
      id: moduleId++,
      module: 'webhook:customWebhook',
      version: 3,
      parameters: {},
      mapper: {},
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
    xPos += 300
  } else if (hasTwitter) {
    modules.push({
      id: moduleId++,
      module: 'twitter:search',
      version: 3,
      parameters: {
        query: 'mot-clé à surveiller'
      },
      mapper: {},
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
    xPos += 300
  } else {
    modules.push({
      id: moduleId++,
      module: 'webhook:customWebhook',
      version: 3,
      parameters: {},
      mapper: {},
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
    xPos += 300
  }

  // Module AI (toujours présent)
  const previousModuleId = moduleId - 1
  modules.push({
    id: moduleId++,
    module: 'openai:chat',
    version: 3,
    parameters: {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant IA qui analyse et extrait des informations structurées.'
        },
        {
          role: 'user',
          content: `Analyse ces données et extrais les informations importantes:\n\n{{${previousModuleId}.text}}`
        }
      ]
    },
    mapper: {},
    metadata: {
      designer: { x: xPos, y: 0 },
      restore: {},
      parameters: [
        { name: 'model', type: 'select', label: 'Modèle', required: true },
        { name: 'messages', type: 'array', label: 'Messages', required: true }
      ],
      expect: [
        { name: 'model', type: 'select', label: 'Modèle', required: true },
        { name: 'messages', type: 'array', label: 'Messages', required: true }
      ]
    }
  })
  xPos += 300

  const aiModuleId = moduleId - 1

  // Module d'action finale
  if (hasNotion) {
    modules.push({
      id: moduleId++,
      module: 'notion:createPage',
      version: 3,
      parameters: {
        databaseId: 'VOTRE_DATABASE_ID'
      },
      mapper: {
        title: `{{${aiModuleId}.choices[0].message.content}}`,
        properties: {}
      },
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
  } else if (hasSlack) {
    modules.push({
      id: moduleId++,
      module: 'slack:postMessage',
      version: 3,
      parameters: {
        channel: '#général'
      },
      mapper: {
        text: `{{${aiModuleId}.choices[0].message.content}}`
      },
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
  } else if (hasAirtable) {
    modules.push({
      id: moduleId++,
      module: 'airtable:createRecord',
      version: 3,
      parameters: {
        baseId: 'VOTRE_BASE_ID',
        tableId: 'VOTRE_TABLE_ID'
      },
      mapper: {
        fields: {
          'Analyse': `{{${aiModuleId}.choices[0].message.content}}`
        }
      },
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
  } else if (hasSheets) {
    modules.push({
      id: moduleId++,
      module: 'google-sheets:addRow',
      version: 3,
      parameters: {
        spreadsheetId: 'VOTRE_SPREADSHEET_ID',
        sheetId: 'Sheet1'
      },
      mapper: {
        values: [
          `{{${aiModuleId}.choices[0].message.content}}`
        ]
      },
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
  } else {
    modules.push({
      id: moduleId++,
      module: 'gmail:sendEmail',
      version: 3,
      parameters: {},
      mapper: {
        to: 'votre-email@example.com',
        subject: 'Analyse IA',
        text: `{{${aiModuleId}.choices[0].message.content}}`
      },
      metadata: {
        designer: { x: xPos, y: 0 },
        restore: {}
      }
    })
  }

  return {
    name: 'Scénario IA Généré',
    description: prompt.substring(0, 200),
    flow: modules,
    metadata: {
      version: 1,
      scenario: {
        roundtrips: 1,
        maxErrors: 3,
        autoCommit: true,
        sequential: false,
        confidential: false,
        dataloss: false,
        dlq: false
      },
      designer: {
        orphans: []
      }
    }
  }
}
