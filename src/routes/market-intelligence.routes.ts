/**
 * Market Intelligence Routes
 * 
 * This file defines the Express routes for the Market Intelligence API
 */

import express from 'express';
import { MarketIntelligenceHandler } from '../services/market-intelligence/handler';
import { MarketIntelligenceRequestType, MarketIntelligenceParams } from '../types/market-intelligence.types';
import { ValidationError } from '../utils/error.utils';
import { createRouteHandler } from '../utils/response.utils';
import { WitsClient } from '../services/market-intelligence/wits-client';
import { TradeFlowService } from '../services/market-intelligence/trade-flow-service';

const router = express.Router();

// Create the necessary services and handlers
const witsClient = new WitsClient({
  baseUrl: process.env.WITS_API_URL || 'https://api.worldbank.org/wits',
  apiKey: process.env.WITS_API_KEY,
});

const tradeFlowService = new TradeFlowService(witsClient);
const marketIntelligenceHandler = new MarketIntelligenceHandler();

/**
 * GET /api/market-intelligence/trade-flow
 * 
 * Get trade flow data for a specific product and market
 */
router.get('/trade-flow', createRouteHandler(async (req, res) => {
  const { hs_code, market, year } = req.query;
  
  if (!hs_code) {
    throw new ValidationError('HS code is required');
  }
  
  if (!market) {
    throw new ValidationError('Market is required');
  }
  
  const params: MarketIntelligenceParams = {
    type: MarketIntelligenceRequestType.TRADE_FLOW,
    hs_code: String(hs_code),
    market: String(market),
    ...(year && { year: Number(year) })
  };
  
  return await marketIntelligenceHandler.handle(params);
}));

/**
 * GET /api/market-intelligence/tariff
 * 
 * Get tariff data for a specific product, origin, and destination
 */
router.get('/tariff', createRouteHandler(async (req, res) => {
  const { hs_code, origin, destination, year } = req.query;
  
  if (!hs_code) {
    throw new ValidationError('HS code is required');
  }
  
  if (!origin) {
    throw new ValidationError('Origin country is required');
  }
  
  if (!destination) {
    throw new ValidationError('Destination country is required');
  }
  
  const params: MarketIntelligenceParams = {
    type: MarketIntelligenceRequestType.TARIFF,
    hs_code: String(hs_code),
    origin: String(origin),
    destination: String(destination),
    ...(year && { year: Number(year) })
  };
  
  return await marketIntelligenceHandler.handle(params);
}));

/**
 * GET /api/market-intelligence/market-size
 * 
 * Get market size data for a specific product category and market
 */
router.get('/market-size', createRouteHandler(async (req, res) => {
  const { product_category, market } = req.query;
  
  if (!product_category) {
    throw new ValidationError('Product category is required');
  }
  
  if (!market) {
    throw new ValidationError('Market is required');
  }
  
  const params: MarketIntelligenceParams = {
    type: MarketIntelligenceRequestType.MARKET_SIZE,
    product_category: String(product_category),
    market: String(market)
  };
  
  return await marketIntelligenceHandler.handle(params);
}));

/**
 * GET /api/market-intelligence/buyers
 * 
 * Get potential buyers in a specific industry and market
 */
router.get('/buyers', createRouteHandler(async (req, res) => {
  const { industry, market } = req.query;
  
  if (!industry) {
    throw new ValidationError('Industry is required');
  }
  
  if (!market) {
    throw new ValidationError('Market is required');
  }
  
  const params: MarketIntelligenceParams = {
    type: MarketIntelligenceRequestType.BUYERS,
    industry: String(industry),
    market: String(market)
  };
  
  return await marketIntelligenceHandler.handle(params);
}));

/**
 * POST /api/market-intelligence
 * 
 * Unified endpoint for all market intelligence requests
 * Accepts request parameters in the request body
 */
router.post('/', createRouteHandler(async (req, res) => {
  const params: MarketIntelligenceParams = req.body;
  
  if (!params.type) {
    throw new ValidationError('Request type is required');
  }
  
  // Validate required fields based on request type
  switch (params.type) {
    case MarketIntelligenceRequestType.TRADE_FLOW:
      if (!params.hs_code) {
        throw new ValidationError('HS code is required for trade flow requests');
      }
      if (!params.market) {
        throw new ValidationError('Market is required for trade flow requests');
      }
      break;
      
    case MarketIntelligenceRequestType.TARIFF:
      if (!params.hs_code) {
        throw new ValidationError('HS code is required for tariff requests');
      }
      if (!params.origin) {
        throw new ValidationError('Origin is required for tariff requests');
      }
      if (!params.destination) {
        throw new ValidationError('Destination is required for tariff requests');
      }
      break;
      
    case MarketIntelligenceRequestType.MARKET_SIZE:
      if (!params.product_category) {
        throw new ValidationError('Product category is required for market size requests');
      }
      if (!params.market) {
        throw new ValidationError('Market is required for market size requests');
      }
      break;
      
    case MarketIntelligenceRequestType.BUYERS:
      if (!params.industry) {
        throw new ValidationError('Industry is required for buyers requests');
      }
      if (!params.market) {
        throw new ValidationError('Market is required for buyers requests');
      }
      break;
      
    case MarketIntelligenceRequestType.COMPETITIVE_LANDSCAPE:
      if (!params.product_category) {
        throw new ValidationError('Product category is required for competitive landscape requests');
      }
      if (!params.market) {
        throw new ValidationError('Market is required for competitive landscape requests');
      }
      break;
      
    default:
      throw new ValidationError(`Unsupported request type: ${params.type}`);
  }
  
  return await marketIntelligenceHandler.handle(params);
}));

export default router;
