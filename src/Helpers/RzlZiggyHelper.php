<?php

namespace RzlApp\Ziggy\Helpers;

final class RzlZiggyHelper
{
  /** -------------------------------
   * * ***Get File Path.***
   * -------------------------------
   *
   * @param string $name
   * @param bool $removeFirstSlash *default is `true`
   * @param bool $useBackSlash *default is `false`
   * @param string|null $default *default is `null`
   *
   * @return string|null
   *
   */
  public static function getPathFile($name, $removeFirstSlash = true, $useBackSlash = false, $default = null): string|null
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

    return filled($default) ? self::getPathFile($default, $removeFirstSlash, $useBackSlash) : null;
  }

  /** ------------------------------- 
   * * Encryption 1x Value of Payload String
   * -------------------------------
   *
   * @param string $payload
   */
  public static function encryptCryptPayload($payload)
  {
    return \Illuminate\Support\Facades\Crypt::encryptString($payload);
  }

  /** -------------------------------
   * * Decryption 1x Value of Payload
   * -------------------------------
   *
   * @param string|null|false $returnDefaultFail - Returning if Fails is depends of value props `$returnDefaultFail`, but Default value is `""` as string.
   * @throws DecryptException - Return if Fails decrypt of is depends of `$returnDefaultFail`, default = string `""`
   */
  public static function decryptCryptPayload($payload, $returnDefaultFail = "")
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

  /** Formats an HTML attribute with a leading space.
   *
   * Example:
   * formattingAttribute('data-id', '123') => ' data-id="123"'
   *
   * Returns an empty string if the value is null or empty.
   *
   * @param string $key     The attribute name (e.g. "id", "class", "data-*")
   * @param string|null $value  The attribute value
   * @return string  The formatted HTML attribute or empty string
   */
  public static function formattingAttribute($key, $value): string
  {
    $key = trim($key, "\"' \t\n\r\0\v\x0B");

    // Only allow alphanumeric keys with - or _
    if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $key)) {
      return '';
    }

    $value = str($value)->trim();

    if ($value->isEmpty()) {
      return '';
    }

    return ' ' . e(str($key)->trim()) . '="' . e($value) . '"';
  }

  /** Appends a leading space to a string if it is not empty after trimming.
   *
   * Useful for optional class names or extra attributes.
   *
   * Example:
   * appendSpaceAttribute('btn') => ' btn'
   * appendSpaceAttribute('   ') => ''
   *
   * @param string|null $attribute  The string to be trimmed and formatted
   * @return string  The formatted string with a space prefix, or an empty string
   */
  public static function appendSpaceAttribute($attribute): string
  {
    $attribute = str($attribute)->trim();
    return $attribute->isEmpty() ? '' : " $attribute";
  }
};
