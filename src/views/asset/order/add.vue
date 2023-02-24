<template>
  <order-add :is-edit="false" />
</template>
<script>
import OrderAdd from './orderAdd'
export default {
  name: 'AddOrder',
  components: { OrderAdd }
}
</script>
<style>
</style>

