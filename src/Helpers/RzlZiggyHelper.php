<?php

namespace RzlApp\Ziggy\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

final class RzlZiggyHelper
{
  /** * Merge config and runtime default parameters, then apply to URL::defaults().
   *
   * @param  array  $overrides  Additional overrides, like from CLI options.
   * @return array The merged default parameters that were applied.
   */
  public static function applyDefaultUrl(array $overrides = []): array
  {
    $defaults = array_merge(
      config('rzl-ziggy.defaults', []),
      URL::getDefaultParameters() ?? [],
      $overrides,
    );

    if (filled($defaults)) {
      URL::defaults($defaults);
    }

    return $defaults;
  }

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

    return ' ' . e(str($key)->trim()->toString()) . '="' . e($value->toString()) . '"';
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
    return $attribute->isEmpty() ? '' : " {$attribute->toString()}";
  }

  public static function generateComposerBanner(string $typeGenerate = "ts-files", string $packageName = 'rzl-app/ziggy'): string
  {
    if ($typeGenerate == "ts-types") {
      $titleGenerate = "Generates types of routes of app based on Laravel route names.";
      $topDesc = "**This module declaration exposes Laravel route definitions for use in TypeScript (TS) mode.**";
      $bottomDesc = "_* **This behaves similarly to `rzl-ziggy:generate --types`.**_";
    } else if ($typeGenerate == "ts-files") {
      $titleGenerate = "Generates files/routes of app based on Laravel route names.";
      $topDesc = "**This behaves similarly to `rzl-ziggy:generate`.**";
      $bottomDesc = "_* **TypeScript (TS) Mode.**_";
    } else if ($typeGenerate == "js-files") {
      $titleGenerate = "Generates files/routes of app based on Laravel route names.";
      $topDesc = "**This behaves similarly to `rzl-ziggy:generate`.**";
      $bottomDesc = "_* **JavaScript (JS) Mode.**_";
    }

    $basePath = base_path("vendor/{$packageName}");
    $composerJson = "{$basePath}/composer.json";
    $packageJson = "{$basePath}/package.json";
    $installedJson = base_path('vendor/composer/installed.json');

    if (!File::exists($composerJson)) {
      throw new \RuntimeException("composer.json not found at {$composerJson}");
    }
    if (!File::exists($packageJson)) {
      throw new \RuntimeException("package.json not found at {$packageJson}");
    }

    $composer = collect(json_decode(File::get($composerJson), true));
    $repo = $composer->get('repository');
    $repoUrl = is_array($repo) ? $repo['url'] ?? null : $repo;
    $repoUrl = $repoUrl ?: $composer->get('homepage', 'https://github.com/rzl-app/ziggy');

    $package = collect(json_decode(File::get($packageJson), true));
    $namePkg = $package->get('name') ?? "rzl-app-ziggy";
    $versionPkg = $package->get('version') ?? "0.0.0";
    $versionLatestNpm = self::getNpmLatestVersion($namePkg);

    $cleanUrl = Str::of($repoUrl)->replaceFirst('git+', '')->replaceLast('.git', '');

    $versionComposer = 'dev-main';
    if (File::exists($installedJson)) {
      $installed = json_decode(File::get($installedJson), true);
      $packages = $installed['packages'] ?? $installed;
      $versionComposer = collect($packages)->firstWhere('name', $packageName)['version'] ?? $versionComposer;
    }

    $author = $composer->get('authors')[0]['name'] ?? 'Rzl';
    $date = date('Y');
    $name = $composer->get('name', $packageName);
    $versionLatestPackagist = self::getComposerLatestVersion($name);
    $license = $composer->get('license', 'MIT');

    $repoName = str($name)->afterLast("github.com");

    return <<<BANNER
      /** ---------------------------------------------------------------------
       * * ***📦 {$titleGenerate}***
       * ---------------------------------------------------------------------
       *
       * {$topDesc}
       *
       * {$bottomDesc}
       *
       *  🔗 Links:
       *  - 📦 NPM       : [{$namePkg}](https://www.npmjs.com/package/{$namePkg})
       *      - Current : {$versionPkg}
       *      - Latest  : {$versionLatestNpm}
       *  - 📦 Packagist : [{$name}](https://packagist.org/packages/{$name})
       *      - Current : {$versionComposer}
       *      - Latest  : {$versionLatestPackagist}
       *  - 🧭 Repo      : [{$repoName}]({$cleanUrl})
       *  - 📝 License   : [{$license}]({$cleanUrl}/blob/main/LICENSE)
       *
       *  © {$date} {$author}
       */
      BANNER;
  }

  public static function getNpmLatestVersion(string $packageName): string
  {
    $url = "https://registry.npmjs.org/{$packageName}";

    try {
      $response = Http::timeout(2)->get($url);

      if ($response->failed()) {
        return '0.0.0';
      }

      $data = $response->json();

      return $data['dist-tags']['latest'] ?? '0.0.0';
    } catch (\Throwable $e) {
      return '0.0.0';
    }
  }

  public static function getComposerLatestVersion(string $packageName): string
  {
    $url = "https://repo.packagist.org/p2/{$packageName}.json";

    try {
      $response = Http::timeout(2)->get($url);

      if ($response->failed()) {
        return 'dev-main';
      }

      $data = $response->json();
      $versions = $data['packages'][$packageName] ?? [];

      if (empty($versions)) {
        return 'dev-main';
      }

      $latest = $versions[0]['version'] ?? 'dev-main';

      return $latest;
    } catch (\Throwable $e) {
      return 'dev-main';
    }
  }
};
