// The second hop: AppRoutes delegates some of its fields to this class, which is where the literal
// actually lives. That indirection is the shape the constant resolver has to reach through.
export class Global {
	public static ADD = 'add';
}
