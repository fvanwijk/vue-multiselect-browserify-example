<template>
  <div id="app">
    <label>Select option</label>
    <multi-select
      :value="selected"
      :options="options"
      :searchable="false"
      @update="updateSelected"
    ></multi-select>
  </div>
</template>

<script>
import MultiSelect from './Multiselect.vue';

export default {
  name: 'app',
  components: { MultiSelect },
  data () {
    return {
      selected: null,
      options: ['list', 'of', 'options']
    }
  },
  methods: {
    updateSelected (newSelected) {
      this.selected = newSelected
    }
  }
}
</script>
