import {Component} from '@angular/core';

// One control per ladder rung the Angular extractor can reach (`locator-ladder.ts`'s `RUNGS`),
// each commented with the rung it pins — modelled on `vue-spa/src/pages/OrderForm.vue`. This is
// the **inline** `template:` branch of `parseAngular`.
@Component({
  selector: 'app-order-form',
  template: `
    <form>
      <!-- rung 1: a test id outranks every other signal on the element -->
      <input data-testid="order-id" />
      <!-- rung 2: a named role — the button's own text, piped through the i18 catalogue -->
      <button>{{ 'order.submit' | i18 }}</button>
      <!-- rung 3: a <label for> written directly in this template, associated by id -->
      <label for="orderNotes">Notes</label>
      <textarea id="orderNotes"></textarea>
      <!-- rung 4: a componentLabel catalogue key, not associated with any <label for> -->
      <input componentLabel="order.name" />
      <!-- rung 5: nothing but a placeholder — read literally, a static one is never piped -->
      <input placeholder="Search orders" />
      <!-- rung 6: nothing but a name attribute -->
      <input name="quantity" />
    </form>
  `,
})
export class OrderFormComponent {}
