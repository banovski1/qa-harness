import {Global} from '../Global';

// Every path shape the resolver is expected to handle, plus one it must refuse:
//   ORDERS         a plain literal
//   ADD            delegated to another class in another file
//   ORDER_HISTORY  a template literal composed out of a sibling field
//   RUNTIME_PATH   computed, so the route declared with it is left out rather than guessed at
export class AppRoutes {
	public static ADD: string = Global.ADD;
	public static ORDERS = 'orders';
	public static ORDER_HISTORY = `${AppRoutes.ORDERS}/history`;
	public static RUNTIME_PATH = ['runtime', 'path'].join('/');
}
