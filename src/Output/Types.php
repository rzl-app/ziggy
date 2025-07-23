<?php

namespace RzlApp\Ziggy\Output;

use Stringable;
use RzlApp\Ziggy\RzlZiggy;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use RzlApp\Ziggy\Helpers\RzlZiggyHelper;

class Types implements Stringable
{
  public function __construct(protected RzlZiggy $ziggy) {}

  public function __toString(): string
  {
    $routes = $this->routes();

    $banner = RzlZiggyHelper::generateComposerBanner("ts-types");

    return <<<JAVASCRIPT
      {$banner}
      declare module "rzl-app-ziggy" {
        interface RouteList {$routes->toJson(JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)}
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
