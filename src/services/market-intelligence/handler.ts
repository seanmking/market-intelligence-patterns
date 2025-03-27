/**
 * Market Intelligence Handler
 * 
 * This file demonstrates a pattern for handling different types of
 * Market Intelligence requests in a type-safe manner.
 */

import { ApiResponse } from '../../types/api.types';
import {
  MarketIntelligenceRequestType,
  MarketIntelligenceParams,
  MarketIntelligenceData,
  TradeFlowParams,
  isTradeFlowParams,
  TradeFlowData,
  TariffParams,
  isTariffParams,
  TariffData,
  MarketSizeParams,
  isMarketSizeParams,
  MarketSizeData,
  BuyersParams,
  isBuyersParams,
  BuyersData,
  CompetitiveLandscapeParams,
  isCompetitiveLandscapeParams,
  CompetitiveLandscapeData
} from '../../types/market-intelligence.types';
import { ValidationError } from '../../utils/error.utils';
import { createSuccessResponse } from '../../utils/response.utils';

/**
 * Market Intelligence Handler class that routes requests to the appropriate handler method
 * based on the request type, while maintaining type safety.
 */
export class MarketIntelligenceHandler {
  /**
   * Main entry point for handling all market intelligence requests
   */
  async handle(params: MarketIntelligenceParams): Promise<ApiResponse<MarketIntelligenceData>> {
    // Validate that the type field exists
    if (!params.type) {
      throw new ValidationError('Request type is required', { params });
    }

    // Use type guards to route to the correct handler with proper typing
    if (isTradeFlowParams(params)) {
      return this.handleTradeFlow(params);
    } else if (isTariffParams(params)) {
      return this.handleTariff(params);
    } else if (isMarketSizeParams(params)) {
      return this.handleMarketSize(params);
    } else if (isBuyersParams(params)) {
      return this.handleBuyers(params);
    } else if (isCompetitiveLandscapeParams(params)) {
      return this.handleCompetitiveLandscape(params);
    }

    // If we get here, the request type is not supported
    throw new ValidationError(`Unsupported request type: ${params.type}`, { params });
  }

  /**
   * Handle Trade Flow requests
   */
  private async handleTradeFlow(params: TradeFlowParams): Promise<ApiResponse<TradeFlowData>> {
    // Validate required fields
    if (!params.hs_code) {
      throw new ValidationError('HS code is required for trade flow requests', { params });
    }
    if (!params.market) {
      throw new ValidationError('Market is required for trade flow requests', { params });
    }

    // Example implementation - in a real service, this would call your WITS service
    const data: TradeFlowData = {
      import_value_usd: 5000000000,
      export_value_usd: 3000000000,
      growth_rate: 12.5,
      top_exporters: [
        { country: 'China', market_share: 35 },
        { country: 'Germany', market_share: 15 },
        { country: 'South Africa', market_share: 8 }
      ],
      import_volume: 250000
    };

    return createSuccessResponse(data, {
      metadata: {
        source: 'WITS API',
        confidence_score: 0.95
      }
    });
  }

  /**
   * Handle Tariff requests
   */
  private async handleTariff(params: TariffParams): Promise<ApiResponse<TariffData>> {
    // Validate required fields
    if (!params.hs_code) {
      throw new ValidationError('HS code is required for tariff requests', { params });
    }
    if (!params.origin) {
      throw new ValidationError('Origin country is required for tariff requests', { params });
    }
    if (!params.destination) {
      throw new ValidationError('Destination country is required for tariff requests', { params });
    }

    // Example implementation
    const data: TariffData = {
      tariff_rate: 5.2,
      quota_restrictions: null,
      trade_agreements: [
        {
          name: 'AfCFTA',
          benefits: 'Reduced tariff rate of 0% for qualifying goods'
        }
      ]
    };

    return createSuccessResponse(data, {
      metadata: {
        source: 'WITS API',
        confidence_score: 0.98
      }
    });
  }

  /**
   * Handle Market Size requests
   */
  private async handleMarketSize(params: MarketSizeParams): Promise<ApiResponse<MarketSizeData>> {
    // Validate required fields
    if (!params.product_category) {
      throw new ValidationError('Product category is required for market size requests', { params });
    }
    if (!params.market) {
      throw new ValidationError('Market is required for market size requests', { params });
    }

    // Example implementation
    const data: MarketSizeData = {
      market_value_usd: '8.5 Billion',
      growth_rate: '5%',
      popular_categories: ['canned vegetables', 'plant-based meals']
    };

    return createSuccessResponse(data, {
      metadata: {
        source: 'ITC TradeMap',
        confidence_score: 0.93
      }
    });
  }

  /**
   * Handle Buyers requests
   */
  private async handleBuyers(params: BuyersParams): Promise<ApiResponse<BuyersData>> {
    // Validate required fields
    if (!params.industry) {
      throw new ValidationError('Industry is required for buyers requests', { params });
    }
    if (!params.market) {
      throw new ValidationError('Market is required for buyers requests', { params });
    }

    // Example implementation
    const data: BuyersData = {
      buyers: [
        {
          name: 'Almarai',
          contact: 'buyer@almarai.com',
          size: 'Large',
          interests: ['dairy', 'beverages']
        },
        {
          name: 'Spinneys',
          contact: 'procurement@spinneys.com',
          size: 'Medium',
          interests: ['organic', 'health foods']
        }
      ]
    };

    return createSuccessResponse(data, {
      metadata: {
        source: 'Internal Trade DB',
        confidence_score: 0.87
      }
    });
  }

  /**
   * Handle Competitive Landscape requests
   */
  private async handleCompetitiveLandscape(
    params: CompetitiveLandscapeParams
  ): Promise<ApiResponse<CompetitiveLandscapeData>> {
    // Validate required fields
    if (!params.product_category) {
      throw new ValidationError('Product category is required for competitive landscape requests', { params });
    }
    if (!params.market) {
      throw new ValidationError('Market is required for competitive landscape requests', { params });
    }

    // Example implementation
    const data: CompetitiveLandscapeData = {
      competitors: [
        {
          name: 'Global Foods Inc.',
          market_share: 32,
          origin: 'USA',
          strengths: ['brand recognition', 'distribution network']
        },
        {
          name: 'EuroFoods',
          market_share: 18,
          origin: 'Germany',
          strengths: ['product quality', 'organic certification']
        }
      ],
      price_points: {
        low: '$2.50 - $4.00',
        average: '$4.00 - $6.50',
        premium: '$6.50 - $12.00'
      }
    };

    return createSuccessResponse(data, {
      metadata: {
        source: 'Market Research DB',
        confidence_score: 0.92
      }
    });
  }
}
