<template>
    <div class="dropdown component form-input input-item">
      <div class="input-wrapper">
        <span
          :class="{
            overrideBiggerText:
              this.searchText.length > 0 &&
              this.isSuggestionListVisible &&
              this.selectedItems.length > 0
          }"
          @click="$refs.multiSelect.focus()"
          class="selected-label"
          v-if="selectedItems.length > 0"
          >{{ selectedItemsLabel }}
          <template v-if="selectedItems.length > numberOfItemsToShow">{{
            totalCountLabel
          }}</template></span
        >
        <span
          class="selected-label placeholder-label"
          v-else-if="placeHolderText.length > 0"
          @click="$refs.multiSelect.focus()"
        >
          {{ placeHolderText }}
        </span>
        <input
          ref="multiSelect"
          @focus="handleFocus"
          type="text"
          v-model="searchText"
          @input="handleInputInSearchField"
          @keyup.up="handleKeyStroke($event, 'up')"
          @keyup.down="handleKeyStroke($event, 'down')"
          @keyup.enter="handleKeyStroke($event, 'enter')"
          @keyup.esc="isSuggestionListVisible = false"
          @click="handleFocus"
          class="auto-complete zaui-input"
          :class="{ disabled }"
          :disabled="disabled"
        />
        <div class="icon">
          <slot name="icon-slot"></slot>
        </div>
      </div>
      <ul v-if="isSuggestionListVisible" class="suggestion-list">
        <!-- Select All -->
        <li
          v-if="showSelectAll"
          :class="{
            selected: areAllItemsSelected
          }"
        >
          <div class="outer-item" @click="handleClickItem(-1, null)">
            <input
              v-if="maxSelectionsAllowed !== 1"
              class="pointer"
              readonly="readonly"
              type="checkbox"
              :checked="areAllItemsSelected"
            />
            <i></i>
            {{ selectAllItem.label }}
          </div>
        </li>
        <!-- Start of the suggestion list -->
        <li
          v-for="(item, index) in matches"
          :key="item.id"
          :class="{
            selected:
              this.selectedItems.findIndex((s) => s.value === item.value) > -1
          }"
        >
          <div
            class="outer-item"
            @mouseover.self="selectedIndex = item.value"
            @click="handleClickItem(index, item.value)"
          >
            <input
              v-if="maxSelectionsAllowed !== 1"
              class="pointer"
              readonly="readonly"
              type="checkbox"
              v-model="item.checked"
            />
            <i></i>
            {{ item.label }}
          </div>
        </li>
      </ul>
      <div
        @click="handleClickAway"
        v-if="isSuggestionListVisible"
        class="click-away-wrapper"
        data-testid="editable-clickaway"
      ></div>
    </div>
  </template>
  <script>
  // This control currently handles the items that are selected INTERNALLY.
  // Could improve it by offering the ability to selected items internally or via props.
  export default {
    name: 'MultiSelectInput',
    emits: ['itemAdded', 'itemRemoved', 'change', 'input'],
    props: {
      /**
       * The list that will be displayed. Passed in the following format.
       *  [{
       *    label: String,
       *    value: String
       *  }]
       */
      selectOptions: {
        type: Array,
        required: true
      },
      /**
       * Allow empty string to avoid warnings on opening
       * Format:
       *  [{
       *    label: String,
       *    value: String
       *  }]
       */
      initialSelectedItems: {
        type: [Array, String],
        default: () => []
      },
      maxSelectionsAllowed: {
        type: Number,
        default: null
      },
      numberOfItemsToShowProp: {
        type: Number
      },
      truncateLabel: {
        type: Number,
        default: 0
      },
      showSelectAll: {
        type: Boolean,
        default: () => false
      },
      placeHolderText: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: () => false
      }
    },
  
    watch: {
      initialSelectedItems: {
        immediate: true,
        handler(newval) {
          this.selectedItems = []
  
          if (newval) {
            newval = Array.isArray(newval) ? newval : [newval]
  
            // ensure that each item has a label and is not undefined
            this.selectedItems = newval
              .map((item) => {
                if (item && !item.label) {
                  item.label = this.selectOptions.find(
                    (option) => option.value === item.value
                  )?.label
                }
  
                return item
              })
              .filter((item) => item)
          }
        }
      }
    },
  
    data() {
      return {
        // Text inside the input field
        searchText: '',
        // Whether or not the results are shown
        isSuggestionListVisible: false,
        // Used to help maintain state between whether something has ever been set or not.
        valueSet: false,
        // Used for controlling the selected position while using keys
        selectedIndex: -1,
        hasBeenFocused: false,
        selectedItems: []
      }
    },
  
    computed: {
      selectAllItem() {
        return this.areAllItemsSelected
          ? { label: 'Deselect all', value: null }
          : { label: 'Select all', value: null }
      },
      // This controls all the items in the list
      matches() {
        return this.findMatches.map((item, index) => {
          item.checked =
            this.selectedItems.findIndex((s) => s.value === item.value) > -1
          return item
        })
      },
      // FInd the matches for the autocomplete
      findMatches() {
        return this.copiedSearchOptions().filter((item) => {
          // If the search term exists in the object return it
          if (item.label.toUpperCase().match(this.searchText.toUpperCase())) {
            return true
          }
        })
      },
      // Generates the string that is displayed in the input of the control
      selectedItemsLabel() {
        if (this.selectedItems.length > 0) {
          return [
            // Create an empty array of length of whatever is less, number of items to show or selected items count
            ...Array(
              // Determine what is less, number of items to show or number of items selected.
              // Only want to show what ever is less
              Math.min(this.numberOfItemsToShow, this.selectedItems.length)
            ).keys()
          ].reduce((acc, item, index) => {
            // If its not the first entry, prepend the string with a comma and a space
            const spacing = index > 0 ? ', ' : ''
            // Truncate label and append ...
            const label =
              this.truncateLabel > 0 &&
              this.selectedItems[item].label.length > this.truncateLabel
                ? this.selectedItems[item].label.substr(
                    0,
                    this.truncateLabel - 1
                  ) + '...'
                : this.selectedItems[item].label
            // return the string and the matched value.
            return (acc += spacing + label)
          }, '')
        } else return ''
      },
      // Used in the display in the input to show how many items are selected that aren't mentioned.
      // eg. & 3 more.
      totalCountLabel() {
        return ` & ${this.selectedItems.length - this.numberOfItemsToShow} more`
      },
      // This may need to be revisited and become dynamic.
      // That would allow the user to specify the widths for inputs that have long strings
      // This works well when the items displayed are short strings, not so much long strings
      // eg: Monday, tuesday, wednesday
      numberOfItemsToShow() {
        if (this.numberOfItemsToShowProp) {
          return this.numberOfItemsToShowProp
        } else {
          if (this.$refs.multiSelect) {
            const clientWidth = this.$refs.multiSelect.clientWidth
            if (clientWidth < 250) return 1
            else if (clientWidth > 250 && clientWidth < 450) return 2
            else return 3
          } else return 1
        }
      },
      areAllItemsSelected() {
        return this.selectedItems.length === this.matches.length
      }
    },
    methods: {
      handleSelectAll() {
        // Check if "Select all" is checked
        if (this.areAllItemsSelected) {
          // Remove all items if untoggled
          this.selectedItems = []
          // Emit an event so the parent knows what happened
          this.matches.forEach((item, index) => {
            this.$emit('itemRemoved', { item, id: index })
          })
        } else {
          this.selectedItems = this.matches
  
          // Let the parent know
          this.matches.forEach((item, index) => {
            this.$emit('itemAdded', { item, id: index })
          })
        }
        // Emit the selected items and indexes.
        this.$emit('change', {
          selectedItems: this.selectedItems
        })
      },
      handleClickItem(index, id) {
        // Handle the select all here. Returns before getting any further
        if (index === -1) {
          this.handleSelectAll()
          return
        }
        // if only one selection is allowed, clear the old selection so that the new selection is the only one
        if (this.maxSelectionsAllowed === 1) {
          this.selectedItems = []
        }
        // Check to see if the item is already selected and remove it if so
        const foundIndex = this.selectedItems.findIndex(
          (item) => item.value === id
        )
        if (foundIndex > -1) {
          // Remove the item
          this.selectedItems.splice(foundIndex, 1)
          // Emit an event so the parent knows what happened
          this.$emit('itemRemoved', { item: this.selectOptions[index], id })
        } else if (
          !this.maxSelectionsAllowed ||
          this.selectedItems.length < this.maxSelectionsAllowed
        ) {
          // Add the item if it doesnt exist
          this.selectedItems.push(this.selectOptions.find((s) => s.value === id))
          // Let the parent know
          this.$emit('itemAdded', { item: this.selectOptions[index], id })
        }
  
        // if only one selection is allowed, hide the suggestion list after adding the new selection
        if (this.maxSelectionsAllowed === 1) {
          this.handleClickAway()
        }
        // Emit the selected items and indexes.
        this.$emit('change', {
          selectedItems: this.selectedItems
        })
      },
      // Happens when the user changes something
      handleInputInSearchField() {
        this.isSuggestionListVisible = this.searchText.length > 0
        // Set the value set to false so the control knows that nothing is set at the moment.
        this.valueSet = false
      },
      // show the suggestions.
      handleFocus() {
        this.isSuggestionListVisible = true
        this.hasBeenFocused = true
      },
      // Used to allow the user to navigate search results with keyboard
      handleKeyStroke(event, stroke) {
        switch (stroke) {
          case 'up':
            // Don't go above the the first match
            if (this.selectedIndex > -1) this.selectedIndex--
            break
          case 'down':
            // Don't go below the bottom match
            if (this.selectedIndex < this.matches.length) this.selectedIndex++
            break
          // Allow select with the enter key
          case 'enter': {
            this.handleClickItem(this.selectedIndex)
            this.$emit('input', {
              id: this.selectedIndex,
              item: this.matches[this.selectedIndex]
            })
            break
          }
        }
      },
      // Used to close the control when the user clicks outside of it.
      handleClickAway() {
        this.isSuggestionListVisible = false
        // Empty the search field after the list is hidden to prevent it flashing the whole list
        this.searchText = ''
      },
      // Use this a method as computed caches the results
      // Used to prevent mutation of the initial items.
      copiedSearchOptions() {
        return JSON.parse(JSON.stringify(this.selectOptions))
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .dropdown {
    position: relative;
    .selected-label {
      position: absolute;
      top: 4px;
      left: 12px;
      font-size: 11px;
      color: #aaa;
    }
    &:not(:focus-within) {
      .selected-label {
        font-size: 16px;
        top: 12px;
        color: #555;
        &.placeholder-label {
          color: #656565;
        }
      }
    }
  }
  .input-wrapper {
    position: relative;
  }
  .zaui-input {
    box-sizing: border-box;
    font-size: 13px;
    padding-top: 10px;
  }
  .suggestion-list {
    background-color: rgba(255, 255, 255, 0.95);
    border: 1px solid #eee;
    list-style: none;
    display: block;
    margin: 0;
    width: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    z-index: 3;
    text-align: left;
    border-radius: 4px;
    padding: 0px;
    color: #555;
    cursor: pointer;
  }
  .list {
    cursor: pointer;
    padding: 8px;
  }
  .selected {
    background-color: #ddd;
  }
  
  input[type='text'] {
    width: 100%;
  }
  input:focus-visible {
    outline: none;
  }
  .click-away-helper {
    position: relative;
    z-index: 2 !important;
    max-height: 36px;
  }
  .click-away-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1;
  }
  .outer-item {
    padding: 8px;
  }
  .input-wrapper:after {
    content: '⌄';
    position: absolute;
    right: 12px;
    top: 0px;
    font-size: 24px;
    color: #888;
  }
  </style>
  