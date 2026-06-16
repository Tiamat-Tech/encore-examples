# Clean Architecture Starter (encore-clean-arch-starter)

A small Encore.ts service built as a **complete, textbook Clean Architecture**
reference — and kept that way automatically by
[ArchContract](https://www.npmjs.com/package/arch-contract).

The behavior is intentionally simple (greet, list, version, health). The point is
the **structure**: a pure domain at the center, dependencies pointing strictly
inward, infrastructure hidden behind ports, thin handlers, an explicit composition
root — and a CI check that fails the build the moment any of that drifts.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Install [Docker](https://docker.com)** — required to run the local Postgres database.

## Create app

```bash
encore app create my-app-name --example=ts/encore-clean-arch-starter
```

## Run app locally

Make sure Docker is running, then:

```bash
encore run
```

Encore provisions a local Postgres database, applies the migrations, and starts a
local Pub/Sub broker automatically.

## Using the API

```bash
curl http://localhost:4000/hello/World
# { "id": "...", "recipient": "World", "language": "en",
#   "message": "Hello, World! You are visitor #1.", "visitor": 1, "createdAt": "..." }

curl "http://localhost:4000/hello/Ada?lang=pt"
# { ... "message": "Olá, Ada! Você é o visitante #2.", ... }

curl http://localhost:4000/greetings/recent
# { "greetings": [ ... ] }

curl http://localhost:4000/version   # { "name": "encore-clean-arch-starter", "version": "1.0.0" }
curl http://localhost:4000/health    # { "status": "ok", "service": "greeting" }
```

### Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/)
for traces, the architecture diagram, and the API explorer.

## Architecture

Each Encore service is a vertical slice of Clean Architecture. Dependencies only
ever point **inward** (toward the domain):

```
greeting/
├── encore.service.ts                       # service boundary (Encore)
│
├── domain/                                 # the center — pure, no framework, no I/O, no runtime
│   ├── greeting.entity.ts                  #   aggregate root (raises domain events)
│   ├── recipient.vo.ts · language.vo.ts    #   value objects (self-validating)
│   ├── app-info.ts                         #   domain constant
│   ├── errors/                             #   DomainError base + typed errors
│   ├── events/                             #   DomainEvent + GreetingCreated
│   ├── services/greeting-translator.ts     #   domain service (localization rule)
│   └── ports/greeting-repository.port.ts   #   driven port (interface the domain owns)
│
├── application/                            # use-cases — orchestrate the domain via ports
│   ├── use-cases/                          #   say-hello (command), list-recent (query), version, health
│   ├── ports/                              #   clock · id-generator · event-publisher (driven ports)
│   └── mappers/greeting.mapper.ts          #   entity -> read model
│
├── infrastructure/                         # adapters — implement the ports with real Encore primitives
│   ├── database.ts + migrations/           #   Encore SQLDatabase (Postgres)
│   ├── repositories/sql-greeting.repository.ts
│   ├── events/                             #   Pub/Sub Topic + publisher + subscription
│   └── clock/  · id/
│
├── presentation/                           # Encore handlers (thin) + HTTP error mapping
│   ├── greeting.controller.ts
│   └── http-error-mapper.ts
│
└── composition/container.ts                # composition root — the ONLY place that `new`s adapters
```

**The dependency rule, made concrete:**

- **domain** depends on nothing — not even the Node runtime. Instantiate and test it with zero setup.
- **application** depends only on the domain, and only through **ports**. Use-cases are framework-agnostic (no Encore).
- **infrastructure** implements the ports with real Encore primitives — Postgres via `SQLDatabase`, events via Pub/Sub `Topic`/`Subscription`. Swap an adapter (e.g. the event publisher) and the domain/application layers don't change.
- **presentation** (Encore handlers) stays thin: it translates HTTP ⇄ use-case and maps errors. No `new`, no infrastructure imports.
- **composition** is the single place that wires concrete adapters into use-cases.

### Architecture tests — the contract is enforced, not hoped for

This project ships an [`arch-contract.yaml`](./arch-contract.yaml) that activates
the AAA-quality built-in `encore-ts` preset and reshapes it into strict Clean
Architecture:

```bash
npm install
npm run arch:check
```

It enforces, with **zero violations required to pass**:

- the full **inward dependency rule** between layers (domain ← application ← infrastructure; presentation → use-cases only; only the composition root may touch infrastructure);
- **every file belongs to a layer** (`unassignedFiles: error` — no stragglers);
- **shape**: use-cases are `*UseCase` classes with `execute()`; ports are interfaces; entities and value objects are classes; domain errors extend `DomainError`; infrastructure classes implement a port;
- **purity**: the domain imports no framework and no runtime; the application imports no framework;
- **thin handlers**: controllers never instantiate use-cases/repositories and never call `console.log`.

Wire `npm run arch:check` into CI and architectural drift fails the build.

### Unit tests

Because the core is pure and depends on ports, the domain and use-cases test in
milliseconds with no database and no Encore runtime — see the `*.test.ts` files.

```bash
npm test
```


## Deployment

Deploy to Encore's free development cloud with `git push encore`, or self-host with
`encore build docker`. See https://encore.dev/docs/ts/deploy.
