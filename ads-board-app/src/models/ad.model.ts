export interface Ad {
  id: number;
  userId: string;
  type: 'מכירה' | 'השכרה' | 'דרושים' | 'כללי';
  title: string;
  description: string;
  location?: string;
  image?: string;
  date?: string;
  contact?: string;
  price: number;
}
