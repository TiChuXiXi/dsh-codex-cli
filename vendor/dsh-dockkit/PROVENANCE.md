# DSH dockkit source import

Source: https://github.com/deepseek-ai/deepseek-harness
Commit: fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159 (local source snapshot, 0.2.2-rc.1).
Path: packages/client/ui-dockkit/src/
License: MIT, copyright 2026 DeepSeek; see LICENSE.

Local adaptations: primitive imports point to the plugin adapter; Branded type is local. Layout persistence uses a validated restored snapshot and a collision-free ID seed. Core gestures/operations remain upstream implementations. The plugin supplies Lucide icons for dock controls and drop hints. TabLayout exposes the active docked column as a data attribute for compact presentation; the mobile adapter displays one active pane without rewriting or reparenting the saved desktop layout. Plugin-owned focus/composition helpers originate from the same source and license.
