const baseUrl = '/api';
const qs = (id) => document.querySelector(id);
let centersCache = [];

const formatCenter = (c) =>
  `<li><strong>${c.name}</strong> | ${c.address}, ${c.city} ${c.state} ${c.pincode}<br><small>Phone: ${c.contact || 'N/A'}</small></li>`;

const loadCenters = async () => {
  const res = await fetch(`${baseUrl}/centers`);
  const centers = await res.json();
  centersCache = centers;
  const list = qs('#center-list');
  if (!centers || centers.length === 0) {
    list.innerHTML = '<li>No centers currently available.</li>';
    return;
  }
  list.innerHTML = centers.map(formatCenter).join('');
};

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

qs('#get-guide').addEventListener('click', async () => {
  const type = qs('#waste-type').value;
  if (!type) return (qs('#guide-output').textContent = 'Please select a type.');
  const res = await fetch(`${baseUrl}/guide?type=${type}`);
  const data = await res.json();
  qs('#guide-output').textContent = data.advice || data.error;
});

qs('#load-centers').addEventListener('click', () => loadCenters());

qs('#find-local').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by this browser.');
  }
  qs('#center-list').innerHTML = '<li>Locating... please allow location permission.</li>';
  navigator.geolocation.getCurrentPosition(async (pos) => {
    if (!centersCache.length) await loadCenters();
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;
    const nearby = centersCache
      .map((c) => ({ ...c, km: distanceKm(userLat, userLng, c.lat || 0, c.lng || 0) }))
      .sort((a, b) => a.km - b.km);

    if (nearby.length === 0) {
      qs('#center-list').innerHTML = '<li>No centers found in your area.</li>';
      return;
    }
    qs('#center-list').innerHTML = nearby
      .slice(0, 6)
      .map((c) => `<li><strong>${c.name}</strong> (approx ${c.km.toFixed(1)} km away)<br>${c.address}, ${c.city}, ${c.state}</li>`)
      .join('');
  }, () => {
    qs('#center-list').innerHTML = '<li>Unable to get your location. Please allow and retry.</li>';
  });
});

qs('#pickup-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = {
    name: qs('#name').value.trim(),
    phone: qs('#phone').value.trim(),
    location: qs('#location').value.trim(),
    type: qs('#pickup-type').value,
    scheduledDate: qs('#scheduledDate').value,
    quantity: parseInt(qs('#quantity').value, 10) || 1,
  };
  const res = await fetch(`${baseUrl}/pickups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (res.ok) {
    qs('#pickup-msg').textContent = `Pickup requested successfully: ${data.type} on ${new Date(data.scheduledDate).toLocaleDateString()}.`;
    qs('#pickup-form').reset();
    fetchPickups();
  } else {
    qs('#pickup-msg').textContent = 'Error: ' + (data.error || 'Unable to schedule pickup.');
  }
});

const fetchPickups = async () => {
  const res = await fetch(`${baseUrl}/pickups`);
  const items = await res.json();
  const list = qs('#pickup-list');
  list.innerHTML = items.length
    ? items
        .map(
          (x) =>
            `<li><strong>${x.name}</strong> | <em>${x.type}</em> | ${new Date(x.scheduledDate).toLocaleDateString()} | <strong>${x.status}</strong></li>`,
        )
        .join('')
    : '<li>No pickup requests yet.</li>';
};

qs('#refresh-pickups').addEventListener('click', fetchPickups);
qs('#load-tips').addEventListener('click', async () => {
  const res = await fetch(`${baseUrl}/awareness`);
  const data = await res.json();
  const list = qs('#tips-list');
  list.innerHTML = data.tips.map((t) => `<li>${t}</li>`).join('');
});

const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

loadCenters();
fetchPickups();
