/**
 * Response Utilities
 * 
 * This file contains utility functions for creating standardized API responses.
 */

import { ApiResponse, ResponseMetadata } from '../types/api.types';

/**
 * Default metadata with current timestamp and complete data
 */
const defaultMetadata: ResponseMetadata = {
  data_completeness: 'complete',
  last_updated: new Date().toISOString(),
  source: 'API'
};

/**
 * Create a standardized success response
 * 
 * @param data The response data payload
 * @param options Optional configuration for the response
 * @returns A standardized API response object
 */
export function createSuccessResponse<T>(
  data: T,
  options: {
    status?: number;
    message?: string;
    metadata?: Partial<ResponseMetadata>;
  } = {}
): ApiResponse<T> {
  const { status = 200, message, metadata = {} } = options;
  
  return {
    status,
    data,
    ...(message && { message }),
    metadata: {
      ...defaultMetadata,
      ...metadata,
      // Ensure timestamp is always current
      last_updated: metadata.last_updated || new Date().toISOString()
    }
  };
}

/**
 * Create a response with partial data indicator
 * 
 * @param data The partial response data
 * @param options Optional configuration for the response
 * @returns A standardized API response with partial data completeness
 */
export function createPartialResponse<T>(
  data: T,
  options: {
    status?: number;
    message?: string;
    metadata?: Partial<ResponseMetadata>;
  } = {}
): ApiResponse<T> {
  return createSuccessResponse(data, {
    ...options,
    metadata: {
      ...options.metadata,
      data_completeness: 'partial'
    }
  });
}

/**
 * Create a response from cached data
 * 
 * @param data The cached data
 * @param cachedTimestamp When the data was cached
 * @param options Optional configuration for the response
 * @returns A standardized API response with cache source indicator
 */
export function createCachedResponse<T>(
  data: T,
  cachedTimestamp: string | Date,
  options: {
    status?: number;
    message?: string;
    metadata?: Partial<ResponseMetadata>;
  } = {}
): ApiResponse<T> {
  const timestamp = typeof cachedTimestamp === 'string' 
    ? cachedTimestamp 
    : cachedTimestamp.toISOString();
    
  return createSuccessResponse(data, {
    ...options,
    metadata: {
      ...options.metadata,
      source: 'Cache',
      last_updated: timestamp
    }
  });
}

/**
 * Handler for Express routes that returns standardized API responses
 * 
 * @param handler An async function that returns the response data
 * @returns An Express route handler
 */
export function createRouteHandler<T>(
  handler: (req: any, res: any) => Promise<ApiResponse<T>>
): (req: any, res: any, next: any) => Promise<void> {
  return async (req, res, next) => {
    try {
      const response = await handler(req, res);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}
