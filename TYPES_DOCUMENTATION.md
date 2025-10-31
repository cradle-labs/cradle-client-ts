# Types Documentation - Lending Pools & Loans

This document provides comprehensive documentation for all TypeScript types related to lending pools, loans, repayments, and liquidations in the Cradle API client.

**Last Updated:** October 31, 2024
**API Version:** 1.0

---

## Table of Contents

1. [Entity Types](#entity-types)
2. [Enum Types](#enum-types)
3. [Input Types (Mutations)](#input-types-mutations)
4. [Filter Types](#filter-types)
5. [Type Guards](#type-guards)
6. [Usage Examples](#usage-examples)

---

## Entity Types

### LendingPool

Represents a lending pool in the DeFi protocol.

```typescript
interface LendingPool {
  id: string;                          // UUID - Unique pool identifier
  pool_address: string;                // Ethereum/Hedera contract address
  pool_contract_id: string;            // Hedera contract ID (0.0.xxx format)
  reserve_asset: string;               // UUID - Asset ID used as reserve
  loan_to_value: string;               // BigDecimal - LTV ratio (0-1)
  base_rate: string;                   // BigDecimal - Base interest rate
  slope1: string;                      // BigDecimal - First slope of interest rate model
  slope2: string;                      // BigDecimal - Second slope of interest rate model
  liquidation_threshold: string;       // BigDecimal - Threshold for liquidation
  liquidation_discount: string;        // BigDecimal - Discount applied during liquidation
  reserve_factor: string;              // BigDecimal - Percentage of interest reserved
  name?: string;                       // Optional - Pool name
  title?: string;                      // Optional - Pool display title
  description?: string;                // Optional - Pool description
  created_at: string;                  // Timestamp - Creation timestamp (ISO 8601)
  updated_at?: string;                 // Optional - Last update timestamp (ISO 8601)
}
```

**Used By Endpoints:**
- `GET /pools` - List all pools
- `GET /pools/{id}` - Get pool by UUID
- `GET /pools/name/{name}` - Get pool by name
- `GET /pools/address/{address}` - Get pool by address

**Example:**
```typescript
const pool: LendingPool = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  pool_address: "0x1234567890123456789012345678901234567890",
  pool_contract_id: "0.0.123456",
  reserve_asset: "550e8400-e29b-41d4-a716-446655440001",
  loan_to_value: "0.8",
  base_rate: "0.02",
  slope1: "0.04",
  slope2: "0.06",
  liquidation_threshold: "0.85",
  liquidation_discount: "0.05",
  reserve_factor: "0.1",
  name: "USDC Lending Pool",
  title: "USDC Pool",
  description: "Pool for USDC lending",
  created_at: "2024-01-15T10:30:00",
  updated_at: "2024-01-15T10:30:00"
};
```

---

### LendingPoolSnapshot

Represents a point-in-time snapshot of lending pool metrics and statistics.

```typescript
interface LendingPoolSnapshot {
  id: string;                      // UUID - Snapshot ID
  lending_pool_id: string;         // UUID - Associated pool ID
  total_supply: string;            // BigDecimal - Total assets supplied to pool
  total_borrow: string;            // BigDecimal - Total assets borrowed from pool
  available_liquidity: string;     // BigDecimal - Available liquidity for borrowing
  utilization_rate: string;        // BigDecimal - Utilization rate (0-1)
  supply_apy: string;              // BigDecimal - Annual Percentage Yield for suppliers
  borrow_apy: string;              // BigDecimal - Annual Percentage Yield for borrowers
  created_at: string;              // Timestamp - Snapshot creation time (ISO 8601)
}
```

**Used By Endpoints:**
- `GET /pools/{id}/snapshot` - Get latest pool snapshot
- `GET /pools/{id}/pool-stats` - Get comprehensive pool statistics

**Example:**
```typescript
const snapshot: LendingPoolSnapshot = {
  id: "660e8400-e29b-41d4-a716-446655440000",
  lending_pool_id: "550e8400-e29b-41d4-a716-446655440000",
  total_supply: "1000000.5",
  total_borrow: "750000.25",
  available_liquidity: "250000.25",
  utilization_rate: "0.75",
  supply_apy: "0.045",
  borrow_apy: "0.065",
  created_at: "2024-01-15T10:30:00"
};
```

---

### Loan

Represents a loan in a lending pool.

```typescript
interface Loan {
  id: string;                  // UUID - Unique loan identifier
  account_id: string;          // UUID - Associated account ID
  wallet_id: string;           // UUID - Associated wallet ID
  pool: string;                // UUID - Lending pool ID
  borrow_index: string;        // BigDecimal - Borrow index at loan creation
  principal_amount: string;    // BigDecimal - Principal amount borrowed
  created_at: string;          // Timestamp - Loan creation timestamp (ISO 8601)
  status: LoanStatus;          // Enum - Loan status ("active" | "repaid" | "liquidated")
  transaction?: string;        // Optional - Blockchain transaction hash
}
```

**Used By Endpoints:**
- `GET /loans` - Get all loans
- `GET /loans/pool/{id}` - Get loans by pool
- `GET /loans/wallet/{id}` - Get loans by wallet
- `GET /loans/status/{status}` - Get loans by status
- `GET /pools/{pool_id}/user-positions/{wallet_id}` - Get user positions

**Example:**
```typescript
const loan: Loan = {
  id: "770e8400-e29b-41d4-a716-446655440000",
  account_id: "880e8400-e29b-41d4-a716-446655440000",
  wallet_id: "990e8400-e29b-41d4-a716-446655440000",
  pool: "550e8400-e29b-41d4-a716-446655440000",
  borrow_index: "1.05",
  principal_amount: "10000.00",
  created_at: "2024-01-10T08:15:00",
  status: "active",
  transaction: "0x1234567890abcdef"
};
```

---

### LoanRepayment

Represents a loan repayment transaction.

```typescript
interface LoanRepayment {
  id: string;                      // UUID - Unique repayment record ID
  loan_id: string;                 // UUID - Associated loan ID
  repayment_amount: string;        // BigDecimal - Amount repaid
  repayment_date: string;          // Timestamp - Date of repayment (ISO 8601)
  transaction?: string;            // Optional - Blockchain transaction hash
}
```

**Used By Endpoints:**
- `GET /loan-repayments` - Get all repayments
- `GET /loan-repayments/loan/{id}` - Get repayments by loan
- `GET /pools/{pool_id}/user-positions/{wallet_id}` - Get user repayment history

**Example:**
```typescript
const repayment: LoanRepayment = {
  id: "aa0e8400-e29b-41d4-a716-446655440000",
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  repayment_amount: "2500.50",
  repayment_date: "2024-01-14T15:45:00",
  transaction: "0x9876543210abcdef"
};
```

---

### LoanLiquidation

Represents a loan liquidation event.

```typescript
interface LoanLiquidation {
  id: string;                          // UUID - Unique liquidation record ID
  loan_id: string;                     // UUID - Associated loan ID
  liquidator_wallet_id: string;        // UUID - Wallet ID of the liquidator
  liquidation_amount: string;          // BigDecimal - Amount liquidated
  liquidation_date: string;            // Timestamp - Date of liquidation (ISO 8601)
  transaction?: string;                // Optional - Blockchain transaction hash
}
```

**Used By Endpoints:**
- `GET /loan-liquidations` - Get all liquidations
- `GET /loan-liquidations/loan/{id}` - Get liquidations by loan

**Example:**
```typescript
const liquidation: LoanLiquidation = {
  id: "cc0e8400-e29b-41d4-a716-446655440000",
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  liquidator_wallet_id: "dd0e8400-e29b-41d4-a716-446655440000",
  liquidation_amount: "5000.00",
  liquidation_date: "2024-01-12T12:00:00",
  transaction: "0x1111111111111111"
};
```

---

### LendingTransaction

Represents a supply or withdraw transaction in a lending pool.

```typescript
interface LendingTransaction {
  id: string;                          // UUID - Unique transaction ID
  wallet: string;                      // UUID - Associated wallet ID
  pool: string;                        // UUID - Associated pool ID
  amount: number;                      // Amount involved in transaction
  transaction_type: PoolTransactionType;  // "supply" | "withdraw"
  created_at: string;                  // Timestamp - Transaction timestamp
}
```

---

## Enum Types

### LoanStatus

Represents the status of a loan.

```typescript
type LoanStatus = 'active' | 'repaid' | 'liquidated';
```

**Valid Values:**
- `'active'` - Loan is currently active and accruing interest
- `'repaid'` - Loan has been fully repaid
- `'liquidated'` - Loan has been liquidated

**Used By:**
- `Loan.status` field
- `LoanFilters.status` filter parameter

---

### PoolTransactionType

Represents the type of transaction in a lending pool.

```typescript
type PoolTransactionType = 'supply' | 'withdraw';
```

**Valid Values:**
- `'supply'` - User supplied assets to the pool
- `'withdraw'` - User withdrew assets from the pool

**Used By:**
- `LendingTransaction.transaction_type` field

---

## Input Types (Mutations)

Input types are used to create or update resources via API mutations.

### CreateLoanRepaymentInput

Input for creating a loan repayment record.

```typescript
interface CreateLoanRepaymentInput {
  loan_id: string;              // UUID - ID of the loan being repaid
  repayment_amount: string;     // BigDecimal - Amount being repaid
  transaction?: string;         // Optional - Blockchain transaction hash
}
```

**Used By Mutation:**
- `Loans.CreateRepayment` - Create a new repayment record

**Example:**
```typescript
const input: CreateLoanRepaymentInput = {
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  repayment_amount: "2500.50",
  transaction: "0x9876543210abcdef"
};

const response = await client.processMutation({
  Loans: { CreateRepayment: input }
});
```

---

### CreateLoanLiquidationInput

Input for creating a loan liquidation record.

```typescript
interface CreateLoanLiquidationInput {
  loan_id: string;                    // UUID - ID of the loan being liquidated
  liquidator_wallet_id: string;       // UUID - Wallet ID of the liquidator
  liquidation_amount: string;         // BigDecimal - Amount being liquidated
  transaction?: string;               // Optional - Blockchain transaction hash
}
```

**Used By Mutation:**
- `Loans.CreateLiquidation` - Create a new liquidation record

**Example:**
```typescript
const input: CreateLoanLiquidationInput = {
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  liquidator_wallet_id: "dd0e8400-e29b-41d4-a716-446655440000",
  liquidation_amount: "5000.00",
  transaction: "0x1111111111111111"
};

const response = await client.processMutation({
  Loans: { CreateLiquidation: input }
});
```

---

### CreateLendingPoolInput

Input for creating a new lending pool.

```typescript
interface CreateLendingPoolInput {
  pool_address: string;              // Ethereum/Hedera contract address
  pool_contract_id: string;          // Hedera contract ID (0.0.xxx format)
  reserve_asset: string;             // UUID - Asset ID for the pool
  loan_to_value: string;             // BigDecimal - LTV ratio (0-1)
  base_rate: string;                 // BigDecimal - Base interest rate
  slope1: string;                    // BigDecimal - First slope rate
  slope2: string;                    // BigDecimal - Second slope rate
  liquidation_threshold: string;     // BigDecimal - Liquidation threshold
  liquidation_discount: string;      // BigDecimal - Liquidation discount
  reserve_factor: string;            // BigDecimal - Reserve factor (0-1)
  name: string;                      // Pool name
  title: string;                     // Pool display title
  description: string;               // Pool description
}
```

---

### SupplyLiquidityInput

Input for supplying liquidity to a pool.

```typescript
interface SupplyLiquidityInput {
  wallet: string;       // UUID - Wallet ID
  pool: string;         // UUID - Pool ID
  amount: number;       // Amount to supply
}
```

---

### BorrowAssetInput

Input for borrowing from a pool.

```typescript
interface BorrowAssetInput {
  wallet: string;       // UUID - Wallet ID
  pool: string;         // UUID - Pool ID
  amount: number;       // Amount to borrow
  collateral: string;   // UUID - Collateral asset ID
}
```

---

### RepayBorrowInput

Input for repaying a borrow position.

```typescript
interface RepayBorrowInput {
  wallet: string;       // UUID - Wallet ID
  loan: string;         // UUID - Loan ID
  amount: number;       // Amount to repay
}
```

---

## Filter Types

Filter types are used to query resources with specific criteria.

### LoanFilters

Filters for querying loans.

```typescript
interface LoanFilters {
  pool_id?: string;         // UUID - Filter by pool
  wallet_id?: string;       // UUID - Filter by wallet
  status?: LoanStatus;      // "active" | "repaid" | "liquidated" - Filter by status
  from_date?: string;       // ISO 8601 timestamp - Start date filter
  to_date?: string;         // ISO 8601 timestamp - End date filter
}
```

**Used By Query Methods:**
- Can be passed as query parameters to loan endpoints

**Example:**
```typescript
const filters: LoanFilters = {
  wallet_id: "990e8400-e29b-41d4-a716-446655440000",
  status: "active",
  from_date: "2024-01-01T00:00:00"
};
```

---

### LoanRepaymentFilters

Filters for querying loan repayments.

```typescript
interface LoanRepaymentFilters {
  loan_id?: string;         // UUID - Filter by loan
  from_date?: string;       // ISO 8601 timestamp - Start date filter
  to_date?: string;         // ISO 8601 timestamp - End date filter
}
```

**Example:**
```typescript
const filters: LoanRepaymentFilters = {
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  from_date: "2024-01-01T00:00:00"
};
```

---

### LoanLiquidationFilters

Filters for querying loan liquidations.

```typescript
interface LoanLiquidationFilters {
  loan_id?: string;         // UUID - Filter by loan
  from_date?: string;       // ISO 8601 timestamp - Start date filter
  to_date?: string;         // ISO 8601 timestamp - End date filter
}
```

---

### LendingPoolFilters

Filters for querying lending pools.

```typescript
interface LendingPoolFilters {
  reserve_asset?: string;       // UUID - Filter by reserve asset
  min_loan_to_value?: number;   // Minimum LTV ratio
  max_loan_to_value?: number;   // Maximum LTV ratio
}
```

---

## Type Guards

Type guards are helper functions for safely accessing mutation responses using TypeScript's type narrowing.

### isCreateRepayment

Safely check if a mutation response is a CreateRepayment response.

```typescript
function isCreateRepayment(response: MutationResponse): response is { Loans: { CreateRepayment: string } }
```

**Usage:**
```typescript
const response = await client.processMutation({
  Loans: { CreateRepayment: input }
});

if (MutationResponseHelpers.isCreateRepayment(response)) {
  const repaymentId: string = response.Loans.CreateRepayment;
  console.log('Repayment created:', repaymentId);
}
```

---

### isCreateLiquidation

Safely check if a mutation response is a CreateLiquidation response.

```typescript
function isCreateLiquidation(response: MutationResponse): response is { Loans: { CreateLiquidation: string } }
```

**Usage:**
```typescript
const response = await client.processMutation({
  Loans: { CreateLiquidation: input }
});

if (MutationResponseHelpers.isCreateLiquidation(response)) {
  const liquidationId: string = response.Loans.CreateLiquidation;
  console.log('Liquidation created:', liquidationId);
}
```

---

## Usage Examples

### Complete Loan Repayment Workflow

```typescript
import { CradleApiClient } from './cradle-api-client';
import type {
  Loan,
  LoanRepayment,
  CreateLoanRepaymentInput,
  LoanFilters
} from './types';

const client = new CradleApiClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000'
});

// 1. Get all active loans for a wallet
const activeLoans = await client.getLoans('550e8400-e29b-41d4-a716-446655440000');
console.log(`Found ${activeLoans.data?.length} loans`);

// 2. Get a specific loan
const loan = activeLoans.data?.[0];
if (loan?.status === 'active') {
  // 3. Create a repayment
  const repaymentInput: CreateLoanRepaymentInput = {
    loan_id: loan.id,
    repayment_amount: '2500.50',
    transaction: '0x...'
  };

  const repaymentResponse = await client.processMutation({
    Loans: { CreateRepayment: repaymentInput }
  });

  // 4. Check response using type guard
  if (client['MutationResponseHelpers'].isCreateRepayment(repaymentResponse)) {
    console.log('Repayment created:', repaymentResponse.Loans.CreateRepayment);
  }
}
```

---

### Pool Statistics Query

```typescript
import { CradleApiClient } from './cradle-api-client';
import type { LendingPoolSnapshot } from './types';

const client = new CradleApiClient({
  apiKey: 'your-api-key'
});

// Get pool snapshot
const poolId = '550e8400-e29b-41d4-a716-446655440000';
const snapshotResponse = await client.request<LendingPoolSnapshot>(
  'GET',
  `/pools/${poolId}/snapshot`
);

if (snapshotResponse.success && snapshotResponse.data) {
  const snapshot = snapshotResponse.data;
  console.log(`Pool Utilization: ${(parseFloat(snapshot.utilization_rate) * 100).toFixed(2)}%`);
  console.log(`Supply APY: ${(parseFloat(snapshot.supply_apy) * 100).toFixed(2)}%`);
  console.log(`Borrow APY: ${(parseFloat(snapshot.borrow_apy) * 100).toFixed(2)}%`);
}
```

---

### User Position Query

```typescript
import { CradleApiClient } from './cradle-api-client';

const client = new CradleApiClient({
  apiKey: 'your-api-key'
});

const poolId = '550e8400-e29b-41d4-a716-446655440000';
const walletId = '990e8400-e29b-41d4-a716-446655440000';

const positionResponse = await client.request(
  'GET',
  `/pools/${poolId}/user-positions/${walletId}`
);

if (positionResponse.success && positionResponse.data) {
  const { borrow_position, repayment_history } = positionResponse.data;
  console.log(`Active Loans: ${borrow_position.active_loans_count}`);
  console.log(`Total Borrowed: ${borrow_position.total_borrow_amount}`);
  console.log(`Total Repaid: ${repayment_history.total_repaid}`);
  console.log(`Repayments: ${repayment_history.repayment_count}`);
}
```

---

### Loan Liquidation

```typescript
import { CradleApiClient } from './cradle-api-client';
import type { CreateLoanLiquidationInput } from './types';

const client = new CradleApiClient({
  apiKey: 'your-api-key'
});

const liquidationInput: CreateLoanLiquidationInput = {
  loan_id: "770e8400-e29b-41d4-a716-446655440000",
  liquidator_wallet_id: "dd0e8400-e29b-41d4-a716-446655440000",
  liquidation_amount: "5000.00",
  transaction: "0x..."
};

const response = await client.processMutation({
  Loans: { CreateLiquidation: liquidationInput }
});

if (response.Loans?.CreateLiquidation) {
  console.log('Liquidation ID:', response.Loans.CreateLiquidation);
}
```

---

## API Endpoint Reference

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/pools` | GET | `LendingPool[]` |
| `/pools/{id}` | GET | `LendingPool` |
| `/pools/name/{name}` | GET | `LendingPool` |
| `/pools/address/{address}` | GET | `LendingPool` |
| `/pools/{id}/snapshot` | GET | `LendingPoolSnapshot` |
| `/pools/{id}/pool-stats` | GET | Pool stats with snapshot |
| `/loans` | GET | `Loan[]` |
| `/loans/pool/{id}` | GET | `Loan[]` |
| `/loans/wallet/{id}` | GET | `Loan[]` |
| `/loans/status/{status}` | GET | `Loan[]` |
| `/loan-repayments` | GET | `LoanRepayment[]` |
| `/loan-repayments/loan/{id}` | GET | `LoanRepayment[]` |
| `/loan-liquidations` | GET | `LoanLiquidation[]` |
| `/loan-liquidations/loan/{id}` | GET | `LoanLiquidation[]` |
| `/pools/{pool_id}/user-positions/{wallet_id}` | GET | User position details |

---

## Data Type Notes

### BigDecimal Strings

All numeric values representing amounts, rates, and ratios are represented as **strings** to maintain precision:

```typescript
const value: string = "0.8";  // Not 0.8 (number)
const rate: string = "1000000.50";  // Not 1000000.50 (number)
```

This prevents floating-point precision errors when dealing with financial data.

### ISO 8601 Timestamps

All timestamps use the ISO 8601 format:

```typescript
"2024-01-15T10:30:00"
"2024-01-14T15:45:00Z"
```

### UUIDs

All IDs follow the standard UUID v4 format:

```typescript
"550e8400-e29b-41d4-a716-446655440000"
```

---

## Migration Guide (from old Loan type)

If you were using the old `Loan` type, here are the breaking changes:

| Old Field | New Field | Type Change | Migration |
|-----------|-----------|-------------|-----------|
| `wallet` | `wallet_id` | `string` | Rename field |
| `amount` | `principal_amount` | `number` → `string` | Rename and convert to BigDecimal |
| (new) | `account_id` | `string` | Now required |
| (new) | `borrow_index` | `string` | Now required |
| `status` | `status` | `LoanStatus` | Same type, but now more specific |
| (new) | `transaction` | `string?` | Optional blockchain TX hash |

---

**For more information, see:**
- [README.md](./README.md) - Main API documentation
- [SETUP.md](./SETUP.md) - Setup and installation guide
- [CHANGELOG.md](./CHANGELOG.md) - Version history
