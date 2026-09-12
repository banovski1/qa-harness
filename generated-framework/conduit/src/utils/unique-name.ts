// A value only this run could have produced.
//
// "Find the row you just created" is only reliable when the value is unique, so every
// create test names its record through this. The prefix keeps it readable in the UI and
// greppable in demo data; the suffix keeps two parallel workers apart.
const RUN_ID = process.env.TEST_RUN_ID ?? Math.random().toString(36).slice(2, 8);

export function uniqueName(prefix: string): string {
  return `${prefix}-${RUN_ID}-${counter++}`;
}

let counter = 1;

/** Every name this run has produced, for a cleanup step that deletes what it made. */
export const runId = RUN_ID;
