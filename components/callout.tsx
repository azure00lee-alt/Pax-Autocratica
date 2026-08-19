export function Callout({type = 'info', title, children}: {
  type?: 'info' | 'warning' | 'source';
  title: string;
  children: React.ReactNode;
}) {
  return <aside className={`callout callout--${type}`}><strong>{title}</strong><div>{children}</div></aside>;
}
