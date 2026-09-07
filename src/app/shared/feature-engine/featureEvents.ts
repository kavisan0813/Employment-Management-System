// Central event bus for immediate feature/subscription state reactivity.
// Kept in a non-component module so the component file stays Fast-Refresh safe.

const featureStateListeners = new Set<() => void>();

export function subscribeFeatureState(listener: () => void) {
  featureStateListeners.add(listener);
  return () => {
    featureStateListeners.delete(listener);
  };
}

export function notifyFeatureStateChange() {
  featureStateListeners.forEach((listener) => listener());
}
