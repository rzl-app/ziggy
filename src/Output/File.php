<?php

namespace RzlApp\Ziggy\Output;

use Stringable;
use RzlApp\Ziggy\RzlZiggy;
use RzlApp\Ziggy\Helpers\RzlZiggyHelper;

class File implements Stringable
{
  public function __construct(protected RzlZiggy|string $ziggy, private $ext)
  {
    if (config("rzl-ziggy.output.encrypting", true)) {
      $this->ziggy = RzlZiggyHelper::encryptCryptPayload(json_encode($ziggy, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    } else {
      $this->ziggy = json_encode($ziggy, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
  }

  public function __toString(): string
  {
    if ($this->ext === "ts") {
      return <<<JAVASCRIPT
        /** ---------------------------------
          * * ***Generates files/routes of app based on Laravel route names.***
          * ---------------------------------
          *
          * **This behaves similarly to `rzl-ziggy:generate`.**
          * 
          * _* **TypeScript (TS) Mode.**_
          */
        export const appRoutes:string = '$this->ziggy';
        JAVASCRIPT;
    }

    return <<<JAVASCRIPT
    /** ---------------------------------
      * * ***Generates files/routes of app based on Laravel route names.***
      * ---------------------------------
      *
      * **This behaves similarly to `rzl-ziggy:generate`.**
      * 
      * _* **JavaScript (JS) Mode.**_
      */
    export const appRoutes = '$this->ziggy';
    JAVASCRIPT;
  }

  /** @deprecated Use `toString()` instead. */
  public function OlderToString(): string
  {
    return <<<JAVASCRIPT
      const appRoutes = {$this->ziggy->toJson(JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)};

      if (typeof window !== 'undefined' && typeof window.appRoutes !== 'undefined') {
        Object.assign(appRoutes.routes, window.appRoutes.routes);
      }

      export { appRoutes };

    JAVASCRIPT;
  }
}
