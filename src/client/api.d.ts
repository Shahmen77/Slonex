declare module './api' {
  interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }

  interface LegalEntity {
    id: string;
    name: string;
    type: string;
    status: string;
    registrationDate: string;
    address: string;
    directors: string[];
    shareholders: string[];
    financialData?: {
      revenue: number;
      profit: number;
      assets: number;
    };
  }

  class ApiClient {
    private baseUrl: string;
    constructor(baseUrl?: string);
    getLegalEntity(id: string): Promise<ApiResponse<LegalEntity>>;
    searchLegalEntities(query: string): Promise<ApiResponse<LegalEntity[]>>;
    verifyLegalEntity(id: string): Promise<ApiResponse<{ verified: boolean; score: number }>>;
  }

  export const apiClient: ApiClient;
} 