<?php
/***********************************************************
* a starter version of a package service
* You should probably rewrite this since I'm no PHP expert
*/


$output = '';


// put params in order, maybe not necessary but just in case
ksort($_GET, SORT_STRING);


// ensure files are cached client side
$expires = 60*60*24*365*10; // 10 yrs
header('Expires: '. gmdate( 'D, d M Y H:i:s', time() + $expires ) .' GMT');


$contentType = endsWith( current($_GET), '.js') ? 'text/javascript' : 'text/css';	
header("Content-Type: " . $contentType);


$pathToPkgAssets = '../lib/1-0-0/';
foreach( $_GET as $requestedFile) {	
	if ( inWhiteList($requestedFile) ) {
		$contents = file_get_contents($pathToPkgAssets . $requestedFile);	
		if ($contents) {
			$output .= $contents;
		}
		
	}
}


// TODO - cache the resulting concated files server side
echo $output;



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