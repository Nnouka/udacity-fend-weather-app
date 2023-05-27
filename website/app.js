/* Global Variables */
const apiKey = "5bf127f28f2e9419c12c5c35cc552e1b";
const weatherHost = "https://api.openweathermap.org/data/2.5/weather";
const baseUrl = `${weatherHost}?appid=${apiKey}&units=imperial&zip=`;
const backendUrl = "http://localhost:8000/api";

// Event listener to add function to existing HTML DOM element
document
  .querySelector("#generate")
  .addEventListener("click", generateWeatherMap);

/**
 * Function called by event listener
 */
function generateWeatherMap() {
  const zip = document.querySelector("#zip")?.value;
  const feel = document.querySelector("#feelings")?.value;
  // Create a new date instance dynamically with JS
  let d = new Date();
  const date = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
  const timestamp = d.getTime();
  const formattedData = {
    key: zip + feel,
    zip,
    feel,
    date,
    timestamp,
    temp: null,
    weathermap: null,
  };
  fetchWeatherMapByZipCode(baseUrl, zip).then(async (data) => {
    formattedData.temp = data?.main?.temp;
    formattedData.weathermap = data;
    try {
      const res = await postData(backendUrl + "/data", formattedData);
      console.log({ res });
      renderResponseData(await getProjectData());
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Function to sort response data by timestamp
 * @param {*} a
 * @param {*} b
 * @returns
 */
function sortResponseDataByTimestamp(a, b) {
  if (a.timestamp > b.timestamp) return -1;
  else if (a.timestamp == b.timestamp) return 0;
  else return 1;
}
/**
 *  Function to add response data to DOM
 * @param {*} data
 */
function renderResponseData(data) {
  const entries = Object.values(data).sort(sortResponseDataByTimestamp);

  const container = document.querySelector("#entryHolder");
  if (entries[0]?.temp) {
    container.querySelector("#date").innerHTML = `
        Date: <span>${entries[0]?.date}</span>
    `;
    container.querySelector("#temp").innerHTML = `
        Temperature: <span>${Math.round(entries[0]?.temp)}</span> degrees
    `;
    container.querySelector("#content").innerHTML = `
        <span>Zip: ${entries[0]?.zip}</span> 
        <p>
          Your feelings
          <hr />
        ${entries[0]?.feel}
        </p>
    `;
  } else {
    container.querySelector("#temp").innerHTML = `
        Error: <span style="color: red;">${entries[0]?.weathermap?.message ?? 'unknown error occured'}</span>
    `;
  }
}

/**
 * Function to GET Web API Data
 * @param {*} url
 * @param {*} zip
 * @returns
 */
async function fetchWeatherMapByZipCode(url, zip = "92210") {
  return await fetch(url + zip).then(async (response) => await response.json());
}

/**
 * Function to POST data
 * @param {*} url
 * @param {*} data
 * @returns
 */
async function postData(url, data) {
  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then(async (response) => await response.json());
}

/* Function to GET Project Data */
async function getProjectData() {
  return await fetch(backendUrl + "/all").then(
    async (response) => await response.json()
  );
}
