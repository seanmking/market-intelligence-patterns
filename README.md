# Market Intelligence Patterns

This repository contains TypeScript patterns for standardizing API responses, error handling, and type safety in market intelligence services. These patterns are designed to solve common issues in developing market intelligence services, especially when integrating with external APIs like the World Bank's WITS.

## Key Features

- **Standardized API Response Structure**: Consistent response format with proper typing for all API responses
- **Type-Safe Request Handling**: Discriminated unions and type guards for handling different request types
- **Robust Error Handling**: Proper error classification and consistent HTTP status codes
- **Testing Patterns**: Jest examples showing how to mock HTTP clients and test complex response structures

## Core Issues Addressed

1. **Request Type Safety**: Type-safe handling of different request types through a single handler
2. **Response Standardization**: Consistent metadata fields in all responses
3. **Error Status Code Consistency**: Clear separation between validation errors (400), not found (404), and internal errors (500)
4. **Country Code Mapping**: Handling discrepancies between user-friendly codes (UAE) and API codes (ARE)

## Getting Started

To use these patterns in your project:

1. **Implement Response Types**: Copy the API response and error types
2. **Use Error Classes**: Implement the error hierarchy for consistent error handling
3. **Create Response Utilities**: Implement response utility functions for standardized responses
4. **Follow Handler Pattern**: Use type guards for different request types

## Example Usage

### Creating a Standardized Response

```typescript
import { createSuccessResponse } from './utils/response.utils';

// In your service or controller
const data = await fetchSomeData();

return createSuccessResponse(data, {
  metadata: {
    source: 'WITS API',
    confidence_score: 0.95
  }
});
```

### Error Handling

```typescript
import { ValidationError, ExternalApiError } from './utils/error.utils';

try {
  // Your code here
} catch (error) {
  if (error.response?.status === 400) {
    throw new ValidationError('Invalid request parameters', { details: error.response.data });
  } else if (error.response?.status >= 500) {
    throw new ExternalApiError('External API error', { details: error.response.data });
  }
  throw error;
}
```

### Type-Safe Request Handling

```typescript
// Use type guards to handle different request types
if (isTradeFlowParams(params)) {
  return this.handleTradeFlow(params);
} else if (isTariffParams(params)) {
  return this.handleTariff(params);
}
```

## Testing

This repository includes Jest test examples that demonstrate:

- How to mock HTTP clients
- Testing error handling and transformations
- Testing type guards and discriminated unions
- Verifying response structures

## License

MIT
