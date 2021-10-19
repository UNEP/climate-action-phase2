// dev-tools console scraper code for
// https://eciu.net/netzerotracker

(function() {
  const data = {};
  const groups = [...document.querySelectorAll('.scorecard-group')];
  groups.forEach(g => {
    const countryBars = [...g.querySelectorAll('.country-bar')];
    const status = g.querySelector('.scorecard-label strong').innerText;
    data[status] = {};
    countryBars.forEach(c => {
      const name = c.querySelector('p.country-name').innerText;
      const year = parseInt(c.querySelector('.country-year span').innerText);
      data[status][name] = isNaN(year) ? null : year;
    });
  })
  console.log(data);
})();
