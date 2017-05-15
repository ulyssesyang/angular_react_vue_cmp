angular
    .module('angularApp')
    .service('angularService', ['$rootScope', function($rootScope) {
        var self = this;
        self.data = [];

        function loadJson(callback) {

            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', './asset/data.json', true);
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }

        loadJson(function(retData) {
            var tempJson = JSON.parse(retData);
            for (var key in tempJson) {
                if (tempJson.hasOwnProperty(key)) {
                    self.data.push(tempJson[key]);
                }
            }
            console.log('self.data:', self.data, '\ndata finish load...');
            $rootScope.$broadcast('data finish load');
        });
    }]);