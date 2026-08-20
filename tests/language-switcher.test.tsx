import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {LanguageSwitcher} from '@/components/language-switcher';

const navigation = vi.hoisted(() => ({
  pathname: '/zh/guides/base-and-resources',
  replace: vi.fn()
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({replace: navigation.replace})
}));

describe('language switcher', () => {
  it('shows the five supported languages and preserves the article path', () => {
    render(<LanguageSwitcher locale="zh" />);

    const selector = screen.getByRole('combobox', {name: '语言选择'});
    expect(selector).toHaveValue('zh');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'English',
      '中文',
      'Français',
      'Русский',
      'Deutsch'
    ]);

    fireEvent.change(selector, {target: {value: 'de'}});
    expect(navigation.replace).toHaveBeenCalledWith('/de/guides/base-and-resources');
  });
});
