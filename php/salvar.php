<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["historia"])) {
    $historia = trim($_POST["historia"]);
    $historia = str_replace("\r\n", "\n", $historia);
    file_put_contents("../txt/historias.txt", $historia . "\n-----\n", FILE_APPEND);
    echo "OK";
}
