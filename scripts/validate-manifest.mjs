import { readFileSync, existsSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));
const allowed = new Set([
  "editor.read", "editor.write", "ui.statusbar", "commands.register",
  "frontmatter.read", "frontmatter.write", "vault.read", "vault.write",
]);
const required = ["id", "name", "version", "minAppVersion", "description"];
for (const key of required) {
  if (typeof manifest[key] !== "string" || !manifest[key].trim())
    throw new Error(`manifest.json: ${key} must be a nonempty string`);
}
if (!/^[a-z0-9][a-z0-9._-]*$/.test(manifest.id))
  throw new Error("manifest.json: id must use lowercase letters, digits, dots, _ or -");
if (!Array.isArray(manifest.permissions) || manifest.permissions.some(p => !allowed.has(p)))
  throw new Error("manifest.json: permissions contains an unknown value");
if (new Set(manifest.permissions).size !== manifest.permissions.length)
  throw new Error("manifest.json: permissions contains duplicates");
if (manifest.main && manifest.main !== "main.js")
  throw new Error("FMD currently loads main.js only");
if (!existsSync(new URL("../main.js", import.meta.url)))
  throw new Error("main.js is missing; run npm run build");
console.log(`Valid FMD plugin: ${manifest.id}@${manifest.version}`);
