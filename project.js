angular.module('project', ['ratings','ngRoute','firebase','angularFileUpload'])

.value('fbURL', 'https://amber-fire-7013.firebaseio.com/projects/')

.config(function($routeProvider) {
$routeProvider
    .when('/login', {
    controller:'loginCtrl',
    templateUrl:'login.html'
    })
    .when('/', {
    controller:'mainCtrl',
    templateUrl:'home.html'
    })
    .when('/login', {
    controller:'loginCtrl',
    templateUrl:'login.html'
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

.factory('Projects', function($firebase, fbURL, $timeout, $q) {
        return $firebase(new Firebase(fbURL));
})


.factory('login', function($firebase, fbURL, $timeout, $q, $location) {
        var chatRef = new Firebase(fbURL);
        var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
          if (error) {
          } else if (user) {
          } else {
          }
        })
        return auth;
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


function mainCtrl($scope,$location,$routeParams, Model, Projects,fbURL, $firebase, $timeout, login) {
        $scope.projects = Model.projects();

        $scope.deleteProject = function(id) {
            var projectUrl = fbURL + id;
            $scope.project = $firebase(new Firebase(projectUrl));
            $scope.project.$remove();
        }


    }


    function loginCtrl($scope, $location,$routeParams, Model, Projects,fbURL, $firebase, $timeout, login) {
            alert(login.status());

            $scope.login = function() {
            login.login('password', {
                email: $scope.email,
                password: $scope.password,
              })
            $timeout(function(){
                if(login.user) {
                    alert(JSON.stringify(login));
                }
                else {
                    alert(JSON.stringify(login));
                }
                
            },1500)

            }

            $scope.logout = function() {
              login.logout();
            }
    }



function projectCtrl($scope,$routeParams, Model,Projects,fbURL, $firebase, $timeout) {
         $timeout(function() { 
            $scope.project = Projects[$routeParams.projectid];
            $scope.id = $routeParams.projectid;
          },300);
    }


function addCtrl($scope,$upload, $location, Model, Projects, $timeout,$firebase) {

        $scope.addTodo = function() {
        Projects.$add($scope.project, function() {
            $timeout(function() { $location.path('/'); });
        });
        }


        $scope.onFileSelect = function($files) {
            $(".imagePreview").show();
        var file = $files[0];
        if (file.type.indexOf('image') == -1) {
             $scope.error = 'image extension not allowed, please choose a JPEG or PNG file.'            
        }
        if (file.size > 2097152){
             $scope.error ='File size cannot exceed 2 MB';
        }
        if($scope.error!="") {
        $scope.upload = $upload.upload({
            url: 'fileUpload.php',
            data: {myObj: $scope.myModelObj},
            file: file, 
          }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            $scope.project.file = data;
          });
        }
        }

    };

function editCtrl($scope, $location, Model, $routeParams, Projects,fbURL, $timeout, $firebase) {
    $timeout(function() { 
            var projectUrl = fbURL + $routeParams.projectid;
            $scope.project = $firebase(new Firebase(projectUrl));
            $scope.id = $routeParams.projectId;

          },200);

         $scope.editProjects = function() {
                 $scope.project.$save();
                 $location.path('/')
                }  
        }







