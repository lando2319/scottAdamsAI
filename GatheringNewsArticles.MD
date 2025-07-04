# Gathering News Articles

Tried newsapi.org

so this, 'works' but it only goes back less than 2 months
pricing is prohibitive
Even paying the max it's unclear how much is even there


----


I would say if I can get google search to deliver results based on filter
maybe their API and I rip to text like I did with blogs



Here are some ChatGPT suggestions

| Use-case                                            | Best bet                                                                                      | Why it stands out                                                                                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| General-purpose news (tens of thousands of outlets) | **NewsCatcher v3 `/api/authors`**                                                             | Native `author_name` filter, supports date/windows, language & source filters, generous free tier ([newscatcherapi.com][1])     |
| AI/quant research, entity linking                   | **Aylien / Quantexa News API `author.name`**                                                  | Elasticsearch-style queries across 90 k sources; returns enriched NLP entities & sentiment ([docs.aylien.com][2])               |
| Single-publisher deep dive                          | **Guardian Content API `tag=profile/{slug}`** or **NYTimes Article Search `fq=byline:(...)`** | Full archives, no article-count caps, permanent URLs —great for timeline work ([cran.r-project.org][3], [stackoverflow.com][4]) |
| Academic / DOI hunting                              | **Crossref REST `query.author=`**                                                             | Instant metadata look-ups for papers, pre-prints and books, free & unlimited ([github.com][5])                                  |
| Citation metrics & abstracts                        | **Elsevier Scopus Author Search**                                                             | Maps one author ID to every Scopus-indexed item, returns citation counts & co-author graph ([dev.elsevier.com][6])              |
| Budget-friendly alt                                 | **NewsData.io `author=` (filter)**                                                            | Real-time + 7 yr archive, inexpensive, supports author, keyword, sentiment in same call ([newsdata.io][7])                      |

[1]: https://www.newscatcherapi.com/docs/v3/api-reference/endpoints/authors/search-articles-by-author-post "Search articles by author - newscatcher"
[2]: https://docs.aylien.com/newsapi/v6/parameters/?utm_source=chatgpt.com "Parameters by theme | News API Documentation - Aylien"
[3]: https://cran.r-project.org/web/packages/guardianapi/guardianapi.pdf?utm_source=chatgpt.com "[PDF] guardianapi: Access 'The Guardian' Newspaper Open Data API"
[4]: https://stackoverflow.com/questions/44933759/nyt-article-search-api-not-returning-results-for-certain-queries?utm_source=chatgpt.com "NYT article search API not returning results for certain queries"
[5]: https://github.com/CrossRef/rest-api-doc?utm_source=chatgpt.com "CrossRef/rest-api-doc: Documentation for Crossref's REST ... - GitHub"
[6]: https://dev.elsevier.com/guides/Scopus%20API%20Guide_V1_20230907.pdf?utm_source=chatgpt.com "[PDF] Scopus API Guide_V1_20230907 - Elsevier Developer Portal"
[7]: https://newsdata.io/blog/historical-news-extractor-using-keyword/ "Historical News Extractor: Using Keyword"
