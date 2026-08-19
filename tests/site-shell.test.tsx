import {readFileSync} from 'node:fs';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {Breadcrumb} from '@/components/breadcrumb';
import {GuideCard} from '@/components/guide-card';
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
    expect(screen.getByRole('navigation', {name: /wiki navigation/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /guides/i})).toHaveAttribute('aria-current', 'page');
  });

  it('exposes the mobile wiki navigation disclosure', () => {
    render(<WikiSidebar locale="en" pathname="/en" />);
    expect(screen.getByText('Browse the wiki', {selector: 'summary'})).toBeInTheDocument();
  });

  it('keeps planned guide cards non-interactive', () => {
    render(<GuideCard title="Economy" description="Resource planning" status="planned" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
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
});
