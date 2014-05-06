<?php
  // Remember to copy files from the SDK's src/ directory to a
  // directory in your application on the server, such as php-sdk/
  require_once('facebook-php-sdk/src/facebook.php');

  $config = array(
    'appId' => '408089229326944',
    'secret' => '3730b3afd6698f0c720763f60c1c6cf9',
    'allowSignedRequest' => false // optional but should be set to false for non-canvas apps
  );

  $facebook = new Facebook($config);
  $user_id = $facebook->getUser();
?>
<html>
  <head></head>
  <body>

  <?php
    if($user_id) {

      // We have a user ID, so probably a logged in user.
      // If not, we'll get an exception, which we handle below.
      try {

        $friends = $facebook->api('/me/links');
        //echo "Name: " . $user_profile['name'];
        //echo "<br>Profile:".$user_profile['bio'];
        //$work = $user_profile['work'];
        //echo json_encode($work);
         //foreach($work as $cat) {
           //echo "<br>Position: ".$cat["position"]['name'];
         //}


         $links = $friends['data'];

         foreach($links as $link) {
          echo "<br><a href='".$link["link"]."'>".$link['name']."</a>";
         }


      } catch(FacebookApiException $e) {
        // If the user is logged out, you can have a 
        // user ID even though the access token is invalid.
        // In this case, we'll get an exception, so we'll
        // just ask the user to login again here.
        $login_url = $facebook->getLoginUrl(array(
        'scope'=>array('user_work_history,user_friends,user_photos,read_stream'), /* you should only have to request the new permission, but can include them all */
        'redirect_uri'=>"http://fbdev.com"
        )); 
        echo 'Please <a href="' . $login_url . '">login.</a>';
        error_log($e->getType());
        error_log($e->getMessage());
      }   
    } else {
      echo $user_id;


    $login_url = $facebook->getLoginUrl(array(
        'scope'=>array('user_work_history,user_friends,user_photos'), /* you should only have to request the new permission, but can include them all */
        'redirect_uri'=>"http://fbdev.com"
        )); 

      // No user, print a link for the user to login
      echo 'Please <a href="' . $login_url . '">login.</a>';

    }

  ?>

  </body>
</html>