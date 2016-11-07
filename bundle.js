(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Multiselect = require('./Multiselect.js');

var _Multiselect2 = _interopRequireDefault(_Multiselect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'app',
  components: { MultiSelect: _Multiselect2.default },
  data: function data() {
    return {
      selected: null,
      options: ['list', 'of', 'options']
    };
  },

  methods: {
    updateSelected: function updateSelected(newSelected) {
      this.selected = newSelected;
    }
  },
  template: '\n<div id="app">\n  <label>Select option</label>\n  <multi-select\n    :value="selected"\n    :options="options"\n    :searchable="false"\n    @update="updateSelected"\n  ></multi-select>\n</div>\n'
};

},{"./Multiselect.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multiselectMixin = require('vue-multiselect/lib/multiselectMixin.js');

var _multiselectMixin2 = _interopRequireDefault(_multiselectMixin);

var _pointerMixin = require('vue-multiselect/lib/pointerMixin.js');

var _pointerMixin2 = _interopRequireDefault(_pointerMixin);

var _MultiselectOption = require('vue-multiselect/lib/MultiselectOption.js');

var _MultiselectOption2 = _interopRequireDefault(_MultiselectOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'vue-multiselect',
  components: {
    MultiselectOption: _MultiselectOption2.default
  },
  mixins: [_multiselectMixin2.default, _pointerMixin2.default],
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
      default: function _default(count) {
        return 'and ' + count + ' more';
      }
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
      default: function _default(h, option, label) {
        return h('span', {}, label);
      }
    }
  },
  computed: {
    visibleValue: function visibleValue() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : [];
    },
    deselectLabelText: function deselectLabelText() {
      return this.showLabels ? this.deselectLabel : '';
    },
    selectLabelText: function selectLabelText() {
      return this.showLabels ? this.selectLabel : '';
    },
    selectedLabelText: function selectedLabelText() {
      return this.showLabels ? this.selectedLabel : '';
    }
  },
  template: '\n<div\n  tabindex="0"\n  :class="{ \'multiselect--active\': isOpen, \'multiselect--disabled\': disabled }"\n  @focus="activate()"\n  @blur="searchable ? false : deactivate()"\n  @keydown.self.down.prevent="pointerForward()"\n  @keydown.self.up.prevent="pointerBackward()"\n  @keydown.enter.stop.prevent.self="addPointerElement()"\n  @keydown.tab.stop.prevent.self="addPointerElement()"\n  @keyup.esc="deactivate()"\n  class="multiselect">\n    <div @mousedown.prevent="toggle()" class="multiselect__select"></div>\n    <div ref="tags" class="multiselect__tags">\n      <span\n        v-for="option of visibleValue"\n        onmousedown="event.preventDefault()"\n        class="multiselect__tag">\n          <span v-text="getOptionLabel(option)"></span>\n          <i\n            aria-hidden="true"\n            tabindex="1"\n            @keydown.enter.prevent="removeElement(option)"\n            @mousedown.prevent="removeElement(option)"\n            class="multiselect__tag-icon">\n          </i>\n      </span>\n      <template v-if="internalValue && internalValue.length > limit">\n        <strong v-text="limitText(internalValue.length - limit)"></strong>\n      </template>\n      <transition name="multiselect__loading">\n        <div v-show="loading" class="multiselect__spinner"></div>\n      </transition>\n      <input\n        name="search"\n        ref="search"\n        type="text"\n        autocomplete="off"\n        :placeholder="placeholder"\n        v-if="searchable"\n        :value="search"\n        :disabled="disabled"\n        @input="updateSearch($event.target.value)"\n        @focus.prevent="activate()"\n        @blur.prevent="deactivate()"\n        @keyup.esc="deactivate()"\n        @keyup.down="pointerForward()"\n        @keyup.up="pointerBackward()"\n        @keydown.enter.stop.prevent.self="addPointerElement()"\n        @keydown.tab.stop.prevent.self="addPointerElement()"\n        @keydown.delete="removeLastElement()"\n        class="multiselect__input"/>\n        <span\n          v-if="!searchable && !multiple"\n          class="multiselect__single"\n          v-text="currentOptionLabel || placeholder">\n        </span>\n    </div>\n    <transition name="multiselect">\n      <ul\n        :style="{ maxHeight: maxHeight + \'px\' }"\n        ref="list"\n        v-show="isOpen"\n        class="multiselect__content">\n        <slot name="beforeList"></slot>\n        <li v-if="multiple && max === internalValue.length">\n          <span class="multiselect__option">\n            <slot name="maxElements">Maximum of {{ max }} options selected. First remove a selected option to select another.</slot>\n          </span>\n        </li>\n        <template v-if="!max || internalValue.length < max">\n          <li v-for="(option, index) of filteredOptions" :key="index">\n            <span\n              tabindex="0"\n              :class="optionHighlight(index, option)"\n              @mousedown.prevent="select(option)"\n              @mouseenter="pointerSet(index)"\n              :data-select="option.isTag ? tagPlaceholder : selectLabelText"\n              :data-selected="selectedLabelText"\n              :data-deselect="deselectLabelText"\n              class="multiselect__option">\n                <multiselect-option\n                  :option-function="optionFunction"\n                  :label="getOptionLabel(option)"\n                  :option="option">\n                </multiselect-option>\n            </span>\n          </li>\n        </template>\n        <li v-show="filteredOptions.length === 0 && search">\n          <span class="multiselect__option">\n            <slot name="noResult">No elements found. Consider changing the search query.</slot>\n          </span>\n        </li>\n        <slot name="afterList"></slot>\n      </ul>\n    </transition>\n</div>\n'
};

},{"vue-multiselect/lib/MultiselectOption.js":4,"vue-multiselect/lib/multiselectMixin.js":5,"vue-multiselect/lib/pointerMixin.js":6}],3:[function(require,module,exports){
'use strict';

var _App = require('./App.js');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new Vue({
  el: '#app',
  template: '<app></app>',
  components: { App: _App2.default }
});

},{"./App.js":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  functional: true,
  render: function render(h, context) {
    return context.props.optionFunction(h, context.props.option, context.props.label);
  },

  props: {
    optionFunction: {
      type: Function,
      required: true
    },
    label: {
      required: true
    },
    option: {}
  }
};

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function includes(str, query) {
  if (!str) return false;
  var text = str.toString().toLowerCase();
  return text.indexOf(query) !== -1;
}

module.exports = {
  data: function data() {
    return {
      search: '',
      isOpen: false,
      internalValue: this.value || this.value === 0 ? (0, _utils2.default)(this.value) : this.multiple ? [] : null
    };
  },

  props: {
    /**
     * Decide whether to filter the results based on search query.
     * Useful for async filtering, where we search through more complex data.
     * @type {Boolean}
     */
    localSearch: {
      type: Boolean,
      default: true
    },
    /**
     * Array of available options: Objects, Strings or Integers.
     * If array of objects, visible label will default to option.label.
     * If `labal` prop is passed, label will equal option['label']
     * @type {Array}
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @default false
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Presets the selected options value.
     * @type {Object||Array||String||Integer}
     */
    value: {
      type: null,
      default: null
    },
    /**
     * Key to compare objects
     * @default 'id'
     * @type {String}
     */
    trackBy: {
      type: String
    },
    /**
     * Label to look for in option Object
     * @default 'label'
     * @type {String}
     */
    label: {
      type: String
    },
    /**
     * Enable/disable search in options
     * @default true
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: true
    },
    /**
     * Clear the search input after select()
     * @default true
     * @type {Boolean}
     */
    clearOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Hide already selected options
     * @default false
     * @type {Boolean}
     */
    hideSelected: {
      type: Boolean,
      default: false
    },
    /**
     * Equivalent to the `placeholder` attribute on a `<select>` input.
     * @default 'Select option'
     * @type {String}
     */
    placeholder: {
      type: String,
      default: 'Select option'
    },
    /**
     * Sets maxHeight style value of the dropdown
     * @default 300
     * @type {Integer}
     */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
     * Allow to remove all selected values
     * @default true
     * @type {Boolean}
     */
    allowEmpty: {
      type: Boolean,
      default: true
    },
    /**
     * Reset this.internalValue, this.search after this.internalValue changes.
     * Useful if want to create a stateless dropdown.
     * @default false
     * @type {Boolean}
     */
    resetAfter: {
      type: Boolean,
      default: false
    },
    /**
     * Enable/disable closing after selecting an option
     * @default true
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Function to interpolate the custom label
     * @default false
     * @type {Function}
     */
    customLabel: {
      type: Function,
      default: function _default(option, label) {
        return label ? option[label] : option;
      }
    },
    /**
     * Disable / Enable tagging
     * @default false
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: false
    },
    /**
     * String to show when highlighting a potential tag
     * @default 'Press enter to create a tag'
     * @type {String}
    */
    tagPlaceholder: {
      type: String,
      default: 'Press enter to create a tag'
    },
    /**
     * Number of allowed selected options. No limit if false.
     * @default False
     * @type {Number}
    */
    max: {
      type: Number
    },
    /**
     * Will be passed with all events as second param.
     * Useful for identifying events origin.
     * @default null
     * @type {String|Integer}
    */
    id: {
      default: null
    },
    /**
     * Limits the options displayed in the dropdown
     * to the first X options.
     * @default 1000
     * @type {Integer}
    */
    optionsLimit: {
      type: Number,
      default: 1000
    }
  },
  created: function created() {
    if (this.searchable) this.adjustSearch();
  },

  computed: {
    filteredOptions: function filteredOptions() {
      var _this = this;

      var search = this.search || '';
      var options = this.hideSelected ? this.options.filter(this.isNotSelected) : this.options;
      if (this.localSearch) {
        options = this.label ? options.filter(function (option) {
          return includes(option[_this.label], _this.search);
        }) : options.filter(function (option) {
          return includes(option, _this.search);
        });
      }
      if (this.taggable && search.length && !this.isExistingOption(search)) {
        options.unshift({ isTag: true, label: search });
      }
      return options.slice(0, this.optionsLimit);
    },
    valueKeys: function valueKeys() {
      var _this2 = this;

      if (this.trackBy) {
        return this.multiple ? this.internalValue.map(function (element) {
          return element[_this2.trackBy];
        }) : this.internalValue[this.trackBy];
      } else {
        return this.internalValue;
      }
    },
    optionKeys: function optionKeys() {
      var _this3 = this;

      return this.label ? this.options.map(function (element) {
        return element[_this3.label].toString().toLowerCase();
      }) : this.options.map(function (element) {
        return element.toString().toLowerCase();
      });
    },
    currentOptionLabel: function currentOptionLabel() {
      return this.getOptionLabel(this.internalValue);
    }
  },
  watch: {
    'internalValue': function internalValue() {
      if (this.resetAfter) {
        this.internalValue = null;
        this.search = '';
      }
      this.adjustSearch();
    },
    'search': function search() {
      /* istanbul ignore else */
      if (this.search === this.currentOptionLabel) return;

      this.$emit('search-change', this.search, this.id);
    },
    'value': function value() {
      this.internalValue = (0, _utils2.default)(this.value);
    }
  },
  methods: {
    updateSearch: function updateSearch(query) {
      this.search = query.trim().toLowerCase();
    },

    /**
     * Finds out if the given query is already present
     * in the available options
     * @param  {String}
     * @returns {Boolean} returns true if element is available
     */
    isExistingOption: function isExistingOption(query) {
      return !this.options ? false : this.optionKeys.indexOf(query) > -1;
    },

    /**
     * Finds out if the given element is already present
     * in the result value
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is selected
     */
    isSelected: function isSelected(option) {
      /* istanbul ignore else */
      if (!this.internalValue) return false;
      var opt = this.trackBy ? option[this.trackBy] : option;

      if (this.multiple) {
        return this.valueKeys.indexOf(opt) > -1;
      } else {
        return this.valueKeys === opt;
      }
    },

    /**
     * Finds out if the given element is NOT already present
     * in the result value. Negated isSelected method.
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is not selected
     */
    isNotSelected: function isNotSelected(option) {
      return !this.isSelected(option);
    },

    /**
     * Returns empty string when options is null/undefined
     * Returns tag query if option is tag.
     * Returns the customLabel() results and casts it to string.
     *
     * @param  {Object||String||Integer} Passed option
     * @returns {Object||String}
     */
    getOptionLabel: function getOptionLabel(option) {
      if (!option && option !== 0) return '';
      if (option.isTag) return option.label;
      return this.customLabel(option, this.label) + '';
    },

    /**
     * Add the given option to the list of selected options
     * or sets the option as the selected option.
     * If option is already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} option to select/deselect
     */
    select: function select(option) {
      if (this.max && this.multiple && this.internalValue.length === this.max) return;
      if (option.isTag) {
        this.$emit('tag', option.label, this.id);
        this.search = '';
      } else {
        if (this.multiple) {
          if (this.isSelected(option)) {
            this.removeElement(option);
            return;
          } else {
            this.internalValue.push(option);
          }
        } else {
          var isSelected = this.isSelected(option);

          /* istanbul ignore else */
          if (isSelected && !this.allowEmpty) return;

          this.internalValue = isSelected ? null : option;
        }
        this.$emit('select', (0, _utils2.default)(option), this.id);
        this.$emit('input', (0, _utils2.default)(this.internalValue), this.id);

        if (this.closeOnSelect) this.deactivate();
      }
    },

    /**
     * Removes the given option from the selected options.
     * Additionally checks this.allowEmpty prop if option can be removed when
     * it is the last selected option.
     *
     * @param  {type} option description
     * @returns {type}        description
     */
    removeElement: function removeElement(option) {
      /* istanbul ignore else */
      if (!this.allowEmpty && this.internalValue.length <= 1) return;

      var index = this.multiple && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' ? this.valueKeys.indexOf(option[this.trackBy]) : this.valueKeys.indexOf(option);

      this.internalValue.splice(index, 1);
      this.$emit('remove', (0, _utils2.default)(option), this.id);
      this.$emit('input', (0, _utils2.default)(this.internalValue), this.id);
    },

    /**
     * Calls this.removeElement() with the last element
     * from this.internalValue (selected element Array)
     *
     * @fires this#removeElement
     */
    removeLastElement: function removeLastElement() {
      /* istanbul ignore else */
      if (this.search.length === 0 && Array.isArray(this.internalValue)) {
        this.removeElement(this.internalValue[this.internalValue.length - 1]);
      }
    },

    /**
     * Opens the multiselect’s dropdown.
     * Sets this.isOpen to TRUE
     */
    activate: function activate() {
      /* istanbul ignore else */
      if (this.isOpen) return;

      this.isOpen = true;
      /* istanbul ignore else  */
      if (this.searchable) {
        this.search = '';
        this.$refs.search.focus();
      } else {
        this.$el.focus();
      }
      this.$emit('open', this.id);
    },

    /**
     * Closes the multiselect’s dropdown.
     * Sets this.isOpen to FALSE
     */
    deactivate: function deactivate() {
      /* istanbul ignore else */
      if (!this.isOpen) return;

      this.isOpen = false;
      /* istanbul ignore else  */
      if (this.searchable) {
        this.$refs.search.blur();
        this.adjustSearch();
      } else {
        this.$el.blur();
      }
      this.$emit('close', (0, _utils2.default)(this.internalValue), this.id);
    },

    /**
     * Adjusts the Search property to equal the correct value
     * depending on the selected value.
     */
    adjustSearch: function adjustSearch() {
      if (!this.searchable || !this.clearOnSelect) return;

      this.search = this.multiple ? '' : this.currentOptionLabel;
    },

    /**
     * Call this.activate() or this.deactivate()
     * depending on this.isOpen value.
     *
     * @fires this#activate || this#deactivate
     * @property {Boolean} isOpen indicates if dropdown is open
     */
    toggle: function toggle() {
      this.isOpen ? this.deactivate() : this.activate();
    }
  }
};

},{"./utils":7}],6:[function(require,module,exports){
'use strict';

module.exports = {
  data: function data() {
    return {
      pointer: 0,
      visibleElements: this.maxHeight / 40
    };
  },

  props: {
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    pointerPosition: function pointerPosition() {
      return this.pointer * 40;
    }
  },
  watch: {
    'filteredOptions': function filteredOptions() {
      this.pointerAdjust();
    }
  },
  methods: {
    optionHighlight: function optionHighlight(index, option) {
      return {
        'multiselect__option--highlight': index === this.pointer && this.showPointer,
        'multiselect__option--selected': this.isSelected(option)
      };
    },
    addPointerElement: function addPointerElement() {
      if (this.filteredOptions.length > 0) {
        this.select(this.filteredOptions[this.pointer]);
      }
      this.pointerReset();
    },
    pointerForward: function pointerForward() {
      if (this.pointer < this.filteredOptions.length - 1) {
        this.pointer++;
        if (this.$refs.list.scrollTop <= this.pointerPosition - this.visibleElements * 40) {
          this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * 40;
        }
      }
    },
    pointerBackward: function pointerBackward() {
      if (this.pointer > 0) {
        this.pointer--;
        if (this.$refs.list.scrollTop >= this.pointerPosition) {
          this.$refs.list.scrollTop = this.pointerPosition;
        }
      }
    },
    pointerReset: function pointerReset() {
      if (!this.closeOnSelect) return;

      this.pointer = 0;
      if (this.$refs.list) {
        this.$refs.list.scrollTop = 0;
      }
    },
    pointerAdjust: function pointerAdjust() {
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0;
      }
    },
    pointerSet: function pointerSet(index) {
      this.pointer = index;
    }
  }
};

},{}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Returns a depply cloned object without reference.
 * Copied from Vuex.
 * @type {Object}
 */
var deepClone = function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  } else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    var cloned = {};
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  } else {
    return obj;
  }
};

module.exports = deepClone;

},{}]},{},[3]);
