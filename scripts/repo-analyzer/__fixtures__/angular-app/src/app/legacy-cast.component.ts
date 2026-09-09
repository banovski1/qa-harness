import {Component, Input} from '@angular/core';

// Pins the `jsx`-vs-`typescript` Babel plugin collision: a legacy angle-bracket cast parses as an
// unterminated JSX element when `jsx` is enabled alongside `typescript`.
@Component({
  selector: 'app-legacy-cast',
  template: `
    <div data-testid="legacy-cast">{{ label }}</div>
  `,
})
export class LegacyCastComponent {
  @Input() label: string;

  read(event: {target: EventTarget | null}) {
    const target = <HTMLInputElement>event.target;
    return target.value;
  }
}
