import MultiSelect from './components/MultiSelect.vue'
// export default so it can be installed like a plugin globally if needed
export default {
    install: (app, options) => {
        app.component('MultiSelect', MultiSelect)
    },
}
// Export as named for use as a component only
export { default as MultiSelect } from "./components/MultiSelect.vue";
