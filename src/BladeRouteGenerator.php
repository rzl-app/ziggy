<?php

namespace RzlApp\Ziggy;

use RzlApp\Ziggy\Output\MergeScript;
use RzlApp\Ziggy\Output\Script;

class BladeRouteGenerator
{
  public static $generated;

  public function generate($group = null, $id = null, $name = null, $nonce = null, $dataAttribute = [], $ignoreMinify = true)
  {
    $ziggy = new Ziggy($group);

    $id = $id ? ' id="' . $id . '"' : '';
    $name = $name ? ' name="' . $name . '"' : '';
    $nonce = $nonce ? ' nonce="' . $nonce . '"' : '';
    $ignoreMinify = $ignoreMinify ? ' ignore--minify' : '';

    $dataAttributes = count($dataAttribute) > 0 ? ' data="' . collect($dataAttribute)->implode(" ") . '"' : '';

    if (static::$generated) {
      return (string) $this->generateMergeJavascript($ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
    }

    $function = $this->getRouteFunction();

    static::$generated = true;

    $output = config('rzl-ziggy.output.script', Script::class);

    return (string) new $output($ziggy, $function, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
  }

  private function generateMergeJavascript(Ziggy $ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify)
  {
    $output = config('rzl-ziggy.output.merge_script', MergeScript::class);

    return new $output($ziggy, $id, $name, $nonce, $dataAttributes, $ignoreMinify);
  }

  private function getRouteFunction()
  {
    return config('rzl-ziggy.skip-route-function') ? '' : file_get_contents(__DIR__ . '/../dist/route.umd.js');
  }
}
