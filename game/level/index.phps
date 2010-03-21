<?php
/*
 * An extremely simple level server in PHP. 
 * This should run on any PHP installation that has `exec`.
 *
 * User is expected to provide something better. :-)
 *
 * This URL will be called with the get parameter `played`
 * containing a comma delimited sequence of keywords the player
 * has played through. You should not serve those keywords.
 * (Not done by this script).
 *
 */

$levelfile = "../../levels.txt";

ini_set( "display_errors", 0 );
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" ); 
header( "Cache-Control: no-cache, must-revalidate" ); 
header( "Pragma: no-cache" );
header( "Content-type: application/json" );

$max = exec( "wc -l $levelfile | awk '{ print $1 }'" );
$lnum = rand( 0, $max );
echo exec( "awk 'NR==$lnum' $levelfile" );

