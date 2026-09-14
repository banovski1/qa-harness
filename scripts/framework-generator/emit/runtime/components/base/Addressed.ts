// An identity in, a locator out. Every field class in this library is this class plus
// the verbs that make sense for its kind of control.
import type { Locator, Page } from '@playwright/test';
import { InteractiveComponent } from './interactive.ts';
import type { ComponentContext } from './BaseComponent.ts';
import { resolve, describeStrategy, type Identity } from './resolve.ts';

export abstract class Addressed extends InteractiveComponent {
  protected readonly identity: Identity;
  protected readonly host: Page | Locator;
  protected abstract role: string;

  constructor(host: Page | Locator, identity: Identity | string, context: ComponentContext = {}) {
    const id: Identity = typeof identity === 'string' ? { label: identity } : identity;
    super(host, id.label ?? id.field ?? '(unnamed)', context);
    this.identity = id;
    this.host = host;
  }

  locator(): Locator {
    return resolve(this.host, this.identity.role ?? this.role, this.identity);
  }

  protected describe() {
    const { strategy, selector } = describeStrategy(this.identity, this.identity.role ?? this.role);
    return { strategy, selector, via: this.identity.via };
  }
}
