import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card" data-testid="user-card">
      <span data-test="user-name">{{ name }}</span>
    </div>
  `,
})
export class UserCardComponent {
  @Input() name: string;
  @Input() role: string;
}
