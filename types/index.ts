export interface RestaurantRow {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  description: string;
  emoji: string;
  color: string;
  createdAt: Date;
}

export interface MenuItemRow {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: string;
  tags: string[];
  createdAt: Date;
}

export interface RestaurantWithMenu extends RestaurantRow {
  menuItems: MenuItemRow[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: "user" | "model"; content: string }>;
}

export interface ChatResponse {
  response: string;
}
