// Copyright (c) 2015 Zhang Yungui, GNU GPL v3 licensed.
//

angular.module('ggbApp')
  .controller('PreviewController', function($scope, $stateParams, $http, model) {
    'use strict';

    var id = $stateParams.id || model.ggbid,
        info = model.getGgb(id),
        article = angular.element('#ggb-preview');

    $scope.ggb = { id: id, info: info };
    $scope.go('.showProp');

    if (info && article.length === 1) {
      model.ggbid = id;
      article.attr('data-param-width', info.width);
      article.attr('data-param-height', info.height);

      $http.get(model.dataURL + 'ggb64/' + id + '.b64')
        .success(function (data) {
          data = data.replace(/\n/g, '');
          article.attr('data-param-ggbBase64', data);
          if (window.webSimple) {
            window.webSimple.succeeded = window.webSimple();
          }
        }).error(function() {
          console.log('Fail to get %d.b64' % id);
        });
    }
  });

angular.module('ggbApp')
  .controller('EditPropController', function($scope, model, ggbProp) {
    'use strict';

    $scope.tmp = {};
    $scope.ggbProp = angular.copy($scope.ggb.info);
    $scope.addKeyword = ggbProp.addKeyword;
    $scope.removeKeyword = ggbProp.removeKeyword;

    $scope.save = function() {
      var info = ggbProp.saveProp($scope.ggbProp);
      angular.copy(info, $scope.ggb.info);

      model.keys = model.collectKeys();
      $scope.data.keys = model.keys;

      $scope.go('preview.showProp');
    };
  });
