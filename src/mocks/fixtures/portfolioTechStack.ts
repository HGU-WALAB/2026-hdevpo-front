import type { TechStackResponse } from '@/pages/portfolio/apis/portfolio';

export const mockTechStackResponse: TechStackResponse = {
  domains: [
    {
      id: 1,
      name: 'iOS',
      order_index: 0,
      tech_stacks: [
        { name: 'Swift', level: 78 },
        { name: 'SwiftUI', level: 82 },
        { name: 'UIKit', level: 70 },
        { name: 'URLSession', level: 65 },
        { name: 'MVVM', level: 72 },
        { name: 'MVC', level: 68 },
      ],
    },
    {
      id: 2,
      name: 'Web',
      order_index: 1,
      tech_stacks: [
        { name: 'JavaScript', level: 75 },
        { name: 'TypeScript', level: 85 },
        { name: 'React.js', level: 88 },
        { name: 'HTML/CSS', level: 80 },
        { name: 'Recoil', level: 62 },
        { name: 'Zustand', level: 70 },
      ],
    },
  ],
};
