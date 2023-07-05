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
            <div class="col-sm-6 offset-sm-2 invoice-col float-right text-md-right">
              <h5>
                {{ $t('inventory.adjustments.view.breadcrumbs_current') }}
              </h5>
              <strong>{{ $t('common.reason') }}:</strong> {{ allData.reason
              }}<br />
              <strong>{{ $t('common.created_by') }}:</strong>
              {{ allData.createdBy }}<br />
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->

          <div class="row mt-2">
            <div class="col-12">
              <div class="table-responsive table-custom">
                <table class="table">
                  <thead>
                    <tr>
                      <th v-if="allData.code">
                        {{ $t('inventory.common.adjustment_no') }}
                      </th>
                      <th v-if="allData.reason">{{ $t('common.reason') }}</th>
                      <th v-if="allData.date">{{ $t('common.date') }}</th>
                      <th v-if="allData.note">{{ $t('common.note') }}</th>
                      <th>{{ $t('common.status') }}</th>
                      <th class="text-right">{{ $t('common.created_by') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td v-if="allData.code">
                        {{ allData.code | withPrefix(adjustmentPrefix) }}
                      </td>
                      <td v-if="allData.reason">{{ allData.reason }}</td>
                      <td v-if="allData.date">
                        {{ allData.date | moment('Do MMM, YYYY') }}
                      </td>
                      <td v-if="allData.note">{{ allData.note }}</td>
                      <td>
                        <span v-if="allData.status === 1" class="badge bg-success">{{ $t('common.active') }}</span>
                        <span v-else class="badge bg-danger">{{
                            $t('common.in_active')
                        }}</span>
                      </td>
                      <td class="text-right">{{ allData.createdBy }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Table row -->
          <div class="row mb-3 mt-3">
            <div class="col-12">
              <strong class="mt-4 mb-2 d-block">{{ $t('inventory.common.adjusted_products') }}:</strong>
              <div class="table-custom table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>{{ $t('common.s_no') }}</th>
                      <th>{{ $t('common.code') }}</th>
                      <th>{{ $t('common.name') }}</th>
                      <th>{{ $t('common.purchase_price') }}</th>
                      <th>{{ $t('common.quantity') }}</th>
                      <th class="text-right">
                        {{ $t('inventory.common.adjustment_type') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="adjustedProducts">
                    <tr v-for="(data, i) in adjustedProducts" :key="i">
                      <td>{{ ++i }}</td>
                      <td>
                        {{ data.productCode | withPrefix(productPrefix) }}
                      </td>
                      <td>{{ data.productName }}</td>
                      <td>{{ data.avgPurchasePrice | withCurrency }}</td>
                      <td>
                        <span v-if="data.type == 1">+</span>
                        <span v-else>-</span>
                        {{ data.quantity }} {{ data.productUnit }}
                      </td>
                      <td class="text-right">
                        <span v-if="data.type == 1" class="badge badge-primary">{{ $t('inventory.common.increment')
                        }}</span>
                        <span v-else class="badge badge-danger">{{
                            $t('inventory.common.decrement')
                        }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- this row will not appear when printing -->
          <div class="row no-print mt-5">
            <div class="col-12">
              <router-link :to="{ name: 'adjustments.index' }" class="btn btn-dark float-right">
                <i class="fas fa-long-arrow-alt-left" /> {{ $t('common.back') }}
              </router-link>
              <a href="#" @click="printWindow" class="btn btn-default"><i class="fas fa-print"></i> {{
                  $t('common.print')
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
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'check-permissions'],
  metaInfo() {
    return { title: this.$t('inventory.adjustments.view.page_title') }
  },
  data: () => ({
    breadcrumbsCurrent: 'inventory.adjustments.view.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'inventory.adjustments.view.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'inventory.adjustments.view.breadcrumbs_second',
        url: 'adjustments.index',
      },
      {
        name: 'inventory.adjustments.view.breadcrumbs_active',
        url: '',
      },
    ],
    allData: '',
    adjustedProducts: [],
    productPrefix: '',
    adjustmentPrefix: '',
  }),
  // Map Getters
  computed: {
    ...mapGetters('operations', ['appInfo']),
  },
  created() {
    this.getAdjustment()
    this.productPrefix = this.appInfo.productPrefix
    this.adjustmentPrefix = this.appInfo.adjustmentPrefix
  },
  methods: {
    // get the adjustment
    async getAdjustment() {
      const { data } = await axios.get(
        window.location.origin +
        '/api/inventory-adjustments/' +
        this.$route.params.slug
      )
      this.allData = data.data
      this.adjustedProducts = this.allData.adjustmentProducts
      this.adjustedProducts.sort(this.sortProducts)
    },

    sortProducts(a, b) {
      if (a.productCode < b.productCode) {
        return -1
      }
      if (a.productCode > b.productCode) {
        return 1
      }
      return 0
    },

    // print
    printWindow() {
      window.print()
    },
  },
}
</script>
