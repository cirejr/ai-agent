# opencode — Full Project Architecture
## 0. Monorepo Foundation

opencode/
├── package.json        # root: bun@1.3.14, turbo (typecheck), oxlint; workspaces = packages/*, console/*, stats/*, sdk/js, slack
├── turbo.json          # per-package task orchestration (typecheck across all workspaces)
├── bunfig.toml         # bun config
├── tsconfig.json       # root TS config
├── sst.config.ts       # SST (Serverless Stack) deploys for hosted services
├── flake.nix / nix/    # nix dev env (system deps: ripgrep, node-pty, etc.)
├── script/             # repo-level tooling scripts (versioning, upgrade, translate)
├── infra/ github/      # CI + infra-as-code
├── specs/              # versioned API spec drafts (e.g. v2 api)
├── perf/               # performance harness
└── packages/           # ← the actual monorepo (34 packages)
Intent: a single polyglot monorepo using bun workspaces + turbo. Everything is one repo so schema → llm → core → opencode → clients share types without version drift. packages/* is the default set; console/* and stats/* are nested SaaS workspaces; sdk/js is the published SDK.


1. The Dependency Spine (bottom-up)
The repo is a strict layered stack. Data contracts at the bottom, transport in the middle, application logic above, consumers on top. Direction of dependency is always down.
Layer 1 — packages/schema (pure data contracts)
packages/schema/src/
├── index.ts            # barrel: re-exports every domain schema
├── schema.ts           # Effect Schema helpers (e.g. optional())
├── *.id.ts             # brand types for ids (session-id, message-id, workspace-id, project-id, integration-id)
├── session.ts / session-message.ts / session-event.ts / session-input.ts / session-status-event.ts / session-todo.ts / session-compaction-event.ts / session-delivery.ts / session-v1.ts
├── agent.ts            # agent definitions (Info: name, description, model, tools, prompts)
├── event.ts            # the event combinator core (tagged-union event construction)
├── event-manifest.ts / durable-event-manifest.ts   # registry of every event type (vs the combinator)
├── server-event.ts / tui-event.ts / ide-event.ts / lsp-event.ts / vcs-event.ts / mcp-event.ts / workspace-event.ts / installation-event.ts
├── permission*.ts / question*.ts / prompt.ts / prompt-input.ts
├── model.ts / models-dev.ts / provider.ts / catalog.ts
├── tool*.ts, file-diff.ts, patch.ts, reference.ts, location.ts, filesystem*.ts, pty*.ts, project*.ts, git.ts, plugin.ts, integration.ts, credential.ts, oauth.ts, skill.ts, worktree.ts
├── llm.ts              # tiny shared LLM bits (ToolTextContent, ToolFileContent, ProviderMetadata)
├── v1/                 # legacy/shims of old contract shapes
└── identifier.ts
Intent: the single source of truth for every domain type and event in the whole product. Effect Schema objects (not just TS types) — so they're runtime-validatable, encodable, and reusable across process boundaries (server → client → TUI). Package is browser-safe (no node deps). event.ts (how to build events) vs event-manifest.ts (the canonical list of all events) is the key distinction: one is machinery, one is the registry. It has zero dependencies inside the repo — everyone depends on it.

Layer 2 — packages/llm (LLM transport)
packages/llm/src/
├── schema/             # the LLM domain model (its OWN schema, distinct from @opencode-ai/schema)
│   ├── messages.ts     # SystemPart, Message + parts, ToolDefinition, ToolChoice, ResponseFormat, LLMRequest
│   ├── options.ts      # GenerationOptions (reasoning effort, maxTokens, temp), ProviderOptions
│   ├── errors.ts       # LLMError + reason union (InvalidRequest, Authentication, RateLimit, QuotaExceeded, ...)
│   ├── events.ts       # LLMEvent (streaming events: text delta, reasoning, tool-call)
│   ├── ids.ts          # tool-call/part id brands
│   └── index.ts
├── protocols/          # one file per wire dialect
│   ├── openai-responses.ts   # Responses-API: schemas + lower(fns) + SSE parser state machine + transport
│   ├── openai-chat.ts / anthropic-messages.ts / gemini.ts / bedrock-converse.ts / openai-compatible-chat.ts
│   └── shared.ts       # cross-protocol shared: MIME tables, validateMedia, error helpers
├── providers/          # provider facades (openai, anthropic, google, xai, openrouter, amazon-bedrock, azure, cloudflare, github-copilot, openai-compatible*)
├── route/              # the "how to execute a request" machinery
│   ├── protocol.ts     # Protocol: body schema + endpoint + auth + framing + transport seam
│   ├── route.ts / client.ts / executor.ts
│   └── transport/      # http.ts (json + sse framing), websocket.ts
├── tool.ts             # Tool definitions + inputSchema projection (JSON schema)
├── tool-runtime.ts     # runs a tool call against a definition (parse args, encode result)
├── provider.ts         # Provider facade (model selection → configured route)
├── provider-error.ts
├── cache-policy.ts     # prompt-cache breakpoints
├── llm.ts              # public API: LLM.request / LLM.generate (streaming)
└── index.ts            # barrel
Intent: the zero-SDK provider transport layer — everything needed to talk to any LLM provider over raw HTTP/SSE/WebSocket. It knows nothing about sessions, tools execution, or UI. Flow: LLMRequest → Route (endpoint+auth+framing+transport) → HTTP → SSE parser (a state machine emitting LLMEvents) → aggregated LLMResponse. Key architectural notes:
- protocol = wire dialect; route = execution mechanics; provider = configured route group; model = an executable provider+route value. This layering is what lets it add a provider with zero changes to the parser.
- Error taxonomy lives here (errors.ts): every failure is a tagged LLMError with a reason + retryable. This is the model we've been mirroring in your Result unions.
- Schema-first: even the wire body is defined as Effect Schema, so outbound = compile+validate, inbound = decode+validate.

Layer 3 — packages/core (application runtime / services)
packages/core/src/
├── session/            # Session service, session loop types, runner
│   └── runner/         # llm.ts (the message loop driving the LLM), to-llm-message.ts, message-v2.ts
├── tool/               # tool execution primitives (edit, bash, grep, glob, read)
├── permission/         # permission engine (rules, prompts, allow/ask/deny)
├── config/             # config schema + defaults (the V1 config model)
├── event/              # event bus / projector
├── provider.ts + model.ts + models-dev.ts + catalog.ts   # provider/model selection
├── project/ filesystem/ git.ts reference/ snapshot.ts patch.ts   # repo/file/git/snapshot subsystems
├── pty/ process.ts     # terminal + process execution
├── skill/              # skill discovery + SKILL.md handling
├── instruction-context.ts + system-context/   # system prompt assembly
├── agent.ts command.ts flag/                    # agents, slash commands, flags
├── integration/ installation/ credential/ oauth/ account/   # auth + integrations
├── background-job.ts observability/ state.ts catalog.ts image/ id/ util/ effect/
├── database/ + data-migration.sql.ts   # Drizzle SQLite persistence (message/part tables, migrations)
├── schema.ts + v2-schema.ts           # session/message persistence schemas
└── (no index.ts — consumed via subpath exports)
Intent: the application service layer — durable state, business logic, and every subsystem the agent needs (filesystem, git, terminal, tools, permissions, sessions). It implements the domain contract from @opencode-ai/schema and delegates all provider/transport concerns to @opencode-ai/llm. Notably: no index.ts — modules are consumed by explicit subpath, which keeps the dependency graph honest. session/runner/llm.ts is the actual agent message loop (build prompt → LLM stream → tool calls → back to loop).


2. The Orchestrator — packages/opencode
packages/opencode/src/
├── index.ts            # ENTRY POINT: yargs CLI (run, generate, account, providers, agent, serve, mcp, attach, tui, ...)
├── node.ts             # programmatic entry: Config, Server, bootstrap, Database
├── cli/                # CLI command implementations + bootstrap.ts (boot chain)
├── effect/             # the dependency-graph heart
│   ├── app-runtime.ts  # ManagedRuntime wiring EVERY service layer (DB, Auth, Session, LLM, MCP, LSP, ...)
│   ├── runner.ts       # single-flight Runner state machine (Idle/Running/Shell)
│   ├── bridge.ts       # Effect ↔ Promise bridge preserving AsyncLocalStorage contexts
│   └── instance-state.ts / instance-ref.ts
├── project/            # instance/project discovery (instance-runtime, instance-store, project)
├── session/            # THE SESSION LOOP
│   ├── session.ts      # session CRUD (Drizzle)
│   ├── processor.ts    # SessionProcessor.loop — the agent run loop (compact/stop/continue)
│   ├── prompt.ts       # system-prompt assembly + LLM invocation
│   ├── llm.ts          # LLM service (wraps @opencode-ai/llm)
│   ├── message-v2.ts   # domain message ↔ LLM model message conversion
│   └── compaction/revert/summary/status/run-state/todo/instruction...
├── agent/ command/ tool/ permission/ question/   # agents, slash commands, tool registry, permission/question flows
├── provider/ auth/    # provider/model resolution + credential store (auth.json)
├── config/            # user config (jsonc) + config-as-markdown
├── plugin/            # plugin loader + hooks + built-in auth plugins
├── mcp/ lsp/ acp/     # MCP client, LSP, Agent Client Protocol (remote agents)
├── git/ snapshot/ patch/ format/ skill/ share/ storage/ worktree/   # tool-support subsystems
├── server/            # ← the REAL product server (richer than packages/server)
│   ├── server.ts      # NodeHttpServer + HttpRouter + mDNS + WebSocketTracker
│   └── routes/instance/httpapi/   # api.ts + groups/ + handlers/ + middleware/ (the v2 HTTP API)
├── control-plane/ workspace sync/ background/ bus/ env/ image/ id/ installation/
└── event-manifest.ts + event-v2-bridge.ts   # events published over the bus/SSE
Intent: the orchestrator + main binary. It owns everything product-level: the session loop, the tool registry, permissions/questions, providers/auth, config, plugins, MCP/LSP, and — critically — the real HTTP/WebSocket server (src/server, not packages/server). This package binds @opencode-ai/core services + @opencode-ai/llm into a working agent and exposes it over CLI and HTTP.
Boot chain: index.ts → cli/bootstrap.ts → InstanceRuntime → AppRuntime (one ManagedRuntime with all service layers) → InstanceStore.load(directory) (resolves project/worktree/instance context) → run.

3. Server & CLI framework
packages/server/        # host-agnostic v2 protocol server
├── api.ts              # makeDefaultApi() from @opencode-ai/protocol/api
├── routes.ts           # createRoutes(password?): HttpApiBuilder.layer + handlers + middleware + service layer
├── auth.ts             # Basic-auth (OPENCODE_SERVER_PASSWORD)
├── location.ts         # LocationMiddleware: resolves directory/workspace from query/headers
├── cors.ts pty-environment.ts handlers/ middleware/
└── handlers/*          # session, message, event(SSE), model, provider, permission, fs, command, skill, agent, health, pty, question, reference, location, integration, credential, project-copy
Intent: a reusable, host-agnostic HTTP API skeleton. No notion of "instance" — location + session-execution services are injected. packages/opencode reuses its primitives (handlers, location, auth, middleware/*) but embeds them in a richer, instance-aware server.
packages/cli/           # v2 CLI framework (thin client shell)
├── index.ts            # Effect-based entry: builds runtime from Commands + Daemon.layer
├── framework/          # declarative command tree (spec.ts) → lazy handlers (runtime.ts)
├── commands/           # command tree: api, debug agents, migrate, service start|restart|status|stop|password, serve
├── services/daemon.ts  # manages a background server (server.json registration, spawn/detach/stop)
└── tui.ts              # launches @opencode-ai/tui against the daemon transport
Intent: a separate lightweight binary that does NOT own the session loop. It starts/manages the server daemon (serve --register detached) and talks to it purely over HTTP via @opencode-ai/sdk/v2. This is the "server daemon" UX model.

4. Consumers (UI clients)
packages/tui/           # Terminal UI (SolidJS + @opentui/solid)
                        # app.tsx, routes/home, routes/session, keymap, theme, prompt, feature-plugins (plugin runtime)
packages/app/           # Browser web client (SolidJS + Vite) — pages, hooks/context, i18n, updater
packages/desktop/       # Electron wrapper: main process manages server sidecar + IPC + WSL; renderer embeds @opencode-ai/app
packages/console/       # Nested SaaS workspace (opencode.ai product): app (marketing/auth/billing), core (services+DB),
                        # function (Cloudflare Workers auth/stats), mail, resource, support
packages/session-ui/    # Reusable SolidJS chat-session UI components (markdown, diffs, tool-call cards, prompt-input)
packages/ui/            # shared design system (consumed by tui/app/desktop/console/session-ui/stats/storybook)
packages/statbox/       # public analytics site (nested: app/core/server)
packages/storybook/     # dev-only component harness
Intent: multiple front-ends over the same server API. TUI = local terminal; app = web; desktop = Electron shell embedding app; console = hosted SaaS. session-ui + ui keep the chat UI shared so every client looks the same.

5. API / SDK / Extension surface
packages/protocol/      # the server HTTP API contract (Effect HttpApi): api.ts + groups/ (session, message, model, fs, event, pty, question, ...)
packages/client/        # generated Effect HttpApi CLIENT (from protocol via httpapi-codegen)
packages/sdk/           # PUBLIC developer SDK: createOpencodeClient / createOpencodeServer / createOpencode (from OpenAPI spec)
packages/sdk-next/      # private next-gen SDK re-exporting client/effect surface as OpenCode/Tool namespaces
packages/plugin/        # public plugin API: ToolDefinition, ToolContext, provider hooks, TUI hooks (+ v2 Effect API)
packages/function/      # serverless/edge functions for hosted service (Hono + CF Durable Objects)
packages/codemode/      # sandboxed JS code execution over schema-described tools (acorn-based)
packages/slack/         # Slack integration
Intent: protocol = the contract (types + HTTP shape). server implements it; client/sdk consume it. schema vs protocol is the key distinction: schema = pure data types; protocol = the HTTP API built on those types. SDK is the external developer surface; plugin is the extension surface.

6. Internal Infra
packages/effect-sqlite-node/       # Effect SqlClient on node:sqlite (semaphores, WAL)
packages/effect-drizzle-sqlite/    # bridges Effect SQL ↔ Drizzle ORM
packages/http-recorder/            # records/replays HTTP+WS traffic into JSON cassettes (test infra)
packages/httpapi-codegen/          # generates typed clients from HttpApi definitions
packages/identity/                 # brand assets (logo) only — not code
packages/containers/               # prebuilt Docker images for CI
packages/script/                   # shared dev/release scripts
packages/docs/ + packages/web/     # Mintlify docs + Astro marketing site
Intent: plumbing that makes the main stack work — Effect-first SQLite, test recording, codegen, CI images.

7. The Three Flows That Tie It Together
Boot: opencode (index.ts) → cli/bootstrap.ts → InstanceRuntime → AppRuntime (all services) → InstanceStore.load(dir) → project/worktree/instance context.
Session loop: SessionPrompt.prompt/command/shell → SessionProcessor.loop (guarded by Runner single-flight) → assemble system prompt → MessageV2.toModelMessagesEffect → @opencode-ai/llm (LLM.request) → SSE events → tool calls → ToolRegistry executes (with Permission/Question/MCP/Git/… services) → results persist via Session (Drizzle) → events published via EventV2Bridge → loop.
HTTP: packages/opencode/src/server mounts the instance-aware HttpApiApp → /prompt calls go back into SessionPrompt/SessionProcessor. packages/cli's daemon keeps that server alive in the background.

8. Dependency Direction (who imports whom)
schema ← protocol ← server ← opencode ← {tui, app, desktop, console, sdk, plugin}
schema ← llm ← core ← opencode
schema ← client ← sdk ← {plugin, tui, app, cli, slack, session-ui}
The invariants: schema is imported by everyone, imports no one. llm never imports core/opencode. core delegates provider work to llm. opencode is the only package that composes them. UI clients import client/sdk, never llm.
