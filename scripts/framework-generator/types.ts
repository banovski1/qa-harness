/** The write policy's unit: one file, and whether the generator owns it. */
export interface GeneratedFile {
  path: string;
  contents: string;
  kind: 'generated' | 'protected';
}
