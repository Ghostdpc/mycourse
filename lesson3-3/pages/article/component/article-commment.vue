<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link href="" class="comment-author" :to="{ name: 'profile', params: { username: comment.author.username } }">
          <img :src="comment.author.image" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{ name: 'profile', params: { username: comment.author.username } }">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date("MMM DD, YYYY") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedAricles, addFavorite, deleteFavorite, getComments } from "@/api/article";
import MarkdownIt from "markdown-it";

export default {
  name: "Articlecomment",
  data() {
    return {
      comments: [],
    };
  },
  props: {
    article: { type: Object, required: true },
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
};
</script>

<style></style>
