export type IslandType = 'Bangka' | 'Belitung';

export type CategoryType = 'Pantai' | 'Restoran' | 'Cafe';

export type UserStatus = 'Free' | 'Premium';

export interface Destination {
  id: string;
  name: string;
  location: string;
  subDistrict: string;
  island: IslandType;
  category: CategoryType;
  description: string;
  highlight: string;
  rating: number;

  imageUrl?: string;
  uniqueness?: string;
  access?: string;
  openingHours?: string;
  created_at?: string;
}
