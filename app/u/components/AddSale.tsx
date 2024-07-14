import React from 'react'

const AddSale = () => {
  return (
    <div>Form Fields:
    Item Name: Dropdown (auto-suggest based on logged purchases)
    Sale Date: Date picker
    Sale Platform: Dropdown (e.g., eBay, Amazon, Custom)
    Listing Price per Unit: Currency input
    Quantity Sold: Number input
    Platform Fees: Auto-calculated (with default values, e.g., eBay 12.5%, editable)
    Shipping Cost: Currency input
    Total Sale Revenue: Auto-calculated (Quantity x Listing Price)
    Estimated Profit: Auto-calculated (Total Sale Revenue - Platform Fees - Shipping Cost - Total Purchase Cost)
    Add Sale Button: Prominently displayed</div>
  )
}

export default AddSale