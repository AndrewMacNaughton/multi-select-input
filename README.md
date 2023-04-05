# Multi Select Input.

This is a reusable multiselect control that allows the user to select multiple items. It includes keyboard navigation, smart truncating (may need work!). This contains styling which an easily be overridden using :deep(selector). If you edit any of the reusable components and publish them, please ensure they are versioned correctly using standard npm style versioning and that they maintain backward compatability for previous versions whereever possible. Please ensure that you only edit this component when something absolutely cannot be configured/styled from the parent component in your project.

## Usage

### Install

Currently the best way to use this component is copy the Vue file locally and access it like any other Vue component. There is hope that this will eventually be loaded as a GitHub Package and that you will be able to install via npm.

### How to use

```
<script>
import MultiSelectInput from '@/components/ZauiReusableComponents/MultiSelectInput/MultiSelectInput.vue'
export default {
    components:{
        MultiSelectInput
    },
    data(){
        return {
            selectOptions:[{
                value: 'Item 1'
            },{
                value: 'Item 2'
            },{
                value: 'Item 3'
            },{
                value: 'Item 4'
            }]
            initialSelectedItems:[{
                value: 'Item 1',
            },{
                value: 'Item 4',
            }]
        }
    },
    methods:{
        handleMultiSelectChanged(event){
            // do some stuff here.
        }
    }
}

</script>

<template>
    <multi-select-input        
        :initialSelectedItems="initialSelectedItems""
        :selectOptions="primaryValue"        
        @change="handleMultiSelectChanged"
    />
</template>
```

### Props
| Prop                   | Description     | Type         | Required | Default |
| ---------------------- | --------------- | ------------ | -------- | ------- |
| selectOptions | The options that will appear in the list. | Object {value:String} | true | - |
| initialSelectedItems | The items that are already selected in the list on rendering | Array, String| false | [] |

### Events

| Event Name      | Description                                                                | Callback Arguments |
| --------------- | -------------------------------------------------------------------------- | ------------------ |
| itemAdded | When an item is added to the list | {item: item that was just selected, id} |
| itemRemoved | When an item is removed from the list | {item: item that was just removed, id} | 
| change | When an item is added or removed. Fires after itemAdded/Removed | {selectedItems, selectedIndexes} |
| input | When an item is selected via key strokes | {id,item} |

### Slots
| Slot Name | Description|
| --- | --- |
| icon-slot | Can be used to add a search icon or something similar
