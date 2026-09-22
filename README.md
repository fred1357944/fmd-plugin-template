# FMD plugin template

Starter for **[FMD](https://github.com/fred1357944/FMD)** (Fred's Markdown) community plugins.

This is a GitHub **template** repository. Click **Use this template** → create a new repo, then write your plugin. Do not send plugin PRs here.

FMD is not Obsidian. Plugins are `manifest.json` + bundled `main.js` against the `fmd` / `api` host (Qt QJSEngine). Obsidian community `.js` will not load.

## 中文（給要開放別人開發的人）

1. 開 https://github.com/fred1357944/fmd-plugin-template → **Use this template**（或 Fork）。
2. 改 `manifest.json` 的 `id` / `name` / `author`（`id` 一旦發布就不要再改）。
3. `npm i` → `npm run dev`（watch）或 `npm run build`。
4. 把 `main.js`、`manifest.json` 放到：
   - `~/.config/fmd/plugins/<id>/`，或
   - `<工作區>/.fmd/plugins/<id>/`
5. 在 FMD：**偏好設定 → 外掛 → 允許社群外掛**，再按 **重新載入**、打開此外掛開關。請先用測試工作區試跑。

完整 API：本 repo 的 `docs/PLUGIN_API.md` 與 `fmd.d.ts`。應用本體：https://github.com/fred1357944/FMD

## Quick start

```bash
npm i
npm run dev     # watch → main.js
# or
npm run build   # production main.js
```

Node.js 18+.

Install into FMD:

```text
~/.config/fmd/plugins/<your-plugin-id>/
    manifest.json
    main.js
```

Folder name should match `manifest.json` `id`. Enable community plugins globally, reload, then enable this plugin in **Preferences → Plugins**.

## What this sample does

- Turns selected lines into Markdown tasks through a command
- Shows open-task count in the status area
- Loads settings and saves the toggle when changed
- Listens to `file-open` / `file-change`

Edit `src/main.ts`. Types: `fmd.d.ts`. Runtime `Plugin` base: `fmd.ts`. Agent notes: `AGENTS.md`.

## Rename before you ship

1. `manifest.json` → new `id`, `name`, `author`, `description`
2. `package.json` → `name`
3. Command ids in `src/main.ts` (stable after release)
4. Rebuild `main.js`

## Release

- Bump `version` in `manifest.json` and map it in `versions.json`
- GitHub release tag must match `manifest.json` `version` exactly (no leading `v`)
- Attach `manifest.json` and `main.js`

`npm version patch|minor|major` runs `version-bump.mjs`.

## API

- [PLUGIN_API.md](docs/PLUGIN_API.md) (snapshot; live spec lives in the FMD app repo)
- [fmd.d.ts](fmd.d.ts)

FMD plugins have **no network** or **Node APIs**. `frontmatter.set`, `editor.replaceSelection`, and `vault.list()` are implemented; `vault.list()` returns all Markdown paths in the current workspace. The host currently loads only `main.js`; it does not apply `styles.css`, command shortcuts, or enforce `minAppVersion`. `ui.notice()` writes the FMD status area rather than opening a popup. Check `PLUGIN_API.md` before using an API.

## License

MIT. See [LICENSE](LICENSE).
