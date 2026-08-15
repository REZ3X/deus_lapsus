```json
{
  "name": "smart",
  "nodes": [
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.message.text }}",
        "needsFallback": true,
        "options": {
          "systemMessage": "=# N.A.W Bot System Prompt\n\nKamu adalah N.A.W Bot, asisten AI untuk sistem hidroponik pintar berbasis IoT.\n\nKeahlian utama:\n\n* Hidroponik\n* IoT\n* MQTT\n* Monitoring sensor\n* Analisis kondisi lingkungan tanaman\n* Kontrol pompa air\n\nTugas utama kamu adalah membantu pengguna Telegram memantau kondisi hidroponik dan mengendalikan pompa melalui tools yang tersedia.\n\n## Tools\n\n### sensor_data\n\nMengambil data sensor terbaru dari database.\n\nData yang tersedia:\n\n* air_temp (°C)\n* air_humid (%)\n* water_level (cm)\n* createdAt (UTC)\n\n### mqtt_override\n\nMengirim perintah override ke MQTT topic:\n\nsetupSendiri/override\n\nPayload yang valid:\n\nMode otomatis:\n{\n\"mode\": \"auto\"\n}\n\nPompa ON:\n{\n\"mode\": \"manual\",\n\"pump\": true\n}\n\nPompa OFF:\n{\n\"mode\": \"manual\",\n\"pump\": false\n}\n\n## Aturan Penggunaan Tool\n\n### Monitoring Data\n\nGunakan tool sensor_data ketika:\n\n* User meminta data sensor\n* User meminta status hidroponik\n* User menanyakan suhu\n* User menanyakan kelembapan\n* User menanyakan level air\n* User menggunakan command /monitor\n\nJangan pernah mengarang data sensor.\n\nSelalu ambil data terbaru menggunakan tool sensor_data.\n\nKonversi createdAt dari UTC ke UTC+7 sebelum ditampilkan.\n\n## Command Telegram\n\n### /monitor\n\nTindakan:\n\n1. Gunakan tool sensor_data\n2. Ambil data terbaru\n3. Tampilkan:\n\n   * suhu\n   * kelembapan\n   * level air\n   * waktu data (UTC+7)\n4. Analisis kondisi sistem\n\n### /pompa_on\n\nTindakan:\n\n1. Gunakan tool mqtt_override\n2. Kirim:\n\n{\n\"mode\": \"manual\",\n\"pump\": true\n}\n\n3. Beri konfirmasi bahwa pompa telah diubah ke mode manual dan dinyalakan.\n\n### /pompa_off\n\nTindakan:\n\n1. Gunakan tool mqtt_override\n2. Kirim:\n\n{\n\"mode\": \"manual\",\n\"pump\": false\n}\n\n3. Beri konfirmasi bahwa pompa telah diubah ke mode manual dan dimatikan.\n\n### /auto\n\nTindakan:\n\n1. Gunakan tool mqtt_override\n2. Kirim:\n\n{\n\"mode\": \"auto\"\n}\n\n3. Beri konfirmasi bahwa sistem telah kembali ke mode otomatis.\n\n## Analisis Sensor\n\nSetelah memperoleh data sensor:\n\n### Suhu\n\n* 18-30°C = normal\n* > 30°C = peringatan suhu tinggi\n* <15°C = peringatan suhu rendah\n\n### Kelembapan\n\n* 50-80% = normal\n* Di luar rentang tersebut = beri peringatan\n\n### Water Level\n\n* Water level kecil berarti tangki semakin penuh\n* Water level besar berarti tangki semakin kosong\n\nGunakan informasi tersebut untuk memberikan analisis singkat.\n\n## Penanganan Error\n\nJika nilai sensor null, kosong, atau tidak valid:\n\n* Jangan mengarang data\n* Jelaskan bahwa data sensor tidak tersedia\n* Sarankan pemeriksaan:\n\n  * sensor DHT22\n  * sensor ultrasonik\n  * kabel sensor\n  * koneksi MQTT\n  * pipeline database\n\n## Format Jawaban\n\nGunakan bahasa Indonesia.\n\nJawaban harus:\n\n* Ringkas\n* Informatif\n* Mudah dipahami\n\nGunakan nama pengguna jika tersedia:\n\n{{ $json.message.from.first_name }}\n\nJangan gunakan MarkdownV2 Telegram.\nJangan menggunakan karakter Markdown yang memerlukan escaping.\nGunakan teks biasa agar kompatibel dengan Telegram.\n",
          "maxIterations": 2,
          "enableStreaming": true
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 3,
      "position": [
        64,
        -16
      ],
      "id": "b95727d2-7158-4809-b36f-73d2e3dfedc5",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "operation": "get",
        "dataTableId": {
          "__rl": true,
          "value": "clcxodEIfbsgzt4r",
          "mode": "list",
          "cachedResultName": "smart_hydroponic",
          "cachedResultUrl": "/projects/woV91TsnIO9n6C1y/datatables/clcxodEIfbsgzt4r"
        },
        "matchType": "allConditions",
        "returnAll": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Return_All', ``, 'boolean') }}",
        "orderBy": true
      },
      "type": "n8n-nodes-base.dataTableTool",
      "typeVersion": 1,
      "position": [
        400,
        208
      ],
      "id": "d3307f67-dcd7-4a5b-86e7-74af903c77f6",
      "name": "sensor_data"
    },
    {
      "parameters": {
        "toolDescription": "Mengirim perintah override ke sistem hidroponik via MQTT topic setupSendiri/override.\n\nGunakan tool ini HANYA untuk command berikut:\n- /pompa_on  → kirim {\"mode\": \"manual\", \"pump\": true}\n- /pompa_off → kirim {\"mode\": \"manual\", \"pump\": false}\n- /auto      → kirim {\"mode\": \"auto\"}\n\nJangan kirim field lain selain yang didefinisikan di schema.\nJangan kirim topic, toolCallId, atau metadata apapun.\nHanya kirim nilai field 'payload' sebagai JSON string.",
        "topic": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Topic', ``, 'string') }}",
        "sendInputData": false,
        "message": "={{ $fromAI('payload') }}",
        "options": {}
      },
      "type": "n8n-nodes-base.mqttTool",
      "typeVersion": 1,
      "position": [
        272,
        208
      ],
      "id": "4ec7e954-8400-4c50-aa3e-4441076567dd",
      "name": "mqtt_override",
      "credentials": {
        "mqtt": {
          "id": "cJ4qrCx4mEBmikuf",
          "name": "MQTT account"
        }
      }
    },
    {
      "parameters": {
        "topics": "setupSendiri/air",
        "options": {}
      },
      "type": "n8n-nodes-base.mqttTrigger",
      "typeVersion": 1,
      "position": [
        -64,
        416
      ],
      "id": "fd16a562-7773-4ceb-820a-3fe2397a92a5",
      "name": "air",
      "credentials": {
        "mqtt": {
          "id": "cJ4qrCx4mEBmikuf",
          "name": "MQTT account"
        }
      }
    },
    {
      "parameters": {
        "topics": "setupSendiri/sonic",
        "options": {}
      },
      "type": "n8n-nodes-base.mqttTrigger",
      "typeVersion": 1,
      "position": [
        -64,
        560
      ],
      "id": "ffa748f0-6bda-4e6e-b711-5d0b7552513b",
      "name": "sonic",
      "credentials": {
        "mqtt": {
          "id": "cJ4qrCx4mEBmikuf",
          "name": "MQTT account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "711eeae5-0040-42ca-8694-683c27e72654",
              "name": "air_temp",
              "value": "={{ $json.message.parseJson().temperature }}",
              "type": "string"
            },
            {
              "id": "0a2d8108-4b81-4587-a0c4-f296b1eff91b",
              "name": "air_humid",
              "value": "={{ $json.message.parseJson().humidity }}",
              "type": "string"
            },
            {
              "id": "8df812dc-93ef-4a16-861e-49a9f518671d",
              "name": "water_level",
              "value": "={{ $json.message.parseJson().distance_cm }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        176,
        496
      ],
      "id": "64a6041a-1b22-4dbd-a948-ea2a768272e1",
      "name": "Edit Fields"
    },
    {
      "parameters": {
        "dataTableId": {
          "__rl": true,
          "value": "clcxodEIfbsgzt4r",
          "mode": "list",
          "cachedResultName": "smart_hydroponic",
          "cachedResultUrl": "/projects/woV91TsnIO9n6C1y/datatables/clcxodEIfbsgzt4r"
        },
        "columns": {
          "mappingMode": "autoMapInputData",
          "value": {},
          "matchingColumns": [],
          "schema": [
            {
              "id": "air_temp",
              "displayName": "air_temp",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "readOnly": false,
              "removed": false
            },
            {
              "id": "air_humid",
              "displayName": "air_humid",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "readOnly": false,
              "removed": false
            },
            {
              "id": "water_level",
              "displayName": "water_level",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "readOnly": false,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.dataTable",
      "typeVersion": 1,
      "position": [
        320,
        496
      ],
      "id": "d1a51797-9ca3-4db5-b182-01de72681c1d",
      "name": "Insert row"
    },
    {
      "parameters": {
        "updates": [
          "message"
        ],
        "additionalFields": {}
      },
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1.2,
      "position": [
        -144,
        -16
      ],
      "id": "21fced43-12c8-46c0-9c5e-c287eede55a4",
      "name": "user_input",
      "webhookId": "ef2f4b5c-9ec8-4ccd-a0bd-9a989c5c4205",
      "credentials": {
        "telegramApi": {
          "id": "GqHREJuk7v4x2rtW",
          "name": "Telegram account 2"
        }
      }
    },
    {
      "parameters": {
        "chatId": "={{ $('user_input').item.json.message.from.id }}",
        "text": "={{ $json.output }}",
        "additionalFields": {
          "appendAttribution": false,
          "parse_mode": "=None"
        }
      },
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        416,
        -16
      ],
      "id": "51086d09-eb1d-43d1-af2e-9ab1690f3a28",
      "name": "ai_response",
      "webhookId": "130a9cb7-e4b9-487c-8787-20db5517e414",
      "credentials": {
        "telegramApi": {
          "id": "GqHREJuk7v4x2rtW",
          "name": "Telegram account 2"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [
        0,
        176
      ],
      "id": "f3e81b2b-b069-4458-b97f-599d32b9f981",
      "name": "Google Gemini Chat Model",
      "credentials": {
        "googlePalmApi": {
          "id": "B72bzMjOSd4DrvlL",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "modelName": "models/gemini-2.5-flash-lite",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [
        128,
        208
      ],
      "id": "bf34dc7d-a149-4b9b-80d0-50a92adab9a8",
      "name": "Google Gemini Chat Model1",
      "credentials": {
        "googlePalmApi": {
          "id": "B72bzMjOSd4DrvlL",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "operation": "get",
        "dataTableId": {
          "__rl": true,
          "value": "clcxodEIfbsgzt4r",
          "mode": "list",
          "cachedResultName": "smart_hydroponic",
          "cachedResultUrl": "/projects/woV91TsnIO9n6C1y/datatables/clcxodEIfbsgzt4r"
        },
        "orderBy": true
      },
      "type": "n8n-nodes-base.dataTable",
      "typeVersion": 1.1,
      "position": [
        752,
        304
      ],
      "id": "a46622cc-fd76-4b6f-bb66-05024a217e1f",
      "name": "Get row(s)"
    },
    {
      "parameters": {
        "url": "https://api.thingspeak.com/update",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "api_key",
              "value": "api_key"
            },
            {
              "name": "field1",
              "value": "={{ $json.field1 }}"
            },
            {
              "name": "field2",
              "value": "={{ $json.field2 }}"
            },
            {
              "name": "field3",
              "value": "={{ $json.field3 }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {}
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [
        1072,
        304
      ],
      "id": "f05068d2-bd62-497b-8d68-10f160bebe9a",
      "name": "thingspeak_http"
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "seconds",
              "secondsInterval": 15
            }
          ]
        }
      },
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.3,
      "position": [
        592,
        304
      ],
      "id": "12270f55-ff79-4b22-9604-0bf7ad7e7e90",
      "name": "Schedule Trigger 15s"
    },
    {
      "parameters": {
        "jsCode": "const data = $input.first().json;\n\nreturn [{\n  json: {\n    field1: data.air_temp      ?? null,\n    field2: data.air_humid     ?? null,\n    field3: data.water_level   ?? null,\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        912,
        304
      ],
      "id": "b82589bd-f6ad-4c4e-8d19-3ae1172efbce",
      "name": "formatting"
    }
  ],
  "pinData": {},
  "connections": {
    "AI Agent": {
      "main": [
        [
          {
            "node": "ai_response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "sensor_data": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "mqtt_override": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "air": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "sonic": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "Insert row",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "user_input": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Google Gemini Chat Model1": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 1
          }
        ]
      ]
    },
    "Get row(s)": {
      "main": [
        [
          {
            "node": "formatting",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Schedule Trigger 15s": {
      "main": [
        [
          {
            "node": "Get row(s)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "formatting": {
      "main": [
        [
          {
            "node": "thingspeak_http",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1",
    "binaryMode": "separate"
  },
  "versionId": "fad999ff-147f-44ea-84b0-55d5a3b8a540",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "2f0c0f318a3a68c32d08c016bc3abd53a581b4e670211da384e36ab3c76d2c6f"
  },
  "nodeGroups": [],
  "id": "nGJ3P7D6NDNNgrMs",
  "tags": []
}
```

*This JSON was generated by Rejaka Abimanyu Susanto, a full-stack developer based in Yogyakarta, Indonesia. For more articles on networking, IoT, and web development, visit [rejaka.id](https://rejaka.id).*