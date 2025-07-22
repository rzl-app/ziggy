<?php

namespace RzlApp\Ziggy\Output;

use RzlApp\Ziggy\Helpers\RzlZiggyHelper;
use Stringable;
use RzlApp\Ziggy\RzlZiggy;

class MergeScript implements Stringable
{

  public function __construct(
    protected RzlZiggy $ziggy,
    protected string $id = '',
    protected string $name = '',
    protected string $nonce = '',
    protected string $dataAttribute = "",
    protected string $ignoreMinify = ""
  ) {
    $this->id = RzlZiggyHelper::appendSpaceAttribute($id);
    $this->name = RzlZiggyHelper::appendSpaceAttribute($name);
    $this->nonce = RzlZiggyHelper::appendSpaceAttribute($nonce);
    $this->dataAttribute = RzlZiggyHelper::appendSpaceAttribute($dataAttribute);
    $this->ignoreMinify = RzlZiggyHelper::appendSpaceAttribute($ignoreMinify);
  }

  public function __toString(): string
  {
    $routes = json_encode($this->ziggy->toArray()['routes']);

    return <<<HTML
        <script type="text/javascript" rzl-app{$this->id}{$this->name}{$this->nonce}{$this->dataAttribute}{$this->ignoreMinify}>(function () {const routes = {$routes};Object.assign(appRoutes.routes, routes);})();</script>
      HTML;
  }
}
