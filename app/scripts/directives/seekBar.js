(function() {
     function seekBar($document) {
         var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
         };
         return {
            templateUrl: '/templates/directives/seek_bar.html', /*Specifies a URL from which the directive will load a template.*/
            replace: true, /* If true, template replaces the directive's element. If false, replaces contents of the directive's element.*/
            restrict: 'E', /*Restricts the directive to a specific declaration style: element  E, attribute A, class C, and comment M*/
            scope: {
                onChange: '&'
            }, /**specify how we want to handle the value passed to the on-change attribute:*/
            link: function(scope, element, attributes) { /* register DOM listeners and update DOM. This is where we put most of directive logic.*/
             // directive logic to return
                scope.value = 0;
                scope.max = 100;
                
                var seekBar = $(element);
                
                attributes.$observe('value', function(newValue) {
                scope.value = newValue;
                });
                attributes.$observe('max', function(newValue) {
                scope.max = newValue;
                });
 
                var percentString = function () {
                 var value = scope.value;
                 var max = scope.max;
                 var percent = value / max * 100;
                 return percent + "%";
                };
 
                 scope.fillStyle = function() {
                  return {width: percentString()};
                 };
                
                 scope.thumbStyle = function() {
                   return {left: percentString()};  
                 };
                
                 scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                 };
                
                 scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });
 
                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                 };
                
                 var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                 };
            }
         };
     }
 
     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();