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
          <div class="row invoice-info mb-5">
            <div class="col-sm-4 invoice-col">
              <CompanyInfo />
            </div>
            <!-- /.col -->
            <div v-if="allData.employee && allData.employee.department"
              class="col-sm-6 offset-sm-2 invoice-col float-right text-md-right">
              <h5>{{ $t('common.employee_details') }}</h5>
              <strong>{{ $t('common.emp_id') }}: </strong>{{ allData.employee.empID | withPrefix(employeePrefix)
              }}<br />
              <strong>{{ $t('common.emp_name') }}: </strong>
              {{ allData.employee.name }}<br />
              <strong>{{ $t('common.department') }}: </strong>
              {{ allData.employee.department.name }}<br />
              <strong>{{ $t('common.designation') }}: </strong>
              {{ allData.employee.designation }}<br />
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->

          <!-- Table row -->
          <div class="row">
            <div class="col-12">
              <div class="table-custom table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th v-if="allData.reason">
                        {{ $t('employees.common.increment_reason') }}
                      </th>
                      <th v-if="allData.employee && allData.employee.salary">
                        {{ $t('employees.common.basic_salary') }}
                      </th>
                      <th v-if="allData.incrementAmount">
                        {{ $t('employees.common.increment_amount') }}
                      </th>
                      <th>{{ $t('employees.common.incremented_salary') }}</th>
                      <th>{{ $t('payroll.common.present_salary') }}</th>
                      <th v-if="allData.incrementDate">
                        {{ $t('employees.common.increment_date') }}
                      </th>
                      <th>{{ $t('common.status') }}</th>
                      <th class="text-right">{{ $t('common.created_by') }}</th>
                    </tr>
                  </thead>
                  <tbody v-if="allData.employee">
                    <tr>
                      <td v-if="allData.reason">{{ allData.reason }}</td>
                      <td v-if="allData.employee.salary">
                        {{ allData.employee.salary | withCurrency }}
                      </td>
                      <td v-if="allData.incrementAmount">
                        {{ allData.incrementAmount | withCurrency }}
                      </td>
                      <td>
                        {{
                            (allData.incrementAmount + allData.employee.salary)
                            | withCurrency
                        }}
                      </td>
                      <td>
                        {{ allData.employee.totalSalary | withCurrency }}
                      </td>
                      <td v-if="allData.incrementDate">
                        {{ allData.incrementDate | moment('Do MMM, YYYY') }}
                      </td>
                      <td>
                        <span v-if="allData.status === 1" class="badge bg-success">{{ $t('common.active') }}</span>
                        <span v-else class="badge bg-danger">{{
                            $t('common.in_active')
                        }}</span>
                      </td>
                      <td class="text-right">{{ allData.user }}</td>
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
              <router-link :to="{ name: 'increments.index' }" class="btn btn-dark float-right">
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
        <img :src="allData.employee.image" class="rounded img-fluid" loading="lazy" />
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Modal from '../../../components/Modal.vue'

export default {
  middleware: ['auth', 'check-permissions'],
  metaInfo() {
    return { title: this.$t('employees.increments.view.page_title') }
  },
  components: {
    Modal,
  },
  data: () => ({
    breadcrumbsCurrent: 'employees.increments.view.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'employees.increments.view.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'employees.increments.view.breadcrumbs_second',
        url: 'increments.index',
      },
      {
        name: 'employees.increments.view.breadcrumbs_active',
        url: '',
      },
    ],
    showModal: false,
    allData: '',
    employeePrefix: '',
  }),
  computed: mapGetters({
    appInfo: 'operations/appInfo',
  }),
  created() {
    this.getIncrement()
    this.employeePrefix = this.appInfo.employeePrefix
  },
  methods: {
    // get increment
    async getIncrement() {
      const { data } = await axios.get(
        window.location.origin + '/api/increments/' + this.$route.params.slug
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

