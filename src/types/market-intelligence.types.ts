/**
 * Market Intelligence Service Type Definitions
 * 
 * This file contains the specific types for the Market Intelligence service,
 * including request parameters, response data structures, and handler types.
 */

import { BaseRequestParams } from './api.types';

/**
 * Market Intelligence Request Type Enum
 * Used to discriminate between different request types
 */
export enum MarketIntelligenceRequestType {
  TRADE_FLOW = 'trade_flow',
  TARIFF = 'tariff',
  MARKET_SIZE = 'market_size',
  BUYERS = 'buyers',
  COMPETITIVE_LANDSCAPE = 'competitive_landscape',
}

/**
 * Base Market Intelligence Request Parameters
 * All specific request types extend this interface
 */
export interface MarketIntelligenceBaseParams extends BaseRequestParams {
  type: MarketIntelligenceRequestType;
}

/**
 * Trade Flow Request Parameters
 */
export interface TradeFlowParams extends MarketIntelligenceBaseParams {
  type: MarketIntelligenceRequestType.TRADE_FLOW;
  /** HS Code for the product */
  hs_code: string;
  /** Target market country code */
  market: string;
  /** Optional year for historical data */
  year?: number;
}

/**
 * Tariff Request Parameters
 */
export interface TariffParams extends MarketIntelligenceBaseParams {
  type: MarketIntelligenceRequestType.TARIFF;
  /** HS Code for the product */
  hs_code: string;
  /** Origin country code */
  origin: string;
  /** Destination country code */
  destination: string;
}

/**
 * Market Size Request Parameters
 */
export interface MarketSizeParams extends MarketIntelligenceBaseParams {
  type: MarketIntelligenceRequestType.MARKET_SIZE;
  /** Product category */
  product_category: string;
  /** Target market country code */
  market: string;
}

/**
 * Buyers Request Parameters
 */
export interface BuyersParams extends MarketIntelligenceBaseParams {
  type: MarketIntelligenceRequestType.BUYERS;
  /** Industry sector */
  industry: string;
  /** Target market country code */
  market: string;
}

/**
 * Competitive Landscape Request Parameters
 */
export interface CompetitiveLandscapeParams extends MarketIntelligenceBaseParams {
  type: MarketIntelligenceRequestType.COMPETITIVE_LANDSCAPE;
  /** Product category */
  product_category: string;
  /** Target market country code */
  market: string;
}

/**
 * Union type of all possible Market Intelligence request parameters
 */
export type MarketIntelligenceParams =
  | TradeFlowParams
  | TariffParams
  | MarketSizeParams
  | BuyersParams
  | CompetitiveLandscapeParams;

/**
 * Type guard to check if params are TradeFlowParams
 */
export function isTradeFlowParams(params: MarketIntelligenceParams): params is TradeFlowParams {
  return params.type === MarketIntelligenceRequestType.TRADE_FLOW;
}

/**
 * Type guard to check if params are TariffParams
 */
export function isTariffParams(params: MarketIntelligenceParams): params is TariffParams {
  return params.type === MarketIntelligenceRequestType.TARIFF;
}

/**
 * Type guard to check if params are MarketSizeParams
 */
export function isMarketSizeParams(params: MarketIntelligenceParams): params is MarketSizeParams {
  return params.type === MarketIntelligenceRequestType.MARKET_SIZE;
}

/**
 * Type guard to check if params are BuyersParams
 */
export function isBuyersParams(params: MarketIntelligenceParams): params is BuyersParams {
  return params.type === MarketIntelligenceRequestType.BUYERS;
}

/**
 * Type guard to check if params are CompetitiveLandscapeParams
 */
export function isCompetitiveLandscapeParams(params: MarketIntelligenceParams): params is CompetitiveLandscapeParams {
  return params.type === MarketIntelligenceRequestType.COMPETITIVE_LANDSCAPE;
}

/**
 * Response data for Trade Flow requests
 */
export interface TradeFlowData {
  /** Total import value in USD */
  import_value_usd: number;
  /** Total export value in USD */
  export_value_usd: number;
  /** Annual growth rate as percentage */
  growth_rate: number;
  /** Top exporters to the market */
  top_exporters: Array<{
    country: string;
    market_share: number;
  }>;
  /** Import volume in metric tons */
  import_volume?: number;
}

/**
 * Response data for Tariff requests
 */
export interface TariffData {
  /** Applicable tariff rate as percentage */
  tariff_rate: number;
  /** Any quota restrictions */
  quota_restrictions: string | null;
  /** Special trade agreement benefits */
  trade_agreements: Array<{
    name: string;
    benefits: string;
  }>;
}

/**
 * Response data for Market Size requests
 */
export interface MarketSizeData {
  /** Total market value in USD */
  market_value_usd: string;
  /** Annual market growth rate as percentage */
  growth_rate: string;
  /** Popular product categories in the market */
  popular_categories: string[];
}

/**
 * Response data for Buyers requests
 */
export interface BuyersData {
  /** List of potential buyers in the market */
  buyers: Array<{
    name: string;
    contact: string;
    size: string;
    interests: string[];
  }>;
}

/**
 * Response data for Competitive Landscape requests
 */
export interface CompetitiveLandscapeData {
  /** Major competitors in the market */
  competitors: Array<{
    name: string;
    market_share: number;
    origin: string;
    strengths: string[];
  }>;
  /** Average price points in the market */
  price_points: {
    low: string;
    average: string;
    premium: string;
  };
}

/**
 * Union type for all possible market intelligence response data
 */
export type MarketIntelligenceData =
  | TradeFlowData
  | TariffData
  | MarketSizeData
  | BuyersData
  | CompetitiveLandscapeData;
