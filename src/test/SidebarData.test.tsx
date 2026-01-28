import { SidebarData } from '../components/SidebarData';
import { describe, it, expect } from 'vitest';

describe('SidebarData', () => {
  it('contains Home link with correct path', () => {
    const homeLink = SidebarData.find(item => item.title === 'Home');
    expect(homeLink).toBeDefined();
    expect(homeLink?.path).toBe('/ui');
  });
});
