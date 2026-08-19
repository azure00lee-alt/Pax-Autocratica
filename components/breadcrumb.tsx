import Link from 'next/link';

export function Breadcrumb({label, items}: {label: string; items: Array<{label: string; href?: string}>}) {
  return <nav className="breadcrumb" aria-label={label}><ol>{items.map((item, index) =>
    <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>
  )}</ol></nav>;
}
