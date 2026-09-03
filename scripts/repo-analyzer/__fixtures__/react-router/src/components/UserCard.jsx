export function UserCard({name, role, ...rest}) {
  return <div data-testid="user-card"><span data-test="user-name">{name}</span>{role}</div>;
}
