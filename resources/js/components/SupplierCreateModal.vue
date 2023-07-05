<template>
  <div>
      <div class="pl-1">
        <a class="create-button" @click="showSupplierCreateModal = !showSupplierCreateModal">
          <i class="fas fa-solid fa-plus-circle"></i>
        </a>
      </div>
      <ModalMini v-if="showSupplierCreateModal">
          <h5 slot="header" class="flex justify-between">
              {{ $t('Create Supplier') }}
          </h5>
          <div class="w-100" slot="body">
             <!-- form start -->
            <form role="form" @submit.prevent="saveSupplier" @keydown="form.onKeydown($event)">
              <div class="card-body">
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="name">{{ $t('common.name') }}
                      <span class="required">*</span></label>
                    <input id="name" v-model="form.name" type="text" class="form-control"
                      :class="{ 'is-invalid': form.errors.has('name') }" name="name"
                      :placeholder="$t('common.name_placeholder')" />
                    <has-error :form="form" field="name" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="companyName">{{
                        $t('common.company_name')
                    }}</label>
                    <input id="companyName" v-model="form.companyName" type="companyName" class="form-control"
                      :class="{ 'is-invalid': form.errors.has('companyName') }" name="companyName"
                      :placeholder="$t('common.company_name_placeholder')" />
                    <has-error :form="form" field="companyName" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="phoneNumber">{{ $t('common.contact_number') }}
                      <span class="required">*</span></label>
                    <input id="phoneNumber" v-model="form.phoneNumber" type="text" class="form-control"
                      :class="{ 'is-invalid': form.errors.has('phoneNumber') }" name="phoneNumber"
                      :placeholder="$t('common.contact_number_placeholder')" />
                    <has-error :form="form" field="phoneNumber" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="email">{{ $t('common.email') }}</label>
                    <input id="email" v-model="form.email" type="email" class="form-control"
                      :class="{ 'is-invalid': form.errors.has('email') }" name="email"
                      :placeholder="$t('common.email_placeholder')" />
                    <has-error :form="form" field="email" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="address">{{ $t('common.address') }}</label>
                  <textarea id="address" v-model="form.address" class="form-control"
                    :class="{ 'is-invalid': form.errors.has('address') }"
                    :placeholder="$t('common.address_placeholder')" />
                  <has-error :form="form" field="address" />
                </div>
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="image">{{ $t('common.image') }}</label>
                    <div class="custom-file">
                      <input id="image" type="file" class="custom-file-input" name="image"
                        :class="{ 'is-invalid': form.errors.has('image') }" @change="onFileChange" />
                      <label class="custom-file-label" for="image">{{
                          $t('common.choose_file')
                      }}</label>
                    </div>
                    <has-error :form="form" field="image" />
                    <div class="bg-light mt-4 w-25">
                      <img v-if="url" :src="url" class="img-fluid" :alt="$t('common.image_alt')" />
                    </div>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="status">{{ $t('common.status') }}</label>
                    <select id="status" v-model="form.status" class="form-control"
                      :class="{ 'is-invalid': form.errors.has('status') }">
                      <option value="1">{{ $t('common.active') }}</option>
                      <option value="0">{{ $t('common.in_active') }}</option>
                    </select>
                    <has-error :form="form" field="status" />
                  </div>
                </div>
              </div>
              <!-- /.card-body -->
              <div class="card-footer d-flex justify-content-between px-5">
                <v-button :loading="form.busy" class="btn btn-primary">
                  <i class="fas fa-save" /> {{ $t('common.save') }}
                </v-button>
                <button type="reset" class="btn btn-secondary float-right" @click="form.reset()">
                  <i class="fas fa-power-off" /> {{ $t('common.reset') }}
                </button>
                <button class="btn btn-secondary" @click="showSupplierCreateModal = false">
                {{$t('Cancel')}}
                </button>
              </div>
            </form>
          </div>
      </ModalMini>

  </div>
</template>

<script>
import Form from 'vform'
import ModalMini from './ModalMini.vue'
export default {
  middleware: ['auth', 'check-permissions'],
  components:{
    ModalMini
  },
  metaInfo() {
    return { title: this.$t('suppliers.create.page_title') }
  },
  data: () => ({
    breadcrumbsCurrent: 'suppliers.create.breadcrumbs_current',
    breadcrumbs: [
      {
        name: 'suppliers.create.breadcrumbs_first',
        url: 'home',
      },
      {
        name: 'suppliers.create.breadcrumbs_second',
        url: 'suppliers.index',
      },
      {
        name: 'suppliers.create.breadcrumbs_active',
        url: '',
      },
    ],
    form: new Form({
      name: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      address: '',
      image: '',
      status: 1,
    }),
    loading: true,
    url: null,
    showSupplierCreateModal: false
  }),
  methods: {
    // vue file upload
    onFileChange(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      if (
        file.size < 2111775 &&
        (file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif')
      ) {
        reader.onloadend = (file) => {
          this.form.image = reader.result
        }
        reader.readAsDataURL(file)
        this.url = URL.createObjectURL(file)
      } else {
        Swal.fire(
          this.$t('common.error'),
          this.$t('common.image_error'),
          'error'
        )
      }
    },

    // save supplier
    async saveSupplier() {
      await this.form
        .post(window.location.origin + '/api/suppliers')
        .then(() => {
          toast.fire({
            type: 'success',
            title: this.$t('suppliers.create.success_msg'),
          })
          this.form.reset();
          this.showSupplierCreateModal = false;
          this.$emit('reloadSuppliers');
        })
        .catch(() => {
          toast.fire({ type: 'error', title: this.$t('common.error_msg') })
        })
    },
  },
}
</script>
<style scoped>
.create-button{
  text-decoration: none;
  cursor: pointer;
}
</style>

