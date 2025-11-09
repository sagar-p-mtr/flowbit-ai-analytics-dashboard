# Entity Relationship Diagram

## Database Schema Overview

```
┌─────────────────┐
│    Document     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ filePath        │
│ fileSize        │
│ fileType        │
│ status          │
│ organizationId  │
│ departmentId    │
│ createdAt       │
│ updatedAt       │
│ uploadedById    │
└─────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│    Invoice      │
├─────────────────┤
│ id (PK)         │
│ documentId (FK) │
│ vendorId (FK)   │
│ customerId (FK) │
│ invoiceNumber   │
│ invoiceDate     │
│ deliveryDate    │
│ dueDate         │
│ subTotal        │
│ totalTax        │
│ invoiceTotal    │
│ currencySymbol  │
│ status          │
└─────────────────┘
    │       │
    │       └──────┐
    │              │
    │ 1:1          │ N:1
    ▼              ▼
┌─────────────┐ ┌──────────┐
│   Payment   │ │  Vendor  │
├─────────────┤ ├──────────┤
│ id (PK)     │ │ id (PK)  │
│ invoiceId   │ │ name     │
│ bankAccount │ │ taxId    │
│ bic         │ │ address  │
│ netDays     │ │ party    │
│ paymentTerms│ │ Number   │
└─────────────┘ └──────────┘
    
    Invoice
       │
       │ 1:N
       ▼
┌─────────────┐
│  LineItem   │
├─────────────┤
│ id (PK)     │
│ invoiceId   │
│ srNo        │
│ description │
│ quantity    │
│ unitPrice   │
│ totalPrice  │
│ sachkonto   │
│ buSchluessel│
│ category    │
└─────────────┘

    Invoice
       │
       │ N:1
       ▼
┌─────────────┐
│  Customer   │
├─────────────┤
│ id (PK)     │
│ name        │
│ address     │
│ createdAt   │
└─────────────┘
```

## Relationships

### Document ↔ Invoice (1:1)
- Each Document has exactly one Invoice
- Each Invoice belongs to one Document
- Cascade delete: Deleting a Document deletes its Invoice

### Invoice ↔ Vendor (N:1)
- Each Invoice belongs to one Vendor
- Each Vendor can have many Invoices
- Indexed on `vendorId` for fast lookups

### Invoice ↔ Customer (N:1)
- Each Invoice belongs to one Customer
- Each Customer can have many Invoices
- Indexed on `customerId`

### Invoice ↔ Payment (1:1)
- Each Invoice can have one Payment record
- Each Payment belongs to one Invoice
- Cascade delete: Deleting an Invoice deletes its Payment

### Invoice ↔ LineItem (1:N)
- Each Invoice can have many LineItems
- Each LineItem belongs to one Invoice
- Cascade delete: Deleting an Invoice deletes all its LineItems

## Key Fields

### Invoice
- **invoiceTotal**: Final amount including tax (negative values indicate credits)
- **subTotal**: Amount before tax
- **totalTax**: Tax amount
- **status**: processed, pending, rejected
- **invoiceDate**: Date issued
- **dueDate**: Payment due date

### LineItem
- **category**: Categorized based on Sachkonto
  - 4400 → Services
  - 4300 → Materials
  - 4500 → Shipping
  - 4600 → Utilities
  - 4700 → Office Supplies
  - default → General

### Vendor
- **taxId**: Tax identification number
- **Unique constraint** on (name, taxId) to prevent duplicates

### Payment
- **netDays**: Number of days until payment is due
- **discountPercentage**: Early payment discount
- **discountDays**: Days within which discount applies

## Indexes

- `Document.organizationId`
- `Document.status`
- `Document.createdAt`
- `Invoice.invoiceDate`
- `Invoice.status`
- `Invoice.vendorId`
- `LineItem.invoiceId`
- `LineItem.category`
- `Vendor.name`
- `Customer.name`

## Data Normalization

The schema is normalized to **Third Normal Form (3NF)**:

1. **1NF**: All fields contain atomic values
2. **2NF**: No partial dependencies
3. **3NF**: No transitive dependencies

### Benefits
- Eliminates data redundancy
- Maintains data integrity
- Enables efficient querying
- Supports referential integrity with foreign keys

## Sample Queries

### Total Spend
```sql
SELECT ABS(SUM(invoice_total)) as total_spend 
FROM "Invoice";
```

### Top Vendors
```sql
SELECT v.name, ABS(SUM(i.invoice_total)) as total_spend
FROM "Vendor" v
JOIN "Invoice" i ON v.id = i.vendor_id
GROUP BY v.name
ORDER BY total_spend DESC
LIMIT 10;
```

### Spend by Category
```sql
SELECT category, ABS(SUM(total_price)) as total
FROM "LineItem"
GROUP BY category
ORDER BY total DESC;
```

### Invoice Trends
```sql
SELECT 
  DATE_TRUNC('month', invoice_date) as month,
  COUNT(*) as count,
  ABS(SUM(invoice_total)) as total
FROM "Invoice"
GROUP BY month
ORDER BY month;
```
