# Sample

## Setup Local proxy

- Open terminal and run `sudo nano /etc/hosts` _(mac / linux)_ or `notepad \c`
- Edit or Add the following line `127.0.0.1 localhost local.sample.ca`

### To run locally use

Run command `npm run dev` it will redirect to (`http://local.sample.ca:4201/`).

## Metric List

### Here is the metrics that used in sample with _name, id, formula & definition_

- Cost per Click: `cpc = spend / click`
- Click through rate: `ctr = (clicks / impressions) * 100`
- Search Impression Share: `impression_share = (impressions / imp_per_search) * 100`
- Search Exact Impression Share: `impression_share_exact = (share_imp / impressions) * 100`
- Bounce Rate: `bounce_rate = (bounces / sessions) * 100`
- Conversion Rate: `conversion_rate = (conversions / sessions) * 100`
- Average Time on page: `avg_time_on_page = ?`
- Percentage in conversion path report: `percentage = totalEvents / individualChannelEvents`
- EP Conversion Rate: `ep_cvr = (totalEP / totalSessions) * 100`
- Cost per EP: `cpe = totalSpend / totalEP`
