import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({locales: ['en', 'zh', 'fr', 'ru', 'de'], defaultLocale: 'en', localePrefix: 'always'});
