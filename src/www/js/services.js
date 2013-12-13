'use strict';

var services = angular.module('SEED_APP.services', []);

services.value('version', '0.1');

services.factory('BackgroundThread', ['$http', '$interval', function($http, $interval){
	var animation = ['\u25cb', '\u25d4', '\u25d1', '\u25d5', '\u25cf'];
  var backgroundThread = {
		onStateReceived: function(state){},
	    get: function(state) {}
	};

	var promise = $interval(function(seconds) {
		$http.get("rest/state")
			.success(function(data) {
				backgroundThread.t++;
				if (!backgroundThread.onStateReceived(data)) {
					$interval.cancel(promise);
				}
			})
			.error(function(data, status, headers, config) {
				var msg = JSON.stringify({
					error:"state GET failed. Server may be unavailable. Refresh page.",
					data:data,
					status:status
				});
				console.log(msg);
				$interval.cancel(promise);
				alert(msg);
			})

		}, 1000);

	return backgroundThread;
}]);

