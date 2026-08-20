import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({locales: ['en', 'de', 'fr', 'ru', 'zh'], defaultLocale: 'en', localePrefix: 'always'});
