interface RatingData {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<string, number>;
  lastUpdated: number;
}

class RatingsCache {
  private cache = new Map<string, RatingData>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private pendingRequests = new Map<string, Promise<RatingData>>();

  get(recipeId: string): RatingData | null {
    const cached = this.cache.get(recipeId);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.lastUpdated > this.CACHE_DURATION) {
      this.cache.delete(recipeId);
      return null;
    }
    
    return cached;
  }

  set(recipeId: string, data: Omit<RatingData, 'lastUpdated'>): void {
    this.cache.set(recipeId, {
      ...data,
      lastUpdated: Date.now()
    });
  }

  async getOrFetch(
    recipeId: string, 
    fetchFn: (id: string) => Promise<Omit<RatingData, 'lastUpdated'>>
  ): Promise<RatingData> {
    // Check cache first
    const cached = this.get(recipeId);
    if (cached) return cached;

    // Check if there's already a pending request for this recipe
    const existing = this.pendingRequests.get(recipeId);
    if (existing) return existing;

    // Create new request
    const request = fetchFn(recipeId).then(data => {
      const ratingData = { ...data, lastUpdated: Date.now() };
      this.set(recipeId, data);
      this.pendingRequests.delete(recipeId);
      return ratingData;
    }).catch(error => {
      this.pendingRequests.delete(recipeId);
      throw error;
    });

    this.pendingRequests.set(recipeId, request);
    return request;
  }

  async batchFetch(
    recipeIds: string[],
    fetchFn: (id: string) => Promise<Omit<RatingData, 'lastUpdated'>>
  ): Promise<Map<string, RatingData>> {
    const results = new Map<string, RatingData>();
    const toFetch: string[] = [];

    // Check cache for each recipe
    for (const recipeId of recipeIds) {
      const cached = this.get(recipeId);
      if (cached) {
        results.set(recipeId, cached);
      } else if (!this.pendingRequests.has(recipeId)) {
        toFetch.push(recipeId);
      }
    }

    // Wait for any pending requests
    const pendingPromises = recipeIds
      .filter(id => this.pendingRequests.has(id))
      .map(async id => {
        const data = await this.pendingRequests.get(id)!;
        results.set(id, data);
      });

    // Fetch missing data in parallel
    const fetchPromises = toFetch.map(async recipeId => {
      const request = fetchFn(recipeId).then(data => {
        const ratingData = { ...data, lastUpdated: Date.now() };
        this.set(recipeId, data);
        return ratingData;
      });
      
      this.pendingRequests.set(recipeId, request);
      
      try {
        const data = await request;
        results.set(recipeId, data);
        return data;
      } finally {
        this.pendingRequests.delete(recipeId);
      }
    });

    // Wait for all operations to complete
    await Promise.all([...pendingPromises, ...fetchPromises]);

    return results;
  }

  invalidate(recipeId: string): void {
    this.cache.delete(recipeId);
    this.pendingRequests.delete(recipeId);
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }
}

export const ratingsCache = new RatingsCache();