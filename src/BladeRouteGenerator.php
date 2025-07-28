<?php

namespace RzlApp\Ziggy;

use RzlApp\Ziggy\Output\Script;
use RzlApp\Ziggy\Output\MergeScript;
use RzlApp\Ziggy\Helpers\RzlZiggyHelper;

class BladeRouteGenerator
{
  public static $generated;

  public function generate($group = null, $id = null, $name = null, $nonce = null, $dataAttribute = [], $ignoreMinify = true)
  {
    $ziggy = new RzlZiggy($group);

    $id = RzlZiggyHelper::formattingAttribute("id", $id);
    $name = RzlZiggyHelper::formattingAttribute("name", $name);
    $nonce = RzlZiggyHelper::formattingAttribute("nonce", $nonce);

    $ignoreMinify = $ignoreMinify ? ' ignore--minify' : '';

    $dataAttributes = ($joined = collect($dataAttribute ?? [])
      ->map(function ($v, $k) {
        $k = trim($k, "\"' \t\n\r\0\v\x0B");

        if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $k)) {
          return null;
        }

        $key = e(str($k)->trim());
        $value = e(str($v)->trim());

        return $value !== '' ? "data-{$key}=\"{$value}\"" : null;
      })
      ->filter()
      ->implode(' ')) !== '' ? " {$joined}" : '';

    if (static::$generated) {
      return (string) $this->generateMergeJavascript($ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
    }

    $function = $this->getRouteFunction();

    static::$generated = true;

    $output = config('rzl-ziggy.output.script', Script::class);

    return (string) new $output($ziggy, $function, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
  }

  private function generateMergeJavascript(RzlZiggy $ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify)
  {
    $output = config('rzl-ziggy.output.merge_script', MergeScript::class);

    return new $output($ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
  }

  private function getRouteFunction()
  {
    return config('rzl-ziggy.skip-route-function') ? '' : file_get_contents(__DIR__ . '/../dist/rzl-ziggy.iife.js');
  }
}
