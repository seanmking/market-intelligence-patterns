/**
 * WITS Client Tests
 * 
 * This file demonstrates patterns for testing the WITS API client
 * with proper mocking and type safety.
 */

import axios from 'axios';
import { WitsClient, WitsTradeFlowParams, WitsTradeFlowResponse } from '../src/services/market-intelligence/wits-client';
import { ExternalApiError, ValidationError } from '../src/utils/error.utils';

// Mock axios
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn()
        }
      }
    }))
  };
});

describe('WitsClient', () => {
  // Test setup
  let client: WitsClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create a fresh client instance
    client = new WitsClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'test-key'
    });
    
    // Get the mock axios instance
    mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;
  });

  describe('getTradeFlow', () => {
    // Sample trade flow parameters
    const params: WitsTradeFlowParams = {
      reporter: 'WLD',
      partner: 'UAE',
      productCode: '210690'
    };
    
    // Sample WITS API response
    const mockWitsResponse: WitsTradeFlowResponse = {
      reporter: 'WLD',
      partner: 'ARE', // Note: This is the ISO code, not 'UAE'
      productCode: '210690',
      year: 2022,
      tradeValue: 5000000000,
      netWeight: 250000,
      tradeFlow: 'Import'
    };

    it('should convert market codes correctly', async () => {
      // Arrange
      mockAxiosInstance.get.mockResolvedValue({ data: mockWitsResponse });
      
      // Act
      await client.getTradeFlow(params);
      
      // Assert - check that the parameters were correctly mapped
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/trade/flow', {
        params: expect.objectContaining({
          reporter: 'WLD',
          partner: 'ARE', // 'UAE' should be converted to 'ARE'
          productCode: '210690'
        })
      });
    });

    it('should normalize responses to preserve original market parameter', async () => {
      // Arrange
      mockAxiosInstance.get.mockResolvedValue({ data: mockWitsResponse });
      
      // Act
      const response = await client.getTradeFlow(params);
      const normalizedResponse = client.normalizeTradeFlowResponse(response, 'UAE');
      
      // Assert
      expect(normalizedResponse.partner).toBe('UAE');
    });

    it('should throw ValidationError for missing product code', async () => {
      // Arrange
      const invalidParams = {
        reporter: 'WLD',
        partner: 'UAE',
        productCode: '' // Missing product code
      };
      
      // Act & Assert
      await expect(client.getTradeFlow(invalidParams)).rejects.toThrow(ValidationError);
    });

    it('should handle and transform WITS API errors correctly', async () => {
      // Arrange - simulate a 500 error from the WITS API
      const errorResponse = {
        response: {
          status: 500,
          data: {
            message: 'WITS API internal error'
          }
        }
      };
      
      mockAxiosInstance.get.mockRejectedValue(errorResponse);
      
      // Act & Assert
      await expect(client.getTradeFlow(params)).rejects.toThrow(ExternalApiError);
    });

    it('should handle and transform WITS API validation errors correctly', async () => {
      // Arrange - simulate a 400 error from the WITS API
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: 'Invalid HS code format'
          }
        }
      };
      
      mockAxiosInstance.get.mockRejectedValue(errorResponse);
      
      // Act & Assert
      await expect(client.getTradeFlow(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('getTariff', () => {
    // Sample tariff parameters
    const params = {
      reporter: 'WLD',
      partner: 'UAE',
      productCode: '210690'
    };
    
    it('should make correct API call for tariff data', async () => {
      // Arrange
      mockAxiosInstance.get.mockResolvedValue({ 
        data: {
          reporter: 'WLD',
          partner: 'ARE',
          productCode: '210690',
          year: 2022,
          simpleAverage: 5.2,
          weightedAverage: 4.8,
          quotas: { isApplied: false },
          tradeAgreements: []
        } 
      });
      
      // Act
      await client.getTariff(params);
      
      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tariff/rate', expect.any(Object));
    });
  });
});
