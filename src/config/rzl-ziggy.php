<?php

return [
  /**
   * !# Using JavaScript or TypeScript?
   *
   * ?: Default "ts" # ts = TypeScript (.ts) and js = JavaScript (.js)
   * todo: Note: If lang value is invalid or empty, will force to ts (.ts)!
   */
  "lang" => "ts",

  /**
   * !# Output Path Generate
   */
  "output" => [
    // ? todo: Encrypting generated route with Crypt::encrypt($route);, set to false to disable. */
    "encrypting" => true,
    // ?: Path Folder Generated
    "path" => [
      // ?: Path Folder Generated of Main file (.js|.ts)
      "main" => "resources/routes/index.ts",
    ]
  ],

  /**
   * !# Including/excluding routes
   *
   * ?: To set up route filtering, create a config file in your Laravel app at config/ziggy.php and add either an only or except key containing an array of route name patterns.
   * todo: Note: You have to choose one or the other. Setting both only and except will disable filtering altogether and return all named routes.
   */
  'only' => [
    // 'home',
    // 'posts.index',
    // 'posts.show'
  ],

  /**
   * todo: Example: You can use asterisks as wildcards in route filters. In the example below, debugbar.* will exclude routes named debugbar.login, debugbar.register, etc.:
   */
  "except" => [
    "_debugbar.*",
    "debugbar.*",
    "ignition.*",
    "sanctum.csrf-cookie",
    "minify.assets",
  ],

  /**
   * !# Filtering with groups
   *
   * ?: You can also define groups of routes that you want make available in different places in your app, using a groups key in your config file:
   */
  "groups" => [
    // ? example :
    // "dashboard" => [
    //   "dashboard.*",
    //   "dashboard"
    // ],
    // "homepage" => [
    //   "homepage"
    // ],
  ],
];
