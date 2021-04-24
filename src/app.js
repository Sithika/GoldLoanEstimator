angular.module("app", []).controller("HelloWorldCtrl", function($scope, $http) {  
    $scope.message="Hello World";
    $scope.syncBtn = function() {
        // alert("clicking ..sync")
        $http.get('/readXl').then(function (response) {
            $scope.message=response;
            // console.log("readXl response= " + JSON.stringify(response));
        });
    }
    })