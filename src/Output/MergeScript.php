<?php

namespace RzlApp\Ziggy\Output;

use Stringable;
use RzlApp\Ziggy\Ziggy;

class MergeScript implements Stringable
{

  public function __construct(
    protected Ziggy $ziggy,
    protected string $id = '',
    protected string $name = '',
    protected string $nonce = '',
    protected string $dataAttribute = "",
    protected string $ignoreMinify = ""
  ) {}

  public function __toString(): string
  {
    $routes = json_encode($this->ziggy->toArray()['routes']);

    return <<<HTML
        <script type="text/javascript" rzl-app {$this->id} {$this->name} {$this->nonce} {$this->dataAttribute} {$this->ignoreMinify}>(function () {const routes = {$routes};Object.assign(appRoutes.routes, routes);})();</script>
      HTML;
  }
}
