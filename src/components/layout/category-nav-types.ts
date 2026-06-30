export interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  image_path: string | null;
  children: CategoryNode[];
}
