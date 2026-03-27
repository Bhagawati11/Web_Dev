let rawData = []
let typeChart, yearChart, genreChart

Papa.parse('/netflix_titles.csv', {
  download: true,
  header: true,
  complete: function (results) {
    rawData = results.data
    populateRatings()
    setupListeners()
    updateDashboard()
  },
})

function populateRatings() {
  const ratings = [...new Set(rawData.map((d) => d.rating))]
  const select = document.getElementById('ratingFilter')

  ratings.forEach((r) => {
    const option = document.createElement('option')
    option.value = r
    option.textContent = r
    select.appendChild(option)
  })
}

function setupListeners() {
  document.getElementById('typeFilter').addEventListener('change', updateDashboard)
  document.getElementById('ratingFilter').addEventListener('change', updateDashboard)
  document.getElementById('yearRange').addEventListener('input', function () {
    document.getElementById('yearLabel').innerText = 'Up to: ' + this.value
    updateDashboard()
  })
}

function filterData() {
  const type = typeFilter.value
  const rating = ratingFilter.value
  const year = parseInt(yearRange.value)

  return rawData.filter((d) => {
    const matchType = type === 'All' || d.type === type
    const matchRating = rating === 'All' || d.rating === rating
    const matchYear = parseInt(d.release_year) <= year

    return matchType && matchRating && matchYear
  })
}

function updateDashboard() {
  const data = filterData()

  document.getElementById('totalTitles').innerText = data.length
  document.getElementById('movies').innerText = data.filter((d) => d.type === 'Movie').length
  document.getElementById('tvShows').innerText = data.filter((d) => d.type === 'TV Show').length

  renderTypeChart(data)
  renderYearChart(data)
  renderGenreChart(data)
}

function renderTypeChart(data) {
  const counts = {
    Movie: data.filter((d) => d.type === 'Movie').length,
    'TV Show': data.filter((d) => d.type === 'TV Show').length,
  }

  if (typeChart) typeChart.destroy()

  const ctx = document.getElementById('typeChart').getContext('2d')

  typeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#f3683e', '#ff3c00'],
        },
      ],
    },
  })
}

function renderYearChart(data) {
  const years = {}
  data.forEach((d) => (years[d.release_year] = (years[d.release_year] || 0) + 1))

  if (yearChart) yearChart.destroy()

  const ctx = document.getElementById('yearChart').getContext('2d')

  yearChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(years),
      datasets: [
        {
          data: Object.values(years),
          borderColor: '#ff3c00',
          tension: 0.3,
        },
      ],
    },
  })
}

function renderGenreChart(data) {
  const genres = {}
  data.forEach((d) => {
    const g = d.listed_in.split(',')[0]
    genres[g] = (genres[g] || 0) + 1
  })

  if (genreChart) genreChart.destroy()

  const ctx = document.getElementById('genreChart').getContext('2d')

  genreChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(genres).slice(0, 10),
      datasets: [
        {
          data: Object.values(genres).slice(0, 10),
          backgroundColor: '#ff3c00',
        },
      ],
    },
  })
}
