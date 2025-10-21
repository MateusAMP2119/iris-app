export interface Category {
  id: number;
  name: string;
  description?: string;
}

export function categoryFromJson(json: any): Category {
  return {
    id: json.id,
    name: json.name,
    description: json.description,
  };
}

export function categoryToJson(category: Category): any {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
}
