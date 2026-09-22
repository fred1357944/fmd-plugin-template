# FMD plugin API snapshot

The [FMD app repository](https://github.com/fred1357944/FMD/blob/master/docs/PLUGIN_API.md) is the current source of truth. This snapshot describes the runtime that this template targets. FMD plugins are `manifest.json` plus a single bundled CommonJS `main.js`, loaded by Qt QJSEngine. They are not Obsidian plugins and have no Node or network API.

## Lifecycle and permissions

FMD constructs the exported class, calls `onload(fmd)` synchronously, and calls `onunload()` on disable. The host does not await an async `onload`. Request the smallest needed permission list in `manifest.json`:

| Permission | API |
|---|---|
| `editor.read` | `editor.getValue()`, `getSelection()`, `workspace.getActiveFile()` |
| `editor.write` | `editor.setValue(text)`, `replaceSelection(text)` |
| `ui.statusbar` | `ui.setStatusBarItem({id,text})` |
| `commands.register` | `commands.register({id,name,callback})` |
| `frontmatter.read` / `frontmatter.write` | `frontmatter.get()` / `set(key,value)` / `update(patch)` |
| `vault.read` / `vault.write` | `vault.read(path)`, `list()`, `write(path,text)` |

`workspace.on(event, callback)` / `off(event, callback)` support `file-open`, `file-save`, `file-change`, `frontmatter-change`, and `view-change`. `settings.get(key, defaultValue)` / `set(key,value)` store values under the plugin ID. `ui.notice(text)` writes the FMD status area, not a popup.

`frontmatter.get()` reads the active note only. `vault.list()` returns every Markdown path relative to the current workspace and takes no folder argument. `vault.write()` returns a boolean. Vault paths must remain inside the current workspace.

The current host always loads `main.js`; it does not apply `styles.css` or plugin command shortcuts. `minAppVersion` is metadata for authors and is not enforced by the host yet. Check the app API before relying on newer features.

## Minimal example

```js
module.exports = class Example {
  onload(api) {
    api.commands.register({
      id: "example-task",
      name: "Make selected text a task",
      callback() {
        const selection = api.editor.getSelection().trim();
        if (selection) api.editor.replaceSelection("- [ ] " + selection);
      }
    });
  }
  onunload() {}
};
```

For this example, declare `editor.read`, `editor.write`, and `commands.register`. Use a disposable workspace and enable both **Allow community plugins** and the individual plugin switch.
