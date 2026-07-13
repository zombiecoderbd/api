# Mission Barisal — System Documentation

> বরিশালের খেলুড়ে চায়ের আড়ালে কোডের শৃঙ্খলা!
> Zero Dependency — OpenCode Free Models — Multi-Agent Debate — Real-time Web Search

---

## Overview

Mission Barisal is a **zero-dependency multi-agent AI system** built on Node.js. It runs 6 specialized AI agents that collaborate through a debate system to provide comprehensive answers.

### Key Features

- **6 Specialized Agents** — Each with unique persona and expertise
- **Multi-Agent Debate** — 3-phase system (Initial → Cross-Verify → Combined)
- **Real-time Web Search** — Agents search the web for current information
- **Zero Dependencies** — Pure Node.js, no external frameworks
- **Free Models** — Uses OpenCode free models (DeepSeek, MiMo, BigPickle)
- **MCP Tools** — File read/write, web search, browser automation
- **Bengali Native** — All agents respond in Bengali (Barishali style)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Client (API Request)            │
│  POST /v1/chat/completions                  │
│  model: "mission" | "code-guru" | ...       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Mission Handler                   │
│  classifyInput → Agent Selection → Pipeline  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          3-Phase Mission Pipeline            │
│  Phase 1: Initial Response (all agents)     │
│  Phase 2: Cross-Verification (debate)       │
│  Phase 3: Combined Output (final answer)    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Competition Router                 │
│  OpenCode (Priority 1)                      │
│  → Groq (Priority 2, fallback)              │
│  → Gemini (Priority 3, tertiary)            │
└─────────────────────────────────────────────┘
```

---

## Agents

| Agent | Name | Role | Model | Priority |
|-------|------|------|-------|----------|
| `code-guru` | কোড গুরু - মনু | Architecture | deepseek-v4-flash-free | 1 |
| `bug-hunter` | বাগ হান্টার - জুয়েল | Debugging | mimo-v2.5-free | 2 |
| `security-hero` | সিকিউরিটি হিরো - বৃষ্টি | Security | deepseek-v4-flash-free | 3 |
| `perf-wizard` | পারফরম্যান্স উইজার্ড - রাশেদ | Performance | mimo-v2.5-free | 4 |
| `doc-king` | ডকুমেন্টেশন রাজা - হালিম | Documentation | big-pickle | 5 |
| `qa-tyrant` | কোয়ালিটি তস্কর - মজনু | Quality | big-pickle | 6 |

### Agent Rules

1. **Persona Enforcement** — Each agent follows its unique persona
2. **Evidence-Based** — Every claim requires proof
3. **SSOT First** — Always check Single Source of Truth
4. **Web Search** — Use web search for current data
5. **No Fabrication** — Say "I don't know" if unsure
6. **No Model Identity** — Agents never reveal their underlying model

---

## Provider Fallback Chain

```
OpenCode (Priority 1) → Groq (Priority 2) → Gemini (Priority 3)
```

- Rate limit on OpenCode → Falls back to Groq
- Groq fails → Falls back to Gemini
- All fail → User-friendly error message

### Fallback-Only Models

The following models are **NOT used for primary agent work**:

- `nemotron-3-ultra-free` — Sacrifices quality for speed
- `north-mini-code-free` — Too eager, causes tool-call loops

These are only available as fallback when primary models are unavailable.

---

## Test Results (Proof-Based)

### Final Test Run: 2026-07-14

```
📊 RESULTS: 59 passed / 1 failed / 60 total (98%)
```

| Test Category | Passed | Total | Status |
|---------------|--------|-------|--------|
| Health Check | 3 | 3 | ✅ |
| Agent List | 3 | 3 | ✅ |
| Session Metadata | 2 | 2 | ✅ |
| Bengali Text Quality | 3 | 3 | ✅ |
| No Weak Models | 7 | 7 | ✅ |
| **code-guru** | 7 | 7 | ✅ |
| **bug-hunter** | 6 | 7 | ⚠️ (flaky LLM) |
| **security-hero** | 7 | 7 | ✅ |
| **perf-wizard** | 7 | 7 | ✅ |
| **doc-king** | 7 | 7 | ✅ |
| **qa-tyrant** | 7 | 7 | ✅ |

### Test Details

#### ✅ All 6 Agents Respond (No 502)
- Previous test: doc-king and qa-tyrant returned 502
- Fixed: Model assignment changed (nemotron → deepseek/mimo/big-pickle)
- Proof: All agents return HTTP 200 with content

#### ✅ No Unicode Replacement Characters (\uFFFD)
- Previous test: Bengali text contained \uFFFD chars
- Fixed: `maskModelIdentity()` now strips \uFFFD
- Proof: All responses clean of replacement characters

#### ✅ Agent Persona Enforcement
- code-guru responds as "মনু" (Monu)
- bug-hunter responds as "জুয়েল" (Jewel)
- security-hero responds as "বৃষ্টি" (Brishti)
- perf-wizard responds as "রাশেদ" (Rashed)
- doc-king responds as "হালিম" (Halim)
- qa-tyrant responds as "মজনু" (Mojnu)

#### ✅ Bengali Text Quality
- All responses in Bengali (Barishali style)
- No English identity leaks
- No thinking artifacts

#### ✅ Model Identity Protection
- Agents never say "I am DeepSeek" or "I am GPT"
- `buildAgentIdentity()` removed model/provider info
- Mandatory rules prevent self-identification

#### ✅ Session Metadata Storage
- Headers (X-Agent-Id, X-Device-Info, etc.) stored correctly
- Sessions persisted to `data/sessions.json`

---

## Security Features

1. **Model Identity Masking** — Real model names hidden
2. **Provider Name Masking** — All providers shown as "ZombieCoder"
3. **Agent Independence** — Agents never know their provider
4. **No Hallucination** — Evidence-based responses enforced
5. **Rate Limiting** — Built-in provider rate limit detection
6. **Session Management** — Automatic session expiry and cleanup

---

## File Structure

```
api/
├── hamba.js              # Main server (~10K lines)
├── start.js              # Entry point
├── domain-config.js      # Domain configuration
├── PERSONAS.md           # Agent persona definitions
├── package.json          # Dependencies
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── .zombiecoder/
│   ├── SSOT.md           # Auto-generated Single Source of Truth
│   └── agents/
│       ├── memory.json   # Agent memory
│       ├── syllabus.md   # Auto-generated syllabus
│       └── sessions/     # Session archives
├── data/
│   └── sessions.json     # Active sessions
├── cache/                # API response cache
├── logs/                 # Server logs
└── doc/
    ├── cPanel Deployment/
    │   └── CPANEL-DEPLOYMENT.md
    ├── Chat completion/
    ├── API interface/
    ├── Browser Test/
    ├── Extensions/
    └── Mcp/
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/zombiecoderbd/api.git
cd api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Start the server
node start.js

# 5. Test
curl http://localhost:5000/health
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/identity` | System identity |
| GET | `/v1/models` | List agents |
| POST | `/v1/chat/completions` | Agent or mission chat |
| POST | `/api/mission` | Full debate mission |
| POST | `/api/v1/anti-dote` | Type safety chain |
| GET | `/api/clients` | Connected MCP clients |
| POST | `/mcp` | MCP JSON-RPC 2.0 |

---

## Support

- **Documentation**: `/doc/` folder
- **Issues**: GitHub Issues
- **Author**: Shawon Bhai (ZombieCoder)

---

> **শাওন ভাই সব জানে — মিসবিহেভ করলে ধরা পড়বে!** 🧟
> **Shawon Bhai knows everything — misbehave and you'll be caught!**
