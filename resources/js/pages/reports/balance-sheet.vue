<template>
  <div>
    <!-- breadcrumbs Start -->
    <breadcrumbs :items="breadcrumbs" :current="breadcrumbsCurrent" />
    <!-- breadcrumbs end -->
    <div class="row">
      <div class="col-lg-12 invoice p-3 mb-3">
        <!-- info row -->
        <div class="row invoice-info">
          <div class="col-sm-4 m-auto invoice-col">
            <CompanyInfo class="text-center" />
          </div>
        </div>
        <!-- /.row -->

        <!-- Table row -->
        <div class="row mt-3 position-relative">
          <table-loading v-show="loading" />
          <div class="table-responsive w-100">
            <table class="table table-striped table-bordered">
              <thead>
                <tr class="text-center">
                  <th colspan="2">
                    <h5>{{ $t('reports.incomes') }}</h5>
                  </th>
                  <th class="red" colspan="2">
                    <h5>{{ $t('reports.liabilities') }}</h5>
                  </th>
                </tr>
              </thead>
              <tbody v-if="balanceInfo">
                <tr>
                  <th>{{ $t('reports.security_asset') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.assets | withAbsoluteCurrency }}
                  </th>
                  <th>{{ $t('reports.supplier_dues') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.supplierDue | withAbsoluteCurrency }}
                  </th>
                </tr>
                <tr>
                  <th>{{ $t('products.list.common.inventory_value') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.inventoryValue | withAbsoluteCurrency }}
                  </th>
                  <th>{{ $t('reports.bank_loan') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.loanDue | withAbsoluteCurrency }}
                  </th>
                </tr>
                <tr>
                  <th>{{ $t('reports.client_dues') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.clientTotalDue | withAbsoluteCurrency }}
                  </th>
                </tr>
                <tr>
                  <th>{{ $t('reports.bank_balance') }}=></th>
                  <th class="text-right">
                    {{ balanceInfo.bankBalance | withAbsoluteCurrency }}
                  </th>
                </tr>
                <tr class="text-right">
                  <th>{{ $t('common.total') }}=></th>
                  <th>
                    {{ balanceInfo.buisnessTotal | withAbsoluteCurrency }}
                  </th>
                  <th>{{ $t('common.total') }}=></th>
                  <th>
                    {{ balanceInfo.liabilities | withAbsoluteCurrency }}
                  </th>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="text-center">
                    <strong>{{ $t('reports.income_liabilities') }}</strong><br />
                    <h4 class="mt-2">
                      {{ $t('reports.total_asset') }}:
                      <span v-if="balanceInfo.totalAsset > 0" class="text-success">{{
                          balanceInfo.totalAsset | withAbsoluteCurrency
                      }}</span>
                      <span v-else-if="balanceInfo.totalAsset < 0" class="text-danger">{{
                          balanceInfo.totalAsset | withAbsoluteCurrency
                      }}</span>
                      <span v-else class="text-success">{{ 0 | withAbsoluteCurrency }}
                      </span>
                    </h4>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <!-- /.row -->

        <!-- this row will not appear when printing -->
        <div class="row no-print mt-5">
          <div class="col-12">
            <router-link :to="{ name: 'home' }" class="btn btn-dark float-right">
              <i class="fas fa-long-arrow-alt-left" /> {{ $t('common.back') }}
            </router-link>
            <a href="#" @click="printWindow" class="btn btn-default"><i class="fas fa-print"></i> {{ $t('common.print')
            }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  middleware: ['auth', 'check-permissions'],
  metaInfo() {
    return { title: this.$t('reports.balance_sheet.page_title') }
  },
  data: () => ({
    breadcrumbsCurrent: 'reports.balance_sheet.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'reports.balance_sheet.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'reports.balance_sheet.breadcrumbs_second',
        url: '',
      },
      {
        name: 'reports.balance_sheet.breadcrumbs_active',
        url: '',
      },
    ],
    loading: false,
    balanceInfo: '',
  }),

  created() {
    this.getData()
  },
  methods: {
    // get data
    async getData() {
      this.loading = true
      const { data } = await axios.get(
        window.location.origin + '/api/reports/balance-sheet'
      )
      this.balanceInfo = data
      this.loading = false
    },
    // print
    printWindow() {
      window.print()
    },
  },
}
</script>

