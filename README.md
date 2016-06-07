# flarecast-monitor
## Real time Solar X-Ray Flux data monitoring

This project takes solar x-ray flux data from the GOES-15 satellite (available in ftp://ftp.swpc.noaa.gov/pub/lists/xray/Gp_xr_1m.txt) and renders a 2-hour time series chart with the latest entries. The data is converted to JSON format and made available from the `/api` endpoint.
In the future, we intend to add predictions for the time series using neural network ṕrocessing; and possibly a notification system (e.g. a Twitter bot) that gives a warning when the values reach a certain threshold
