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
              <h5>{{ $t('loans.common.authority_details') }}</h5>
              <div v-if="allData.authority">
                <strong>{{ $t('common.name') }}:</strong>
                {{ allData.authority.name }}<br />
                <strong>{{ $t('common.email') }}:</strong>
                {{ allData.authority.email }}<br />
                <strong>{{ $t('common.contact_number') }}:</strong>
                {{ allData.authority.contactNumber }}<br />
                <strong>{{ $t('common.address') }}:</strong>
                {{ allData.authority.address }}<br />
              </div>
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
                      <th>{{ $t('common.image') }}</th>
                      <th>{{ $t('loans.common.loan_ref') }}</th>
                      <th>{{ $t('loans.common.payment_ref') }}</th>
                      <th v-if="allData.loan">{{ $t('common.payable') }}</th>
                      <th>{{ $t('loans.common.amount_paid') }}</th>
                      <th>{{ $t('loans.common.interetest_paid') }}</th>
                      <th v-if="allData.account">{{ $t('common.account') }}</th>
                      <th v-if="allData.note">{{ $t('common.note') }}</th>
                      <th>{{ $t('common.status') }}</th>
                      <th v-if="allData.date">{{ $t('common.date') }}</th>
                      <th class="text-right">{{ $t('common.created_by') }}</th>
                    </tr>
                  </thead>
                  <tbody v-if="allData.loan">
                    <tr>
                      <td>
                        <a v-if="allData.image" href="#" id="show-modal" @click="showModal = true">
                          <img :src="allData.image" class="rounded preview-sm" loading="lazy" />
                        </a>
                        <div v-else class="bg-secondary rounded no-preview-sm">
                          <small>{{ $t('common.no_preview') }}</small>
                        </div>
                      </td>
                      <td>{{ allData.loan.reference }}</td>
                      <td>{{ allData.reference }}</td>
                      <td v-if="allData.loan">
                        {{ allData.loan.payable | withCurrency }}
                      </td>
                      <td>{{ allData.amount | withCurrency }}</td>
                      <td>{{ allData.interest | withCurrency }}</td>
                      <td v-if="allData.account">
                        {{ allData.account.label }}
                      </td>
                      <td v-if="allData.note">{{ allData.note }}</td>
                      <td>
                        <span v-if="allData.status == 1" class="badge bg-success">{{ $t('common.active') }}</span>
                        <span v-else class="badge bg-danger">{{
                            $t('common.in_active')
                        }}</span>
                      </td>
                      <td v-if="allData.date">
                        {{ allData.date | moment('Do MMM, YYYY') }}
                      </td>
                      <td class="text-right">{{ allData.created_by }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- /.row -->
          <div class="row mt-4">
            <div class="offset-xl-8 col-lg-12 col-xl-4 text-xl-right">
              <div class="table-responsive table-custom table-border-y-0" v-if="allData.loan">
                <table class="table">
                  <tbody>
                    <tr class="bg-sub-light text-bold">
                      <th>{{ $t('loans.common.loan_amount') }}:</th>
                      <td>
                        {{ allData.loan.transaction.amount | withCurrency }}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        {{ $t('common.interest') }}
                        <span v-if="allData.loan.loanType == 1">({{ allData.interestRate }}%)</span>:
                      </th>
                      <td>
                        <span class="plus-sign">+</span>
                        {{ allData.loan.interestAmount | withCurrency }}
                      </td>
                    </tr>
                    <tr class="bg-indigo-light">
                      <th>{{ $t('common.payable') }}:</th>
                      <td v-if="allData.loan.loanType == 1">
                        <span class="equal-sign">=</span>
                        {{ allData.loan.payable | withCurrency }}
                      </td>
                      <td v-else>
                        <span class="equal-sign">=</span>
                        {{
                            (allData.loan.payable + allData.loan.interestAmount)
                            | withCurrency
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>{{ $t('common.total_paid') }}:</th>
                      <td>
                        <span class="minus-sign">-</span>
                        <span v-if="allData.loan.loanType == 0">{{
                            allData.loan.loanWithInterest | withCurrency
                        }}</span>
                        <span v-else>{{
                            (allData.loan.totalPaid > 0
                              ? allData.loan.totalPaid
                              : 0) | withCurrency
                        }}</span>
                      </td>
                    </tr>
                    <tr class="bg-red-light">
                      <th>{{ $t('common.total_due') }}:</th>
                      <td>{{ allData.loan.due | withCurrency }}</td>
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
              <router-link :to="{ name: 'loanPayments.index' }" class="btn btn-dark float-right">
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
    return { title: this.$t('loans.payments.view.page_title') }
  },
  components: {
    Modal,
  },
  data: () => ({
    breadcrumbsCurrent: 'loans.payments.view.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'loans.payments.view.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'loans.payments.view.breadcrumbs_second',
        url: 'loanPayments.index',
      },
      {
        name: 'loans.payments.view.breadcrumbs_active',
        url: '',
      },
    ],
    showModal: false,
    allData: '',
  }),

  created() {
    this.getLoanPayment()
  },
  methods: {
    // get the loan payment
    async getLoanPayment() {
      const { data } = await axios.get(
        window.location.origin + '/api/loan-payments/' + this.$route.params.slug
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

