# Rzl Ziggy – Fully-Typed Laravel Route Generator for JS/TS
(Forked from [Ziggy](https://github.com/tighten/ziggy) by [Tighten](https://github.com/tighten)).

[![Latest Version on Packagist](https://img.shields.io/packagist/v/rzl-app/ziggy.svg?style=flat)](https://packagist.org/packages/rzl-app/ziggy)
[![Downloads on Packagist](https://img.shields.io/packagist/dt/rzl-app/ziggy.svg?style=flat)](https://packagist.org/packages/rzl-app/ziggy)
[![Latest Version on NPM](https://img.shields.io/npm/v/rzl-app-ziggy.svg?style=flat)](https://npmjs.com/package/rzl-app-ziggy)
[![Downloads on NPM](https://img.shields.io/npm/dt/rzl-app-ziggy.svg?style=flat)](https://npmjs.com/package/rzl-app-ziggy)
[![GitHub](https://img.shields.io/badge/GitHub-rzl--app%2Frzl--ziggy-181717?logo=github)](https://github.com/rzl-app/[rzl-utils-js](https://github.com/rzl-app/ziggy))
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
    - [TypeScript](#typescript)
- [**JavaScript frameworks**](#javascript-frameworks)
    - [Generating and importing Ziggy's configuration](#generating-and-importing-rzl-ziggys-configuration)
    - [Importing the `route()` function](#importing-the-route-function)
    - [Vue](#vue)
    - [React](#react)
    - [SPAs or separate repos](#spas-or-separate-repos)
- [**Filtering Routes**](#filtering-routes)
    - [Including/excluding routes](#includingexcluding-routes)
    - [Filtering with groups](#filtering-with-groups)
- [**Routes File Generator**](#routes-file-generator)
    - [Using JavaScript/TypeScript](#using-javascript-or-typescript)
    - [Output Path Generate](#output-path-generate)
- [**Automatically Regenerates File Routes**](#automatically-regenerates-file-routes)
- [**Other**](#other)
- [**Contributing**](#contributing)
 

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

## Usage

### `route()` function

Rzl Ziggy's `route()` function works like [Laravel's `route()` helper](https://laravel.com/docs/helpers#method-route)—you can pass it the name of a route, and the parameters you want to pass to the route, and it will generate a URL.

#### Basic usage

```php
Route::get('posts', fn (Request $request) => /* ... */)->name('posts.index');
```

```js
route('posts.index'); // 'https://ziggy.test/posts'
```

#### Parameters

```php
Route::get('posts/{post}', fn (Post $post) => /* ... */)->name('posts.show');
```

```js
route('posts.show', 1);           // 'https://ziggy.test/posts/1'
route('posts.show', [1]);         // 'https://ziggy.test/posts/1'
route('posts.show', { post: 1 }); // 'https://ziggy.test/posts/1'
```

#### Multiple parameters

```php
Route::get('venues/{venue}/events/{event}', fn (Venue $venue, Event $event) => /* ... */)
    ->name('venues.events.show');
```

```js
route('venues.events.show', [1, 2]);                 // 'https://ziggy.test/venues/1/events/2'
route('venues.events.show', { venue: 1, event: 2 }); // 'https://ziggy.test/venues/1/events/2'
```

#### Query parameters

Rzl Ziggy adds arguments that don't match any named route parameters as query parameters:

```php
Route::get('venues/{venue}/events/{event}', fn (Venue $venue, Event $event) => /* ... */)
    ->name('venues.events.show');
```

```js
route('venues.events.show', {
    venue: 1,
    event: 2,
    page: 5,
    count: 10,
});
// 'https://ziggy.test/venues/1/events/2?page=5&count=10'
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
// 'https://ziggy.test/venues/1/events/2?event=3&page=5'
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
});
// 'https://ziggy.test/venues/1/events/2?draft=0&overdue=1'
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
route('posts.show', 1); // 'https://ziggy.test/de/posts/1'
```

#### Examples

HTTP request with `axios`:

```js
const post = { id: 1, title: 'Ziggy Stardust' };

return axios.get(route('posts.show', post)).then((response) => response.data);
```

### `Router` class

Calling Rzl Ziggy's `route()` function with no arguments will return an instance of its JavaScript `Router` class, which has some other useful properties and methods.

#### Check the current route: `route().current()`

```js
// Laravel route called 'events.index' with URI '/events'
// Current window URL is https://ziggy.test/events

route().current();               // 'events.index'
route().current('events.index'); // true
route().current('events.*');     // true
route().current('events.show');  // false
```

`route().current(...)` optionally accepts parameters as its second argument, and will check that their values also match in the current URL:

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all

route().current('venues.events.show', { venue: 1 });           // true
route().current('venues.events.show', { venue: 1, event: 2 }); // true
route().current('venues.events.show', { hosts: 'all' });       // true
route().current('venues.events.show', { venue: 6 });           // false
```

#### Check if a route exists: `route().has(...)`

```js
// Laravel app has only one named route, 'home'

route().has('home');   // true
route().has('orders'); // false
```

#### Retrieve the current route params: `route().params`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all

route().params; // { venue: '1', event: '2', hosts: 'all' }
```

> Note: parameter values retrieved with `route().params` will always be returned as strings.

#### Retrieve only params route in laravel route (except query search params) in the current route: `route().routeParams`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test

route().routeParams; // { venue: '1', event: '2' }
```

> Note: parameter values retrieved with `route().routeParams` will always be returned as strings.

#### Retrieve all search query params only (except params route in laravel route) in the current route: `route().queryParams`

```js
// Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
// Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test

route().queryParams; // { hosts: 'all', type: 'test' }
```

> Note: parameter values retrieved with `route().queryParams` will always be returned as strings.

### Route-model binding

Rzl Ziggy supports Laravel's [route-model binding](https://laravel.com/docs/routing#route-model-binding), and can even recognize custom route key names. If you pass `route()` a JavaScript object as a route parameter, Ziggy will use the registered route-model binding keys for that route to find the correct parameter value inside the object. If no route-model binding keys are explicitly registered for a parameter, Ziggy will use the object's `id` key.

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
    title: 'Introducing Ziggy v1',
    slug: 'introducing-ziggy-v1',
    date: '2020-10-23T20:59:24.359278Z',
};

// Rzl Ziggy knows that this route uses the 'slug' route-model binding key:

route('posts.show', post); // 'https://ziggy.test/blog/introducing-ziggy-v1'
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

route('authors.photos.show', [{ id: 1, name: 'Ansel' }, photo]);
// 'https://ziggy.test/authors/1/photos/714b19e8-ac5e-4dab-99ba-34dc6fdd24a5'
```

### TypeScript

Rzl Ziggy includes TypeScript type definitions, and an Artisan command that can generate additional type definitions to enable route name and parameter autocompletion.

To generate route types, run the `rzl-ziggy:generate` command with the `--types` or `--types-only` option:

```bash
php artisan rzl-ziggy:generate --types
```

To make your IDE aware that Ziggy's `route()` helper is available globally, and to type it correctly, add a declaration like this in a `.d.ts` file somewhere in your project:

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

## JavaScript frameworks

> [!NOTE]
> Many applications don't need the additional setup described here—the `@rzlRoutes` Blade directive makes Rzl Ziggy's `route()` function and config available globally, including within bundled JavaScript files.

If you are not using the `@rzlRoutes` Blade directive, you can import Ziggy's `route()` function and configuration directly into JavaScript/TypeScript files.

### Generating and importing Rzl Ziggy's configuration

Rzl Ziggy provides an Artisan command to output its config and routes to a file:

```bash
php artisan rzl-ziggy:generate
```

This command places your configuration in `resources/routes/index.ts` by default, but you can customize this path by passing an argument to the Artisan command or setting in the laravel config file `rzl-ziggy.output.path.main` for name file [Output Path Generate](#output-path-generate) and `rzl-ziggy.lang` valid value is (`ts` or `js`) [Using JavaScript or TypeScript](#using-javascript-or-typescript).

The file `rzl-ziggy:generate` creates looks something like this:

```js
// resources/routes/index.{ts|js}

/** ---------------------------------
  * * ***Data Generates Routes of App Based-on Laravel Routes Name.***
  * ---------------------------------
  *
  * @return  string
  *
  */
export const appRoutes = {
    url: 'https://ziggy.test',
    port: null,
    routes: {
        home: {
            uri: '/',
            methods: [ 'GET', 'HEAD'],
            domain: null,
        },
        login: {
            uri: 'login',
            methods: ['GET', 'HEAD'],
            domain: null,
        },
    },
};
 
```

### Importing the `route()` function

You can import Ziggy like any other JavaScript library. Without the `@rzlRoutes` Blade directive Rzl Ziggy's config is not available globally, so it must be passed to the `route()` function manually:

```js
import { route } from '../../vendor/rzl-app/ziggy';
import { appRoutes } from './routes/index.js';

route('home', undefined, undefined, appRoutes);
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

Ziggy includes a Vue plugin to make it easy to use the `route()` helper throughout your Vue app:

```js
import { createApp } from 'vue';
import { ZiggyVue } from 'rzl-app-ziggy';
import App from './App.vue';

createApp(App).use(ZiggyVue);
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

If you are not using the `@rzlRoutes` Blade directive, import Ziggy's configuration too and pass it to `.use()`:

```js
import { createApp } from 'vue';
import { ZiggyVue } from 'rzl-app-ziggy';
import { appRoutes } from './routes/index.js';
import App from './App.vue';

createApp(App).use(ZiggyVue, appRoutes);
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

Ziggy includes a `useRoute()` hook to make it easy to use the `route()` helper in your React app:

```jsx
import React from 'react';
import { useRoute } from 'rzl-app-ziggy';

export default function PostsLink() {
    const route = useRoute();

    return <a href={route('posts.index')}>Posts</a>;
}
```

If you are not using the `@rzlRoutes` Blade directive, import Ziggy's configuration too and pass it to `useRoute()`:

```jsx
import React from 'react';
import { useRoute } from 'rzl-app-ziggy';
import { appRoutes } from './routes/index.js';

export default function PostsLink() {
    const route = useRoute(appRoutes);

    return <a href={route('posts.index')}>Posts</a>;
}
```

You can also make the `Rzl Ziggy` config object available globally, so you can call `useRoute()` without passing Rzl Ziggy's configuration to it every time:

```js
// app.js
import { appRoutes } from './routes/index.ts';
globalThis.appRoutes = appRoutes;
```

### SPAs or separate repos

Ziggy's `route()` function is available as an NPM package, for use in JavaScript projects managed separately from their Laravel backend (i.e. without Composer or a `vendor` directory). You can install the NPM package with `npm install rzl-app-ziggy`.

To make your routes available on the frontend for this function to use, you can either run `php artisan rzl-ziggy:generate` and add the generated config file to your frontend project, or you can return Rzl Ziggy's config as JSON from an endpoint in your Laravel API (see [Retrieving Ziggy's config from an API endpoint](#retrieving-ziggys-config-from-an-api-endpoint) below for an example of how to set this up).

## Filtering Routes

Ziggy supports filtering the list of routes it outputs, which is useful if you have certain routes that you don't want to be included and visible in your HTML source.

> [!IMPORTANT]
> Hiding routes from Ziggy's output is not a replacement for thorough authentication and authorization. Routes that should not be accessibly publicly should be protected by authentication whether they're filtered out of Ziggy's output or not.

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

## Routes File Generator

### Using JavaScript or TypeScript

You can also format your front-end using JavaScript or TypeScript when running the Artisan commands `php artisan rzl-ziggy:generate` or `php artisan rzl-ziggy:generate --types`:

```php
// config/rzl-ziggy.php

return [
    /**
     * Using JavaScript or TypeScript?
     *
     * Default "ts" # ts = TypeScript (.ts) and js = JavaScript (.js)
     * todo: Note: If lang value is invalid or empty, will force to ts (.ts)!
     */
    "lang" => "ts",
];
```

### Output Path Generate

You can also set the output location when running the Artisan command `php artisan rzl-ziggy:generate` or `php artisan rzl-ziggy:generate --types`:

```php
// config/rzl-ziggy.php

return [
    "output" => [ 
      // Path Folder Generated
      "path" => [
          // Path Folder Generated of Main file (.js|.ts)
          "main" => "resources/routes/index.ts",
      ]
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

## Automatically Regenerates File Routes

#### Rzl Ziggy includes a built-in Vite plugin that automatically generates a route index file (index.ts or index.js) based on your Laravel named routes (location depends your setting, see: [Output Path Generate](#routes-file-generator)).
#### - Works the same as:
```bash
php artisan rzl-ziggy:generate
# or
php artisan rzl-ziggy:generate --types
```
#### - Auto-regenerates the file whenever:
    - You change .env (e.g. APP_URL)
    - You update any routes/*.php file
    - No need to run manual commands—works live in development 
    (npm run dev).

#### - Setting in your vite.config.ts or vite.config.js, register the plugin:

```js
import rzlZiggyPlugin from 'rzl-app-ziggy/vite-plugin'

export default defineConfig({
  plugins: [
    rzlZiggyPlugin(),
    // ...other your plugin
  ],
})
```

## Other

### TLS/SSL termination and trusted proxies

<!-- Or: What to do if your app is served over `https` but Ziggy's `route()` helper generates `http` URLs -->

If your application is using [TLS/SSL termination](https://en.wikipedia.org/wiki/TLS_termination_proxy) or is behind a load balancer or proxy, or if it's hosted on a service that is, Ziggy may generate URLs with a scheme of `http` instead of `https`, even if your app URL uses `https`. To fix this, set up your Laravel app's trusted proxies according to the documentation on [Configuring Trusted Proxies](https://laravel.com/docs/requests#configuring-trusted-proxies).

### Using `@rzlRoutes` with a Content Security Policy

A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) may block inline scripts, including those output by Ziggy's `@rzlRoutes` Blade directive. If you have a CSP and are using a nonce to flag safe inline scripts, you can pass the nonce to the `@rzlRoutes` directive and it will be added to Ziggy's script tag:

```php
@rzlRoutes(nonce: 'your-nonce-here')
```

### Disabling the `route()` helper

If you only want to use the `@rzlRoutes` directive to make Ziggy's configuration available in JavaScript, but don't need the `route()` helper function, set the `rzl-ziggy.skip-route-function` config to `true`.

### Retrieving Rzl Ziggy's config from an API endpoint

If you need to retrieve Rzl Ziggy's config from your Laravel backend over the network, you can create a route that looks something like this:

```php
// routes/api.php

use RzlApp\Ziggy\RzlZiggy;

Route::get('rzl-ziggy', fn () => response()->json(new RzlZiggy));
```

### Re-generating the routes file when your app routes change

If you are generating your Rzl Ziggy config as a file by running `php artisan rzl-ziggy:generate`, you may want to re-run that command when your app's route files change. The example below is a Laravel Mix plugin, but similar functionality could be achieved without Mix. Huge thanks to [Nuno Rodrigues](https://github.com/nacr) for [the idea and a sample implementation](https://github.com/rzl-app/ziggy/issues/321#issuecomment-689150082). See [#655](https://github.com/rzl-app/ziggy/pull/655/files#diff-4aeb78f813e14842fcf95bdace9ced23b8a6eed60b23c165eaa52e8db2f97b61) or [vite-plugin-ziggy](https://github.com/aniftyco/vite-plugin-ziggy) for Vite examples.

<details>
<summary>Laravel Mix plugin example</summary>
<p></p>

```js
const mix = require('laravel-mix');
const { exec } = require('child_process');

mix.extend('ziggy', new class {
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
    .ziggy();
```
</details>

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

## Security

Please review our [security policy](../../security/policy) on how to report security vulnerabilities.

## License

Rzl Ziggy is open-source software released under the MIT license. See [LICENSE](LICENSE) for more information.

## Credits

- Forked and extended from [Ziggy by Tighten.](https://github.com/tighten/ziggy)
- Inspired by the work of Daniel Coulbourne, Jake Bathman, Matt Stauffer, and Jacob Baker-Kretzmar.
- Custom features and enhancements maintained by [Rizalfin Dwiky (RZL)](https://github.com/rzl-app)
