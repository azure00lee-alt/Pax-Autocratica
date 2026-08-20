'use client';

import {usePathname, useRouter} from 'next/navigation';
import {isLocale, locales, switchLocalePath, type Locale} from '@/lib/locale';

const languageNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  fr: 'Français',
  ru: 'Русский',
  de: 'Deutsch'
};

const selectorLabels: Record<Locale, string> = {
  en: 'Language selector',
  zh: '语言选择',
  fr: 'Sélection de la langue',
  ru: 'Выбор языка',
  de: 'Sprachauswahl'
};

export function LanguageSwitcher({locale}: {locale: Locale}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="language-switcher">
      <select
        aria-label={selectorLabels[locale]}
        value={locale}
        onChange={(event) => {
          if (isLocale(event.target.value)) {
            router.replace(switchLocalePath(pathname, event.target.value));
          }
        }}
      >
        {locales.map((item) => <option key={item} value={item}>{languageNames[item]}</option>)}
      </select>
    </div>
  );
}
