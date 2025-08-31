
export interface LifeEvent {
  id: number;
  age: number;
  happiness: number; // 1 to 10 scale
  description: string;
  imageUrl?: string; // Optional image URL (base64)
}
