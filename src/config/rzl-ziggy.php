<?php

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

    // ?: Path to the output folder for the generated route file(s)
    // @note Relative to the project root — do NOT prefix with "/" or "\\".
    // @note CLI `--path` overrides this value.
    // ⚠️ If the folder name matches the filename, e.g., `routes/index.ts`,
    //     be careful — file overwrite may occur.

    /** Paths for output destination of the generated route files. */
    "path" => [
      /**
       * The output folder path for the main generated route file.
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

  /** Default values for dynamic route parameters.
   *
   * These values will be applied automatically to any route parameter
   * that exists in the route URI but is not explicitly passed during route generation.
   *
   * Useful for things like localization (e.g. `{locale}`), tenant identifiers (e.g. `{team}`),
   * or filtering (e.g. `{type}`) without having to always specify them in the frontend.
   *
   * You can override these at runtime via `URL::defaults([...])`.
   */
  'defaults' => [
    /** Default for `{locale}` route parameter. CLI `--locale` overrides this value. */
    // 'locale' => env('APP_LOCALE', 'en'),

    // another example:...
    // 'type'   => 'default', // Default value for routes requiring {type}
    // 'team'   => 'main',    // Default tenant/team identifier (e.g. {team})
  ],

  /** Filter the named routes that will be included in the generated output.
   *
   * You may define an array of route names or wildcard patterns to include.
   * This is useful if you only want to expose a subset of routes to the frontend.
   *
   * Notes:
   * - Define either `only` or `except`, **not both** — if both are set, filtering will be disabled and all named routes will be included.
   * - To configure this more globally, create a `config/rzl-ziggy.php` file in your Laravel app and define `only` or `except` there.
   *
   * Example:
   * [
   *     'home',
   *     'posts.*',
   * ]
   */
  'only' => [
    // 'home',
    // 'posts.index',
    // 'posts.show',
  ],

  /** Exclude specific named routes from the generated output.
   *
   * You may define an array of route names or wildcard patterns to exclude.
   * This is useful to prevent exposing internal or debug-related routes to the frontend.
   *
   * Notes:
   * - You can use asterisks (`*`) as wildcards. For example, `debugbar.*` will match
   *   `debugbar.login`, `debugbar.register`, etc.
   * - Do **not** set both `only` and `except` at the same time — this will disable filtering
   *   and include all named routes.
   *
   * Example:
   * [
   *     '_debugbar.*',
   *     'debugbar.*',
   *     'ignition.*',
   *     'sanctum.csrf-cookie',
   *     'minify.assets',
   * ]
   */
  "except" => [
    "_debugbar.*",
    "debugbar.*",
    "ignition.*",
    "sanctum.csrf-cookie",
    "minify.assets",
  ],

  // !# Filtering with groups
  // ?: Define named groups of routes for contextual loading (e.g. dashboard, homepage)
  // @note Use wildcards like "dashboard.*" for multiple matches
  /** Define route groups to make different sets of routes available in different parts of your app.
   *
   * Each group is a named key with an array of route names or wildcard patterns.
   * This allows you to load only a subset of routes per context, such as for a dashboard,
   * homepage, or public vs. admin section.
   *
   * Notes:
   * - You can use asterisks (`*`) as wildcards to match multiple route names.
   * - These groups can be selected when calling `route()` or during route generation.
   *
   * Example:
   * [
   *     'dashboard' => [
   *         'dashboard.*',
   *         'dashboard',
   *     ],
   *     'homepage' => [
   *         'homepage',
   *     ],
   * ]
   */
  "groups" => [
    // "dashboard" => [
    //   "dashboard.*",
    //   "dashboard",
    // ],
    // "homepage" => [
    //   "homepage",
    // ],
  ],
];
