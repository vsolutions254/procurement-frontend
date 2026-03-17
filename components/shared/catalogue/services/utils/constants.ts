export function formatCurrency(amount: number, currency = "KES") {
  return `${currency} ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;
}

export function taxStatusColor(status: string) {
  if (status === "taxable") return "green";
  if (status === "exempt") return "orange";
  if (status === "zero_rated") return "blue";
  return "gray";
}

export function taxStatusLabel(status: string) {
  return status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Computes the tax amount for a sellable item.
 *
 * - Exclusive: tax is added on top of base_price.
 *     tax = base_price × rate / 100
 *
 * - Inclusive: tax is already baked into base_price.
 *     tax = base_price × rate / (100 + rate)
 *
 * In both cases totalPrice is computed in the page as:
 *   exclusive → base_price + taxAmount
 *   inclusive → base_price  (tax already included)
 */
type SellableItem = { base_price: number; sellable?: Sellable };

export function computeTax(service: SellableItem): number {
  const { sellable } = service;
  if (!sellable || sellable.tax_status !== "taxable" || !sellable.tax_value)
    return 0;

  const base = Number(service.base_price);

  if (sellable.tax_value_type === "percentage") {
    if (sellable.tax_type === "inclusive") {
      return (base * sellable.tax_value) / (100 + sellable.tax_value);
    }
    return (base * sellable.tax_value) / 100;
  }

  // Fixed amount — same regardless of inclusive/exclusive
  return sellable.tax_value;
}

/**
 * Computes the pre-tax subtotal (amount before tax).
 *
 * - Exclusive: subtotal = base_price (tax is on top)
 * - Inclusive: subtotal = base_price - tax (tax is baked in)
 */
export function computeSubtotal(service: SellableItem): number {
  const base = Number(service.base_price);
  const { sellable } = service;
  if (!sellable || sellable.tax_status !== "taxable" || !sellable.tax_value)
    return base;

  if (sellable.tax_type === "inclusive") return base - computeTax(service);
  return base;
}

/**
 * Computes the final total price.
 *
 * - Exclusive: total = base_price + tax
 * - Inclusive: total = base_price (tax already inside)
 */
export function computeTotal(service: SellableItem): number {
  const { sellable } = service;
  const base = Number(service.base_price);
  if (!sellable || sellable.tax_status !== "taxable" || !sellable.tax_value)
    return base;

  if (sellable.tax_type === "inclusive") return base;
  return base + computeTax(service);
}
