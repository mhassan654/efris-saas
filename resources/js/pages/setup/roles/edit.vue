<template>
  <div>
    <!-- breadcrumbs Start -->
    <breadcrumbs :items="breadcrumbs" :current="breadcrumbsCurrent" />
    <!-- breadcrumbs end -->

    <div class="row">
      <div class="col-lg-12">
        <form @submit.prevent="updateRole" @keydown="form.onKeydown($event)">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title mt-2">
                {{ $t("setup.role_and_permission.edit.form_title") }}
              </h3>
              <router-link
                :to="{ name: 'roles.index' }"
                class="btn btn-dark float-right"
              >
                <i class="fas fa-long-arrow-alt-left" /> {{ $t("common.back") }}
              </router-link>
            </div>
            <div class="card-body">
              <div class="form-group mb-4">
                <label for="name">{{ $t("common.name") }}</label>
                <input
                  v-model="form.name"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                  class="form-control"
                  :placeholder="$t('common.name_placeholder')"
                />
                <has-error :form="form" field="name" />
              </div>
              <h5 class="mb-3 mt-4">
                {{ $t("setup.role_and_permission.edit.update_permission") }}
              </h5>

              <masonry
                :cols="{ default: 3, 1000: 2, 700: 1, 400: 1 }"
                :gutter="{ default: '30px', 700: '15px' }"
              >
                <div
                  v-for="(data, index) in items"
                  :key="index"
                  :class="{ 'is-invalid': form.errors.has('permission') }"
                >
                  <has-error
                    class="permission"
                    :form="form"
                    field="permission"
                  />
                  <div class="card permission-card">
                    <div class="card-header">
                      <h5
                        v-if="data[0]"
                        class="card-title text-bold text-capitalize"
                      >
                        {{ data[0].guard_name }}
                      </h5>
                      <div class="card-tools">
                        <button
                          type="button"
                          :loading="form.busy"
                          class="btn btn-tool"
                          data-card-widget="collapse"
                        >
                          <i class="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div class="card-body permisson-card">
                      <ul>
                        <li v-for="(permission, key) in data" :key="key">
                          <label
                            :for="permission.slug"
                            class="text-capitalize"
                            >{{ permission.name }}</label
                          >
                          <div class="custom-control custom-checkbox mb-1">
                            <input
                              class="custom-control-input"
                              type="checkbox"
                              :id="permission.slug"
                              name="permission"
                              v-model="form.permission"
                              :value="permission.slug"
                              @change="
                                onChangeEventHandler($event, permission.slug)
                              "
                            />
                            <label
                              :for="permission.slug"
                              class="custom-control-label"
                            ></label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </masonry>
            </div>
            <div class="card-footer">
              <v-button :loading="form.busy" class="btn btn-primary">
                <i class="fas fa-edit" /> {{ $t("common.save_changes") }}
              </v-button>
              <button
                type="reset"
                class="btn btn-secondary float-right"
                @click="form.reset()"
              >
                <i class="fas fa-power-off" /> {{ $t("common.reset") }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Form from "vform";
export default {
  middleware: ["auth", "check-permissions"],

  metaInfo() {
    return { title: this.$t("setup.role_and_permission.edit.page_title") };
  },

  data: () => ({
    // Breadcrumbs
    breadcrumbsCurrent: "setup.role_and_permission.edit.breadcrumbs_current",
    breadcrumbs: [
      {
        name: "setup.role_and_permission.edit.breadcrumbs_first",
        url: "home",
      },
      {
        name: "setup.role_and_permission.edit.breadcrumbs_second",
        url: "setup.index",
      },
      {
        name: "setup.role_and_permission.edit.breadcrumbs_third",
        url: "roles.index",
      },
      {
        name: "setup.role_and_permission.edit.breadcrumbs_active",
        url: "",
      },
    ],
    form: new Form({
      name: null,
      permission: [],
    }),
    loading: true,
  }),

  // Map Getters
  computed: mapGetters({
    items: "operations/items",
  }),

  mounted() {
    this.getPermission();
    this.getRole();
  },

  methods: {
    // get role from server
    async getRole() {
      const { data } = await this.form.get(
        window.location.origin + "/api/roles/" + this.$route.params.slug
      );
      this.form.name = data.data.name;
      this.form.permission = data.data.permissions;
    },

    // get permission data
    async getPermission() {
      this.loading = true;
      await this.$store.dispatch("operations/allData", {
        path: "/api/all-permissions",
      });
      this.loading = false;
    },

    // assign v-model permission data when change checkbox event
    onChangeEventHandler(e, permission) {
      let newPermission =
        permission.includes("view") ||
        permission.includes("edit") ||
        permission.includes("delete");
      if (newPermission) {
        let text = permission.includes("delete")
          ? permission.substring(0, permission.length - 6)
          : permission.substring(0, permission.length - 4);
        if (
          this.form.permission.includes(permission) &&
          !this.form.permission.includes(text + "list")
        ) {
          this.form.permission.push(text + "list");
        }
      }
      if (
        permission.includes("list") &&
        !this.form.permission.includes(permission)
      ) {
        let newText = permission.substring(0, permission.length - 4);
        this.form.permission = this.form.permission.filter(function (item) {
          return newText + "edit" !== item;
        });
        this.form.permission = this.form.permission.filter(function (item) {
          return newText + "delete" !== item;
        });
        this.form.permission = this.form.permission.filter(function (item) {
          return newText + "view" !== item;
        });
      }
    },

    // update role and permission
    async updateRole() {
      await this.form
        .patch(window.location.origin + "/api/roles/" + this.$route.params.slug)
        .then((response) => {
          toast.fire({
            type: "success",
            title: this.$t("setup.role_and_permission.edit.success_msg"),
          });
          this.$router.push({ name: "roles.index" });
        })
        .catch(() => {
          toast.fire({
            type: "error",
            title: this.$t("common.error_msg"),
          });
        });
      // action for demo
      // toast.fire({
      //   type: "warning",
      //   title: this.$t("You are not allowed to do this in demo version."),
      // });
    },
  },
};
</script>
