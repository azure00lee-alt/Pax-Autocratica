'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {switchLocalePath, type Locale} from '@/lib/locale';

export function LanguageSwitcher({locale}: {locale: Locale}) {
  const pathname = usePathname();

  return (
    <div className="language-switcher" aria-label="Language">
      {(['en', 'zh'] as const).map((item) => (
        <Link key={item} href={switchLocalePath(pathname, item)} aria-current={item === locale ? 'page' : undefined}>
          {item === 'en' ? 'EN' : '中文'}
        </Link>
      ))}
    </div>
  );
}
