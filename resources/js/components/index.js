import Vue from 'vue'
import Card from './Card'
import Child from './Child'
import Modal from './Modal'
import Search from './Search'
import Button from './Button'
import Checkbox from './Checkbox'
import TopClients from './TopClients'
import StockAlert from './StockAlert'
import Pagination from './Pagination'
import EmptyTable from './EmptyTable'
import Breadcrumbs from './Breadcrumbs'
import CompanyInfo from './CompanyInfo'
import TableLoading from './TableLoading'
import RecentActivities from './RecentActivities'
import {
  HasError,
  AlertError,
  AlertErrors,
  AlertSuccess
} from 'vform/src/components/bootstrap4'


// Components that are registered globaly.
[
  Card,
  Child,
  Modal,
  Button,
  Search,
  Checkbox,
  StockAlert,
  EmptyTable,
  TopClients,
  Pagination,
  Breadcrumbs,
  CompanyInfo,
  TableLoading,
  RecentActivities,
  HasError,
  AlertError,
  AlertErrors,
  AlertSuccess,

].forEach(Component => {
  Vue.component(Component.name, Component)
})
