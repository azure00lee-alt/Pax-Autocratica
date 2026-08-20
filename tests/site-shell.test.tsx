import {readFileSync} from 'node:fs';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {Breadcrumb} from '@/components/breadcrumb';
import {GuideCard} from '@/components/guide-card';
import {SiteFooter} from '@/components/site-footer';
import {WikiSidebar} from '@/components/wiki-sidebar';

describe('shared wiki shell', () => {
  it('keeps short breadcrumb links at least 44 pixels wide', () => {
    const style = document.createElement('style');
    style.textContent = readFileSync('app/globals.css', 'utf8');
    document.head.append(style);
    render(<Breadcrumb label="Breadcrumb" items={[{label: 'Home', href: '/en'}, {label: 'Guides'}]} />);
    expect(getComputedStyle(screen.getByRole('link', {name: 'Home'})).minWidth).toBe('44px');
    style.remove();
  });

  it('exposes a localized Chinese breadcrumb landmark label', () => {
    render(<Breadcrumb label="面包屑导航" items={[{label: '首页', href: '/zh'}, {label: '攻略导航'}]} />);
    expect(screen.getByRole('navigation', {name: '面包屑导航'})).toBeInTheDocument();
  });

  it('renders a route-aware wiki navigation landmark', () => {
    render(<WikiSidebar locale="en" pathname="/en/guides" />);
    const navigation = screen.getByRole('navigation', {name: /wiki navigation/i});
    expect(navigation).toBeInTheDocument();
    expect(navigation.querySelector('a[href="/en/guides"]')).toHaveAttribute('aria-current', 'page');
    expect(navigation.querySelectorAll('a')).toHaveLength(7);
    for (const slug of [
      'soldiers-and-breeding',
      'base-and-resources',
      'captives-and-conversion',
      'weapons-and-combat',
      'exploration-and-bosses'
    ]) {
      expect(navigation.querySelector(`a[href="/en/guides/${slug}"]`)).toBeInTheDocument();
    }
    expect(navigation.querySelector('.wiki-nav__planned')).not.toBeInTheDocument();
  });

  it('exposes the mobile wiki navigation disclosure', () => {
    render(<WikiSidebar locale="en" pathname="/en" />);
    const summary = screen.getByText('Browse the wiki', {selector: 'summary'});
    expect(summary).toBeInTheDocument();
    expect(summary.closest('details')).not.toHaveAttribute('open');
  });

  it('renders desktop navigation outside the mobile disclosure', () => {
    const {container} = render(<WikiSidebar locale="en" pathname="/en" />);
    const desktopNavigation = screen.getByRole('navigation', {name: 'Wiki navigation'});
    expect(desktopNavigation.closest('details')).toBeNull();
    expect(container.querySelector('details.wiki-sidebar__mobile')).toBeInTheDocument();
  });

  it('keeps planned guide cards non-interactive', () => {
    render(<GuideCard title="Economy" description="Resource planning" status="planned" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('article')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });

  it('uses localized guide card labels when supplied', () => {
    const {rerender} = render(
      <GuideCard
        title="经济与生产"
        description="资源规划"
        status="planned"
        statusLabel="计划中"
        actionLabel="阅读攻略"
      />
    );
    expect(screen.getByText('计划中')).toBeInTheDocument();

    rerender(
      <GuideCard
        title="士兵与繁育"
        description="人口管理"
        status="ready"
        href="/zh/guides/soldiers-and-breeding"
        statusLabel="计划中"
        actionLabel="阅读攻略"
      />
    );
    expect(screen.getByRole('link', {name: /阅读攻略/i})).toBeInTheDocument();
  });

  it('renders localized internal and official footer destinations', () => {
    render(<SiteFooter locale="zh" disclosure="独立粉丝资源。" />);
    expect(screen.getByRole('link', {name: '首页'})).toHaveAttribute('href', '/zh');
    expect(screen.getByRole('link', {name: '攻略导航'})).toHaveAttribute('href', '/zh/guides');
    expect(screen.getByRole('link', {name: '士兵与繁育'})).toHaveAttribute('href', '/zh/guides/soldiers-and-breeding');
    expect(screen.getByRole('link', {name: '基地与资源'})).toHaveAttribute('href', '/zh/guides/base-and-resources');
    expect(screen.getByRole('link', {name: '俘虏与转化'})).toHaveAttribute('href', '/zh/guides/captives-and-conversion');
    expect(screen.getByRole('link', {name: '兵器与战斗'})).toHaveAttribute('href', '/zh/guides/weapons-and-combat');
    expect(screen.getByRole('link', {name: '探索与 BOSS'})).toHaveAttribute('href', '/zh/guides/exploration-and-bosses');
    expect(screen.getByRole('link', {name: '官方网站'})).toHaveAttribute('href', 'https://www.paxautocratica.com/');
    expect(screen.getByRole('link', {name: 'Steam 官方页面'}).getAttribute('href')).toMatch(/store\.steampowered\.com/);
  });
});
