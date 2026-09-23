import toolDefinitionsData from './configs/toolDefinitions.json';

/**
 * Defines the parameter schema for a tool's configurable option.
 */
export interface ToolParam {
  name: string;
  type: 'string' | 'boolean' | 'number' | 'enum';
  description: string;
  required: boolean;
  default?: any;
  options?: string[];
}

/**
 * Complete definition of a cybersecurity tool registered in the platform.
 */
export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  command: string;
  requiresRoot: boolean;
  requiresNetwork: boolean;
  icon: string;
  docLink: string;
  parameters: ToolParam[];
}

/**
 * Supported tool categories for filtering and organization.
 */
export type ToolCategory =
  | 'Network'
  | 'Vulnerability'
  | 'Exploitation'
  | 'Web'
  | 'Wireless'
  | 'Password'
  | 'Sniffing'
  | 'Forensics'
  | 'Recon'
  | 'Crypto';

/**
 * All available tool categories with display metadata.
 */
export const TOOL_CATEGORIES: { id: ToolCategory; label: string; icon: string; color: string }[] = [
  { id: 'Network', label: 'Network', icon: 'globe-outline', color: '#00d4ff' },
  { id: 'Vulnerability', label: 'Vulnerability', icon: 'bug-outline', color: '#ff6b6b' },
  { id: 'Exploitation', label: 'Exploitation', icon: 'skull-outline', color: '#ff3333' },
  { id: 'Web', label: 'Web Security', icon: 'code-slash-outline', color: '#ffaa00' },
  { id: 'Wireless', label: 'Wireless', icon: 'wifi-outline', color: '#7c4dff' },
  { id: 'Password', label: 'Password', icon: 'key-outline', color: '#ff9100' },
  { id: 'Sniffing', label: 'Sniffing', icon: 'eye-outline', color: '#00e676' },
  { id: 'Forensics', label: 'Forensics', icon: 'search-outline', color: '#448aff' },
  { id: 'Recon', label: 'Recon/OSINT', icon: 'earth-outline', color: '#69f0ae' },
  { id: 'Crypto', label: 'Cryptography', icon: 'lock-closed-outline', color: '#ea80fc' },
];

/**
 * Central registry for all cybersecurity tools available in the platform.
 * Provides search, filtering, and tool lookup capabilities.
 */
export class ToolRegistry {
  private static tools: Map<string, ToolDefinition> = new Map();
  private static initialized = false;

  /**
   * Initialize the registry by loading all tool definitions.
   * Called once at app startup.
   */
  static initialize(): void {
    if (this.initialized) return;

    const definitions = toolDefinitionsData as ToolDefinition[];
    for (const tool of definitions) {
      this.tools.set(tool.id, tool);
    }
    this.initialized = true;
  }

  /**
   * Register a single tool definition.
   */
  static register(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  /**
   * Get a tool by its unique ID.
   */
  static getTool(id: string): ToolDefinition | undefined {
    this.ensureInitialized();
    return this.tools.get(id);
  }

  /**
   * Get all registered tools.
   */
  static getAllTools(): ToolDefinition[] {
    this.ensureInitialized();
    return Array.from(this.tools.values());
  }

  /**
   * Get tools filtered by category.
   */
  static getToolsByCategory(category: ToolCategory): ToolDefinition[] {
    return this.getAllTools().filter(tool => tool.category === category);
  }

  /**
   * Search tools by name or description.
   */
  static searchTools(query: string): ToolDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTools().filter(
      tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.command.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get tools that don't require root access.
   */
  static getNonRootTools(): ToolDefinition[] {
    return this.getAllTools().filter(tool => !tool.requiresRoot);
  }

  /**
   * Get tools that work offline (no network required).
   */
  static getOfflineTools(): ToolDefinition[] {
    return this.getAllTools().filter(tool => !tool.requiresNetwork);
  }

  /**
   * Get the total count of registered tools.
   */
  static getToolCount(): number {
    this.ensureInitialized();
    return this.tools.size;
  }

  /**
   * Get tool counts grouped by category.
   */
  static getCategoryCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const tool of this.getAllTools()) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }

  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}
