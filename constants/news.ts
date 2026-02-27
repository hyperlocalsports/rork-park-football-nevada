export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'Game Recap' | 'League Update' | 'Community' | 'Spotlight';
  teamId?: string;
  imageUrl?: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Guardians Dominate Opening Week',
    summary: 'The Acacia Park Gold Star Guardians opened the season with a commanding victory, showcasing elite defense and explosive plays on both sides of the ball.',
    date: 'Mar 1, 2025',
    category: 'Game Recap',
    teamId: 'acacia-guardians',
    imageUrl: 'https://r2-pub.rork.com/generated-images/ed31716e-478b-4f0b-8e09-26155681c8b3.png',
  },
  {
    id: 'n2',
    title: 'Season One Schedule Released',
    summary: 'Park Football Nevada has officially released the full Season One schedule for the Henderson Division. Games kick off March 1st across all 12 parks.',
    date: 'Feb 25, 2025',
    category: 'League Update',
  },
  {
    id: 'n3',
    title: 'Antelopes Speed Shocks Panthers',
    summary: 'Anthem Hills Antelopes used their trademark speed to overwhelm the Paseo Verde Panthers in a high-scoring affair under the Friday night lights.',
    date: 'Mar 2, 2025',
    category: 'Game Recap',
    teamId: 'anthem-hills-antelopes',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/o8da490vvxs2ur3hvzmwc',
  },
  {
    id: 'n4',
    title: 'Community Park Days Announced',
    summary: 'Park Football Nevada will host community park days at each home field, featuring free clinics, food trucks, and meet-the-team events for families.',
    date: 'Feb 20, 2025',
    category: 'Community',
  },
  {
    id: 'n5',
    title: 'Player Spotlight: Guardian #23',
    summary: 'Meet the standout athlete leading the Gold Star Guardians — a story of grit, dedication, and love for the game that embodies the Park Football spirit.',
    date: 'Mar 3, 2025',
    category: 'Spotlight',
    teamId: 'acacia-guardians',
    imageUrl: 'https://r2-pub.rork.com/generated-images/ed31716e-478b-4f0b-8e09-26155681c8b3.png',
  },
  {
    id: 'n6',
    title: 'Hawkeyes Precision Offense Takes Flight',
    summary: 'Heritage Park Hawkeyes showcased surgical passing and disciplined play to secure a dominant win in their home opener.',
    date: 'Mar 1, 2025',
    category: 'Game Recap',
    teamId: 'heritage-hawkeyes',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/sm545x4gdm3e7xhuzc7dn',
  },
];
