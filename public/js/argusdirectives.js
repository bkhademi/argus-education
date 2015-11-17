(function (app) {
    app
    .directive('dropzone', function () {
        return function (scope, element, attrs) {
            var config, dropzone;
            config = scope[attrs.dropzone];
            
            //create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);

            //bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            })

        };// end return
    })

}(angular.module("Argus")));
(function (app) {
    app
    .directive('dropzonedata', function () {
        return function (scope, element, attrs) {
            var config, dropzone, counter;
            config = scope[attrs.dropzonedata];
            
         
            
            
            if (config.variables.dropzone) { // dropzone already attached, just change method
            } else { // dropzone not attached,  add it for the first time
              
              
                //create a Dropzone for the element with the given options
                config.variables.dropzone = new Dropzone(element[0], config.options);

                //bind the given event handlers
                angular.forEach(config.eventHandlers, function (handler, event) {
                    config.variables.dropzone.on(event, handler);
                })
            }

        };// end return
    })

}(angular.module("Argus")));
(function(app){
    app
    .directive('autoResize',function(){
        return {
            restrict:"CA",
            link: function (scope, element) {
                element = element[0];
                element.addEventListener('keyup',function(event){
                    this.style.overflow='hidden';
                    this.style.height = 0;
                    this.style.height = this.scrollHeight + 'px';
                    console.log('keyup')
                }, false)
            }
        }

    })
}(angular.module("Argus")));
(function (app) {
    app
    .directive("drawing", function () {
        return {
            restrict: "A",
            scope: {
                bw: "=width",
                bh: "=height"
            },
            link: function (scope, element) {
                var ctx = element[0].getContext('2d');
                console.log(element);
                // variable that decides if something should be drawn on mousemove
                var drawing = false;

                // the last coordinates before the current move
                var lastX;
                var lastY;

                var bw = scope.bw;
                var bh = scope.bh;
                var p = 5;


                function drawBoard() {
                    for (var x = 0; x <= bw; x += 30) {
                        ctx.moveTo(x + p, p);
                        ctx.lineTo(x + p, bh + p);
                    }


                    for (var x = 0; x <= bh; x += 30) {
                        ctx.moveTo(p, x + p);
                        ctx.lineTo(bw + p, x + p);
                    }

                    ctx.strokeStyle = "lightgray";
                    ctx.stroke();
                }

                drawBoard();
                function start_move(event) {

                    if (event.offsetX !== undefined) {
                        lastX = event.offsetX;
                        lastY = event.offsetY;

                    } else { // Firefox compatibility
                        lastX = event.layerX - event.currentTarget.offsetLeft;
                        lastY = event.layerY - event.currentTarget.offsetTop;

                    }
                    console.log(lastX);
                    console.log(lastY);
                    // begins new line
                    ctx.beginPath();

                    drawing = true;
                }

                element.bind('mousedown', start_move);

                function move(event) {
                    if (drawing) {
                        // get current mouse position
                        if (event.offsetX !== undefined) {
                            currentX = event.offsetX;
                            currentY = event.offsetY;
                        } else {
                            currentX = event.layerX - event.currentTarget.offsetLeft;
                            currentY = event.layerY - event.currentTarget.offsetTop;
                        }

                        draw(lastX, lastY, currentX, currentY);

                        // set current coordinates to last one
                        lastX = currentX;
                        lastY = currentY;
                    }

                }

                element.bind('mousemove', move);

                function up(event) {
                    // stop drawing
                    drawing = false;
                }
                element.bind('mouseup', up);



                // Tablet
                function onTouchMove(event) {
                    if (drawing) {
                        event.preventDefault();
                        if (event.offsetX !== undefined) {
                            currentX = event.offsetX;
                            currentY = event.offsetY;
                        } else {
                            currentX = (event.targetTouches[0].pageX) - element.offset().left;
                            currentY = (event.targetTouches[0].pageY) - element.offset().top;
                        }

                        draw(lastX, lastY, currentX, currentY);

                        // set current coordinates to last one
                        lastX = currentX;
                        lastY = currentY;
                    }
                }

                function onTouchStart(event) {
                    drawing = true;

                    lastX = (event.targetTouches[0].pageX) - element.offset().left;
                    lastY = (event.targetTouches[0].pageY) - element.offset().top;

                    ctx.beginPath();
                }

                function onMouseUp(event) {
                    drawing = false;
                }



                element.bind('touchmove', onTouchMove, false);
                element.bind('touchstart', onTouchStart, false);
                element.bind('touchend', onMouseUp, false);
                element[0].addEventListener('touchmove', onTouchMove, false);
                element[0].addEventListener('touchstart', onTouchStart, false);
                element[0].addEventListener('touchend', onMouseUp, false);
                // canvas reset
                function reset() {
                    element[0].width = element[0].width;
                }

                function draw(lX, lY, cX, cY) {

                    // line from
                    ctx.moveTo(lX, lY);
                    // to
                    ctx.lineTo(cX, cY);
                    // color
                    ctx.strokeStyle = "#4bf";
                    // draw it
                    ctx.stroke();
                }
                console.log(element);
            }
        };
    });

}(angular.module("Argus")));
(function (app) {
    // USAGE   <student student="studentObject" ></student
    /*
        where studentObject is
        $scope.studentObject = {}
    */
    app
    .directive("student", function () {
        var directive = {};
        directive.restrict = "E";
        directive.templateUrl = "views/otherItems/sampleStuProfile.html"
        directive.scope = {
            student: "=student"
        }

        directive.compile = function (element, attributes) {
            element.css('border', '1px solid, #cccccc');

            var linkFunction = function ($scope, element, attributes) {
                //element.html("student: <b>" + $scope.student.name + "</b>, Roll No: </b>");
                //element.css('background-color', '#ff00ff');
            }
            return linkFunction;
        }
        return directive;
    })

}(angular.module("Argus")));
(function (app) {

    app
    .directive("gaugeChart", [function () {
        return {
            restrict: "A",
            scope: {
                data: "=",
                options: "="
            },
            link: function (scope, ele) {
                var data, gauge, options;
                return data = scope.data, options = scope.options, gauge = new Gauge(ele[0]).setOptions(options), gauge.maxValue = data.maxValue, gauge.animationSpeed = data.animationSpeed, gauge.set(data.val)
            }
        }
    }]).directive("flotChart", [function () {
        return {
            restrict: "A",
            scope: {
                data: "=",
                options: "="
            },
            link: function (scope, ele) {
                var data, options, plot;
                return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options)
            }
        }
    }]).directive("flotChartRealtime", [function () {
        return {
            restrict: "A",
            link: function (scope, ele) {
                var data, getRandomData, plot, totalPoints, update, updateInterval;
                return data = [], totalPoints = 300, getRandomData = function () {
                    var i, prev, res, y;
                    for (data.length > 0 && (data = data.slice(1)) ; data.length < totalPoints;) prev = data.length > 0 ? data[data.length - 1] : 50, y = prev + 10 * Math.random() - 5, 0 > y ? y = 0 : y > 100 && (y = 100), data.push(y);
                    for (res = [], i = 0; i < data.length;) res.push([i, data[i]]), ++i;
                    return res
                }, update = function () {
                    plot.setData([getRandomData()]), plot.draw(), setTimeout(update, updateInterval)
                }, data = [], totalPoints = 300, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
                    series: {
                        lines: {
                            show: !0,
                            fill: !0
                        },
                        shadowSize: 0
                    },
                    yaxis: {
                        min: 0,
                        max: 100
                    },
                    xaxis: {
                        show: !1
                    },
                    grid: {
                        hoverable: !0,
                        borderWidth: 1,
                        borderColor: "#eeeeee"
                    },
                    colors: ["#cadcaf"]
                }), update()
            }
        }
    }]).directive("sparkline", [function () {
        return {
            restrict: "A",
            scope: {
                data: "=",
                options: "="
            },
            link: function (scope, ele) {
                var data, options, sparkResize, sparklineDraw;
                return data = scope.data, options = scope.options, sparkResize = void 0, sparklineDraw = function () {
                    return ele.sparkline(data, options)
                }, $(window).resize(function () {
                    return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200)
                }), sparklineDraw()
            }
        }
    }]).directive("morrisChart", [function () {

        return {
            restrict: "A",
            scope: {
                data: "="
            },
            link: function (scope, ele, attrs) {

                var colors, data, func, options;
                switch (data = scope.data, attrs.type) {
                    case "line":
                        return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                            element: ele[0],
                            data: data,
                            xkey: attrs.xkey,
                            ykeys: JSON.parse(attrs.ykeys),
                            labels: JSON.parse(attrs.labels),
                            lineWidth: attrs.lineWidth || 2,
                            lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                            resize: !0
                        }, new Morris.Line(options);
                    case "area":
                        return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                            element: ele[0],
                            data: data,
                            xkey: attrs.xkey,
                            ykeys: JSON.parse(attrs.ykeys),
                            labels: JSON.parse(attrs.labels),
                            lineWidth: attrs.lineWidth || 2,
                            lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                            behaveLikeLine: attrs.behaveLikeLine || !1,
                            fillOpacity: attrs.fillOpacity || "auto",
                            pointSize: attrs.pointSize || 4,
                            resize: !0
                        }, new Morris.Area(options);
                    case "bar":
                        return colors = void 0 === attrs.barColors || "" === attrs.barColors ? null : JSON.parse(attrs.barColors), options = {
                            element: ele[0],
                            data: data,
                            xkey: attrs.xkey,
                            ykeys: JSON.parse(attrs.ykeys),
                            labels: JSON.parse(attrs.labels),
                            barColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                            stacked: attrs.stacked || null,
                            resize: !0
                        }, new Morris.Bar(options);
                    case "donut":

                        return colors = void 0 === attrs.colors || "" === attrs.colors ? null : JSON.parse(attrs.colors), options = {
                            element: ele[0],
                            data: data,
                            colors: colors || ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"],
                            resize: !0
                        }, attrs.formatter && (func = new Function("y", "data", attrs.formatter), options.formatter = func),
                            setTimeout(function () {
                                new Morris.Donut(options)
                            }, 100)
                }
            }
        }
    }])

}(angular.module("Argus")));

(function (app) {

    app
     .directive("gaugeRegular", function () {
         var directive = {};
         directive.restrict = "E";
         directive.templateUrl = "views/otheritems/gaugeTemplate.html"
         directive.scope = {
             position: "=position"
         }
         directive.compile = function (element, attributes) {

             var linkFunction = function ($scope, element, attributes) {
                var pos = (($scope.position)*(90)/50) - (90);
                $scope.position = 'transform: rotate('+ pos+ 'deg);';
             }
             return linkFunction;
         }

         return directive;
     })

}(angular.module("Argus")));

(function (app) {

    app
     .directive("gaugeSmall", function () {
         var directive = {};
         directive.restrict = "E";
         directive.templateUrl = "views/otheritems/gaugeSmallTemplate.html"
         directive.scope = {
             position: "=position"
         }
         directive.compile = function (element, attributes) {
             var linkFunction = function ($scope, element, attributes) {
                var pos = (($scope.position)*(90)/50) - (90);
                $scope.position = 'transform: rotate('+ pos+ 'deg);';
             }
             return linkFunction;
         }

         return directive;
     })

}(angular.module("Argus")));

(function (app) {

    app
     .directive("scatterPlot", function () {
         var directive = {};
         directive.restrict = "E";
         directive.templateUrl = "views/otheritems/scatterTemplate.html"
         directive.scope = {
             scatterPos: "=scatterPos"
         }

         return directive;
     })

}(angular.module("Argus")));

(function (app) {
    app
    .directive('ngRadialGauge', ['$window', '$timeout', function ($window, $timeout) {
        return {
            restrict: 'EAC',
            scope: {
                data: '=',
                lowerLimit: '=',
                upperLimit: '=',
                ranges: '=',
                value: '=',
                valueUnit: '=',
                precision: '=',
                majorGraduationPrecision: '=',
                label: '@',
                onClick: '&'
            },
            link: function (scope, ele, attrs) {
                var defaultUpperLimit = 100;
                var defaultLowerLimit = 0;
                var initialized = false;

                var renderTimeout;
                var gaugeAngle = parseInt(attrs.angle) || 120;
                var width = parseInt(attrs.width) || 300;
                var innerRadius = Math.round((width * 130) / 300);
                var outerRadius = Math.round((width * 145) / 300);
                var majorGraduations = parseInt(attrs.majorGraduations - 1) || 5;
                var minorGraduations = parseInt(attrs.minorGraduations) || 10;
                var majorGraduationLength = Math.round((width * 16) / 300);
                var minorGraduationLength = Math.round((width * 10) / 300);
                var majorGraduationMarginTop = Math.round((width * 7) / 300);
                var majorGraduationColor = attrs.majorGraduationColor || "#B0B0B0";
                var minorGraduationColor = attrs.minorGraduationColor || "#D0D0D0";
                var majorGraduationTextColor = attrs.majorGraduationTextColor || "#6C6C6C";
                var needleColor = attrs.needleColor || "#416094";
                var valueVerticalOffset = Math.round((width * 30) / 300);
                var inactiveColor = "#D7D7D7";
                var transitionMs = parseInt(attrs.transitionMs) || 750;
                var majorGraduationTextSize = parseInt(attrs.majorGraduationTextSize);
                var needleValueTextSize = parseInt(attrs.needleValueTextSize);
                var needle = undefined;

                //The scope.data object might contain the data we need, otherwise we fall back on the scope.xyz property
                var extractData = function (prop) {
                    if (!scope.data) return scope[prop];
                    if (scope.data[prop] === undefined || scope.data[prop] == null) {
                        return scope[prop];
                    }
                    return scope.data[prop];
                };

                var maxLimit;
                var minLimit;
                var value;
                var valueUnit;
                var precision;
                var majorGraduationPrecision;
                var ranges;

                var updateInternalData = function () {
                    maxLimit = extractData('upperLimit') ? extractData('upperLimit') : defaultUpperLimit;
                    minLimit = extractData('lowerLimit') ? extractData('lowerLimit') : defaultLowerLimit;
                    value = extractData('value');
                    valueUnit = extractData('valueUnit');
                    precision = extractData('precision');
                    majorGraduationPrecision = extractData('majorGraduationPrecision');
                    ranges = extractData('ranges');
                };
                updateInternalData();

                var svg = d3.select(ele[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', width * 0.75);
                var renderMajorGraduations = function (majorGraduationsAngles) {
                    var centerX = width / 2;
                    var centerY = width / 2;
                    //Render Major Graduations
                    majorGraduationsAngles.forEach(function (pValue, index) {
                        var cos1Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength));
                        var sin1Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength));
                        var cos2Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                        var sin2Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                        var x1 = centerX + cos1Adj;
                        var y1 = centerY + sin1Adj * -1;
                        var x2 = centerX + cos2Adj;
                        var y2 = centerY + sin2Adj * -1;
                        svg.append("svg:line")
                        .attr("x1", x1)
                        .attr("y1", y1)
                        .attr("x2", x2)
                        .attr("y2", y2)
                        .style("stroke", majorGraduationColor);

                        renderMinorGraduations(majorGraduationsAngles, index);
                    });
                };
                var renderMinorGraduations = function (majorGraduationsAngles, indexMajor) {
                    var minorGraduationsAngles = [];

                    if (indexMajor > 0) {
                        var minScale = majorGraduationsAngles[indexMajor - 1];
                        var maxScale = majorGraduationsAngles[indexMajor];
                        var scaleRange = maxScale - minScale;

                        for (var i = 1; i < minorGraduations; i++) {
                            var scaleValue = minScale + i * scaleRange / minorGraduations;
                            minorGraduationsAngles.push(scaleValue);
                        }

                        var centerX = width / 2;
                        var centerY = width / 2;
                        //Render Minor Graduations
                        minorGraduationsAngles.forEach(function (pValue, indexMinor) {
                            var cos1Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLength));
                            var sin1Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLength));
                            var cos2Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                            var sin2Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                            var x1 = centerX + cos1Adj;
                            var y1 = centerY + sin1Adj * -1;
                            var x2 = centerX + cos2Adj;
                            var y2 = centerY + sin2Adj * -1;
                            svg.append("svg:line")
                            .attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .style("stroke", minorGraduationColor);
                        });
                    }
                };
                var getMajorGraduationValues = function (pMinLimit, pMaxLimit, pPrecision) {
                    var scaleRange = pMaxLimit - pMinLimit;
                    var majorGraduationValues = [];
                    for (var i = 0; i <= majorGraduations; i++) {
                        var scaleValue = pMinLimit + i * scaleRange / (majorGraduations);
                        majorGraduationValues.push(scaleValue.toFixed(pPrecision));
                    }

                    return majorGraduationValues;
                };
                var getMajorGraduationAngles = function () {
                    var scaleRange = 2 * gaugeAngle;
                    var minScale = -1 * gaugeAngle;
                    var graduationsAngles = [];
                    for (var i = 0; i <= majorGraduations; i++) {
                        var scaleValue = minScale + i * scaleRange / (majorGraduations);
                        graduationsAngles.push(scaleValue);
                    }

                    return graduationsAngles;
                };
                var getNewAngle = function (pValue) {
                    var scale = d3.scale.linear().range([0, 1]).domain([minLimit, maxLimit]);
                    var ratio = scale(pValue);
                    var scaleRange = 2 * gaugeAngle;
                    var minScale = -1 * gaugeAngle;
                    var newAngle = minScale + (ratio * scaleRange);
                    return newAngle;
                };
                var renderMajorGraduationTexts = function (majorGraduationsAngles, majorGraduationValues, pValueUnit) {
                    if (!ranges) return;

                    var centerX = width / 2;
                    var centerY = width / 2;
                    var textVerticalPadding = 5;
                    var textHorizontalPadding = 5;

                    var lastGraduationValue = majorGraduationValues[majorGraduationValues.length - 1];
                    var textSize = isNaN(majorGraduationTextSize) ? (width * 12) / 300 : majorGraduationTextSize;
                    var fontStyle = textSize + "px Courier";

                    var dummyText = svg.append("text")
                        .attr("x", centerX)
                        .attr("y", centerY)
                        .attr("fill", "transparent")
                        .attr("text-anchor", "middle")
                        .style("font", fontStyle)
                        .text(lastGraduationValue + pValueUnit);

                    var textWidth = dummyText.node().getBBox().width;

                    for (var i = 0; i < majorGraduationsAngles.length; i++) {
                        var angle = majorGraduationsAngles[i];
                        var cos1Adj = Math.round(Math.cos((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength - textHorizontalPadding));
                        var sin1Adj = Math.round(Math.sin((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength - textVerticalPadding));

                        var sin1Factor = 1;
                        if (sin1Adj < 0) sin1Factor = 1.1;
                        if (sin1Adj > 0) sin1Factor = 0.9;
                        if (cos1Adj > 0) {
                            if (angle > 0 && angle < 45) {
                                cos1Adj -= textWidth / 2;
                            } else {
                                cos1Adj -= textWidth;
                            }
                        }
                        if (cos1Adj < 0) {
                            if (angle < 0 && angle > -45) {
                                cos1Adj -= textWidth / 2;
                            }
                        }
                        if (cos1Adj == 0) {
                            cos1Adj -= angle == 0 ? textWidth / 4 : textWidth / 2;
                        }

                        var x1 = centerX + cos1Adj;
                        var y1 = centerY + sin1Adj * sin1Factor * -1;

                        svg.append("text")
                        .attr("class", "mtt-majorGraduationText")
                        .style("font", fontStyle)
                        .attr("text-align", "center")
                        .attr("x", x1)
                        .attr("dy", y1)
                        .attr("fill", majorGraduationTextColor)
                        .text(majorGraduationValues[i] + pValueUnit);
                    }
                };
                var renderGraduationNeedle = function (value, valueUnit, precision, minLimit, maxLimit) {
                    svg.selectAll('.mtt-graduation-needle').remove();
                    svg.selectAll('.mtt-graduationValueText').remove();
                    svg.selectAll('.mtt-graduation-needle-center').remove();

                    var centerX = width / 2;
                    var centerY = width / 2;
                    var centerColor;

                    if (typeof value === 'undefined') {
                        centerColor = inactiveColor;
                    } else {
                        centerColor = needleColor;
                        var needleAngle = getNewAngle(value);
                        var needleLen = innerRadius - majorGraduationLength - majorGraduationMarginTop;
                        var needleRadius = (width * 2.5) / 300;
                        var textSize = isNaN(needleValueTextSize) ? (width * 12) / 300 : needleValueTextSize;
                        var fontStyle = textSize + "px Courier";

                        if (value >= minLimit && value <= maxLimit) {
                            var lineData = [
                               [needleRadius, 0],
                               [0, -needleLen],
                               [-needleRadius, 0],
                               [needleRadius, 0]
                            ];
                            var pointerLine = d3.svg.line().interpolate('monotone');
                            var pg = svg.append('g').data([lineData])
                                        .attr('class', 'mtt-graduation-needle')
                                        .style("fill", needleColor)
                                        .attr('transform', 'translate(' + centerX + ',' + centerY + ')');
                            needle = pg.append('path')
                                       .attr('d', pointerLine)
                                       .attr('transform', 'rotate(' + needleAngle + ')');
                        }

                        svg.append("text")
                            .attr("x", centerX)
                            .attr("y", centerY + valueVerticalOffset)
                            .attr("class", "mtt-graduationValueText")
                            .attr("fill", needleColor)
                            .attr("text-anchor", "middle")
                            .attr("font-weight", "bold")
                            .style("font", fontStyle)
                            .text('[ ' + value.toFixed(precision) + valueUnit + ' ]');
                    }

                    var circleRadius = (width * 6) / 300;

                    svg.append("circle")
                      .attr("r", circleRadius)
                      .attr("cy", centerX)
                      .attr("cx", centerY)
                      .attr("fill", centerColor)
                      .attr("class", "mtt-graduation-needle-center");
                };
                $window.onresize = function () {
                    scope.$apply();
                };
                scope.$watch(function () {
                    return angular.element($window)[0].innerWidth;
                }, function () {
                    scope.render();
                });
                scope.$watchCollection('[ranges, data.ranges]', function () {
                    scope.render();
                }, true);


                scope.render = function () {
                    updateInternalData();
                    svg.selectAll('*').remove();
                    if (renderTimeout) clearTimeout(renderTimeout);

                    renderTimeout = $timeout(function () {
                        var d3DataSource = [];

                        if (typeof ranges === 'undefined') {
                            d3DataSource.push([minLimit, maxLimit, inactiveColor]);
                        } else {
                            //Data Generation
                            ranges.forEach(function (pValue, index) {
                                d3DataSource.push([pValue.min, pValue.max, pValue.color]);
                            });
                        }

                        //Render Gauge Color Area
                        var translate = "translate(" + width / 2 + "," + width / 2 + ")";
                        var cScale = d3.scale.linear().domain([minLimit, maxLimit]).range([-1 * gaugeAngle * (Math.PI / 180), gaugeAngle * (Math.PI / 180)]);
                        var arc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(function (d) { return cScale(d[0]); })
                            .endAngle(function (d) { return cScale(d[1]); });
                        svg.selectAll("path")
                            .data(d3DataSource)
                            .enter()
                            .append("path")
                            .attr("d", arc)
                            .style("fill", function (d) { return d[2]; })
                            .attr("transform", translate);

                        var majorGraduationsAngles = getMajorGraduationAngles();
                        var majorGraduationValues = getMajorGraduationValues(minLimit, maxLimit, majorGraduationPrecision);
                        renderMajorGraduations(majorGraduationsAngles);
                        renderMajorGraduationTexts(majorGraduationsAngles, majorGraduationValues, valueUnit);
                        renderGraduationNeedle(value, valueUnit, precision, minLimit, maxLimit);
                        initialized = true;
                    }, 200);

                };
                var onValueChanged = function (pValue, pPrecision, pValueUnit) {
                    if (typeof pValue === 'undefined' || pValue == null) return;

                    if (needle && pValue >= minLimit && pValue <= maxLimit) {
                        var needleAngle = getNewAngle(pValue);
                        needle.transition()
                            .duration(transitionMs)
                            .ease('elastic')
                            .attr('transform', 'rotate(' + needleAngle + ')');
                        svg.selectAll('.mtt-graduationValueText')
                        .text('[ ' + pValue.toFixed(pPrecision) + pValueUnit + ' ]');
                    } else {
                        svg.selectAll('.mtt-graduation-needle').remove();
                        svg.selectAll('.mtt-graduationValueText').remove();
                        svg.selectAll('.mtt-graduation-needle-center').attr("fill", inactiveColor);
                    }
                };
                scope.$watchCollection('[value, data.value]', function () {
                    if (!initialized) return;
                    updateInternalData();
                    onValueChanged(value, precision, valueUnit);
                }, true);
            }
        };
    }]);
    app
    .directive('ngPrint', function printDirective($rootScope) {
        var printSection = document.getElementById('printSection');
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            }
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
            $rootScope.$digest();
            window.print();
        }
        return {
            link: link,
            restrict: 'A'
        };
    })

}(angular.module("Argus")));

(function(app){
    app.directive('logout', function(){
        var controller = ['$scope', '$auth', '$rootScope', '$state', function($scope, $auth, $rootScope,$state){
           $scope.logout = function(){
              
               $auth.logout().then(function(){
                   debugger
                   localStorage.removeItem('user');
                   
               $rootScope.authenticated = false;
               
               $rootScope.currentUser  = null;
               $state.go('auth'); 
               });
               
               
           }     
        }], 
     
        template = '<a ng-click="logout()">Logout</button>' ;
        return {
            restrict:'EA',
            controller:controller,
            template:template,
            transclude:true
        };
        
        
    })
    
}(angular.module('Argus')));
