let rawData = []
let salesChart, profitChart, categoryChart

Papa.parse('superstore.csv', {
  download: true,
  header: true,
  complete: function (results) {
    rawData = results.data
    initialize()
  },
})

function initialize() {
  populateRegions()
  updateDashboard()
}

function populateRegions() {
  const regions = [...new Set(rawData.map((row) => row.Region))]
  const select = document.getElementById('regionFilter')

  regions.forEach((region) => {
    const option = document.createElement('option')
    option.value = region
    option.textContent = region
    select.appendChild(option)
  })

  select.addEventListener('change', updateDashboard)
  document.getElementById('startDate').addEventListener('change', updateDashboard)
  document.getElementById('endDate').addEventListener('change', updateDashboard)
}

function filterData() {
  const region = document.getElementById('regionFilter').value
  const start = document.getElementById('startDate').value
  const end = document.getElementById('endDate').value

  return rawData.filter((row) => {
    const orderDate = new Date(row['Order Date'])
    const matchRegion = region === 'All' || row.Region === region
    const matchStart = !start || orderDate >= new Date(start)
    const matchEnd = !end || orderDate <= new Date(end)

    return matchRegion && matchStart && matchEnd
  })
}

function updateDashboard() {
  const data = filterData()

  let totalSales = 0,
    totalProfit = 0

  data.forEach((row) => {
    totalSales += parseFloat(row.Sales)
    totalProfit += parseFloat(row.Profit)
  })

  document.getElementById('totalSales').innerText = totalSales.toFixed(2)
  document.getElementById('totalProfit').innerText = totalProfit.toFixed(2)
  document.getElementById('totalOrders').innerText = data.length
  document.getElementById('profitMargin').innerText =
    ((totalProfit / totalSales) * 100 || 0).toFixed(2) + '%'

  renderSalesTrend(data)
  renderProfitByRegion(data)
  renderCategorySales(data)
}

function renderSalesTrend(data) {
  const monthly = {}

  data.forEach((row) => {
    const date = new Date(row['Order Date'])
    const key = date.getFullYear() + '-' + (date.getMonth() + 1)

    monthly[key] = (monthly[key] || 0) + parseFloat(row.Sales)
  })

  const labels = Object.keys(monthly)
  const values = Object.values(monthly)

  if (salesChart) salesChart.destroy()

  salesChart = new Chart(document.getElementById('salesTrend'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Sales Trend',
          data: values,
          borderColor: '#2ecc71', // GREEN
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
  })
}

function renderProfitByRegion(data) {
  const regionProfit = {}

  data.forEach((row) => {
    regionProfit[row.Region] = (regionProfit[row.Region] || 0) + parseFloat(row.Profit)
  })

  if (profitChart) profitChart.destroy()

  profitChart = new Chart(document.getElementById('profitRegion'), {
    type: 'bar',
    data: {
      labels: Object.keys(regionProfit),
      datasets: [
        {
          label: 'Profit by Region',
          data: Object.values(regionProfit),
          backgroundColor: '#f39c12', // ORANGE
          borderRadius: 6,
        },
      ],
    },
  })
}

function renderCategorySales(data) {
  const categorySales = {}

  data.forEach((row) => {
    categorySales[row.Category] = (categorySales[row.Category] || 0) + parseFloat(row.Sales)
  })

  if (categoryChart) categoryChart.destroy()

  categoryChart = new Chart(document.getElementById('categorySales'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(categorySales),
      datasets: [
        {
          data: Object.values(categorySales),
          backgroundColor: [
            '#9b59b6', // purple
            '#3498db', // blue (controlled)
            '#1abc9c', // teal
            '#e74c3c', // red
          ],
        },
      ],
    },
  })
}
