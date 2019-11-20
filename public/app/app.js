angular.module('onlineTestApp', ['routerRoutes'])
    .controller('userController', function ($scope, $http, $location) {
        var vm = this;
        vm.message = "Data binding";
        $http.get("/api/users")
            .success(function (data) {
                if (data) {
                    vm.user = data;
                }
            })
            .error(function (data, status) {
                $location.path('/login');
            });
    })
    .controller('studentController', function ($scope, $http, $location) {
        var vm = this;
        vm.message = "Data binding";
        $http.get("/api/users")
            .success(function (data) {
                if (data) {
                    vm.data = data;
                }
            })
            .error(function (data, status) {
                $location.path('/');
                console.log(data);
            });
    });
