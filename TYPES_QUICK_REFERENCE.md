# Types Quick Reference

A quick lookup guide for all new types added for lending pools and loan repayments.

---

## Entity Types at a Glance

### LendingPool
Pool contract with interest rate configuration and risk parameters.

```typescript
id | pool_address | pool_contract_id | reserve_asset | loan_to_value
base_rate | slope1 | slope2 | liquidation_threshold | liquidation_discount
reserve_factor | name? | title? | description? | created_at | updated_at?
```

**Endpoints:**
- `GET /pools` - List all
- `GET /pools/{id}` - By UUID
- `GET /pools/name/{name}` - By name
- `GET /pools/address/{address}` - By contract address

---

### LendingPoolSnapshot
Point-in-time metrics for a pool (supply, borrow, utilization, APY).

```typescript
id | lending_pool_id | total_supply | total_borrow | available_liquidity
utilization_rate | supply_apy | borrow_apy | created_at
```

**Endpoints:**
- `GET /pools/{id}/snapshot` - Latest snapshot
- `GET /pools/{id}/pool-stats` - With comprehensive stats

---

### Loan
Loan record with borrow index and principal amount.

```typescript
id | account_id | wallet_id | pool | borrow_index | principal_amount
created_at | status ("active" | "repaid" | "liquidated") | transaction?
```

**Endpoints:**
- `GET /loans` - All loans
- `GET /loans/pool/{id}` - By pool
- `GET /loans/wallet/{id}` - By wallet
- `GET /loans/status/{status}` - By status

---

### LoanRepayment
Repayment transaction on a loan.

```typescript
id | loan_id | repayment_amount | repayment_date | transaction?
```

**Endpoints:**
- `GET /loan-repayments` - All repayments
- `GET /loan-repayments/loan/{id}` - By loan
- `POST` via mutation - Create new

---

### LoanLiquidation
Liquidation event for a loan.

```typescript
id | loan_id | liquidator_wallet_id | liquidation_amount | liquidation_date | transaction?
```

**Endpoints:**
- `GET /loan-liquidations` - All liquidations
- `GET /loan-liquidations/loan/{id}` - By loan
- `POST` via mutation - Create new

---

## Mutation Input Types

### CreateLoanRepaymentInput
Create a repayment record.

```typescript
loan_id: string              // UUID of loan being repaid
repayment_amount: string     // BigDecimal amount
transaction?: string         // Optional TX hash
```

**Usage:**
```typescript
await client.processMutation({
  Loans: { CreateRepayment: input }
});
```

---

### CreateLoanLiquidationInput
Create a liquidation record.

```typescript
loan_id: string              // UUID of loan
liquidator_wallet_id: string // UUID of liquidator wallet
liquidation_amount: string   // BigDecimal amount
transaction?: string         // Optional TX hash
```

**Usage:**
```typescript
await client.processMutation({
  Loans: { CreateLiquidation: input }
});
```

---

## Filter Types

### LoanFilters
```typescript
pool_id?: string       // Filter by pool
wallet_id?: string     // Filter by wallet
status?: LoanStatus    // "active" | "repaid" | "liquidated"
from_date?: string     // ISO 8601
to_date?: string       // ISO 8601
```

### LoanRepaymentFilters
```typescript
loan_id?: string       // Filter by loan
from_date?: string     // ISO 8601
to_date?: string       // ISO 8601
```

### LoanLiquidationFilters
```typescript
loan_id?: string       // Filter by loan
from_date?: string     // ISO 8601
to_date?: string       // ISO 8601
```

### LendingPoolFilters
```typescript
reserve_asset?: string      // UUID
min_loan_to_value?: number  // 0-1
max_loan_to_value?: number  // 0-1
```

---

## Enum Types

### LoanStatus
```typescript
"active"      // Loan is open
"repaid"      // Loan fully repaid
"liquidated"  // Loan liquidated
```

### PoolTransactionType
```typescript
"supply"      // User supplied liquidity
"withdraw"    // User withdrew liquidity
```

---

## Type Guards

Safe type checking for mutation responses.

```typescript
MutationResponseHelpers.isCreateRepayment(response)
MutationResponseHelpers.isCreateLiquidation(response)
```

---

## Import All Types

```typescript
import type {
  // Entities
  LendingPool,
  LendingPoolSnapshot,
  Loan,
  LoanRepayment,
  LoanLiquidation,

  // Enums
  LoanStatus,
  PoolTransactionType,

  // Inputs
  CreateLoanRepaymentInput,
  CreateLoanLiquidationInput,

  // Filters
  LoanFilters,
  LoanRepaymentFilters,
  LoanLiquidationFilters,
  LendingPoolFilters
} from './types';

import { MutationResponseHelpers } from './types';
```

---

## Common Patterns

### Create Repayment
```typescript
const input: CreateLoanRepaymentInput = {
  loan_id: "...",
  repayment_amount: "2500.50"
};

const response = await client.processMutation({
  Loans: { CreateRepayment: input }
});

if (MutationResponseHelpers.isCreateRepayment(response)) {
  console.log(response.Loans.CreateRepayment); // repayment ID
}
```

### Create Liquidation
```typescript
const input: CreateLoanLiquidationInput = {
  loan_id: "...",
  liquidator_wallet_id: "...",
  liquidation_amount: "5000.00"
};

const response = await client.processMutation({
  Loans: { CreateLiquidation: input }
});

if (MutationResponseHelpers.isCreateLiquidation(response)) {
  console.log(response.Loans.CreateLiquidation); // liquidation ID
}
```

### Get Pool Snapshot
```typescript
const response = await client.request<LendingPoolSnapshot>(
  'GET',
  `/pools/${poolId}/snapshot`
);

if (response.success && response.data) {
  console.log(response.data.supply_apy);
  console.log(response.data.utilization_rate);
}
```

### Query Loans by Status
```typescript
const activeLoans = await client.request<Loan[]>(
  'GET',
  '/loans/status/active'
);

if (response.success && response.data) {
  response.data.forEach(loan => {
    console.log(loan.principal_amount);
  });
}
```

---

## Key Data Format Notes

### BigDecimal (String)
All amounts are strings to prevent precision loss:
```typescript
principal_amount: "10000.50"    // ✓ Correct
principal_amount: 10000.50      // ✗ Wrong (number type)
```

### Timestamps (ISO 8601)
```typescript
created_at: "2024-01-15T10:30:00"  // ✓ Correct
created_at: 1705318200             // ✗ Wrong (unix timestamp)
```

### IDs (UUID)
```typescript
id: "550e8400-e29b-41d4-a716-446655440000"  // ✓ Correct
id: "550e8400e29b41d4a716446655440000"      // ✗ Wrong (no dashes)
```

---

## What Changed from Old Types

| Old | New | Type |
|-----|-----|------|
| `Loan.wallet` | `Loan.wallet_id` | Rename |
| `Loan.amount` | `Loan.principal_amount` | Rename + `number` → `string` |
| — | `Loan.account_id` | New required field |
| — | `Loan.borrow_index` | New required field |
| — | `Loan.transaction?` | New optional field |
| `Loan.collateral` | Removed | — |

---

## Deployment Checklist

- [ ] All Loan types updated to new schema
- [ ] principal_amount changed from number to string
- [ ] account_id field populated for all loans
- [ ] borrow_index field populated for all loans
- [ ] Type guards imported and used for mutations
- [ ] LoanRepayment endpoints tested
- [ ] LoanLiquidation endpoints tested
- [ ] LendingPoolSnapshot queries working
- [ ] Filter types properly applied in queries

---

**See [TYPES_DOCUMENTATION.md](./TYPES_DOCUMENTATION.md) for complete documentation.**
