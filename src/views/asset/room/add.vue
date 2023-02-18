<template>
  <room-detail :is-edit="false" />
</template>
<script>
import RoomDetail from './components/RoomDetail'
export default {
  name: 'AddRoom',
  components: { RoomDetail }
}
</script>
<style>
</style>
