//Create the application and apply white listing configuration to comply with chrome app policies
  var app = angular.module('myApp', ['uiSlider', 'nvd3ChartDirectives', 'ngAnimate', 'gravatarModule', 'ngAudio', 'ngMd5'])
  .config( [
    '$compileProvider',
    function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);

