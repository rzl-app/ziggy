<?php

namespace RzlApp\Ziggy\Output;

use Stringable;
use RzlApp\Ziggy\Ziggy;

class File implements Stringable
{
  public function __construct(protected Ziggy|string $ziggy, private $ext)
  {
    if (config("rzl-ziggy.output.encrypting", true)) {
      $this->ziggy = encryptCryptPayload(json_encode($ziggy, JSON_UNESCAPED_SLASHES));
    } else {
      $this->ziggy = json_encode($ziggy, JSON_UNESCAPED_SLASHES);
    }
  }

  // const AppRoutes = "$this->ziggy";
  public function __toString(): string
  {
    if ($this->ext === "ts") {
      return <<<JAVASCRIPT
        /* eslint-disable quotes */
        /** ---------------------------------
        * * ***Data Generates Routes of App Based-on Laravel Routes Name.***
        */
        export const appRoutes:string = '$this->ziggy';
        JAVASCRIPT;
    }

    return <<<JAVASCRIPT
    /* eslint-disable quotes */
    /** ---------------------------------
    * * ***Data Generates Routes of App Based-on Laravel Routes Name.***
    * ---------------------------------
    *
    * @return  string
    *
    */
    export const appRoutes = '$this->ziggy';
    JAVASCRIPT;
  }

  public function OlderToString(): string
  {
    return <<<JAVASCRIPT
      const appRoutes = {$this->ziggy->toJson(128)};

      if (typeof window !== 'undefined' && typeof window.appRoutes !== 'undefined') {
        Object.assign(appRoutes.routes, window.appRoutes.routes);
      }

      export { appRoutes };

    JAVASCRIPT;
  }
}
