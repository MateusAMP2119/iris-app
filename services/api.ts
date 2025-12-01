import { ArticlesResponse } from '../models';

const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchArticles(
  page: number = 0,
  size: number = 10
): Promise<ArticlesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/articles?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  return response.json();
}
