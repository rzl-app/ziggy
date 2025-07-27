# Rzl Ziggy – Fully-Typed Laravel Route Generator for JS/TS
(Forked from [Ziggy](https://github.com/tighten/ziggy) by [Tighten](https://github.com/tighten)).

[![Latest Version on Packagist](https://img.shields.io/packagist/v/rzl-app/ziggy.svg?style=flat)](https://packagist.org/packages/rzl-app/ziggy)
[![Downloads on Packagist](https://img.shields.io/packagist/dt/rzl-app/ziggy.svg?style=flat)](https://packagist.org/packages/rzl-app/ziggy)
[![Latest Version on NPM](https://img.shields.io/npm/v/rzl-app-ziggy.svg?style=flat)](https://npmjs.com/package/rzl-app-ziggy)
[![Downloads on NPM](https://img.shields.io/npm/dt/rzl-app-ziggy.svg?style=flat)](https://npmjs.com/package/rzl-app-ziggy)
[![GitHub](https://img.shields.io/badge/GitHub-rzl--app%2Frzl--ziggy-181717?logo=github)](https://github.com/rzl-app/ziggy)
[![Repo on GitHub](https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded)](https://github.com/rzl-app)

**Rzl Ziggy** is a customized fork of [Ziggy](https://github.com/tighten/ziggy) that provides a fully-typed JavaScript `route()` function mimicking Laravel's routing, with additional features such as extended config handling and attribute stubs.

This package is **not officially maintained by Tighten**.

It is framework-agnostic and can be used with **Vue**, **React**, **Vanilla JS**, and other JavaScript-based frontends that rely on Laravel's routing system.
> ⚡️ Includes a Vite plugin for auto-generating route definitions on the fly from Laravel!

---

- [**Installation**](#installation)
- [**Usage**](#usage)
    - [`route()` function](#route-function)
    - [`Router` class](#router-class)
    - [Route-model binding](#route-model-binding)
    - [TypeScript Support](#typescript-support)
- [**JavaScript frameworks**](#javascript-frameworks)
    - [Generating and importing Rzl Ziggy's configuration](#generating-and-importing-rzl-ziggys-configuration)
    - [Importing the `route()` function](#importing-the-route-function)
    - [Vue](#vue)
    - [React](#react)
    - [SPAs or separate repos](#spas-or-separate-repos)
- [**Publish Config File**](#publish-config-file)
- [**Filtering Routes**](#filtering-routes)
    - [Including/excluding routes](#includingexcluding-routes)
    - [Filtering with groups](#filtering-with-groups)
- [**Routes File Generator**](#routes-file-generator)
    - [Using JavaScript/TypeScript](#using-javascript-or-typescript)
    - [Output Name File And Path To Generate](#output-name-file-and-path-to-generate)
- [**Automatically Regenerates File Routes**](#automatically-regenerates-file-routes)
- [**Other**](#other)
- [**Contributing**](#contributing)
 
---
## Installation

Install Rzl Ziggy in your Laravel backend with Composer:

```bash
composer require rzl-app/ziggy
```

Install Rzl Ziggy in your frontend or SPA with NPM:

```bash
npm i rzl-app-ziggy
```

Add the ***`@rzlRoutes`*** Blade directive to your main layout (_before_ your application's JavaScript), and the `route()` helper function will be available globally!

> By default, the output of the `@rzlRoutes` Blade directive includes a list of all your application's routes and their parameters. This route list is included in the HTML of the page and can be viewed by end users. To configure which routes are included in this list, or to show and hide different routes on different pages, see [Filtering Routes](#filtering-routes).

---
## Usage

### `route()` function

Rzl Ziggy's `route()` function works like [Laravel's `route()` helper](https://laravel.com/docs/helpers#method-route)—you can pass it the name of a route, and the parameters you want to pass to the route, and it will generate a URL.

#### Basic usage

```php
Route::get('posts', fn (Request $request) => /* ... */)->name('posts.index');
```

```js
route('posts.index');                  // ➔ '/posts'
route('posts.index', {}, true);        // ➔ 'https://rzl.test/posts'
route('posts.index', null, true);      // ➔ 'https://rzl.test/posts'
route('posts.index', undefined, true); // ➔ 'https://rzl.test/posts'
```

#### Absolute URL

The third argument determines whether the generated URL should include the origin.
By default, it is false, meaning the URL will be returned without the origin.
To include the origin in the result, simply pass true as the third argument.

> ⚠️ Passing a non-boolean value except null or undefined as the third argument will throw an error.

```js
route('posts.index');                  // ➔ '/posts'
route('posts.index', {}, false);       // ➔ '/posts'
route('posts.index', null, true);      // ➔ 'https://rzl.test/posts'
route('posts.index', undefined, true); // ➔ 'https://rzl.test/posts'
```
> ⚠️ Passing a non-boolean value like null or undefined as the third argument will force to false.
```js
route('posts.index', {}, null);             // ➔ '/posts'
route('posts.index', {}, undefined);        // ➔ '/posts'
route('posts.index', null, undefined);      // ➔ '/posts'
route('posts.index', undefined, undefined); // ➔ '/posts'
```
#### Parameters

```php
Route::get('posts/{post}', fn (Post $post) => /* ... */)->name('posts.show');
```

```js
route('posts.show', [1], true);                    // ➔ 'https://rzl.test/posts/1'      
route('posts.show', [1]);                          // ➔ '/posts/1'      
route('posts.show', [{}]);                         // ➔  Error.
// Error: Object passed as 'post' parameter is missing route model binding key 'undefined'.
// The first parameter (index 0) is must be passed as route parameters, e.g., { post }.
route('posts.show', [1, { other: "test" }]);       // ➔ '/posts/1?other=test'
route('posts.show', { post: 1 });                  // ➔ '/posts/1'
```

> ⚠️ Warning: Unknown route parameters in Laravel will be appended as query strings with empty values.
```js
route('posts.show', [1, "unknown-route-params"]);  // ➔ '/posts/1?unknown-route-params='      
```

#### Multiple parameters

```php
Route::get('venues/{venue}/events/{event}', fn (Venue $venue, Event $event) => /* ... */)->name('venues.events.show');
```

```js
route('venues.events.show', [1, 2], true);                   // ➔ 'https://rzl.test/venues/1/events/2'
route('venues.events.show', [1, 2]);                         // ➔ '/venues/1/events/2'
route('venues.events.show', [1, 2, { other: "test" }]);      // ➔ '/venues/1/events/2?other=test'
route('venues.events.show', [1, {}]);                        // ➔ Error.  
// Error: Object passed as 'event' parameter is missing route model binding key 'undefined'.
// The second parameter (index 1) is must be passed as route parameters, e.g., { event }.
route('venues.events.show', { venue: 1, event: 2 });         // ➔ '/venues/1/events/2'
```
> ⚠️ Warning: Unknown route parameters in Laravel will be appended as query strings with empty values.
```js
route('venues.events.show', [1, 2, "unknown-route-params"]); // ➔ '/venues/1/events/2?unknown-route-params='
```

#### Query parameters

Rzl Ziggy adds arguments that don't match any named route parameters as query parameters:

```php
Route::get('venues/{venue}/events/{event}', fn (Venue $venue, Event $event) => /* ... */)->name('venues.events.show');
```

```js
route('venues.events.show', {
    venue: 1,
    event: 2,
    page: 5,
    count: 10,
});
// '/venues/1/events/2?page=5&count=10'
route('venues.events.show', {
    venue: 1,
    event: 2,
    page: 5,
    count: 10,
    type: "active"
}, true);
// 'https://rzl.test/venues/1/events/2?page=5&count=10&type=active'
```

If you need to pass a query parameter with the same name as a route parameter, nest it under the special `_query` key:

```js
route('venues.events.show', {
    venue: 1,
    event: 2,
    _query: {
        event: 3,
        page: 5,
    },
});
// '/venues/1/events/2?event=3&page=5'
route('venues.events.show', {
    venue: 1,
    event: 2,
    type: "disable"
    _query: {
        event: 3,
        page: 5,
        type: "active",
    },
}, true);
// 'https://rzl.test/venues/1/events/2?event=3&page=5&type=active'
```

Like Laravel, Rzl Ziggy automatically encodes boolean query parameters as integers in the query string:

```js
route('venues.events.show', {
    venue: 1,
    event: 2,
    _query: {
        draft: false,
        overdue: true,
    },
}, true);
// 'https://rzl.test/venues/1/events/2?draft=0&overdue=1'
route('venues.events.show', {
    venue: 1,
    event: 2,
    active: true,
    _query: {
        draft: false,
        overdue: true,
    },
});
// '/venues/1/events/2?active=1&draft=0&overdue=1'
```

#### Default parameter values

Rzl Ziggy supports default route parameter values ([Laravel docs](https://laravel.com/docs/urls#default-values)).

```php
Route::get('{locale}/posts/{post}', fn (Post $post) => /* ... */)->name('posts.show');
```

```php
// app/Http/Middleware/SetLocale.php

URL::defaults(['locale' => $request->user()->locale ?? 'de']);
```

```js
route('posts.show', { post: 1 }, true);           // ➔ 'https://rzl.test/de/posts/1'
route('posts.show', { post: 5, type: "active" }); // ➔ '/de/posts/5?type=active'
```

#### Examples

HTTP request with `axios`:

```js
const post = { id: 1, title: 'Rzl Ziggy Stardust' };

return axios.get(route('posts.show', post)).then((response) => response.data);
```
---
### ⚠️ Warning: Calling `route()` Without Arguments

- #### Calling `route()` without a name (or with undefined / null) can cause runtime errors when used in a string context.

  ❌ Incorrect usage:


  ```js
  href={route()}
  console.log(`${route()}`)
  route(null)
  route(undefined)
  ```
  These patterns may throw an error, such as:
  ```js
  - `Uncaught TypeError: can't access property "toString", e is undefined.`

  - `Rzl-Ziggy Error: Function 'route()' was implicitly coerced to a primitive without a name.`

  - `Rzl-Ziggy Error - Function route() was called without a name and used as a string. Pass a valid route name, or use route().current() to get the current route name, or...`
  
  - `Rzl-Ziggy Error: route() was called without a route name and then implicitly converted to a string. This typically happens when route() is used in a string context...`
  ```
  > ℹ️ The actual error message may vary depending on your environment or build process, but it typically happens because route() without a name returns an object that can't be coerced to a string.

  ✅ Correct usage:
  ```js
  route('events.index');    
  // ➔ Returns the full URL
  route().params            
  // ➔ Retrieve the current route with all params, queryParams and routeParams.
  route().queryParams       
  // ➔ Retrieve all search query params only (except params route in laravel route) in the current route: route().queryParams
  route().routeParams       
  // ➔ Retrieve only params route in laravel route (except query search params) in the current route: route().routeParams
  route().current()         
  // ➔ Check the current route name
  route().has('route.name') 
  // ➔ Check if a route exists
  ```
  > 💡 To safely introspect the current route, use route() as an object:
  >  - [route().current()](#check-the-current-route-routecurrent)
  >  - [route().has('route.name')](#check-if-a-route-exists-routehas)
  >  - [route().params](#retrieve-the-current-route-params-routeparams)
  >  - [route().queryParams](#retrieve-all-search-query-params-only-except-params-route-in-laravel-route-in-the-current-route-routequeryparams)
  >  - [route().routeParams](#retrieve-only-params-route-in-laravel-route-except-query-search-params-in-the-current-route-routerouteparams)

---

### `Router` class

Calling Rzl Ziggy's `route()` function with no arguments will return an instance of its JavaScript `Router` class, which has some other useful properties and methods.

#### Check the current route: `route().current()`

```js
// Laravel route called 'events.index' with URI '/events'
// Current window URL is https://rzl.test/events

route().current();               // ➔ 'events.index'
route().current('events.index'); // ➔ true
route().current('events.*');     // ➔ true
route().current('events.show');  // ➔ false
```

#### `route().current(...)` optionally accepts parameters as its second argument, and will check that their values also match in the current URL:

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all

route().current('venues.events.show', [1]);                        // ➔ true
route().current('venues.events.show', [6]);                        // ➔ false
route().current('venues.events.show', [1, 5]);                     // ➔ false
route().current('venues.events.show', [1, 2]);                     // ➔ true
route().current('venues.events.show', [1, { hosts: 'all' }]);      // ➔ Error
//* Error: Object passed as 'event' parameter is missing route model binding key 'undefined'.
//* Error: (Cause array index 1 is must passing as routeParams, aka: {event}). 
route().current('venues.events.show', [1, 2, { hosts: 'all' }]);   // ➔ true
route().current('venues.events.show', [2, 2, { hosts: 'all' }]);   // ➔ false
route().current('venues.events.show', [1, { hosts: 'single' }]);   // ➔ Error 
//* Error: Object passed as 'event' parameter is missing route model binding key 'undefined'.
//* Error: (Cause array index 1 is must passing as routeParams, aka: {event}).
route().current('venues.events.show', [1, 5, { hosts: 'single' }]);// ➔ false
route().current('venues.events.show', [2, 2, { hosts: 'all' }]);   // ➔ false
route().current('venues.events.show', { venue: 1 });               // ➔ true
route().current('venues.events.show', { venue: 1, event: 2 });     // ➔ true
route().current('venues.events.show', { hosts: 'all' });           // ➔ true
route().current('venues.events.show', { venue: 6 });               // ➔ false
```

#### Check if a route exists: `route().has(...)`

```js
// Laravel app has only one named route, 'home'

route().has('home');   // => true
route().has('orders'); // => false
```

#### Retrieve the current route params: `route().params`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all
 
const test = route().params;
console.log(test)         // ➔ { venue: '1', event: '2', hosts: 'all' }
console.log(test.venue)   // ➔ "1"
console.log(test.hosts)   // ➔ "all"
console.log(test.other)   // ➔ undefined
```

> Note: parameter values retrieved with `route().params` will always be returned as strings or undefined.

#### Retrieve only params route in laravel route (except query search params) in the current route: `route().routeParams`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test

const test = route().routeParams;
console.log(test)         // ➔ { venue: '1', event: '2' }
console.log(test.venue)   // ➔ "1"
console.log(test.hosts)   // ➔ undefined
console.log(test.other)   // ➔ undefined

```

> Note: parameter values retrieved with `route().routeParams` will always be returned as strings or undefined.

#### Retrieve all search query params only (except params route in laravel route) in the current route: `route().queryParams`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
 
const test = route().queryParams;
console.log(test)         // ➔ { hosts: 'all', type: 'test' }
console.log(test.type)    // ➔ "test"
console.log(test.hosts)   // ➔ "all"
console.log(test.venue)   // ➔ undefined
console.log(test.other)   // ➔ undefined
```

> Note: parameter values retrieved with `route().queryParams` will always be returned as strings or undefined.

### Route-model binding

Rzl Ziggy supports Laravel's [route-model binding](https://laravel.com/docs/routing#route-model-binding), and can even recognize custom route key names. If you pass `route()` a JavaScript object as a route parameter, Rzl Ziggy will use the registered route-model binding keys for that route to find the correct parameter value inside the object. If no route-model binding keys are explicitly registered for a parameter, Rzl Ziggy will use the object's `id` key.

```php
// app/Models/Post.php

class Post extends Model
{
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
```

```php
Route::get('blog/{post}', function (Post $post) {
    return view('posts.show', ['post' => $post]);
})->name('posts.show');
```

```js
const post = {
    id: 3,
    title: 'Introducing Rzl Ziggy v1',
    slug: 'introducing-rzl-ziggy-v1',
    date: '2020-10-23T20:59:24.359278Z',
};

// Rzl Ziggy knows that this route uses the 'slug' route-model binding key:

route('posts.show', post);       // ➔ '/blog/introducing-rzl-ziggy-v1'
route('posts.show', post, true); // ➔ 'https://rzl.test/blog/introducing-rzl-ziggy-v1'
```

Rzl Ziggy also supports [custom keys](https://laravel.com/docs/routing#customizing-the-key) for scoped bindings declared directly in a route definition:

```php
Route::get('authors/{author}/photos/{photo:uuid}', fn (Author $author, Photo $photo) => /* ... */)
    ->name('authors.photos.show');
```

```js
const photo = {
    uuid: '714b19e8-ac5e-4dab-99ba-34dc6fdd24a5',
    filename: 'sunset.jpg',
}

route('authors.photos.show', [{ id: 1, name: 'John' }, photo], true);
// 'https://rzl.test/authors/1/photos/714b19e8-ac5e-4dab-99ba-34dc6fdd24a5'
```

### TypeScript Support

Rzl Ziggy includes TypeScript type definitions, and an Artisan command that can generate additional type definitions to enable route name and parameter autocompletion.

To generate route types, run the `rzl-ziggy:generate` command with the `--types` or `--types-only` option:

```bash
php artisan rzl-ziggy:generate --types
```

To make your IDE aware that Rzl Ziggy's `route()` helper is available globally, and to type it correctly, add a declaration like this in a `.d.ts` file somewhere in your project:

```ts
import { route as routeFn } from 'rzl-app-ziggy';

declare global {
    var route: typeof routeFn;
}
```

If you don't have [Rzl Ziggy's NPM package installed](https://www.npmjs.com/package/rzl-app-ziggy), add the following to your `jsconfig.json` or `tsconfig.json` to load Rzl Ziggy's types from your vendor directory:

```json
{
    "compilerOptions": {
        "paths": {
            "rzl-app-ziggy": ["./vendor/rzl-app/ziggy"]
        }
    }
}
```

---
## JavaScript frameworks

> [!NOTE]
> Many applications don't need the additional setup described here—the `@rzlRoutes` Blade directive makes Rzl Ziggy's `route()` function and config available globally, including within bundled JavaScript files.

If you are not using the `@rzlRoutes` Blade directive, you can import Rzl Ziggy's `route()` function and configuration directly into JavaScript/TypeScript files.

### Generating and importing Rzl Ziggy's configuration

Rzl Ziggy provides an Artisan command to output its config and routes to a file:

```bash
php artisan rzl-ziggy:generate
```

This command places your configuration in `resources/js/rzl-ziggy/routes/index.ts` by default, but you can customize this path by passing an argument to the Artisan command or setting in the laravel config file `rzl-ziggy.output.path.main` for name file [Output Name File And Path To Generate](#output-name-file-and-path-to-generate) and `rzl-ziggy.lang` valid value is (`ts` or `js`) [Using JavaScript or TypeScript](#using-javascript-or-typescript).

The file `rzl-ziggy:generate` creates looks something like this:

#### For TypeScript:
```ts
// resources/js/rzl-ziggy/routes/index.ts

/** ---------------------------------
  * * ***Generates files/routes of app based on Laravel route names.***
  * ---------------------------------
  *
  * **This behaves similarly to `rzl-ziggy:generate`.**
  * 
  * _* **TypeScript (TS) Mode.**_
  */
export const appRoutes: string = `{
  "url": "https://rzl.test",
  "port": null,
  "routes": {
    "home": {
      "uri": "/",
      "methods": ["GET", "HEAD"],
      "domain": null
    },
    "login": {
      "uri": "login",
      "methods": ["GET", "HEAD"],
      "domain": null
    }
  }
}`;
 
```
#### For JavaScript:
```js
// resources/js/rzl-ziggy/routes/index.js

/** ---------------------------------
  * * ***Generates files/routes of app based on Laravel route names.***
  * ---------------------------------
  *
  * **This behaves similarly to `rzl-ziggy:generate`.**
  * 
  * _* **JavaScript (JS) Mode.**_
  */
export const appRoutes = `{
  "url": "https://rzl.test",
  "port": null,
  "routes": {
    "home": {
      "uri": "/",
      "methods": ["GET", "HEAD"],
      "domain": null
    },
    "login": {
      "uri": "login",
      "methods": ["GET", "HEAD"],
      "domain": null
    }
  }
}`;
 
```

### Importing the `route()` function

You can import Rzl Ziggy like any other JavaScript library.  
However, without the `@rzlRoutes` Blade directive, the route config (typically named `appRoutes`) is not available globally.

This means:

- You must manually pass the config to the `route()` function.
- Since `appRoutes` is a string, you need to parse it using `JSON.parse()` before passing it in.

> ℹ️ Path import `import { appRoutes } from './rzl-ziggy/routes/index.js';` depend from your setting at config php file, see: [Output Name File And Path To Generate](#output-name-file-and-path-to-generate).

```js
import { route } from '../../vendor/rzl-app/ziggy';
import { appRoutes } from './rzl-ziggy/routes/index.js';

route('home', null, false, JSON.parse(appRoutes));
route('home', undefined, undefined, JSON.parse(appRoutes));
```

To simplify importing the `route()` function, you can create an alias to the vendor path:

```js
// vite.config.js

export default defineConfig({
    resolve: {
        alias: {
            'rzl-app-ziggy': path.resolve('vendor/rzl-app/ziggy'),
        },
    },
});
```

Now your imports can be shortened to:

```js
import { route } from 'rzl-app-ziggy';
```

### Vue

Rzl Ziggy includes a Vue plugin to make it easy to use the `route()` helper throughout your Vue app:

```js
import { createApp } from 'vue';
import { rzlZiggyVue } from 'rzl-app-ziggy';
import App from './App.vue';

createApp(App).use(rzlZiggyVue);
```

Now you can use the `route()` function anywhere in your Vue components and templates:

```vue
<a class="nav-link" :href="route('home')">Home</a>
```

With `<script setup>` in Vue 3 you can use `inject` to make the `route()` function available in your component script:

```vue
<script setup>
import { inject } from 'vue';

const route = inject('route');
</script>
```

If you are not using the `@rzlRoutes` Blade directive, import Rzl Ziggy's configuration too and pass it to `.use()`:


> ℹ️ Path import `import { appRoutes } from './rzl-ziggy/routes/index.js';` depend from your setting at config php file, see: [Output Name File And Path To Generate](#output-name-file-and-path-to-generate). 

```js
import { createApp } from 'vue';
import { rzlZiggyVue } from 'rzl-app-ziggy';
import { appRoutes } from './rzl-ziggy/routes/index.js';
import App from './App.vue';

createApp(App).use(rzlZiggyVue, JSON.parse(appRoutes));
```

If you're using TypeScript, you may need to add the following declaration to a `.d.ts` file in your project to avoid type errors when using the `route()` function in your Vue component templates:

```ts
declare module 'vue' {
    interface ComponentCustomProperties {
        route: typeof routeFn;
    }
}
```

### React

Rzl Ziggy includes a `useRoute()` hook to make it easy to use the `route()` helper in your React app:

```jsx
import React from 'react';
import { useRoute } from 'rzl-app-ziggy';

export default function PostsLink() {
    const route = useRoute();

    return <a href={route('posts.index')}>Posts</a>;
}
```

If you are not using the `@rzlRoutes` Blade directive, import Rzl Ziggy's configuration too and pass it to `useRoute()`:

> ℹ️ Path import `import { appRoutes } from './rzl-ziggy/routes/index.js';` depend from your setting at config php file, see: [Output Name File And Path To Generate](#output-name-file-and-path-to-generate). 

```jsx
import React from 'react';
import { useRoute } from 'rzl-app-ziggy';
import { appRoutes } from './rzl-ziggy/routes/index.js';

export default function PostsLink() {
    const route = useRoute(JSON.parse(appRoutes));

    return <a href={route('posts.index')}>Posts</a>;
}
```

You can also make the `Rzl Ziggy` config object available globally, so you can call `useRoute()` without passing Rzl Ziggy's configuration to it every time:

```js
// app.js
import { appRoutes } from './rzl-ziggy/routes/index.js';
globalThis.appRoutes = JSON.parse(appRoutes);
```

### SPAs or separate repos

Rzl Ziggy's `route()` function is available as an NPM package, for use in JavaScript projects managed separately from their Laravel backend (i.e. without Composer or a `vendor` directory). You can install the NPM package with `npm install rzl-app-ziggy`.

To make your routes available on the frontend for this function to use, you can either run `php artisan rzl-ziggy:generate` and add the generated config file to your frontend project, or you can return Rzl Ziggy's config as JSON from an endpoint in your Laravel API (see [Retrieving Rzl Ziggy's config from an API endpoint](#retrieving-rzl-ziggys-config-from-an-api-endpoint) below for an example of how to set this up).

---
## Publish Config File

You can customize the default configuration of Rzl Ziggy by publishing the `rzl-ziggy.php` file to your `config` directory.
Run the following command in your terminal:

```bash
php artisan vendor:publish --tag=rzl-ziggy
```
---
## Filtering Routes

Rzl Ziggy supports filtering the list of routes it outputs, which is useful if you have certain routes that you don't want to be included and visible in your HTML source.

> [!IMPORTANT]
> Hiding routes from Rzl Ziggy's output is not a replacement for thorough authentication and authorization. Routes that should not be accessibly publicly should be protected by authentication whether they're filtered out of Rzl Ziggy's output or not.

### Including/excluding routes

To set up route filtering, create a config file in your Laravel app at `config/rzl-ziggy.php` and add **either** an `only` or `except` key containing an array of route name patterns.

> Note: You have to choose one or the other. Setting both `only` and `except` will disable filtering altogether and return all named routes.

```php
// config/rzl-ziggy.php

return [
    'only' => ['home', 'posts.index', 'posts.show'],
];
```

You can use asterisks as wildcards in route filters. In the example below, `admin.*` will exclude routes named `admin.login`, `admin.register`, etc.:

```php
// config/rzl-ziggy.php

return [
    'except' => ['_debugbar.*', 'horizon.*', 'admin.*'],
];
```
### Filtering with groups

You can also define groups of routes that you want make available in different places in your app, using a `groups` key in your config file:

```php
// config/rzl-ziggy.php

return [
    'groups' => [
        'admin' => ['admin.*', 'users.*'],
        'author' => ['posts.*'],
    ],
];
```

Then, you can expose a specific group by passing the group name into the `@rzlRoutes` Blade directive:

```blade
{{-- authors.blade.php --}}

@rzlRoutes('author')
```

To expose multiple groups you can pass an array of group names:

```blade
{{-- admin.blade.php --}}

@rzlRoutes(['admin', 'author'])
```

> Note: Passing group names to the `@rzlRoutes` directive will always take precedence over your other `only` or `except` settings.

---
## Routes File Generator

### Using JavaScript or TypeScript

You can also format your front-end using JavaScript or TypeScript when running the Artisan commands `php artisan rzl-ziggy:generate` or `php artisan rzl-ziggy:generate --types`:

```php
// config/rzl-ziggy.php

return [
  /** The language used for the generated route file.
   *
   * Valid options:
   * - "ts" (TypeScript, .ts)
   * - "js" (JavaScript, .js)
   *
   * Default: "ts"
   *
   * Notes:
   * - If this config value (`rzl-ziggy.lang`) is invalid or empty, it defaults to "ts".
   * - You can override it using the CLI option: `php artisan rzl-ziggy:generate --lang=...`
   * - If the CLI `--lang` value is invalid, it falls back to this config value.
   * - If both are invalid, "ts" will be used as a safe fallback.
   */
  "lang" => "ts",

  // other you config...
];
```

### Output Name File And Path To Generate

You can also set the output location when running the Artisan command `php artisan rzl-ziggy:generate` or `php artisan rzl-ziggy:generate --types`:

> ⚠️ Be careful when naming the folder and file: if the folder name and filename are the same
>    (e.g. folder `routes/` and file `routes.ts`), a file with the same name inside the folder
>    may be accidentally overwritten.
```php
// config/rzl-ziggy.php

return [
  /** Configuration for output paths and file naming during route generation.
   *
   * This controls where the generated JavaScript/TypeScript route file will be placed
   * and what it will be named. You can override these settings using CLI options.
   */
  "output" => [
    /** The name of the generated route file (without extension).
     *
     * Example: "index" will become "index.ts" or "index.js" depending on the selected `lang`.
     *
     * Notes:
     * - The extension will be automatically added based on the `lang` value ("ts" or "js").
     * - If this value is invalid or empty, it defaults to "index".
     * - You can override this config using the CLI option: `--name=...`.
     * - If both are invalid, "index" will be used as the safe default.
     */
    "name" => "index", 

    /** Paths for output destination of the generated route files. */
    "path" => [
      /** The output folder path for the main generated route file.
       *
       * Example: "resources/js/rzl-ziggy/routes" will result in something like "resources/js/rzl-ziggy/routes/index.ts"
       *
       * Notes:
       * - Do **not** prefix the path with "/" or "\\" — it should be relative to the project root.
       * - This path can be overridden using the CLI option: `--path=...`
       * - If the CLI `--path` is null, empty, or omitted, and this config value is also empty or invalid,
       *   it will default to: `"resources/js/rzl-ziggy/routes"`.
       * - If the provided path is invalid (e.g. not writable or not a directory), an error will be thrown.
       * - This path does not include the filename or extension — only the folder.
       * - ⚠️ Be careful when naming the folder and file: if the folder name and filename are the same
       *   (e.g. folder `routes/` and file `routes.ts`), a file with the same name inside the folder
       *   may be accidentally overwritten.
       */
      "main" => "resources/js/rzl-ziggy/routes",
    ]
  ],
  
  // other you config...
];
```

## Automatically Regenerates File Routes

#### Rzl Ziggy includes a built-in Vite plugin that automatically generates a route index file (index.ts or index.js) based on your Laravel named routes (location depends your setting, see: [Output Name File And Path To Generate](#output-name-file-and-path-to-generate)).
#### - Works the same as:
```bash
php artisan rzl-ziggy:generate
# or
php artisan rzl-ziggy:generate --types
```
#### - Auto-regenerates the file whenever:
    - You change .env (e.g. APP_URL)
    - You update any routes/*.php file
    - No need to run manual commands—works live in development (npm run dev).

#### - Setting in your vite.config.ts or vite.config.js, register the plugin:

```js
import rzlZiggyPlugin from 'rzl-app-ziggy/vite-plugin'

export default defineConfig({
  plugins: [
    rzlZiggyPlugin({
      // ...you can replace default options.
    }),

    // ...other your plugin
  ],
})
```
<details>
<summary>Laravel Mix plugin example</summary>
<p></p>

```js
const mix = require('laravel-mix');
const { exec } = require('child_process');

mix.extend('rzlZiggy', new class {
    register(config = {}) {
        this.watch = config.watch ?? ['routes/**/*.php'];
        this.path = config.path ?? '';
        this.enabled = config.enabled ?? !Mix.inProduction();
    }

    boot() {
        if (!this.enabled) return;

        const command = () => exec(
            `php artisan rzl-ziggy:generate ${this.path}`,
            (error, stdout, stderr) => console.log(stdout)
        );

        command();

        if (Mix.isWatching() && this.watch) {
            ((require('chokidar')).watch(this.watch))
                .on('change', (path) => {
                    console.log(`${path} changed...`);
                    command();
                });
        };
    }
}());

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [])
    .rzlZiggy();
```
</details>

---
## Other

### TLS/SSL termination and trusted proxies

<!-- Or: What to do if your app is served over `https` but Rzl Ziggy's `route()` helper generates `http` URLs -->

If your application is using [TLS/SSL termination](https://en.wikipedia.org/wiki/TLS_termination_proxy) or is behind a load balancer or proxy, or if it's hosted on a service that is, Rzl Ziggy may generate URLs with a scheme of `http` instead of `https`, even if your app URL uses `https`. To fix this, set up your Laravel app's trusted proxies according to the documentation on [Configuring Trusted Proxies](https://laravel.com/docs/requests#configuring-trusted-proxies).

### Using `@rzlRoutes` with a Content Security Policy

A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) may block inline scripts, including those output by Rzl Ziggy's `@rzlRoutes` Blade directive. If you have a CSP and are using a nonce to flag safe inline scripts, you can pass the nonce to the `@rzlRoutes` directive and it will be added to Rzl Ziggy's script tag:

```php
@rzlRoutes(nonce: 'your-nonce-here')
```

### Disabling the `route()` helper

If you only want to use the `@rzlRoutes` directive to make Rzl Ziggy's configuration available in JavaScript, but don't need the `route()` helper function, set the `rzl-ziggy.skip-route-function` config to `true`.

### Retrieving Rzl Ziggy's config from an API endpoint

If you need to retrieve Rzl Ziggy's config from your Laravel backend over the network, you can create a route that looks something like this:

```php
// routes/api.php

use RzlApp\Ziggy\RzlZiggy;

Route::get('rzl-ziggy', fn () => response()->json(new RzlZiggy));
```

---
## Contributing

This project is heavily inspired by and based on [Ziggy](https://github.com/tighten/ziggy), originally developed by the team at Tighten.

## Original Authors of Ziggy:
- [Daniel Coulbourne](https://twitter.com/DCoulbourne)
- [Jake Bathman](https://twitter.com/jakebathman)
- [Matt Stauffer](https://twitter.com/stauffermatt)
- [Jacob Baker-Kretzmar](https://twitter.com/bakerkretzmar)
- [All contributors](https://github.com/rzl-app/ziggy/contributors)

## Additional Customization by:
- [Rzl App](https://github.com/rzl-app)


Special thanks to [Caleb Porzio](http://twitter.com/calebporzio), [Adam Wathan](http://twitter.com/adamwathan), and [Jeffrey Way](http://twitter.com/jeffrey_way) for help solidifying the idea.

---
## Security

Please review our [security policy](../../security/policy) on how to report security vulnerabilities.

---
## License

Rzl Ziggy is open-source software released under the MIT license. See [LICENSE](LICENSE) for more information.

---
## Credits

- Forked and extended from [Ziggy by Tighten.](https://github.com/tighten/ziggy)
- Inspired by the work of Daniel Coulbourne, Jake Bathman, Matt Stauffer, and Jacob Baker-Kretzmar.
- Custom features and enhancements maintained by [Rizalfin Dwiky (RZL)](https://github.com/rzl-app)
