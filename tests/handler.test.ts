/**
 * Market Intelligence Handler Tests
 * 
 * This file demonstrates patterns for testing the Market Intelligence Handler
 * with proper mocking and type safety.
 */

import { MarketIntelligenceHandler } from '../src/services/market-intelligence/handler';
import { MarketIntelligenceRequestType, TradeFlowParams } from '../src/types/market-intelligence.types';
import { ValidationError } from '../src/utils/error.utils';

// Mock the necessary modules/services 
// (these would typically be service dependencies of the handler)
jest.mock('../src/services/market-intelligence/trade-flow-service', () => {
  return {
    TradeFlowService: jest.fn().mockImplementation(() => ({
      getTradeFlow: jest.fn()
    }))
  };
});

describe('MarketIntelligenceHandler', () => {
  let handler: MarketIntelligenceHandler;

  beforeEach(() => {
    // Clear mocks and create a fresh instance for each test
    jest.clearAllMocks();
    handler = new MarketIntelligenceHandler();
  });

  describe('handle method', () => {
    it('should throw a ValidationError if type is missing', async () => {
      // Arrange
      const params = {} as any;

      // Act & Assert
      await expect(handler.handle(params)).rejects.toThrow(ValidationError);
    });

    it('should call handleTradeFlow for trade_flow request type', async () => {
      // Arrange
      const params: TradeFlowParams = {
        type: MarketIntelligenceRequestType.TRADE_FLOW,
        hs_code: '0123',
        market: 'UAE'
      };

      // Spy on the private method
      const handleTradeFlowSpy = jest.spyOn(
        handler as any, // Cast to any to access private method
        'handleTradeFlow'
      );

      // Mock the return value
      handleTradeFlowSpy.mockResolvedValue({
        status: 200,
        data: {
          import_value_usd: 5000000000,
          export_value_usd: 3000000000,
          growth_rate: 12.5,
          top_exporters: []
        },
        metadata: {
          data_completeness: 'complete',
          last_updated: new Date().toISOString(),
          source: 'WITS API'
        }
      });

      // Act
      await handler.handle(params);

      // Assert
      expect(handleTradeFlowSpy).toHaveBeenCalledWith(params);
      expect(handleTradeFlowSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw ValidationError for unsupported request type', async () => {
      // Arrange
      const params = {
        type: 'unsupported_type' as any,
      };

      // Act & Assert
      await expect(handler.handle(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('handleTradeFlow method', () => {
    it('should validate required parameters', async () => {
      // Arrange - missing hs_code
      const paramsWithoutHsCode = {
        type: MarketIntelligenceRequestType.TRADE_FLOW,
        market: 'UAE'
      } as TradeFlowParams;

      // Access the private method directly for testing
      const handleTradeFlow = (handler as any).handleTradeFlow.bind(handler);

      // Act & Assert
      await expect(handleTradeFlow(paramsWithoutHsCode)).rejects.toThrow(
        /HS code is required/
      );

      // Arrange - missing market
      const paramsWithoutMarket = {
        type: MarketIntelligenceRequestType.TRADE_FLOW,
        hs_code: '0123'
      } as TradeFlowParams;

      // Act & Assert
      await expect(handleTradeFlow(paramsWithoutMarket)).rejects.toThrow(
        /Market is required/
      );
    });

    it('should return formatted trade flow data', async () => {
      // Arrange
      const params: TradeFlowParams = {
        type: MarketIntelligenceRequestType.TRADE_FLOW,
        hs_code: '0123',
        market: 'UAE'
      };

      // Access the private method directly for testing
      const handleTradeFlow = (handler as any).handleTradeFlow.bind(handler);

      // Act
      const result = await handleTradeFlow(params);

      // Assert
      expect(result).toMatchObject({
        status: 200,
        data: {
          import_value_usd: expect.any(Number),
          export_value_usd: expect.any(Number),
          growth_rate: expect.any(Number),
          top_exporters: expect.any(Array)
        },
        metadata: {
          data_completeness: 'complete',
          last_updated: expect.any(String),
          source: expect.any(String)
        }
      });
    });
  });
});
