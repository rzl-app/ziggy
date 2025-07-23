<?php

use Illuminate\Support\Str;

if (!function_exists("getQueryParams")) {
  /** * Get Query Params from Request
   *
   * Returns the string of URL's query (includes leading "?" if non-empty).
   */
  function getQueryParams(null|\Illuminate\Http\Request $request = null): string
  {
    $req = $request ?? request();

    $uri = Str::of($req->getRequestUri());

    if (!empty($req->query())) {
      // count(request()->query()) > 0
      return $uri->replaceFirst($uri->split('[\?]')[0], "");
    }

    return "";
    // return $uri->contains("?") ? $uri->replaceFirst($uri->split('[\?]')[0], "") : "";
  }
}

if (!function_exists("getAllPreviousRequestQuery")) {
  /** * Get All of Previus Query Params from Request
   *
   * If params `$key` is not null it will be return string or null, otherwise return array.
   *
   * @return array|string|null
   */
  function getAllPreviousRequestQuery(?string $key = null, null|\Illuminate\Http\Request $request = null): array|string|null
  {
    $req = $request ?? request();
    $reqQuery = $req->query(); //?:
    (parse_str(parse_url(url()->previous())["query"] ?? "", $RequestURLParsing));
    $reqQuery = $reqQuery ?: $RequestURLParsing;

    if (!is_null($key)) {
      return collect(collect($reqQuery)->toArray())->get($key, null);
    }

    return collect($reqQuery)->toArray();
  }
}
