require('dotenv').config({ path: __dirname + '/.env' });


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
var util = require('util');









// LEFT OFF HERE
// so this, 'works' but it only goes back less than 2 months
// pricing is prohibitive
// idk, I guess see if there anything in the last month





// I would say if I can get google search to deliver results based on filter
// maybe their API and I rip to text like I did with blogs
// 









newsapi.v2.everything({
    q: '"Scott Adams"',
    // sources: 'bbc-news,the-verge',
    // domains: 'bbc.co.uk, techcrunch.com',
    // searchIn: "title",
    from: '2025-06-04',
    to: '2025-07-04',
    language: 'en',
    sortBy: 'relevancy',
    page: 1
}).then(response => {
    // console.log(util.inspect(response, false, null));

    response.articles.forEach(article => {
        // if (article.author == "Scott Adams") {
        //     console.log("FOUND");
            console.log(article);
        // }
    });
});