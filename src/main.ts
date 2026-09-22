import { Plugin, type FmdApi } from "../fmd";
import { DEFAULT_SETTINGS, type SamplePluginSettings } from "./settings";

/**
 * Small, useful plugin: turn selected lines into Markdown tasks.
 * Bundled by esbuild to root `main.js` (CommonJS).
 */
class SamplePlugin extends Plugin {
  settings: SamplePluginSettings = { ...DEFAULT_SETTINGS };

  onload(api?: FmdApi) {
    if (api) this.api = api;
    this.loadSettings();

    this.addCommand({
      id: "sample-task-selection",
      name: "Turn selection into tasks",
      callback: () => {
        const selection = this.api.editor.getSelection();
        if (!selection.trim()) {
          this.api.ui.notice("先選取要變成待辦的文字");
          return;
        }
        const tasks = selection.split(/\r?\n/)
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => `- [ ] ${line}`);
        this.api.editor.replaceSelection(tasks.join("\n"));
        this.api.ui.notice(`已建立 ${tasks.length} 個待辦`);
      },
    });

    this.addCommand({
      id: "sample-toggle-task-count",
      name: "Toggle task count in status bar",
      callback: () => {
        this.settings.enabled = !this.settings.enabled;
        this.api.settings.set("enabled", this.settings.enabled);
        this.updateStatus();
      },
    });

    this.api.workspace.on("file-open", () => this.updateStatus());
    this.api.workspace.on("file-change", () => this.updateStatus());
    this.updateStatus();
  }

  onunload() {
    // Engine teardown clears listeners; keep idempotent cleanup here if needed.
  }

  private loadSettings() {
    const enabled = this.api.settings.get("enabled", DEFAULT_SETTINGS.enabled);
    const statusPrefix = this.api.settings.get(
      "statusPrefix",
      DEFAULT_SETTINGS.statusPrefix,
    );
    this.settings = {
      enabled: Boolean(enabled),
      statusPrefix: String(statusPrefix),
    };
  }

  private updateStatus() {
    if (!this.settings.enabled) {
      this.api.ui.setStatusBarItem({ id: "sample-plugin-status", text: "" });
      return;
    }
    const text = this.api.editor.getValue() || "";
    const tasks = (text.match(/^\s*[-*]\s+\[ \]/gm) || []).length;
    this.api.ui.setStatusBarItem({
      id: "sample-plugin-status",
      text: `${this.settings.statusPrefix}: ${tasks}`,
    });
  }
}

// Host expects CommonJS constructor export (esbuild format: cjs)
module.exports = SamplePlugin;
