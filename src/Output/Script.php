<?php

namespace RzlApp\Ziggy\Output;

use RzlApp\Ziggy\Helpers\RzlZiggyHelper;
use Stringable;
use RzlApp\Ziggy\RzlZiggy;

class Script implements Stringable
{
  public function __construct(protected RzlZiggy $ziggy, protected string $function, protected string $id = '', protected string $name = '', protected string $nonce = '', protected string $dataAttribute = "", protected string $ignoreMinify = "")
  {
    $this->function = str($function)->replace('/\s+/', '')->trim();
    $this->id = RzlZiggyHelper::appendSpaceAttribute($id);
    $this->name = RzlZiggyHelper::appendSpaceAttribute($name);
    $this->nonce = RzlZiggyHelper::appendSpaceAttribute($nonce);
    $this->dataAttribute = RzlZiggyHelper::appendSpaceAttribute($dataAttribute);
    $this->ignoreMinify = RzlZiggyHelper::appendSpaceAttribute($ignoreMinify);
  }

  public function __toString(): string
  {
    $flag = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK | JSON_HEX_AMP | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT;

    // {$this->function}
    return <<<HTML
      <script type="text/javascript" rzl-app{$this->id}{$this->name}{$this->nonce}{$this->dataAttribute}{$this->ignoreMinify}>{$this->function}const appRoutes={$this->ziggy->toJson($flag)};</script>
      HTML;
  }
}
