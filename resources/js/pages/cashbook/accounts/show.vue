<template>
  <div>
    <!-- breadcrumbs Start -->
    <breadcrumbs :items="breadcrumbs" :current="breadcrumbsCurrent" />
    <!-- breadcrumbs end -->
    <div class="row">
      <div class="col-lg-12">
        <!-- Main content -->
        <div class="invoice p-3 mb-3">
          <!-- info row -->
          <div class="row invoice-info">
            <div class="col-sm-4 invoice-col">
              <CompanyInfo />
            </div>
            <!-- /.col -->
            <div v-if="allData" class="col-sm-6 offset-sm-2 invoice-col float-right text-md-right">
              <h5 v-if="allData.date">
                {{ $t("cashbook.common.account_details") }}
              </h5>
              <strong>{{ $t("cashbook.common.bank_name") }}:</strong>
              {{ allData.bankName }}<br />
              <span v-if="allData.branchName"><strong>{{ $t("cashbook.common.branch_name") }}:</strong>
                {{ allData.branchName }}<br /></span>
              <span v-if="allData.accountNumber"><strong>{{ $t("cashbook.common.account_number") }}:</strong>
                {{ allData.accountNumber }}<br /></span>
              <span v-if="allData.accountNumber"><strong>{{ $t("common.created_at") }}:</strong>
                {{ allData.date | moment("Do MMM, YYYY") }}<br /></span>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->

          <div class="row">
            <div v-if="pagination" class="col-lg-3 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h4>
                    <span>{{ totalCount }}</span>
                  </h4>
                  <p>{{ $t("cashbook.common.total_transactions") }}</p>
                </div>
                <div class="icon">
                  <i class="fas fa-coins"></i>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h4>{{ allData.totalCredits | withCurrency }}</h4>
                  <p>{{ $t("cashbook.common.credit_amount") }}</p>
                </div>
                <div class="icon">
                  <i class="fas fa-sign-in-alt"></i>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h4>{{ allData.totalDebits | withCurrency }}</h4>
                  <p>{{ $t("cashbook.common.debit_amount") }}</p>
                </div>
                <div class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-primary">
                <div class="inner">
                  <h4>{{ allData.availableBalance | withCurrency }}</h4>
                  <p>{{ $t("common.available_balance") }}</p>
                </div>
                <div class="icon">
                  <i class="fas fa-piggy-bank"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Table row -->
          <div class="row">
            <div class="w-100 bg-light">
              <div>
                <div class="row no-print pt-3 px-3">
                  <div class="col-xl-2 col-md-3 col-4">
                    <search v-model="query" @reset-pagination="resetPagination()" @reload="reload" />
                  </div>
                  <div v-if="items && items.length > 0" class="col-xl-10 col-md-9 col-8 text-right">
                    <a :href="'/account-transactions/pdf/' + allData.slug" v-tooltip="$t('common.export_table')"
                      class="btn btn-secondary">
                      <i class="fas fa-file-export"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <table-loading v-show="loading" />
                  <div class="table-responsive table-custom">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>{{ $t("common.s_no") }}</th>
                          <th>{{ $t("common.reason") }}</th>
                          <th>{{ $t("common.date") }}</th>
                          <th>{{ $t("common.type") }}</th>
                          <th>{{ $t("common.amount") }}</th>
                          <th>{{ $t("common.status") }}</th>
                          <th class="text-right">
                            {{ $t("common.created_by") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-show="items.length" v-for="(data, i) in items" :key="i">
                          <td>{{ ++i }}</td>
                          <td>{{ data.reason }}</td>
                          <td>
                            <span v-if="data.transactionDate">{{
                                data.transactionDate | moment("Do MMM, YYYY")
                            }}</span>
                          </td>
                          <td>
                            <span v-if="data.type === 1" class="badge bg-primary">{{ $t("common.credit") }}</span>
                            <span v-else class="badge bg-danger">{{
                                $t("common.debit")
                            }}</span>
                          </td>
                          <td>{{ data.amount | withCurrency }}</td>
                          <td>
                            <span v-if="data.status === 1" class="badge bg-success">{{ $t("common.active") }}</span>
                            <span v-else class="badge bg-danger">{{
                                $t("common.in_active")
                            }}</span>
                          </td>
                          <td v-if="data.user" class="text-right">
                            {{ data.user.name }}
                          </td>
                        </tr>
                        <tr v-show="!loading && !items.length">
                          <td colspan="8">
                            <EmptyTable />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div v-if="pagination && pagination.last_page > 1" class="mt-3 clearfix">
                <div class="dtable-footer">
                  <div class="form-group row display-per-page">
                    <label>{{ $t("per_page") }} </label>
                    <div>
                      <select @change="updatePerPager" v-model="perPage" class="form-control form-control-sm ml-1">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                  <!-- pagination-start -->
                  <pagination v-if="pagination && pagination.last_page > 1" :pagination="pagination" :offset="5"
                    class="justify-flex-end" @paginate="paginate" />
                  <!-- pagination-end -->
                </div>
              </div>
            </div>
          </div>
          <div v-show="allData.length" class="no-print callout callout-danger mt-4 w-100">
            <h5>{{ $t("cashbook.accounts.view.empty_transaction") }}</h5>
            <p>{{ $t("cashbook.accounts.view.empty_transaction_msg") }}</p>
          </div>

          <hr />
          <!-- /.row -->
          <!-- this row will not appear when printing -->
          <div class="row no-print mt-5">
            <div class="col-12">
              <router-link :to="{ name: 'accounts.index' }" class="btn btn-dark float-right">
                <i class="fas fa-long-arrow-alt-left" /> {{ $t("common.back") }}
              </router-link>
              <a href="#" @click="printWindow" class="btn btn-default"><i class="fas fa-print"></i> {{
                  $t("common.print")
              }}</a>
            </div>
          </div>
        </div>
        <!-- /.invoice -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import pagination from "../../../components/Pagination.vue";

export default {
  middleware: ["auth", "check-permissions"],
  metaInfo() {
    return { title: this.$t("cashbook.accounts.view.page_title") };
  },
  data: () => ({
    breadcrumbsCurrent: "cashbook.accounts.view.breadcrumbs_current",
    breadcrumbs: [
      {
        name: "cashbook.accounts.view.breadcrumbs_first",
        url: "home",
      },
      {
        name: "cashbook.accounts.view.breadcrumbs_second",
        url: "accounts.index",
      },
      {
        name: "cashbook.accounts.view.breadcrumbs_active",
        url: "",
      },
    ],
    query: "",
    allData: "",
    perPage: 10,
    totalCount: 0,
  }),

  // Map Getters
  computed: {
    ...mapGetters("operations", ["items", "loading", "pagination"]),
  },
  watch: {
    // watch search data
    query: function (newQ) {
      if (newQ === "") {
        this.getTransactions();
      } else {
        this.searchTransactions();
      }
    },
  },

  created() {
    this.getAccount();
    this.getTransactions();
  },
  methods: {
    // update per page count
    updatePerPager() {
      this.pagination.current_page = 1;
      this.query === "" ? this.getTransactions() : this.searchTransactions();
    },

    // get the account
    async getAccount() {
      const { data } = await axios.get(
        window.location.origin + "/api/accounts/" + this.$route.params.slug
      );
      this.allData = data.data;
    },

    // get the supplier lc
    async getTransactions() {
      this.$store.state.operations.loading = true;
      await this.$store.dispatch("operations/fetchData", {
        path:
          "/api/accounts/transactions/" + this.$route.params.slug + "?page=",
        currentPage: this.pagination.current_page + "&perPage=" + this.perPage,
      });

      this.totalCount = this.pagination.total;
    },

    // search lc
    async searchTransactions() {
      this.$store.state.operations.loading = true;
      await this.$store.dispatch("operations/searchData", {
        term: this.query,
        path:
          "/api/accounts/transactions/" + this.$route.params.slug + "/search",
        currentPage: this.pagination.current_page + "&perPage=" + this.perPage,
      });
    },

    // pagination
    async paginate() {
      this.query === "" ? this.getTransactions() : this.searchTransactions();
    },

    // reset purchase pagination
    async resetPagination() {
      this.pagination.current_page = 1;
    },

    // reload purchases after search
    async reload() {
      this.query = "";
    },

    // print
    printWindow() {
      window.print();
    },
  },
};
</script>

