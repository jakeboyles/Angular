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

    if (2==1)
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

      $newFile = getcwd()."/uploads/".$temper.urlencode($_FILES["file"]["name"]);

      move_uploaded_file($_FILES["file"]["tmp_name"],
      $newFile);

      if (!class_exists('S3')) require_once 's3.php';

      // AWS access info
      if (!defined('awsAccessKey')) define('awsAccessKey', 'AKIAIYHS42A3YNAGOG3Q');
      if (!defined('awsSecretKey')) define('awsSecretKey', '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');

      $uploadFile = $newFile; // File to upload, we'll use the S3 class since it exists
      $bucketName = 'ChowPics'; // Temporary bucket

      // If you want to use PECL Fileinfo for MIME types:
      //if (!extension_loaded('fileinfo') && @dl('fileinfo.so')) $_ENV['MAGIC'] = '/usr/share/file/magic';


      // Check if our upload file exists
      if (!file_exists($uploadFile) || !is_file($uploadFile))
      exit("\nERROR: No such file: $uploadFile\n\n");

      // Check for CURL
      if (!extension_loaded('curl') && !@dl(PHP_SHLIB_SUFFIX == 'so' ? 'curl.so' : 'php_curl.dll'))
      exit("\nERROR: CURL extension not loaded\n\n");

      // Pointless without your keys!
      if (awsAccessKey == 'change-this' || awsSecretKey == 'change-this')
      exit("\nERROR: AWS access information required\n\nPlease edit the following lines in this file:\n\n".
      "define('awsAccessKey', 'change-me');\ndefine('awsSecretKey', 'change-me');\n\n");

      // Instantiate the class
      $s3 = new S3(awsAccessKey, awsSecretKey);

      // Put our file (also with public read access)
      if ($s3->putObjectFile($uploadFile, $bucketName, baseName($uploadFile), S3::ACL_PUBLIC_READ)) {
      echo "https://s3.amazonaws.com/ChowPics/".baseName($uploadFile).PHP_EOL;
      } else {
      echo "S3::putBucket(): Unable to create bucket (it may already exist and/or be owned by someone else)\n";
      }

      }
    }
  }
else
  {
  echo "Invalid file";
  }
?> 