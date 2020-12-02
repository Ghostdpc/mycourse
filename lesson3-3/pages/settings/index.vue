<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" v-model="user.image" placeholder="URL of profile picture" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name" />
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" v-model="user.bio" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.email" type="email" placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.password" type="password" placeholder="Password" />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click="onSubmit">Update Settings</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { update } from "@/api/user";
export default {
  middleware: "authenticated",
  name: "Settings",
  computed: {
    ...mapState(["user"]),
  },
  // data() {
  //   return {
  //     user: {
  //       password: "",
  //       email: "",
  //       bio: "",
  //       username: "",
  //       image: "",
  //     },
  //   };
  // },
  methods: {
    async onSubmit() {
      try {
        await update(this.user);
        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style></style>
