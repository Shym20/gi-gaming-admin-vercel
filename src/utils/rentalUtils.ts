export const getRentalCatalogProducts = (state: any) => {
  if (!Array.isArray(state.rentalProducts)) return []
  return state.rentalProducts
}

export const getAvailableRentalProducts = (state: any) => {
  return getRentalCatalogProducts(state).filter(
    (p: any) => p.status === "ACTIVE" && Number(p.stock) > 0
  )
}