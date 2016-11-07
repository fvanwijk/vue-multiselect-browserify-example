import MultiSelect from './Multiselect.js';

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
  },
  template: `
<div id="app">
  <label>Select option</label>
  <multi-select
    :value="selected"
    :options="options"
    :searchable="false"
    @update="updateSelected"
  ></multi-select>
</div>
`
}
