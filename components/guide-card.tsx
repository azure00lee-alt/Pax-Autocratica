import Link from 'next/link';

type GuideCardProps = {
  title: string;
  description: string;
  status: 'ready' | 'planned';
  href?: string;
  statusLabel?: string;
  actionLabel?: string;
};

export function GuideCard({
  title,
  description,
  status,
  href,
  statusLabel = 'Planned',
  actionLabel = 'Read guide'
}: GuideCardProps) {
  const body = <><h3>{title}</h3><p>{description}</p><span>{status === 'planned' ? statusLabel : actionLabel}</span></>;
  return status === 'ready' && href
    ? <Link className="guide-card" href={href}>{body}</Link>
    : <article className="guide-card guide-card--planned" aria-disabled="true">{body}</article>;
}
