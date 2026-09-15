/**
 * The order in which auth shapes are tried.
 *
 * `auth.kind` is a value a skill wrote while reading source. It is usually right, so it
 * goes first — but it is a hypothesis like every other citation in this pipeline, and a
 * wrong one used to end the run. Here it orders the cascade instead of choosing for it.
 *
 * `browser` is always last: it needs a browser, it is the slowest by an order of
 * magnitude, and its proof is weaker in kind — it can be re-performed but not
 * re-derived. It is skipped entirely when an HTTP shape already succeeded.
 */
import type { AuthBlock, AuthStrategy } from './types.ts';

const HTTP_SHAPES: AuthStrategy[] = ['session', 'token', 'basic'];

/**
 * Which shape the login request looks like, regardless of what `kind` claims.
 * An app can hand back a token in exchange for Basic, so the request's own shape
 * is better evidence than the label on the block.
 */
function declared(auth: AuthBlock): AuthStrategy | null {
  const login = auth.loginEndpoint;
  const wantsBasic = auth.kind === 'basic'
    || login?.auth === 'basic'
    || Object.values(login?.headers ?? {}).some(value => /basic|base64/i.test(value));
  if (wantsBasic) return 'basic';
  if (auth.kind === 'token') return 'token';
  if (auth.kind === 'session') return 'session';
  return null;
}

/**
 * The rungs to try, in order. The declared shape first when there is one, then the
 * remaining HTTP shapes, then the browser when the app documents a UI login.
 *
 * `includeBrowser` is false when no `uiLogin` was recorded: there would be nothing
 * for the rung to perform.
 */
export function cascadeFor(auth: AuthBlock, { includeBrowser = true } = {}): AuthStrategy[] {
  const first = declared(auth);
  const order: AuthStrategy[] = first ? [first, ...HTTP_SHAPES.filter(s => s !== first)] : [...HTTP_SHAPES];
  const hasUiLogin = Boolean((auth as { uiLogin?: unknown }).uiLogin);
  if (includeBrowser && hasUiLogin) order.push('browser');
  return order;
}
