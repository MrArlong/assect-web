<template>
  <room-detail :is-edit="true" />
</template>
<script>
import RoomDetail from './components/RoomDetail'
export default {
  name: 'UpdateRoom',
  components: { RoomDetail }
}
</script>
<style>
</style>
