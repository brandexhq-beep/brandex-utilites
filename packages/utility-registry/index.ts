/**
 * BrandEX Utility Registry
 * Dynamic utility registration and discovery.
 */

export interface RegisteredUtility {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

const registry = new Map<string, RegisteredUtility>();

export function registerUtility(util: RegisteredUtility): void {
  registry.set(util.id, util);
}

export function getUtility(id: string): RegisteredUtility | undefined {
  return registry.get(id);
}

export function getAllUtilities(): RegisteredUtility[] {
  return Array.from(registry.values());
}
