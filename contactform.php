<?php

if(isset($_POST['submit'])){

$name = $_POST['name'];
$mailFrom = $_POST['email'];
$message = $_POST['message'];

$subject="web page email from ".$name;

$mailTo="hola@michgonzalez.com";
$headers="From: ".$mailFrom."";
$txt="You have recieved an e-mail from ".$name.".\n\n".$message;
   
mail($mailTo, $subject, $txt, $headers);
header("Location: indexportfolio.html?hola");


}
