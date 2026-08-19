import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {GuideCard} from '@/components/guide-card';
import {WikiSidebar} from '@/components/wiki-sidebar';

describe('shared wiki shell', () => {
  it('renders a route-aware wiki navigation landmark', () => {
    render(<WikiSidebar locale="en" pathname="/en/guides" />);
    expect(screen.getByRole('navigation', {name: /wiki navigation/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /guides/i})).toHaveAttribute('aria-current', 'page');
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
