# Contribution

You can contribute by

- Trying out the [website](https://scottadamsai.com)

Report back answers that were like Scott and why you think they were so good, why were they like Scott. Ideally with Screenshots.

- Gathering Data

Links, text files, etc. Original source material. We currently have youtube transascripts and blog posts.

Send this data [here](https://github.com/lando2319/scottAdamsAI/issues), Click, 'New Issue'

[Reach out](https://scottadamsai.com/contact) with ideas, comments, etc

----

### Data
Right now the AI is using [youtube transcripts](https://github.com/lando2319/scottAdamsAI/tree/main/cwsa_transcripts) and [Blog posts](https://github.com/lando2319/scottAdamsAI/tree/main/blogPosts) as it's vector store data.

I'd love to get the following

- locals: (if possible) If there is something publically available

- tweets:
Scott has 150K tweets, the $200 a month api plan allows for 10K a month. I can set it up to query all the tweets, it's just a question of cost and time.

- periscopes:
Apparently if known, the url it's accessible https://x.com/Drangula/status/1924636858677338527
if we have a range or something, maybe we can iterate to find them all

- interviews on youtube:
I've added Scott's two tumblrs scottadamssays and scottadamsblog as well as his old 2008 blog, are there any I'm missing?

- articles in media (opeds, interview, guest blog posts)

### Evaluation Data
We need a way to gauge the AI model's Scottness, the way I've done this in the past is to have an obj like so

```
{
  "question": "<question for scott>",
  "answer": "<example of a good answer>",
  "evalCriteria: "<what makes a good question, 'must say X, should say X'>"
}
```

Then we would ask the model the question, add it's response to the obj, then have the openai high resoning model score the answers Scottness

This is critical to benchmarking the model, allowing for testing of mini models, open source models, or just gauging the affect of adding additional data.

Here is the [current list](https://github.com/lando2319/scottAdamsAI/blob/main/evalTestData/base.json)

If you can help build out a list of eval questions send a pull request

The name of the Game is gather data and evaluating the model

----

Github trucates these file, so if someone doesn't clone the repo they won't be able to see all the files
We might want to do hugging face for the raw data and github for the source code
