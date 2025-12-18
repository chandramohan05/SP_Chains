import { supabase } from '../lib/supabase';

interface TrackActivityParams {
  userId: string;
  activityType: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  durationSeconds?: number;
}

export const trackActivity = async ({
  userId,
  activityType,
  entityType,
  entityId,
  metadata = {},
  durationSeconds = 0
}: TrackActivityParams) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id: userId,
        activity_type: activityType,
        entity_type: entityType,
        entity_id: entityId,
        metadata,
        duration_seconds: durationSeconds
      }]);

    if (error) {
      console.error('Error tracking activity:', error);
    }
  } catch (error) {
    console.error('Error in trackActivity:', error);
  }
};

export const trackPageView = async (userId: string, pageName: string) => {
  await trackActivity({
    userId,
    activityType: 'page_view',
    metadata: { page: pageName }
  });
};

export const trackProductView = async (userId: string, productId: string, productName: string, duration: number) => {
  await trackActivity({
    userId,
    activityType: 'product_view',
    entityType: 'product',
    entityId: productId,
    metadata: { product_name: productName },
    durationSeconds: duration
  });
};

export const trackOrderPlaced = async (userId: string, orderId: string, orderAmount: number) => {
  await trackActivity({
    userId,
    activityType: 'order_placed',
    entityType: 'order',
    entityId: orderId,
    metadata: { amount: orderAmount }
  });
};

export const trackSearch = async (userId: string, searchTerm: string, resultsCount: number) => {
  await trackActivity({
    userId,
    activityType: 'search',
    metadata: {
      search_term: searchTerm,
      results_count: resultsCount
    }
  });
};

export class SessionTracker {
  private startTime: number;
  private userId: string;
  private pageName: string;

  constructor(userId: string, pageName: string) {
    this.userId = userId;
    this.pageName = pageName;
    this.startTime = Date.now();
  }

  end() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000);
    trackActivity({
      userId: this.userId,
      activityType: 'session',
      metadata: { page: this.pageName },
      durationSeconds: duration
    });
  }
}
