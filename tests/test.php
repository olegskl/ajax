<?php

$method = $_SERVER['REQUEST_METHOD'];
$a = $_REQUEST['a'];
$body = file_get_contents('php://input');

echo $method . ': "' . $a . '" body="' . $body . '"';

?>