# vue-multiselect browserify example

The `vue-multiselect` package exports a minified bundle (vue-multiselect.min.js)
but also offers the option to import the individual files:

1. Full source: `Multiselect.vue`
2. Business logic only: `multiselectMixin.js`, `MultiselectOption.js`, `pointerMixin.js` and `utils.js`

For importing 1. we need a `vueify` transform and therefore there is a browserify config defined in `package.json` from `vue-multiselect`.

However, we when want to import one of the JS files from `vue-multiselect`,
we do not need the vueify step and we might not have the `vueify` dependency in our project.
Still the browserify config in package.json is leading so it is impossible to import the JS files without having `vueify` as dependency.

When this config is deleted from `vue-multiselect`, we need to define the `vueify` transform in our own build.
It is important apply the transform *globally* or else the transform is only applied to the project files and not the imported files from `node_modules`. 

See package.json how this is not.

## Installing and running

There are two apps in this project. One with `vueify` transform (importing the Vue file and useing Vue files in the project) and another with only JS files so there is not `vueify` transform.

### With `vueify`

Run `npm install` to get all the dependencies.

Remove the `browserify` config from `node_modules/vue-multiselect/package.json` to see that the build still works.

Run `npm run dev` or `npm run build` to build the bundle.

Open `index.html` to view the 'app'.

### Without `vueify`

Go the to the `js-only` branch: `git checkout js-only`.
Reinstall the `node_modules`: `rm -rf node_modules`.

Follow the same steps as before to install, build and run the app.
