import type {Locale} from '@/lib/locale';

type NavigationItem = {label: string; href: string};

export const wikiSections = {
  en: [
    {label: 'Home', href: '/en'},
    {label: 'Guides', href: '/en/guides'},
    {label: 'Soldiers & Breeding', href: '/en/guides/soldiers-and-breeding'},
    {label: 'Base & Resources', href: '/en/guides/base-and-resources'},
    {label: 'Captives & Conversion', href: '/en/guides/captives-and-conversion'},
    {label: 'Weapons & Combat', href: '/en/guides/weapons-and-combat'},
    {label: 'Exploration & Bosses', href: '/en/guides/exploration-and-bosses'}
  ],
  zh: [
    {label: '首页', href: '/zh'},
    {label: '攻略导航', href: '/zh/guides'},
    {label: '士兵与繁育', href: '/zh/guides/soldiers-and-breeding'},
    {label: '基地与资源', href: '/zh/guides/base-and-resources'},
    {label: '俘虏与转化', href: '/zh/guides/captives-and-conversion'},
    {label: '兵器与战斗', href: '/zh/guides/weapons-and-combat'},
    {label: '探索与 BOSS', href: '/zh/guides/exploration-and-bosses'}
  ],
  fr: [
    {label: 'Accueil', href: '/fr'},
    {label: 'Guides', href: '/fr/guides'},
    {label: 'Soldats et reproduction', href: '/fr/guides/soldiers-and-breeding'},
    {label: 'Base et ressources', href: '/fr/guides/base-and-resources'},
    {label: 'Captifs et conversion', href: '/fr/guides/captives-and-conversion'},
    {label: 'Armes et combat', href: '/fr/guides/weapons-and-combat'},
    {label: 'Exploration et boss', href: '/fr/guides/exploration-and-bosses'}
  ],
  ru: [
    {label: 'Главная', href: '/ru'},
    {label: 'Руководства', href: '/ru/guides'},
    {label: 'Солдаты и размножение', href: '/ru/guides/soldiers-and-breeding'},
    {label: 'База и ресурсы', href: '/ru/guides/base-and-resources'},
    {label: 'Пленные и обращение', href: '/ru/guides/captives-and-conversion'},
    {label: 'Оружие и бой', href: '/ru/guides/weapons-and-combat'},
    {label: 'Исследование и боссы', href: '/ru/guides/exploration-and-bosses'}
  ],
  de: [
    {label: 'Startseite', href: '/de'},
    {label: 'Guides', href: '/de/guides'},
    {label: 'Soldaten und Fortpflanzung', href: '/de/guides/soldiers-and-breeding'},
    {label: 'Basis und Ressourcen', href: '/de/guides/base-and-resources'},
    {label: 'Gefangene und Konvertierung', href: '/de/guides/captives-and-conversion'},
    {label: 'Waffen und Kampf', href: '/de/guides/weapons-and-combat'},
    {label: 'Erkundung und Bosse', href: '/de/guides/exploration-and-bosses'}
  ]
} satisfies Record<Locale, NavigationItem[]>;

export const shellCopy = {
  en: {knowledge: 'Knowledge base', wikiNav: 'Wiki navigation', browse: 'Browse the wiki', mobileNav: 'Mobile wiki menu', officialGame: 'Official game', officialDescription: 'Visit the official Steam page for game updates and community news.', openSteam: 'Open Steam', primaryNav: 'Primary navigation', officialSteam: 'Official Steam', footerNav: 'Footer navigation', officialWebsite: 'Official website'},
  zh: {knowledge: '知识库', wikiNav: 'Wiki 导航', browse: '浏览 Wiki', mobileNav: '移动 Wiki 菜单', officialGame: '官方游戏', officialDescription: '前往 Steam 官方页面查看游戏更新与社区动态。', openSteam: '打开 Steam', primaryNav: '主导航', officialSteam: 'Steam 官方页面', footerNav: '页脚导航', officialWebsite: '官方网站'},
  fr: {knowledge: 'Base de connaissances', wikiNav: 'Navigation du Wiki', browse: 'Parcourir le Wiki', mobileNav: 'Menu mobile du Wiki', officialGame: 'Jeu officiel', officialDescription: 'Consultez la page Steam officielle pour les mises à jour et les actualités communautaires.', openSteam: 'Ouvrir Steam', primaryNav: 'Navigation principale', officialSteam: 'Steam officiel', footerNav: 'Navigation de pied de page', officialWebsite: 'Site officiel'},
  ru: {knowledge: 'База знаний', wikiNav: 'Навигация по Wiki', browse: 'Открыть Wiki', mobileNav: 'Мобильное меню Wiki', officialGame: 'Официальная игра', officialDescription: 'На официальной странице Steam публикуются обновления игры и новости сообщества.', openSteam: 'Открыть Steam', primaryNav: 'Основная навигация', officialSteam: 'Официальный Steam', footerNav: 'Навигация в подвале', officialWebsite: 'Официальный сайт'},
  de: {knowledge: 'Wissensdatenbank', wikiNav: 'Wiki-Navigation', browse: 'Wiki durchsuchen', mobileNav: 'Mobiles Wiki-Menü', officialGame: 'Offizielles Spiel', officialDescription: 'Auf der offiziellen Steam-Seite findest du Spielupdates und Community-Neuigkeiten.', openSteam: 'Steam öffnen', primaryNav: 'Hauptnavigation', officialSteam: 'Offizielles Steam', footerNav: 'Fußzeilennavigation', officialWebsite: 'Offizielle Website'}
} satisfies Record<Locale, Record<string, string>>;

export const officialSteamUrl = 'https://store.steampowered.com/app/1067360/Pax_Autocratica/';
export const officialWebsiteUrl = 'https://www.paxautocratica.com/';
