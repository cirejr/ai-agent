import type { AnyToolDescriptor } from "@erwin/schema";

const registryMap = new Map<string, AnyToolDescriptor>();

export const registry = {
  register(descriptor: AnyToolDescriptor): void {
    if (registryMap.has(descriptor.name)) {
      throw new Error(`Tool "${descriptor.name}" is already registered`);
    }
    registryMap.set(descriptor.name, descriptor);
  },
  get(name: string): AnyToolDescriptor | undefined {
    return registryMap.get(name);
  },
  list(): AnyToolDescriptor[] {
    return Array.from(registryMap.values());
  },
};
