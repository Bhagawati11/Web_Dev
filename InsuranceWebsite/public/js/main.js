// Auto-dismiss flash messages
setTimeout(() => {
  document.querySelectorAll('.flash').forEach((f) => (f.style.display = 'none'))
}, 4000)

// Dynamic policy form fields
const typeSelect = document.getElementById('typeSelect')
const dynamicFields = document.getElementById('dynamicFields')
if (typeSelect) {
  const fieldMap = {
    auto: `<div class="form-row">
      <div class="form-group"><label>Vehicle Make</label><input name="vehicleMake" placeholder="Toyota"></div>
      <div class="form-group"><label>Vehicle Model</label><input name="vehicleModel" placeholder="Camry"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Vehicle Year</label><input type="number" name="vehicleYear" placeholder="2022"></div>
      <div class="form-group"><label>VIN Number</label><input name="vehicleVIN" placeholder="VIN123..."></div>
    </div>`,
    health: `<div class="form-group"><label>Deductible (₹)</label><input type="number" name="deductible" placeholder="10000"></div>`,
    life: `<div class="form-group"><label>Beneficiary Name</label><input name="beneficiary" placeholder="Spouse/Child name"></div>`,
    home: `<div class="form-row">
      <div class="form-group"><label>Property Address</label><input name="propertyAddress" placeholder="123 Main St, City"></div>
      <div class="form-group"><label>Property Value (₹)</label><input type="number" name="propertyValue" placeholder="5000000"></div>
    </div>`,
  }
  typeSelect.addEventListener('change', () => {
    dynamicFields.innerHTML = fieldMap[typeSelect.value] || ''
  })
}
