<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="image" />
            <h4>{{ username }}</h4>
            <p>{{ bio }}</p>
            <button v-if="username === user.username" @click="onEdit" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn" :disabled="favoriteDisabled" :class="{ active: following }" @click="onFollow(username)">
              <i class="ion-plus-round"></i>
              &nbsp; {{ follow }} {{ username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="{ namme: 'profile', query: { tab: 'mine' } }" exact :class="{ active: tab === 'mine' }">My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="{ namme: 'profile', query: { tab: 'favorites' } }" exact :class="{ active: tab === 'favorites' }">Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }" class="author">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdcreatedAt | date("MMM DD, YYYY") }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }" @click="onFavorite(article)" :disabled="article.favoriteDisabled"><i class="ion-heart"></i> {{ article.favoritesCount }}</button>
            </div>
            <nuxt-link :to="{ name: 'article', params: { slug: article.slug } }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.descrption }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ active: item === page }" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link" :to="{ name: 'profile', query: { tab: tab, page: item }, params: { username: username } }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, followUser, unfollowUser } from "@/api/profile";
import { getArticles } from "@/api/article";
import { mapState } from "vuex";
export default {
  middleware: "authenticated",
  name: "UserProfile",
  watchQuery: ["page", "tab"],
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    let page = Number.parseInt(query.page || 1);
    const tab = query.tab || "mine";
    const limit = 20;
    const param = {
      limit: limit,
      offset: (page - 1) * limit,
      author: params.username,
      favorited: params.username,
    };
    if (tab === "favorites") {
      delete param.author;
    } else {
      delete param.favorited;
    }
    const [articleRes, profileRes] = await Promise.all([getArticles(param), getProfile(params.username)]);
    const { data } = profileRes;
    const { articles, articlesCount } = articleRes.data;
    const favoriteDisabled = false;
    let follow;
    if (data.profile.following) {
      follow = "unfollow";
    } else {
      follow = "follow";
    }
    return {
      username: data.profile.username,
      image: data.profile.image,
      following: data.profile.following,
      bio: data.profile.bio,
      articles,
      articlesCount,
      page,
      tab,
      favoriteDisabled,
      follow,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      let pages = Math.ceil(this.articlesCount / this.limit);
      pages = pages ? pages : 1;
      return pages;
    },
  },
  methods: {
    onEdit() {
      this.$router.push("/settings");
    },
    async onFollow(username) {
      this.favoriteDisabled = true;
      if (this.favorited) {
        await unfollowUser(username);
        this.favorited = false;
        this.follow = "follow";
      } else {
        await followUser(username);
        this.favorited = true;
        this.follow = "unfollow";
      }
      this.favoriteDisabled = false;
    },
  },
};
</script>

<style></style>
