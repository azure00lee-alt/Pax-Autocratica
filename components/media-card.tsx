import Image from 'next/image';

export function MediaCard({image, alt, label, title, description}: {
  image: string;
  alt: string;
  label: string;
  title?: string;
  description?: string;
}) {
  return <figure className="media-card">
    <Image src={image} alt={alt} width={1920} height={1080} sizes="(max-width: 1040px) 100vw, 936px" />
    <figcaption><span>{label}</span>{title && <strong>{title}</strong>}{description && <p>{description}</p>}</figcaption>
  </figure>;
}
