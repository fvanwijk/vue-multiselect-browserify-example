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
import Vue from 'vue';
import MultiSelect from 'vue-multiselect/lib/Multiselect.vue';
Vue.component('multiSelect', MultiSelect);

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
