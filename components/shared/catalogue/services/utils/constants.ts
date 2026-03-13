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
export function computeTax(service: Service): number {
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
 * Computes the final total price.
 *
 * - Exclusive: total = base_price + tax
 * - Inclusive: total = base_price (tax already inside)
 */
export function computeTotal(service: Service): number {
  const { sellable } = service;
  const base = Number(service.base_price);
  if (!sellable || sellable.tax_status !== "taxable" || !sellable.tax_value)
    return base;

  if (sellable.tax_type === "inclusive") return base;
  return base + computeTax(service);
}
