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
          .ct-series-a .ct-point,
          .ct-series-a .ct-line,
          .ct-series-a .ct-bar,
          .ct-series-a .ct-slice-donut {
              background-color: #d70206;
          }
          
          .ct-series-b .ct-point,
          .ct-series-b .ct-line,
          .ct-series-b .ct-bar,
          .ct-series-b .ct-slice-donut {
              background-color: #f05b4f;
          }
          
          
          .ct-series-c .ct-point,
          .ct-series-c .ct-line,
          .ct-series-c .ct-bar,
          .ct-series-c .ct-slice-donut {
              background-color: #f4c63d;
          }
          
          .ct-series-d .ct-point,
          .ct-series-d .ct-line,
          .ct-series-d .ct-bar,
          .ct-series-d .ct-slice-donut {
              background-color: #d17905;
          }
          
          .ct-series-e .ct-point,
          .ct-series-e .ct-line,
          .ct-series-e .ct-bar,
          .ct-series-e .ct-slice-donut {
              background-color: #453d3f;
          }
          
          .ct-series-f .ct-point,
          .ct-series-f .ct-line,
          .ct-series-f .ct-bar,
          .ct-series-f .ct-slice-donut {
              background-color: #59922b;
          }
          
          .ct-series-g .ct-point,
          .ct-series-g .ct-line,
          .ct-series-g .ct-bar,
          .ct-series-g .ct-slice-donut {
              background-color: #0544d3;
          }
          
          .ct-series-h .ct-point,
          .ct-series-h .ct-line,
          .ct-series-h .ct-bar,
          .ct-series-h .ct-slice-donut {
              background-color: #6b0392;
          }
          
          .ct-series-i .ct-point,
          .ct-series-i .ct-line,
          .ct-series-i .ct-bar,
          .ct-series-i .ct-slice-donut {
              background-color: #f05b4f;
          }
          
          .ct-series-j .ct-point,
          .ct-series-j .ct-line,
          .ct-series-j .ct-bar,
          .ct-series-j .ct-slice-donut {
              background-color: #dda458;
          }
          
          .ct-series-k .ct-point,
          .ct-series-k .ct-line,
          .ct-series-k .ct-bar,
          .ct-series-k .ct-slice-donut {
              background-color: #eacf7d;
          }
          
          .ct-series-l .ct-point,
          .ct-series-l .ct-line,
          .ct-series-l .ct-bar,
          .ct-series-l .ct-slice-donut {
              background-color: #86797d;
          }
          
          .ct-series-m .ct-point,
          .ct-series-m .ct-line,
          .ct-series-m .ct-bar,
          .ct-series-m .ct-slice-donut {
              background-color: #b2c326;
          }
          
          .ct-series-n .ct-point,
          .ct-series-n .ct-line,
          .ct-series-n .ct-bar,
          .ct-series-n .ct-slice-donut {
              background-color: #6188e2;
          }
          
          .ct-series-o .ct-point,
          .ct-series-o .ct-line,
          .ct-series-o .ct-bar,
          .ct-series-o .ct-slice-donut {
              background-color: #a748ca;
          }
            `;
          divBoxWrapper.appendChild(addBoxStyle);

          var divWrapperItem = [];
          var divBox = [];
          var addLegend = [];
          for (var i = 0; i < chart.data.series.length; i++) {
            divBox[i] = document.createElement('div');
            divBox[i].setAttribute('class', 'ct-label ct-legend-box ct-point ct-line ct-bar ct-slice-donut');
            divBox[i].setAttribute('xmlns', Chartist.namespaces.xmlns);
            divBox[i].style.cssText = `display: inline-block; margin: 0 0.1rem 0; width: ${fontSize * 0.75}px; height: ${fontSize * 0.75}px;`;
            divBox[i].innerHTML = '&nbsp;&nbsp;&nbsp;'

            divWrapperItem[i] = document.createElement('div');
            divWrapperItem[i].setAttribute('class', 'ct-legend-box-wrapper-item ' + seriesClassName[i].className);//
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
            addLegend[i].setAttribute('class', 'ct-label ct-legend-title');
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
