
(function () {
      'use strict';
  
      appModule.directive('freezeTable', freezeTable);
  
      freezeTable.$inject = ['$timeout'];
      function freezeTable($timeout) {
          return {
              restrict: 'A',
              scope: {
                  freezeColumns: "@"
              },
              link: function (scope, element) {
                  var container = element[0];
  
  
                  function activate() {
                      applyClasses('thead tr', 'cross', 'th');
                      applyClasses('tfoot tr', 'cross', 'td');
                      applyClasses('tbody tr', 'fixed-cell', 'td');
  
                      var leftHeaders = [].concat.apply([], container.querySelectorAll('tbody td.fixed-cell'));
                      var topHeaders = [].concat.apply([], container.querySelectorAll('thead th'));
                      var crossHeaders = [].concat.apply([], container.querySelectorAll('thead th.cross'));
                      var crossFooters = [].concat.apply([], container.querySelectorAll('tfoot td.cross'));
                      var botFooters = [].concat.apply([], container.querySelectorAll('tfoot td'));
  
                      //console.log('line before setting up event handler');
  
                      container.addEventListener('scroll', function () {
                          init();
  
  
                      });
  
                      function init() {
                          //console.log('scroll event handler hit');
                          var x = container.scrollLeft;
                          var y = container.scrollTop;
                          var h = container.scrollHeight;
                          var parentHeight = container.offsetHeight;
                          var fh = h - y - parentHeight;
                          var sh = getScrollbarHeight(container);
                          var sw = getScrollbarWidth(container);
                          //console.log('container');
  
                          //Update the left header positions when the container is scrolled
                          leftHeaders.forEach(function (leftHeader) {
                              leftHeader.style.transform = translate(x, 0);
                          });
  
                          //Update the top header positions when the container is scrolled
                          topHeaders.forEach(function (topHeader) {
                              topHeader.style.transform = translate(0, y);
                          });
  
                          //Update headers that are part of the header and the left column
                          crossHeaders.forEach(function (crossHeader) {
                              crossHeader.style.transform = translate(x, y);
                          });
  
                          //Update the bot footer positions when the container is scrolled
                          botFooters.forEach(function (botFooter) {
                              botFooter.style.transform = translate(0, -(fh + sh));
                          });
  
                          //Update footer that are part of the header and the left column
                          crossFooters.forEach(function (crossFooter) {
                              crossFooter.style.transform = translate(x, -(fh + sh));
                          });
                      }
                      init();
  
                      function getScrollbarWidth(element) {
                          return element.offsetWidth - element.clientWidth;
                      }
                      function getScrollbarHeight(element) {
                          return element.offsetHeight - element.clientHeight;
                      }
  
                      function translate(x, y) {
                          return 'translate(' + x + 'px, ' + y + 'px)';
                      }
  
                      function applyClasses(selector, newClass, cell) {
                          var arrayItems = [].concat.apply([], container.querySelectorAll(selector));
                          var currentElement;
                          var colspan;
  
                          arrayItems.forEach(function (row, i) {
                              var freezeColumns = scope.freezeColumns;
                              for (var j = 0; j < freezeColumns; j++) {
                                  currentElement = angular.element(row).find(cell)[j];
                                  //currentElement.classList.add(newClass);
                                  if (!currentElement.classList.contains(newClass)) {
                                      currentElement.classList.add(newClass);
                                  }
  
                                  if (currentElement.hasAttribute('colspan')) {
                                      colspan = currentElement.getAttribute('colspan');
                                      freezeColumns -= (parseInt(colspan) - 1);
                                  }
                              }
                          });
                      }
                  }
  
                  $timeout(function () {
                      activate();
                  }, 0);
  
                  scope.$on('refreshFreezeColumns', function () {
                      $timeout(function () {
                          activate();
                          container.scrollLeft = 0;
                      }, 0);
                  });
              }
          };
      }
  })();