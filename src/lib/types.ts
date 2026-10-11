export type Product = {
  id: string;
  name: string;
  name_tj: string | null;
  category: string;
  price: number;
  weight: number | null;
  purity: string | null;
  description: string | null;
  description_tj: string | null;
  in_stock: boolean;
  image_url: string | null;
  created_at: string;
};
