# Carbon Compass - Google Cloud Monitoring & Logging Guide

This guide details the setup for production monitoring, logging, and alerting on Google Cloud Run for the Carbon Compass application.

---

## 🪵 Cloud Logging

Cloud Run automatically redirects standard output (`stdout`) and standard error (`stderr`) streams to **Google Cloud Logging**. There is no need to write log files or install log shippers inside the container.

### Useful Log Queries (Logs Explorer)
Navigate to **Logging -> Logs Explorer** in the Google Cloud Console and use these filters to monitor your service:

* **Monitor all logs for the service**:
  ```query
  resource.type="cloud_run_revision"
  resource.labels.service_name="carbon-compass"
  ```
* **Filter to show only application errors (HTTP 5xx)**:
  ```query
  resource.type="cloud_run_revision"
  resource.labels.service_name="carbon-compass"
  severity>=ERROR
  ```
* **Track slow requests to the Gemini Assistant API route**:
  ```query
  resource.type="cloud_run_revision"
  resource.labels.service_name="carbon-compass"
  httpRequest.requestUrl:"/api/assistant"
  httpRequest.latency > "10s"
  ```
* **Filter API route execution failures**:
  ```query
  resource.type="cloud_run_revision"
  resource.labels.service_name="carbon-compass"
  textPayload:"API Error in Carbon Assistant Route"
  ```

---

## 📈 Cloud Monitoring & Alerts

Google Cloud Monitoring collects performance metrics (CPU, Memory, Request Count, Latency, Error Rates) out of the box.

### Recommended Alerting Policies
To ensure the application remains stable and responsive, configure Alerting Policies under **Monitoring -> Alerting** in the Cloud Console:

#### 1. HTTP 5xx Error Rate Alert (Service Availability)
* **Metric**: `run.googleapis.com/request/count`
* **Filter**: `response_code_class = 5xx`
* **Condition**: Trigger alert if HTTP 5xx count is greater than `5` failures within a `5-minute` window.
* **Notification Channel**: Email, SMS, Slack, or PagerDuty.

#### 2. High Container Latency Alert (Performance Degredation)
* **Metric**: `run.googleapis.com/request/latencies`
* **Filter**: `percentile = 99` (or `95`)
* **Condition**: Trigger alert if the 99th percentile request latency exceeds `15 seconds` for a duration of `10 minutes`. This detects slow API calls to Gemini or cold-start bottlenecks.

#### 3. Container Memory Utilization Alert (Resource Limits)
* **Metric**: `run.googleapis.com/container/memory/utilization`
* **Condition**: Trigger alert if container memory utilization exceeds **85%** of allocated limits for more than `5 consecutive minutes`. Next.js standalone containers are lightweight, but leak protection is essential for long-lived processes.

---

## 🚨 Error Reporting

Google Cloud **Error Reporting** aggregates application stack traces and crash logs into a unified dashboard.

* **Automatic Capture**: Since next.js error boundary outputs are printed to `stderr` in standard Node.js formats, Error Reporting automatically parses them from Cloud Logging.
* **Alert Notifications**: You can enable automatic email notifications in the **Error Reporting** panel to receive instant notifications whenever a new type of uncaught exception (e.g. Gemini SDK initialization or authentication errors) occurs.
