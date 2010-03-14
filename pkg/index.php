<?php
/***********************************************************
* A starter package service. Use at your own risk.
* If writing your own you may want to look at the following
* http://code.google.com/p/minify/ 
* 
*/

$expires = 60*60*24*365*10; // length of expires headers - 10 yrs
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

$contentType = getContentType($validFiles);
$encoding = getEncoding();
 
// create unique filename based on valid file requests
// we use this for caching to disk
$cachefile = md5( implode($validFiles) . $encoding );
$cachefullpath = $cachedir .'/'. $cachefile;


// check if this file has already been created/cached
if ( file_exists($cachefullpath) ) {
	if ( $fp = fopen($cachefullpath, 'rb') ) {
		setHeaders($encoding, $contentType, filesize($cachefullpath), $expires);
		fpassthru($fp);
		fclose($fp);
		exit;
	}
}


// request not yet cached
$output = '';
$pathToPkgAssets = '../lib/1.1.0/';
foreach( $validFiles as $validFile ) {	
	$output .= file_get_contents($pathToPkgAssets . $validFile);	
}

if ( 'none' != $encoding ) {
	$output = gzencode($output, 9, ($encoding == 'gzip' ? FORCE_GZIP : FORCE_DEFLATE));	
}

setHeaders($encoding, $contentType, strlen($output), $expires);

echo $output;

// store the file in disk cache
if ($fp = fopen($cachefullpath, 'wb')) {
	fwrite($fp, $output);
	fclose($fp);
}



/* functions */

function setHeaders ($encoding, $contentType, $contentLength, $expires) {
	if ( 'none' != $encoding ) {
		header('Content-Encoding: ' . $encoding);	
	}	
	header('Content-Type: ' . $contentType);
	header('Content-Length: ' . $contentLength);
	header('Expires: '. gmdate( 'D, d M Y H:i:s', time() + $expires ) .' GMT');
	header('Accept-Encoding: Vary');
}




function getEncoding () {
	$userAgent = $_SERVER['HTTP_USER_AGENT'];
	$acceptEncoding = $_SERVER['HTTP_ACCEPT_ENCODING']; 
	$encoding = 'none';

	// don't encode in IE versions less than 7 to be completely safe
	if (strpos($userAgent, 'Mozilla/4.0 (compatible; MSIE ') === 0 && 
		strpos($userAgent, 'Opera') === false &&
		7 > ((float)substr($userAgent, 30))
		) {
		// encoding already set
	} else {	
		if (strstr($acceptEncoding, 'gzip')) {
			$encoding = 'gzip';

		} elseif (strstr($acceptEncoding, 'deflate')) {
			$encoding = 'deflate';		
		}
	}
	return $encoding;
}


function getContentType ($validFiles) {
	return endsWith(current($validFiles), '.js') ? 
		'text/javascript' : 
		'text/css';
}

// determines if $path is allowed
function inWhiteList ($path) {		
	return strpos($path, './') === false && 
			strpos($path, '~') === false &&
			stripos($path, 'jquery') === 0 &&
			(
				endsWith($path, '.js') ||
				endsWith($path, '.css')
			);
}

// determines if $string ends with $test
function endsWith ($string, $test) {
    $strlen = strlen($string);
    $testlen = strlen($test);

    if ($testlen > $strlen) {
		return false;
	}
	
    return substr_compare($string, $test, -$testlen, $testlen, true) === 0;
}

?>