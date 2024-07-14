import React from 'react'

const AddPurchase = () => {
  return (
    <div>Form Fields:
    Item Name: Text field
    Purchase Date: Date picker
    Quantity: Number input
    Purchase Price per Unit: Currency input
    Total Purchase Cost: Auto-calculated (Quantity x Purchase Price)
    Supplier Name: Text field (optional)
    Add Purchase Button: Prominently displayed</div>
  )
}

export default AddPurchase