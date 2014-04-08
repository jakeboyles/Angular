<?php
include "image-resize.php";
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);
if (in_array($extension, $allowedExts))
  {
  if ($_FILES["file"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    }
  else
    {

    if (file_exists("uploads/" . $_FILES["file"]["name"]))
      {
      echo $_FILES["file"]["name"];
      }
    else
      {
      $original_image = $_FILES['file']['name'];
      $image = new ImageResize($_FILES["file"]["tmp_name"]);
      $image->resizeToHeight(800);
      $image->save($_FILES["file"]["tmp_name"]);

      $temper = rand();

      move_uploaded_file($_FILES["file"]["tmp_name"],
      "uploads/".$temper . $_FILES["file"]["name"]);
      echo $temper.$_FILES["file"]["name"];
      }
    }
  }
else
  {
  echo "Invalid file";
  }
?> 