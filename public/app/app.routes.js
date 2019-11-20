angular.module('routerRoutes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/views/pages/login.html',
                controller: 'loginController',
                controllerAs: 'login'
            })
            .when('/admin/student', {
                templateUrl: 'app/views/pages/student.html',
                controller: 'studentController',
                controllerAs: 'student'
            })
            .when('/contact', {
                templateUrl: 'views/pages/contact.html',
                controller: 'contactController',
                controllerAs: 'contact'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })