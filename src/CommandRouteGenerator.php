<?php

namespace RzlApp\Ziggy;

use Illuminate\Support\Str;
use RzlApp\Ziggy\Output\File;
use RzlApp\Ziggy\Output\Types;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Console\Output\OutputInterface;

class CommandRouteGenerator extends Command
{
  private $PREFIX_LOG = "[RZL ZIGGY]:";

  protected $signature = "rzl-ziggy:generate
                        {--path= : Path to the generated JavaScript file. Default: `resources/rzl-ziggy-routes`.}
                        {--name= : Filename to the generated JavaScript file. Default: `index`.}
                        {--lang= : Set language to JavaScript or TypeScript (default: `ts`). If invalid or empty, will fallback to `ts`.}
                        {--types : Generate with a TypeScript declaration file.}
                        {--types-only : Generate only a TypeScript declaration file.}
                        {--url=}
                        {--group=}";

  protected $description = "Generate a JavaScript file containing Rzl Ziggy’s routes and configuration.";

  public function __construct(protected Filesystem $files)
  {
    parent::__construct();
  }

  public function handle()
  {
    $this->alert("Generating routes using 'artisan rzl-ziggy:generated'. Please wait a moment....");

    $ziggy = new RzlZiggy($this->option("group"), $this->option("url") ? url($this->option("url")) : null);

    $lang = $this->resolveLang();

    $basePath = $this->resolveRawPathDetails(
      $this->option('path'),
      config('rzl-ziggy.output.path.main'),
      $lang
    );
    $name = $this->resolveOutputName();
    $finalFile = $this->buildOutputFilePath($basePath['dir'], $name, $lang);

    // Generated new folder
    $this->makeDirectory($finalFile["dir"]);

    if (!$this->option("types-only")) {
      $output = config("rzl-ziggy.output.file", File::class);

      $this->files->put(base_path($finalFile["raw"]), new $output($ziggy, $lang));

      $this->info("✅ Main routes file '{$finalFile["filename"]}' generated at:");
      $this->line("   [" . str_replace('\\', "/", base_path($finalFile["raw"])) . "]");
      $this->newLine();
    }

    if ($this->option("types") || $this->option("types-only")) {
      $types = config("rzl-ziggy.output.types", Types::class);
      $typesPath = str($finalFile["raw"])->replaceLast($finalFile["filename"], "{$finalFile["basename"]}-types.d.ts");

      $this->files->put(base_path($typesPath), new $types($ziggy));

      $this->info("✅ Type definition file 'routes-types.d.ts' generated at:");
      $this->line("   [" . str_replace('\\', "/", base_path($typesPath)) . "]");
      $this->newLine();
    }

    return self::SUCCESS;
  }

  /** @param string $path */
  private function makeDirectory($path)
  {
    // Remove leading slashes to ensure the path is relative
    $path = ltrim($path, '/\\');

    // Resolve the full path relative to the Laravel project root
    $fullPath = str_replace('\\', "/", base_path($path));

    // Create the directory if it does not exist
    if (!$this->files->isDirectory($fullPath)) {
      $this->files->makeDirectory($fullPath, 0755, true, true);

      $this->info("✅ Making new folder generated at:");
      $this->line("   [{$fullPath}]");
      $this->newLine();
    }

    return $fullPath;
  }

  /** * ***Front-End Type (JS/TS).***
   *
   * @return string
   */
  private function resolveLang(): string
  {
    $cliLang = trim((string) $this->option('lang'));

    if (in_array($cliLang, ['ts', 'js'], true)) {
      return $cliLang;
    }

    $configLang = trim((string) config('rzl-ziggy.lang'));

    if (in_array($configLang, ['ts', 'js'], true)) {
      return $configLang;
    }

    return 'ts'; // Default fallback
  }

  private function resolveOutputName(): string
  {
    // Get the initial name from CLI option
    $nameInputOption = $this->option('name');

    // Log raw input type and value
    if (!is_string($nameInputOption)) {
      $this->debugWarn("The '--name' option is not a string. Raw value: " . var_export($nameInputOption, true));
    }

    $nameInput = is_string($nameInputOption) ? trim($nameInputOption) : '';

    if ($nameInput === '') {
      $configName = config('rzl-ziggy.output.name');
      $this->debugWarn("No '--name' provided. Falling back to config value: '$configName'");
      $nameInput = trim($configName);
    }

    if ($nameInput === '') {
      if (config()->has('rzl-ziggy.output.name')) {
        $this->warn("{$this->PREFIX_LOG} Config fallback 'rzl-ziggy.output.name' is also empty. Using default value: 'index'");
      }
      return 'index';
    }

    // Remove leading slashes or backslashes to avoid Git Bash path conversion
    $normalizedInput = ltrim($nameInput, "/\\");
    $name = $normalizedInput !== '' ? $normalizedInput : 'index';

    if ($this->isInvalidName($nameInput)) {
      $typeNameInput = filled($nameInputOption) ? '--name' : 'rzl-ziggy.output.name';

      $this->warn("{$this->PREFIX_LOG} Invalid '{$typeNameInput}' value: '$nameInput'.");
      $this->warn("  - Reason     : Contains path-like characters (e.g. '/', '\\', ':') or starts with a slash.");
      $this->warn("               : Some terminals (e.g. Git Bash, MSYS2, MinGW, Cygwin) may interpret these as absolute paths, depending on your OS and shell.");
      $this->warn("  - Suggestion : Use only a plain filename (without extension). Extension will follow '--lang' or fallback to config('rzl-ziggy.lang', 'ts').");
      $this->warn("  - Action     : Falling back to default name: 'index'\n");
      return 'index';
    }

    // Extract filename without extension, Strip extension if any (user might accidentally pass "index.ts")
    $nameBeforeSanitize = pathinfo($name, PATHINFO_FILENAME);
    $this->debugLine("Raw filename before sanitization: '$nameBeforeSanitize'");

    // Sanitize the name (only keep letters, numbers, underscore, hyphen, dot)
    $sanitizedName = preg_replace('/[^\p{L}\p{N}_\-.]/u', '', $nameBeforeSanitize);

    if ($sanitizedName === null) {
      $this->warn("{$this->PREFIX_LOG} Regex failed. Possibly due to invalid UTF-8 in: '$nameBeforeSanitize'");
      $sanitizedName = ''; // or handle as fatal
    }

    // ✅ Prevent reserved Windows names (e.g. CON, AUX, NUL, COM1)
    $reserved = [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9'
    ];
    if (in_array(strtoupper($sanitizedName), $reserved)) {
      $this->warn("{$this->PREFIX_LOG} Sanitized name '$sanitizedName' is a reserved Windows filename. Appending underscore.");
      $sanitizedName .= '_';
    }

    $this->debugLine("Sanitized filename: '$sanitizedName'");

    // Validate the final result avoid empty name
    if (trim($sanitizedName) === '') {
      $this->error("❌ {$this->PREFIX_LOG} Output filename is empty or invalid after sanitization.");
      $this->error("→ Diagnostic information:");
      $this->error("- Original '--name' input: " . var_export($this->option('name'), true));
      $this->error("- After config fallback: '$nameInput'");
      $this->error("- Before sanitization: '$nameBeforeSanitize'");
      $this->error("- After sanitization: '$sanitizedName'");
      exit(self::INVALID);
    }

    // Truncate to max length (e.g., 50 characters, to be safe)
    $maxLength = 50;
    if (mb_strlen($sanitizedName) > $maxLength) {
      $this->warn("{$this->PREFIX_LOG} Filename too long. Truncating to $maxLength characters.");
      $sanitizedName = mb_substr($sanitizedName, 0, $maxLength);
    }

    return $sanitizedName;
  }

  /**
   * @return array{
   *    raw: string,
   *    dir: string,
   *    filename: string|null,
   *    basename: string|null,
   *    ext: string|null
   * }
   */
  private function buildOutputFilePath(string $dir, string $name, string $lang)
  {
    $finalPath = rtrim($dir, '/\\') . "/" . $name . '.' . $lang;

    // Fix any backslashes to forward slashes
    $finalPath = str_replace('\\', "/", $finalPath);

    return $this->resolveRawPathDetails($finalPath, null, $lang);
  }

  /** Resolve and extract detailed path info.
   *
   * @param  string|null  $argPath
   * @param  string|null  $configPath
   * @param  string|null  $lang
   * @param  string|null  $default
   * @return array{
   *     raw: string,
   *     dir: string,
   *     filename: string|null,
   *     basename: string|null,
   *     ext: string|null
   * }
   */
  private function resolveRawPathDetails(
    ?string $argPath = null,
    ?string $configPath = null,
    ?string $lang = null,
    ?string $default = null
  ) {
    // Normalize language and default to 'ts' if not 'js'
    $lang = strtolower(ltrim($lang ?? '', '.'));
    $lang = $lang === 'js' ? 'js' : 'ts';

    // Determine the raw path: priority → arg > config > default
    $default ??= "resources/rzl-ziggy-routes/index.$lang";
    $raw = filled($argPath)
      ? trim($argPath)
      : (filled($configPath) ? trim($configPath) : $default);

    // Strip query string or fragment (e.g., ?lang=ts#hash)
    $raw = preg_replace('/[?#].*$/', '', $raw);

    // Ensure path is always relative to the Laravel project
    if (Str::startsWith($raw, ['/', "/", "\\", '\\'])) {
      $raw = ltrim($raw, '/\\');
    }

    // Detect if path looks like a file (contains a dot in the basename)
    $looksLikeFile = str_contains(basename($raw), '.');

    $rawBeforeAppendFileName = rtrim($raw, "/");

    // If not a file, treat as a directory and append index.<lang>
    if (!$looksLikeFile) {
      $raw =  $rawBeforeAppendFileName . "/" . "index.$lang";
    }

    if (!$this->isValidOutputPath($raw)) {
      $typePath = filled($argPath) ? "--path" : "rzl-ziggy.output.path.main";

      $valueType = $rawBeforeAppendFileName === "" ? "/" : $rawBeforeAppendFileName;
      $this->error("{$this->PREFIX_LOG} Invalid characters or structure in output path from '{$typePath}': \"{$valueType}\"");

      if (filled($argPath)) {
        $this->error("  - Reason : Path-like characters (e.g. '//', '\\\\', ':') or start with a slash/backslash — Some terminals (e.g. Git Bash, MSYS2, MinGW, Cygwin) may automatically convert inputs these into absolute paths, depending on your OS and shell.");
      }

      exit(self::INVALID);
    }

    // Parse path info
    $info = pathinfo($raw);


    // 🔒 Ensure file contains both filename and extension
    if (!isset($info['filename']) || !isset($info['extension'])) {
      $this->error("{$this->PREFIX_LOG} Invalid path. Filename or extension missing in: \"$raw\"");
      exit(self::INVALID);
    }

    // 🔧 If extension is invalid or missing, fix it to match target language
    if (!isset($info['extension']) || $info['extension'] !== $lang) {
      $raw = ($info['dirname'] ?? '') . "/" . ($info['filename'] ?? 'index') . '.' . $lang;
      $info = pathinfo($raw); // Re-parse after fix
    }

    // $this->info($raw);

    // Normalize paths to use forward slashes (for cross-platform and JS output)
    $normalizedRaw = str_replace('\\', "/", $raw);
    $normalizedDir = str_replace('\\', "/", $info['dirname'] ?? dirname($raw));

    return [
      'raw'      => $normalizedRaw,                   // full path including filename
      'dir'      => $normalizedDir,                   // directory path
      'filename' => $info['basename'] ?? null,        // filename with extension
      'basename' => $info['filename'] ?? null,        // filename without extension
      'ext'      => $info['extension'] ?? $lang,      // file extension
    ];
  }

  /** Validate output path according to cross-platform rules.
   * (Reuse your isValidOutputPath function here)
   */
  private function isValidOutputPath(string $raw): bool
  {
    // Normalize separator
    $path = str_replace('\\', "/", trim($raw));
    $basename = basename($path);
    $dirname = dirname($path);

    if (strlen($basename) > 255 || strlen($path) > 4096) {
      return false;
    }

    if (trim($raw) === '' || preg_match('/^[\s\'\"\.\-\/\\\\]*$/', $raw)) {
      return false;
    }

    if (preg_match('/[:*?"\'<>|@~,;#$%^&*()!=+]/', $path) || preg_match('/[\x00-\x1F\x7F]/', $path)) {
      return false;
    }

    $parts = explode('/', $path);
    foreach ($parts as $part) {
      if ($part === '') continue;

      if (
        preg_match('/[\'<>:"|?*@\+]/', $part) ||
        preg_match('/[\x00-\x1F\x7F]/', $part) ||
        $part === '.' || $part === '..'
      ) {
        return false;
      }
    }

    if (preg_match('/^[-.]/', $basename)) {
      return false;
    }

    if (
      strpos($path, '..') !== false ||
      preg_match('#(^|/)\.{1,}(/|$)#', $path) ||
      strpos($path, '//') !== false
    ) {
      return false;
    }

    if (
      in_array($basename, ["'", '"', '-', '', '.', '..']) ||
      $dirname === '-'
    ) {
      return false;
    }

    $reserved = [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9'
    ];
    if (in_array(strtoupper(pathinfo($basename, PATHINFO_FILENAME)), $reserved)) {
      return false;
    }

    return true;
  }

  private function isInvalidName(string $name): bool
  {
    return trim($name) === '' ||
      in_array($name, ['.', '..', '/', '\\'], true) ||
      preg_match('/^[\/\\\\]/', $name) ||   // starts with slash or backslash
      preg_match('/[\/\\\\:]/', $name);     // contains any of those
  }

  private function debugWarn(string $message): void
  {
    if ($this->getOutput()->getVerbosity() >= OutputInterface::VERBOSITY_DEBUG) {
      $this->warn("{$this->PREFIX_LOG} $message");
    }
  }

  private function debugLine(string $message): void
  {
    if ($this->getOutput()->getVerbosity() >= OutputInterface::VERBOSITY_DEBUG) {
      $this->line("{$this->PREFIX_LOG} $message");
    }
  }
}
