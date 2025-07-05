<?php

/** * Get File Path. */
if (!function_exists("getPathFile")) {
  /** ---------------------------------
   * * Get File Path.
   * ---------------------------------
   *
   * @param string $name
   * @param bool $removeFirstSlash *default is `true`
   * @param bool $useBackSlash *default is `false`
   * @param string|null $default *default is `null`
   *
   * @return string|null
   *
   */
  function getPathFile($name, $removeFirstSlash = true, $useBackSlash = false, $default = null): string|null
  {
    if (filled($name)) {
      $name = str($name)->replace("\\", "/")->replaceMatches(['#/{2,}#'], "/");
      $filePath = str($name);

      if ($removeFirstSlash && $filePath->startsWith("/")) {
        $returnPath = $filePath->replaceFirst("/", "");

        if ($useBackSlash) {
          return $returnPath->replace("/", "\\");
        }

        return $returnPath;
      }

      if ($useBackSlash) {
        return $filePath->replace("/", "\\");
      }

      return $filePath;
    }

    return filled($default) ? getPathFile($default, $removeFirstSlash, $useBackSlash) : null;
  }
}

if (!function_exists("encryptCryptPayload")) {
  /** * Encryption 1x Value of Payload String
   *
   * @param string $payload
   */
  function encryptCryptPayload($payload)
  {
    return \Illuminate\Support\Facades\Crypt::encryptString($payload);
  }
}

if (!function_exists("decryptCryptPayload")) {
  /** * Decryption 1x Value of Payload
   *
   * @param string|null|false $returnDefaultFail - Returning if Fails is depends of value props `$returnDefaultFail`, but Default value is `""` as string.
   * @throws DecryptException - Return if Fails decrypt of is depends of `$returnDefaultFail`, default = string `""`
   */
  function decryptCryptPayload($payload, $returnDefaultFail = "")
  {
    try {
      return \Illuminate\Support\Facades\Crypt::decryptString($payload);
    } catch (\Illuminate\Contracts\Encryption\DecryptException) {
      if (!is_null($returnDefaultFail)) {
        return $returnDefaultFail;
      } elseif (is_null($returnDefaultFail)) {
        return null;
      } else {
        return false;
      }
    }
  }
}
