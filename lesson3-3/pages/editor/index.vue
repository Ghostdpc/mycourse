<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" v-model="article.title" placeholder="Article Title" required />
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" v-model="article.description" placeholder="What's this article about?" />
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control" rows="8" v-model="article.body" placeholder="Write your article (in markdown)" required></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" v-model="article.tagList" placeholder="Enter tags" />
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="onSubmit">Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from "@/api/article";
export default {
  middleware: "authenticated",
  name: "Editor",
  methods: {
    async onSubmit() {
      try {
        const temp = this.article.tagList;
        this.article.tagList = temp.split(" ");
        await createArticle(this.article);
        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: "",
      },
    };
  },
};
</script>

<style></style>
