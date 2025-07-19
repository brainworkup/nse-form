# plumber.R
library(plumber)

#* Receive NSE form JSON
#* @post /submit
function(req, res) {
  data <- jsonlite::fromJSON(req$postBody)
  # e.g. save to Postgres, S3, etc.
  dbWriteTable(con, "forms", data, append = TRUE)

  list(status = "ok")
}

# Run with:
plumber::pr(file = "plumber.R")$run(port = 8000)
