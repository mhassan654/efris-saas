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
          </div>
          <!-- /.row -->

          <!-- Table row -->
          <div class="row">
            <div class="col-12">
              <div class="table-responsive table-custom">
                <table class="table">
                  <thead>
                    <tr>
                      <th>{{ $t('common.preview') }}</th>
                      <th>{{ $t('setup.brands.common.brand_name') }}</th>
                      <th>{{ $t('setup.common.sort_code') }}</th>
                      <th v-if="allData.note">{{ $t('common.note') }}</th>
                      <th>{{ $t('common.status') }}</th>
                      <th class="text-right">{{ $t('common.created_at') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a v-if="allData.image" href="#" id="show-modal" @click="showModal = true">
                          <img :src="allData.image" class="rounded preview-sm" loading="lazy" />
                        </a>
                        <div v-else class="bg-secondary rounded no-preview-sm">
                          <small>{{ $t('common.no_preview') }}</small>
                        </div>
                      </td>
                      <td>{{ allData.name }}</td>
                      <td>{{ allData.code }}</td>
                      <td v-if="allData.note">{{ allData.note }}</td>
                      <td>
                        <span v-if="allData.status === 1" class="badge bg-success">{{ $t('common.active') }}</span>
                        <span v-else class="badge bg-danger">>{{ $t('common.in_active') }}</span>
                      </td>
                      <td class="text-right">
                        {{ allData.createdAt | moment('Do MMM, YYYY') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- /.row -->

          <!-- this row will not appear when printing -->
          <div class="row no-print mt-5">
            <div class="col-12">
              <router-link :to="{ name: 'brands.index' }" class="btn btn-dark float-right">
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
    <!-- use the modal component, pass in the prop -->
    <Modal v-if="showModal" @close="showModal = false">
      <h5 slot="header">{{ $t('common.modal_header') }}</h5>
      <div class="w-100" slot="body">
        <img :src="allData.image" class="rounded img-fluid" loading="lazy" />
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import Modal from '../../../components/Modal.vue'

export default {
  middleware: ['auth', 'check-permissions'],
  metaInfo() {
    return { title: this.$t('setup.brands.view.page_title') }
  },
  components: {
    Modal,
  },
  data: () => ({
    breadcrumbsCurrent: 'setup.brands.view.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'setup.brands.view.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'setup.brands.view.breadcrumbs_second',
        url: 'setup.index',
      },
      {
        name: 'setup.brands.view.breadcrumbs_third',
        url: 'brands.index',
      },
      {
        name: 'setup.brands.view.breadcrumbs_active',
        url: '',
      },
    ],
    url: null,
    showModal: false,
    allData: '',
  }),

  created() {
    this.getBrand()
  },
  methods: {
    // get the brand
    async getBrand() {
      const { data } = await axios.get(
        window.location.origin + '/api/brands/' + this.$route.params.slug
      )
      this.allData = data.data
    },

    // print
    printWindow() {
      window.print()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
