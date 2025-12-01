export interface Author {
  authorId: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Source {
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  reliabilityRating: string;
  isActive: boolean;
  createdAt: string;
}

export interface Article {
  articleId: number;
  title: string;
  subtitle: string | null;
  content: string;
  authors: Author[];
  categories: Category[];
  url: string;
  status: string;
  publicationDate: string;
  isFeatured: boolean | null;
  createdAt: string;
  updatedAt: string;
  imgUrl: string | null;
  source: Source | null;
}

export interface ArticlesResponse {
  content: Article[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) {
    return `${Math.floor(diffDays / 7)}w ago`;
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  } else {
    return 'Just now';
  }
}
