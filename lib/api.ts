import { ArticlesResponse } from '../models';

// API module for all external API calls

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

const ARTICLES_QUERY = `
  query GetArticles($page: Int, $size: Int) {
    articles(page: $page, size: $size) {
      content {
        articleId
        title
        subtitle
        content
        authors {
          authorId
          firstName
          lastName
          email
          isActive
          createdAt
          updatedAt
        }
        categories {
          categoryId
          categoryName
          isActive
          createdAt
        }
        url
        status
        publicationDate
        isFeatured
        createdAt
        updatedAt
        imgUrl
        source {
          sourceId
          sourceName
          sourceUrl
          reliabilityRating
          isActive
          createdAt
          logo
        }
      }
      totalElements
      totalPages
      pageNumber
      pageSize
      hasNext
      hasPrevious
    }
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface ArticlesQueryResponse {
  articles: ArticlesResponse;
}

export async function fetchArticles(
  page: number = 0,
  size: number = 10
): Promise<ArticlesResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: ARTICLES_QUERY,
      variables: { page, size },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  const result: GraphQLResponse<ArticlesQueryResponse> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data.articles;
}
