# Multi Select Input.

This is a reusable multiselect control that allows the user to select multiple items. It includes keyboard navigation, smart truncating (may need work!). This contains styling which an easily be overridden using :deep(selector). If you edit any of the reusable components and publish them, please ensure they are versioned correctly using standard npm style versioning and that they maintain backward compatability for previous versions whereever possible. Please ensure that you only edit this component when something absolutely cannot be configured/styled from the parent component in your project.

## Usage

### Install

If you have already created or your file already has an .npmrc file wiht a valid token, please skip directly to step 3.

1. To install this you will need to first create a Personal Access Token (Classic) at github.com [following the instructions in this link](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).<br>
 **<em>Please only select package:read as the only scope</em>**<br/>

2. To install the project in a new project you will need to add a .npmrc file to the root of the project with the following contents. The comment is designed to be left in as that is the syntax from NPM. If the file already exists, please update the token with your own token.
    ```
       @zaui:registry=https://npm.pkg.github.com
       //npm.pkg.github.com/:_authToken=YOUR_TOKEN_FROM_ABOVE_GOES_HERE
    ```
    
3. Once you have that in place you can simply do an `npm install @zaui/vue3-multiselect`.<br>

If your are getting 401's, thats likely because either your token is expired or incorrect so please ensure that your access token is correctly in place. Please not you only need to complete steps 1 and 2 once per project no matter how many Zaui packages you want

### How to use

You can use this as either a global component or adhoc as you need it. To use globally, add the following in your main.js
``` javascript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import MultiSelect  from 'MultiSelect'
import "multiselect/dist/style.css"

const app = createApp(App)
app.use(MultiSelect)
app.mount('#app')
```

``` javascript
<script>
// Leave out this line if using globally
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
