angular.module('HomePageModule', []).factory('facebookConnect', function() {
    return new function() {
        this.askFacebookForPhotos = function(fail, success) {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me/picture?redirect=0&height=200&type=normal&width=200', success);
                } else {
                    fail('User cancelled login or did not fully authorize.');
                }
            });
        },
        this.askFacebookForBio = function(fail, success) {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me', success);
                } else {
                    fail('User cancelled login or did not fully authorize.');
                }
            });
        },
        this.askFacebookForFeed = function(fail, success) {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me/feed', success);
                } else {
                    fail('User cancelled login or did not fully authorize.');
                }
            });
        }

    }
});

function ConnectCtrl(facebookConnect, $scope, $resource) {

    $scope.user = {}
    $scope.error = null;

    $scope.registerWithFacebook = function() {
        facebookConnect.askFacebookForPhotos(
        function(reason) { // fail
            $scope.error = reason;
        }, function(user) { // success
            $scope.photos = user
            $scope.$digest() // Manual scope evaluation
        })

        facebookConnect.askFacebookForBio(
        function(reason) { // fail
            $scope.error = reason;
        }, function(user) { // success
            $scope.bio = user
            $scope.$digest() // Manual scope evaluation
        });

        facebookConnect.askFacebookForFeed(
        function(reason) { // fail
            $scope.error = reason;
        }, function(user) { // success
            $scope.feed = user
            $scope.$digest() // Manual scope evaluation
        });
    }

}

ConnectCtrl.$inject = ['facebookConnect', '$scope', '$resource'];
