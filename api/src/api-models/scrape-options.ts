export interface ScrapeAndSaveAllComicsOptions {
  // Only scrape comics from a specific siteId ID. Default: all sites.
  siteId?: number;
  // Limit to a max number of comics. 0 results in no limit. Default: 50.
  limit?: number;
  // Don't re-scrape syndications we've already successfully scraped today. Default: true.
  dontRescrapeSyndicationThatSucceededEarlierToday?: boolean;
  // Don't try to scrape it if we've tried already within the last hour. Default: true.
  dontRetryInLessThanAnHour?: boolean;
}
