(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["chartist"], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("chartist"));
  } else {
    root['Chartist.plugins.ctLegendTitle'] = factory(Chartist);
  }
}(this, function (Chartist) {

  /**
   * Chartist.js plugin to to display table legend
   * version 0.0.1
   * author: Syaifur Rizal
   * git username: syaifurrizal
   * license: MIT and any Chartist's licenses already have. 
   */
  (function (window, document, Chartist) {
    'use strict';

    var defaultOptions = {
      position: 'bottom',
      seriesName: ['Please add seriesName'],
      legendPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: undefined
      },
      width: 'max-content',
      noop: Chartist.noop
    };
    
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctLegendTitle = function (options) {

      options = Chartist.extend({}, defaultOptions, options);

      return function ctLegendTitle(chart) {
        chart.on('created', function (data) {

          function setSeriesClassNames() {
            chart.data.series = chart.data.series.map(function (series, seriesIndex) {
              if (typeof series !== 'object') {
                series = {
                  value: series
                };
              }
              series.className = series.className || chart.options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex);
              return series;
            });
            return chart.data.series;
          }

          var seriesClassName = setSeriesClassNames();
          var height = chart.defaultOptions.height || chart.options.height ?
            chart.defaultOptions.height || chart.options.height : chart.container.clientHeight;
          var width = chart.defaultOptions.width || chart.options.width ?
            chart.defaultOptions.width || chart.options.width : chart.container.clientWidth;
          var getElement = document.querySelector(".ct-label");
          var lineHeight = parseFloat(window.getComputedStyle(getElement, null).lineHeight);
          var fontSize = parseFloat(window.getComputedStyle(getElement, null).fontSize);
          var gridHeight = height - chart.options.chartPadding.top - chart.options.chartPadding.bottom;
          var gridWidth = width - chart.options.chartPadding.right - chart.options.chartPadding.left;

          var gContainer = new Chartist.Svg('g');
          gContainer.attr({
          }).addClass('ct-legends');

          var foreignObject = new Chartist.Svg('foreignObject');
          foreignObject.attr({
            x: 0,
            y: 0,
            width: width,
            height: height,
            'style': 'overflow: visible;'
          }).addClass('ct-foreignContainer');

          // LOL, LOL, LOL. Total mess after this line. But it's worthed!
          var upperLower, leftRight, leftRightItem, onLeftRight;
          if (options.position === 'top') {
            upperLower = `padding-top: ${height - gridHeight - data.options.chartPadding.bottom - (2 * lineHeight)}`;
            leftRight = `text-align: center; margin: 0 auto 0`;
            leftRightItem = `display: inline-block; margin-bottom: .5em`;
            onLeftRight = `width: 100%`;
          } else if (options.position === 'right') {
            upperLower = `padding-top: ${data.options.chartPadding.top + options.legendPadding.top}`;
            leftRight = `text-align: left; margin: 0 auto 0 ${chart.options.chartPadding.right < 50 ? '75%' : gridWidth + chart.options.chartPadding.left + lineHeight + 'px'}`;
            leftRightItem = `margin-bottom: .5em; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-start; align-items: baseline;`;
            onLeftRight = `width: ${typeof options.width !== 'string' ?
              options.width + 'px' : (options.width === 'max-content' || options.width === 'min-content' && options.width ? options.width : defaultOptions.noop(data.options.chartPadding.right - 7) + 'px')}`;
          } else if (options.position === 'bottom') {
            upperLower = `padding-top: ${height - data.options.chartPadding.bottom - lineHeight}`;
            leftRight = `text-align: center; margin: 0 auto`;
            leftRightItem = `display: inline-block; margin-bottom: .5em`;
            onLeftRight = `width: 100%`;
          } else if (options.position === 'left') {
            upperLower = `padding-top: ${data.options.chartPadding.top + options.legendPadding.top}`;
            leftRight = `text-align: left; margin: 0 ${gridWidth + chart.options.chartPadding.right}px 0 auto`;
            leftRightItem = `margin-bottom: .5em; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-start; align-items: baseline;`;
            onLeftRight = `width: ${typeof options.width !== 'string' ? options.width + 'px' : (chart.options.width === 'max-content' || chart.options.width === 'min-content' && chart.options.width ? options.width : defaultOptions.noop(data.options.chartPadding.left - 7) + 'px')}`;
          }

          var divBoxWrapper = document.createElement('div');
          divBoxWrapper.setAttribute('class', 'ct-label ct-legend-box-wrapper ');
          divBoxWrapper.setAttribute('xmlns', Chartist.namespaces.xmlns);
          divBoxWrapper.style.cssText = `${upperLower}px; display: block; ${leftRight}; ${onLeftRight}`;
          foreignObject._node.appendChild(divBoxWrapper);

          var addBoxStyle = document.createElement('style');
          addBoxStyle.innerHTML = `
          .ct-legend-box.ct-series-a {
            background-color: #d70206;
          }
          .ct-legend-box.ct-series-b {
            background-color: #f05b4f;
          }
          .ct-legend-box.ct-series-c {
            background-color: #f4c63d;
          }
          .ct-legend-box.ct-series-d {
            background-color: #d17905;
          }
          .ct-legend-box.ct-series-e {
            background-color: #453d3f;
          }
          .ct-legend-box.ct-series-f {
            background-color: #59922b;
          }
          .ct-legend-box.ct-series-g {
            background-color: #0544d3;
          }
          .ct-legend-box.ct-series-h {
            background-color: #6b0392;
          }
          .ct-legend-box.ct-series-i {
            background-color: #f05b4f;
          }
          .ct-legend-box.ct-series-j {
            background-color: #dda458;
          }
          .ct-legend-box.ct-series-k {
            background-color: #eacf7d;
          }
          .ct-legend-box.ct-series-l {
            background-color: #86797d;
          }
          .ct-legend-box.ct-series-m {
            background-color: #b2c326;
          }
          .ct-legend-box.ct-series-n {
            background-color: #6188e2;
          }
          .ct-legend-box.ct-series-o {
            background-color: #a748ca;
          }
            `;
          divBoxWrapper.appendChild(addBoxStyle);

          var divWrapperItem = [];
          var divBox = [];
          var addLegend = [];
          for (var i = 0; i < chart.data.series.length; i++) {
            divBox[i] = document.createElement('div');
            divBox[i].setAttribute('class', 'ct-label ct-legend-box ' + seriesClassName[i].className);
            divBox[i].setAttribute('xmlns', Chartist.namespaces.xmlns);
            divBox[i].style.cssText = `display: inline-block; margin: 0 0.1rem 0; width: ${fontSize * 0.75}px; height: ${fontSize * 0.75}px;`;
            divBox[i].innerHTML = '&nbsp;&nbsp;&nbsp;'

            divWrapperItem[i] = document.createElement('div');
            divWrapperItem[i].setAttribute('class', 'ct-legend-box-wrapper-item');
            divWrapperItem[i].setAttribute('xmlns', Chartist.namespaces.xmlns);
            divWrapperItem[i].style.cssText = leftRightItem;
            divBoxWrapper.appendChild(divWrapperItem[i]);
            divWrapperItem[i].appendChild(divBox[i]);

            addLegend[i] = document.createElement('span');
            if (chart.data.series.name) {
              addLegend[i].innerHTML = chart.data.series[i].name;
            } else {
              addLegend[i].innerHTML = options.seriesName[i] || defaultOptions.seriesName[0];
            }
            addLegend[i].setAttribute('class', 'ct-label ct-legend-title ' + seriesClassName[i].className);
            addLegend[i].setAttribute('xmlns', Chartist.namespaces.xmlns);
            addLegend[i].style.cssText = `display:inline-block; margin: 0 1em 0 0.25em;`;

            divWrapperItem[i].appendChild(addLegend[i]);
          }

          data.svg.append(gContainer.append(foreignObject, true));
        });
      };
    };
  }(window, document, Chartist));

  return Chartist.plugins.ctLegendTitle;

}));