<?php
/***********************************************************
* a starter version of a package service
* You should probably rewrite this since I'm no PHP expert
*/

$cachedir = dirname(__FILE__) . '/cache';
$validFiles = array();

// put params in order, maybe not necessary but just in case
ksort($_GET, SORT_STRING);

// determine valid file requests
foreach( $_GET as $requestedFile ) {	
	if ( inWhiteList($requestedFile) ) {
		$validFiles[] = $requestedFile;
	}
}

// create unique filename based on valid file requests
// we use this for caching to disk
$cachefile = md5(implode('#', $validFiles));
$cachefullpath = $cachedir .'/'. $cachefile;

$expires = 60*60*24*365*10; // 10 yrs
$contentType = endsWith(current($_GET), '.js') ? 'text/javascript' : 'text/css';


if ( file_exists($cachefullpath) ) {
	if ( $fp = fopen($cachefullpath, 'rb') ) {
		header("Content-Encoding: gzip");	
		header("Content-Type: " . $contentType);
		header("Content-Length: " . filesize($cachefullpath));
		header('Expires: '. gmdate( 'D, d M Y H:i:s', time() + $expires ) .' GMT');
		header('Cache-Control: max-age=' . $expires);
		fpassthru($fp);
		fclose($fp);
		exit;
	}
}


$output = '';
$pathToPkgAssets = '../lib/1-0-0/';
foreach( $validFiles as $validFile ) {	
	$output .= file_get_contents($pathToPkgAssets . $validFile);	
}

	
$output = gzencode($output, 9, FORCE_GZIP);
header("Content-Encoding: gzip");
header("Content-Type: " . $contentType);
header('Content-Length: ' . strlen($output));
header('Expires: '. gmdate( 'D, d M Y H:i:s', time() + $expires ) .' GMT');
header('Cache-Control: max-age=' . $expires);
echo $output;


// store the file in cache
if ($fp = fopen($cachefullpath, 'wb')) {
	fwrite($fp, $output);
	fclose($fp);
}



/* functions */

function inWhiteList ($path) {		
	return strpos($path, './') === false && 
			strpos($path, '~') === false &&
			stripos($path, 'jquery') === 0 &&
			(
				endsWith($path, '.js') ||
				endsWith($path, '.css')
			);
}

function endsWith ($string, $test) {
    $strlen = strlen($string);
    $testlen = strlen($test);

    if ($testlen > $strlen) {
		return false;
	}
	
    return substr_compare($string, $test, -$testlen, $testlen, true) === 0;
}

?>