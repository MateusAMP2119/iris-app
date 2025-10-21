export interface Source {
  id: number;
  name: string;
  url?: string;
}

export function sourceFromJson(json: any): Source {
  return {
    id: json.id,
    name: json.name,
    url: json.url,
  };
}

export function sourceToJson(source: Source): any {
  return {
    id: source.id,
    name: source.name,
    url: source.url,
  };
}
