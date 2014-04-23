'use strict';

// Jake Ideas
//..............................

// When they click on the pic on the home it flips to a map of where its located... awesome
// Include Yelp Reviews by getting them using the location and the keyword (http://www.yelp.com/developers/documentation/v2/search_api)



angular.module('project', ['ratings','ngRoute','firebase','angularFileUpload','wu.masonry'])

.value('fbURL', 'https://amber-fire-7013.firebaseio.com/projects/')

.config(function($routeProvider) {
$routeProvider
    .when('/', {
    controller:'mainCtrl',
    templateUrl:'home.html'
    })
    .when('/add', {
    controller:'addCtrl',
    templateUrl:'add.html'
    })
    .when('/projects/:projectid/edit', {
    controller:'editCtrl',
    templateUrl:'edit.html'
    })
    .when('/projects/:projectid', {
    controller:'projectCtrl',
    templateUrl:'project.html'
    })
    .otherwise({
    redirectTo:'/'
    });
})


.factory('maps',function($http,$timeout,$q) {
return {
    zip: function (zip) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var city;
            $.zipLookup(                                            
                zip,                                      
                function(cityName, stateName, stateShortName){      
                    city = cityName+","+stateName;
                    deferred.resolve(city);
                },
                function(errMsg){                                  
                    city="error";      
                });

        return promise
        .then(function(response) {
            return response;
        })
    }
}})


.factory('Projects', function($firebase, fbURL, $timeout, $q) {
    return $firebase(new Firebase(fbURL));
})

.factory('Facebook', function($http) {
    return {
        askFacebookForBio:function(fail, success) {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me/', success);
                } else {
                    fail('User cancelled login or did not fully authorize.');
                }
            })
        },
        logIn:function () {
            var status ="";
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    status = uid;
              } else if (response.status === 'not_authorized') {
                    status = false;
              } else {
                    status = false;
              }
            });
            return status;
        }
    }
})


.factory ('Model', function ($firebase,fbURL, Projects) {
    return {
        projects:function () {
            return Projects;
        },
        get:function(theID){
            return Projects[theID];
        },
        add:function (headline,content,type) {
            var currentIndex = data.length;
            var project = new Object();
        },
        edit:function (id,headline,content,type) {
            data[id].type =type;
            data[id].content =content;
            data[id].headline = headline; 
        },
        delete:function (id) {
            var oldNotes = data;
            data = [];
            angular.forEach(oldNotes, function (note) {
                if (note.id !== id) data.push(note);
            });
        }
    }
})


function mainCtrl($scope,$location,$routeParams, Model, Projects,fbURL, $firebase, $timeout,Facebook,$rootScope, maps) {

    $timeout(function() {
        if(Facebook.logIn()!="0"){
            $scope.loginButton = "Logout";
        }
        else {
            $scope.loginButton = "Login"
        }
    },200)

     $scope.fbLogin = function() {
        if(Facebook.logIn()!=false){
            FB.logout();
        }
        else {
            FB.login();
            $scope.loginButton = "Logout";
        }
     }

    $scope.projects = Model.projects();

    $scope.deleteProject = function(id) {
        var projectUrl = fbURL + id;
        $scope.project = $firebase(new Firebase(projectUrl));
        $scope.project.$remove();
    }

}

function projectCtrl($scope,$routeParams, Model,Projects,fbURL, $firebase, $timeout) {
    $timeout(function() { 
        $scope.project = Projects[$routeParams.projectid];
        $scope.id = $routeParams.projectid;
    },200);
}


function addCtrl($scope, $upload, $location, Model, Projects, $timeout,$firebase,Facebook,maps) {

    var latitude,longitude;

    var init = function () {
        if (navigator.geolocation)
        {
           console.log(navigator.geolocation.getCurrentPosition(showPosition));
        }
        else{
           alert("Geolocation is not supported by this browser.");
        }

      function showPosition(position)
      {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
      }
    };

    $scope.addTodo = function() {

        Facebook.askFacebookForBio(
            function(reason) { // fail
                $scope.error = reason;
                }, function(user) { // success
                    $scope.project.userName = user.name;
                    $scope.project.lat = latitude;
                    $scope.project.long = longitude;
                    $scope.project.city = maps.zip($scope.project.zipcode);
                    $scope.$digest() // Manual scope evaluation
                    Projects.$add($scope.project, function() {
                        $timeout(function() { 
                            $location.path('/'); 
                        });
                    });
                }
    )}

    $scope.onFileSelect = function($files) {
        $(".imagePreview").show();

        var file = $files[0];

        if (file.type.indexOf('image') == -1) {
            $scope.error = 'image extension not allowed, please choose a JPEG or PNG file.' ;
        }

        if (file.size > 3097152){
            $scope.error ='File size cannot exceed 2 MB';
        }

        if(!$scope.error) {
            console.log("made it");
            $scope.upload = $upload.upload({
                url: 'fileUpload.php',
                data: {myObj: $scope.myModelObj},
                file: file, 
              })
            .progress(function(evt) {
                if(parseInt(100.0 * evt.loaded / evt.total)<100) {
                    $("#showing").show();
                }
                else {
                   $("#showing").hide(); 
                }
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                console.log(parseInt(100.0 * evt.loaded / evt.total));
            })
            .success(function(data, status, headers, config) {
                $scope.project.file = data;
            });
        }

        else {
            $scope.error=null;
        }
    }

    init();
};

function editCtrl($scope, $location, Model, $routeParams, Projects,fbURL, $timeout, $firebase,maps) {
    var latitude,longitude;


    var init = function () {
        if (navigator.geolocation)
        {
            console.log(navigator.geolocation.getCurrentPosition(showPosition));
        }
        else{
            alert("Geolocation is not supported by this browser.");
        }

        function showPosition(position)
        {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        }
    };


    $timeout(function() { 
        var projectUrl = fbURL + $routeParams.projectid;
        $scope.project = $firebase(new Firebase(projectUrl));
        $scope.id = $routeParams.projectId;
    },200);


    $scope.editProjects = function() {
        console.log(latitude+" "+longitude);
        maps.zip($scope.project.zipcode)
            $scope.project.lat = latitude;
            $scope.project.long = longitude;
            $scope.project.$save();
            $location.path('/');
    }

    init();

}