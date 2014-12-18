angular.module('starter.controllers', [])

.controller('loginController', function ($scope, $stateParams, $state, AuthService){
	$scope.doLogin = function(){
		console.log('attempting login');
		AuthService.login();
	};
	
	$scope.$on('loggedIn', function (event,message) {
	    if (message.loggedIn === true) { 
			console.log('LOGGED IN!');
			$state.go('main');
		} else {
			console.log('NOT LOGGED IN!');
			$scope.modal.show();
		}
	});
})

.controller('mainController', function ($scope, $stateParams, $ionicModal, $http, $ionicPopup, $timeout, $ionicLoading, $state, AuthService) {
	
	if (!AuthService.checkLogin()){
		$state.go('main');
	}
	
    $ionicModal.fromTemplateUrl('templates/newReport.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.userReport = {
		type: null,
		comment: null
	};
		
	$scope.trimComment = function(){
		$scope.userReport.comment = $scope.userReport.comment.substring(0,160);
	}
		
	$scope.cancelReport = function() {
		if ($scope.userReport.type != null || $scope.userReport.comment != null){
   			var discardPopup = $ionicPopup.confirm({
     			title: 'New Report',
     			template: 'Discard this report?',
				scope: $scope,
				cancelText: 'Cancel',
				okText: 'Discard', 
				okType: 'button-assertive'
   			});
   			discardPopup.then(function(result) {
				if(result) {
					$scope.userReport.type = null;
					$scope.userReport.comment = null;
					$scope.modal.hide();
     			}
   			});
		} else {
			$scope.modal.hide();
		}
 	};
	
	$scope.showSettings = function() {
		var settingsPopup = $ionicPopup.show({
			title: 'Log Out',
			subTitle: 'Are you sure you want to log out?',
    		scope: $scope,
			buttons: [
				{ text: 'Log Out',
				  onTap: function(e) {
				  	  AuthService.logout();
					  $state.go('login');
					
				  }
				},
      			{ text: 'Cancel' }
			]
		});
		settingsPopup.then(function(result){
			console.log(result);
		});
	};
    
    $scope.newReport = function() {
        $scope.modal.show();				
    };
    
    $scope.doReport = function() {
		$ionicLoading.show({
      		template: '<i class="icon ion-loading-c"></i> Reporting...'
    	});
				
		$timeout(function() {
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
		$http({
			method: 'POST',
			url: 'http://www.shaf2kstudios.com/sample/wtt/api/v1/report.php',
			headers: {'Content-Type': 'application/json'},
			data: $scope.userReport
		}).success(function(data){
			//console.log(data);
			$scope.userReport.type = null;
			$scope.userReport.comment = null;
			$scope.modal.hide();
		}).error(function(data){
			var alertPopup = $ionicPopup.alert({
     			title: 'Error!',
     			template: 'Unable to post your traffic report at this time. Please try again later.'
   			});
   			alertPopup.then(function(res) {
   			});
		});
		$ionicLoading.hide();
		}, 1000);
		$scope.doRefresh(false);
    };
    
    $scope.doRefresh = function(manual) {
    	$http.get('http://www.shaf2kstudios.com/sample/wtt/api/v1/fetch.php')
		.success(function(data) {
       		$scope.items = data;
     	}).error(function(){
			$scope.items = [];
			var alertPopup = $ionicPopup.alert({
     			title: 'Error!',
     			template: 'Unable to retrieve traffic reports at this time. Please check your network connection.'
   			});
		});
     	
		if (manual)
        	$scope.$broadcast('scroll.refreshComplete');
    };
})