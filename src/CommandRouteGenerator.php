<?php

namespace RzlApp\Ziggy;

use Illuminate\Support\Str;
use RzlApp\Ziggy\Output\File;
use RzlApp\Ziggy\Output\Types;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use RzlApp\Ziggy\Helpers\RzlZiggyHelper;

class CommandRouteGenerator extends Command
{
  protected $signature = "rzl-ziggy:generate
                        {path? : Path to the generated JavaScript file. Default: `resources/js/ziggy.js`.}
                        {--lang= : Using JavaScript or TypeScript? Default: `ts`, default value is (`js`|`ts`), Note: If lang value is invalid or empty, will force to ts (.ts)!.}
                        {--types : Generate a TypeScript declaration file.}
                        {--types-only : Generate only a TypeScript declaration file.}
                        {--url=}
                        {--group=}";

  protected $description = "Generate a JavaScript file containing Ziggy’s routes and configuration.";


  public function __construct(protected Filesystem $files)
  {
    parent::__construct();
  }

  public function handle()
  {
    $this->alert("Starting to generating at rzl-ziggy, please wait a sec, instans generating...");

    $ziggy = new RzlZiggy($this->option("group"), $this->option("url") ? url($this->option("url")) : null);

    $scriptLanguage = $this->option("lang") ?? config("rzl-ziggy.lang");
    if (!in_array($scriptLanguage, ["ts", "js"])) {
      $scriptLanguage = "ts";
    }

    $nameFile = $this->argument("path") ?? config("rzl-ziggy.output.path.main", "resources/routes/index.$scriptLanguage");
    $extFile = str($nameFile)->match("/\.([0-9a-zA-Z]+)(?=[^a-zA-Z])|(?:[a-zA-Z]+)$/")->toString();

    if (!in_array($extFile, ["ts", "js"])) {
      $this->error('Invalid extension path argument: "' . $extFile . '". Supported runtimes are `ts` and `js` only.');

      return self::INVALID;
    }

    $this->makeDirectory(
      $path = str(
        $this->argument("path") ??
          config("rzl-ziggy.output.path.main", "resources/routes/index.$scriptLanguage")
      )->replaceLast($extFile, $scriptLanguage)->toString()
    );

    $this->makeDirectory(
      $pathTypes = str(
        $this->argument("path") ??
          config("rzl-ziggy.output.path.main", "resources/routes/types.$scriptLanguage")
      )->replaceLast($extFile, $scriptLanguage)->toString()
    );

    if (!$this->option("types-only")) {
      $output = config("rzl-ziggy.output.file", File::class);

      $this->files->put(base_path($path), new $output($ziggy, $scriptLanguage));
    }

    if ($this->option("types") || $this->option("types-only")) {
      $types = config("rzl-ziggy.output.types", Types::class);

      $nameFile = (str($nameFile)->beforeLast(".")->contains("/") ? str($nameFile)->beforeLast(".")->afterLast("/") : str($nameFile)->beforeLast("."))->toString();

      $this->files->put(base_path(Str::replaceLast("$nameFile.$scriptLanguage", "types.d.ts", $pathTypes)), new $types($ziggy));

      $this->info("File types as (.d.ts) generated => [" . base_path(RzlZiggyHelper::getPathFile(Str::replaceLast("$nameFile.$scriptLanguage", "types.d.ts", $pathTypes), true, true)) . "]");

      if ($this->option("types-only")) {

        return self::SUCCESS;
      }
    }

    $this->info("File main file routes (.$scriptLanguage) generated => [" . base_path(RzlZiggyHelper::getPathFile($path, true, true)) . "]");

    return self::SUCCESS;
  }

  /** @param string $path */
  protected function makeDirectory($path)
  {
    $pathFolder = RzlZiggyHelper::getPathFile(
      dirname(base_path($path)),
      true,
      true
    );

    if (!$this->files->isDirectory($pathFolder)) {
      $this->info("Make folder file at [{$pathFolder}]");

      $this->line("");

      $this->files->makeDirectory($pathFolder, 0755, true, true);
    }

    return $path;
  }
}
