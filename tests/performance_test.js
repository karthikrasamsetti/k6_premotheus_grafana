const http = require('k6/http');
const { htmlReport } = require("https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js");
const { check, sleep }= require('k6');
import { Trend } from 'k6/metrics';
// let concurrentUsers = new Trend('concurrent_users');
// const ENV = {
//   K6_PROMETHEUS_RW_SERVER_URL: "http://localhost:9090/api/v1/write",
//   K6_PROMETHEUS_RW_TREND_STATS: "p(95),p(99),min,max"
// };

// export function setup() {
//   // You can use the environment variables within your setup function if needed
//   console.log(`Prometheus server URL: ${ENV.K6_PROMETHEUS_RW_SERVER_URL}`);
//   console.log(`Prometheus trend stats: ${ENV.K6_PROMETHEUS_RW_TREND_STATS}`);
// }
export let options = {
  stages: [
    /* During this stage, the load test will ramp up to 
    50 virtual users over 15 seconds and maintain that
    level of load for the specified duration.*/
    { duration: '15s', target: 100 },
    // This stage maintains the load at 50 virtual users for 60 seconds.
    { duration: '60s', target: 100 },
    // In the final stage, the load test will ramp down to 0 virtual users over 15 seconds.
    { duration: '15s', target: 0 },
  ],
  // vus: 10, // Virtual Users
  // duration: '30s',
  thresholds: {
    http_req_duration: ["p(95)<50"],
    // http_req_duration: ["p(99)<280"],
    http_req_failed: ["rate<0.01"],
  },
};
 
export default async function performanceTest() {
  // let vuCount = __VU;
  // GET request
  // const response = http.get('https://qa.rygen.com/corsair/');
 
  const url = 'https://restful-booker.herokuapp.com/auth';
  const payload = JSON.stringify({
    "userName": "karthik",
    "password": "pass"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response= http.post(url, payload, params);
  // concurrentUsers.add(__VU);

// Check if the number of concurrent users exceeds a threshold
  // check(response, { 'Number of concurrent users exceeds threshold': vuCount <= 90 });
  // Check status code and response time
  check(response, { 'status is 200': (r) => r.status === 200 });
   // Check content type
  check(response, { 'content type is text/html': (r) => r.headers['Content-Type'] === 'text/html' });
 
  // Check response time
  check(response, { 'response time is less than 200ms': (r) => r.timings.duration < 200
 });
//  console.log(response)
  // Sleep for a short duration to simulate user behavior
  sleep(1);
}
// export function handleSummary(data) {
//   return {
//     "reports/index/performance.html": htmlReport(data),
//   };
// }
