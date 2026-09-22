export interface SamplePluginSettings {
  enabled: boolean;
  statusPrefix: string;
}

export const DEFAULT_SETTINGS: SamplePluginSettings = {
  enabled: true,
  statusPrefix: "待辦",
};
