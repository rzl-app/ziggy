<?php

namespace RzlApp\Ziggy\Output;

use Stringable;
use RzlApp\Ziggy\RzlZiggy;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class Types implements Stringable
{
  public function __construct(protected RzlZiggy $ziggy) {}

  public function __toString(): string
  {
    $routes = $this->routes();

    return <<<JAVASCRIPT
      /** -----------------------------------------------
       * *** Generates types of routes of app based on Laravel route names. ***
       * -----------------------------------------------
       *
       * This module declaration exposes Laravel route definitions
       * for use in TypeScript (TS) mode.
       *
       * **This behaves similarly to `rzl-ziggy:generate`.**
       *
       * @module rzl-app-ziggy
       */
      declare module "rzl-app-ziggy" {
        interface RouteList {$routes->toJson(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)}
      }
      export {};
      JAVASCRIPT;
  }

  protected function routes(): Collection
  {
    return collect($this->ziggy->toArray()['routes'])->map(function ($route) {
      return collect($route['parameters'] ?? [])->map(function ($param) use ($route) {
        return Arr::has($route, "bindings.{$param}")
          ? ['name' => $param, 'required' => ! Str::contains($route['uri'], "{$param}?"), 'binding' => $route['bindings'][$param]]
          : ['name' => $param, 'required' => ! Str::contains($route['uri'], "{$param}?")];
      });
    });
  }
}
