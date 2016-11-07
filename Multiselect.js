import multiselectMixin from 'vue-multiselect/lib/multiselectMixin.js'
import pointerMixin from 'vue-multiselect/lib/pointerMixin.js'
import MultiselectOption from 'vue-multiselect/lib/MultiselectOption.js'

export default {
  name: 'vue-multiselect',
  components: {
    MultiselectOption
  },
  mixins: [multiselectMixin, pointerMixin],
  props: {
    /**
     * String to show when pointing to an option
     * @default 'Press enter to select'
     * @type {String}
     */
    selectLabel: {
      type: String,
      default: 'Press enter to select'
    },
    /**
     * String to show next to selected option
     * @default 'Selected'
     * @type {String}
     */
    selectedLabel: {
      type: String,
      default: 'Selected'
    },
    /**
     * String to show when pointing to an alredy selected option
     * @default 'Press enter to remove'
     * @type {String}
     */
    deselectLabel: {
      type: String,
      default: 'Press enter to remove'
    },
    /**
     * Decide whether to show pointer labels
     * @default true
     * @type {Boolean}
     */
    showLabels: {
      type: Boolean,
      default: true
    },
    /**
     * Limit the display of selected options. The rest will be hidden within the limitText string.
     * @default 'label'
     * @type {String}
     */
    limit: {
      type: Number,
      default: 99999
    },
    /**
     * Function that process the message shown when selected
     * elements pass the defined limit.
     * @default 'and * more'
     * @param {Int} count Number of elements more than limit
     * @type {Function}
     */
    limitText: {
      type: Function,
      default: count => `and ${count} more`
    },
    /**
     * Set true to trigger the loading spinner.
     * @default False
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Disables the multiselect if true.
     * @default false
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },
    optionFunction: {
      type: Function,
      default (h, option, label) {
        return h('span', {}, label)
      }
    }
  },
  computed: {
    visibleValue () {
      return this.multiple
        ? this.internalValue.slice(0, this.limit)
        : []
    },
    deselectLabelText () {
      return this.showLabels
        ? this.deselectLabel
        : ''
    },
    selectLabelText () {
      return this.showLabels
        ? this.selectLabel
        : ''
    },
    selectedLabelText () {
      return this.showLabels
        ? this.selectedLabel
        : ''
    }
  },
  template: `
<div
  tabindex="0"
  :class="{ 'multiselect--active': isOpen, 'multiselect--disabled': disabled }"
  @focus="activate()"
  @blur="searchable ? false : deactivate()"
  @keydown.self.down.prevent="pointerForward()"
  @keydown.self.up.prevent="pointerBackward()"
  @keydown.enter.stop.prevent.self="addPointerElement()"
  @keydown.tab.stop.prevent.self="addPointerElement()"
  @keyup.esc="deactivate()"
  class="multiselect">
    <div @mousedown.prevent="toggle()" class="multiselect__select"></div>
    <div ref="tags" class="multiselect__tags">
      <span
        v-for="option of visibleValue"
        onmousedown="event.preventDefault()"
        class="multiselect__tag">
          <span v-text="getOptionLabel(option)"></span>
          <i
            aria-hidden="true"
            tabindex="1"
            @keydown.enter.prevent="removeElement(option)"
            @mousedown.prevent="removeElement(option)"
            class="multiselect__tag-icon">
          </i>
      </span>
      <template v-if="internalValue && internalValue.length > limit">
        <strong v-text="limitText(internalValue.length - limit)"></strong>
      </template>
      <transition name="multiselect__loading">
        <div v-show="loading" class="multiselect__spinner"></div>
      </transition>
      <input
        name="search"
        ref="search"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        v-if="searchable"
        :value="search"
        :disabled="disabled"
        @input="updateSearch($event.target.value)"
        @focus.prevent="activate()"
        @blur.prevent="deactivate()"
        @keyup.esc="deactivate()"
        @keyup.down="pointerForward()"
        @keyup.up="pointerBackward()"
        @keydown.enter.stop.prevent.self="addPointerElement()"
        @keydown.tab.stop.prevent.self="addPointerElement()"
        @keydown.delete="removeLastElement()"
        class="multiselect__input"/>
        <span
          v-if="!searchable && !multiple"
          class="multiselect__single"
          v-text="currentOptionLabel || placeholder">
        </span>
    </div>
    <transition name="multiselect">
      <ul
        :style="{ maxHeight: maxHeight + 'px' }"
        ref="list"
        v-show="isOpen"
        class="multiselect__content">
        <slot name="beforeList"></slot>
        <li v-if="multiple && max === internalValue.length">
          <span class="multiselect__option">
            <slot name="maxElements">Maximum of {{ max }} options selected. First remove a selected option to select another.</slot>
          </span>
        </li>
        <template v-if="!max || internalValue.length < max">
          <li v-for="(option, index) of filteredOptions" :key="index">
            <span
              tabindex="0"
              :class="optionHighlight(index, option)"
              @mousedown.prevent="select(option)"
              @mouseenter="pointerSet(index)"
              :data-select="option.isTag ? tagPlaceholder : selectLabelText"
              :data-selected="selectedLabelText"
              :data-deselect="deselectLabelText"
              class="multiselect__option">
                <multiselect-option
                  :option-function="optionFunction"
                  :label="getOptionLabel(option)"
                  :option="option">
                </multiselect-option>
            </span>
          </li>
        </template>
        <li v-show="filteredOptions.length === 0 && search">
          <span class="multiselect__option">
            <slot name="noResult">No elements found. Consider changing the search query.</slot>
          </span>
        </li>
        <slot name="afterList"></slot>
      </ul>
    </transition>
</div>
`
}