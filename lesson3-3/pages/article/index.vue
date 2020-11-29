<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-commment :article="article"></article-commment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
import MarkdownIt from "markdown-it";
import ArticleMeta from "./component/article-meta";
import ArticleCommment from "./component/article-commment.vue";

export default {
  name: "Article",
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article: article,
    };
  },
  components: {
    ArticleMeta,
    ArticleCommment,
  },
  head() {
    return {
      title: `${this.article.title} - Realworld`,
      meta: [
        {
          hid: `description`,
          name: `description`,
          content: this.article.description,
        },
      ],
    };
  },
};
</script>

<style></style>
