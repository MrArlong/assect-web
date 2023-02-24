<template>
  <order-add :is-edit="true" />
</template>
<script>
import OrderAdd from './orderAdd'
export default {
  name: 'UpdateOrder',
  components: { OrderAdd }
}
</script>
<style>
</style>

