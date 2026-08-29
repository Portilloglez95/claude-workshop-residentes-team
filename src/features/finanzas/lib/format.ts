const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}
