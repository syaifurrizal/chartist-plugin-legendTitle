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
   * version 0.0.2
   * author: Syaifur Rizal
   * git username: syaifurrizal
   * license: MIT and any Chartist's licenses already have. 
   */
  (function (window, document, Chartist) {
    'use strict';

    var defaultOptions = {
      position: 'bottom',
      seriesName: ['Please add seriesName'],
      width: 'max-content'
    };

    // Find the font size of root for determine the font size and height of legend.
    var fontSize = parseFloat(window.getComputedStyle(document.querySelector('html'), null).fontSize);

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctLegendTitle = function (options) {
      options = Chartist.extend({}, defaultOptions, options);

      return function ctLegendTitle(chart) {
        chart.on('created', function (data) {
          // Get width & hight of main container (div) where the Chartist placed.
          var width = chart.container.clientWidth;
          var height = chart.container.clientHeight;

          // Get chart padding.
          var chartPadding = chart.options.chartPadding;

          // Get width & height of chart grid.
          var gridWidth = chart.container.clientWidth - chartPadding.right - chartPadding.left;
          var gridHeight = chart.container.clientHeight - chartPadding.top - chartPadding.bottom;
          // console.log(gridHeight);

          // Get series names
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

          // Count the series index
          var seriesIndex = chart.data.series.length;

          // Create new group ct-legends
          var gContainer = new Chartist.Svg('g');
          gContainer.attr({
          }).addClass('ct-legends');

          // Create foreignObject
          var foreignObject = new Chartist.Svg('foreignObject');
          foreignObject.attr({
            x: 0,
            y: 0,
            width: 100 + '%',
            height: 100 + '%',
            'style': 'overflow: visible;'
          }).addClass('ct-legendContainer');

          // Create div wrapper as main container after creating foreignObject.
          var divWrap = document.createElement('div');
          divWrap.setAttribute('class', 'ct-legend-div-wrapper');
          divWrap.setAttribute('xmlns:ct', Chartist.namespaces.ct);

          // Create style element to control legend.
          var styleEl = document.createElement('style');
          if (options.position === 'top') {
            styleEl.innerHTML = `.${chart.container.attributes[0].textContent} .ct-legend-div-wrapper{display: flex; flex-direction: row; justify-content: center; align-items: baseline;  padding-top: ${chartPadding.top - (fontSize * 2)}px; max-width: ${gridWidth}px; margin: 0 auto;} .${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${typeof options.width === 'string' ? options.width : options.width + 'px'};}`;
          } else if (options.position === 'right') {
            styleEl.innerHTML = `.${chart.container.attributes[0].textContent} .ct-legend-div-wrapper{display: flex; flex-direction: column; justify-content: flex-start; align-items: baseline; padding-left: ${chartPadding.left + gridWidth + fontSize}px; width: max-content; padding-top: ${chartPadding.top - fontSize}px} .${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${typeof options.width === 'string' ? options.width : options.width + 'px'};}`;
          } else if (options.position === 'bottom') {
            styleEl.innerHTML = `.${chart.container.attributes[0].textContent} .ct-legend-div-wrapper{display: flex; flex-direction: row; justify-content: center; align-items: baseline; padding-top: ${chartPadding.top + gridHeight - fontSize}px; max-width: ${gridWidth}px; margin: 0 auto;} .${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${typeof options.width === 'string' ? options.width : options.width + 'px'};}`;
          } else if (options.position === 'left') {
            styleEl.innerHTML = `.${chart.container.attributes[0].textContent} .ct-legend-div-wrapper{display: flex; flex-direction: column; justify-content: flex-start; align-items: baseline; padding-right: ${chartPadding.right + gridWidth - (fontSize * 0.25) - chart.defaultOptions.chartPadding.left}px; margin-left: auto; width: max-content; padding-top: ${chartPadding.top - fontSize}px} .${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${typeof options.width === 'string' ? options.width : options.width + 'px'};}`;
          }

          // Append style tag to divWrap.
          foreignObject._node.append(styleEl)

          var divWrapItem = [];
          var svgBox = [];
          var rectBox = [];
          var spanTxt = [];
          for (var i = 0; i < seriesIndex; i++) {
            // Create div wrap for each legend item to control them.
            divWrapItem[i] = document.createElement('div');
            divWrapItem[i].setAttribute('class', 'ct-legend-div-wrapper-item');
            divWrapItem[i].setAttribute('xmlns:ct', Chartist.namespaces.ct);
            // divWrapItem.style.cssText = `height:${height}; width:${width}`;

            // Create svg element inside foreingObject for rectangle identifier of each legend.
            svgBox[i] = document.createElementNS(Chartist.namespaces.svg, 'svg');
            svgBox[i].setAttributeNS(Chartist.namespaces.xhtml, 'xhtml', Chartist.namespaces.xhtml);
            svgBox[i].setAttribute('width', fontSize * 0.65 + 'px');
            svgBox[i].setAttribute('height', fontSize * 0.65 + 'px');
            svgBox[i].setAttribute('x', '0');
            svgBox[i].setAttribute('y', '0');
            svgBox[i].setAttribute('style', `overflow: hidden`);
            svgBox[i].setAttribute('class', `ct-series ${seriesClassName[i].className}`);

            // Create rect.
            rectBox[i] = new Chartist.Svg('rect');
            rectBox[i].attr({
              x: 0,
              y: 0,
              width: fontSize * 0.65 + 'px',
              height: fontSize * 0.65 + 'px',
              'class': 'ct-label ct-legend-box ct-point ct-line ct-bar ct-slice-donut',
              'style': 'overflow: hidden;'
            }).addClass('ct-svg-rect');

            // Create text span.
            spanTxt[i] = document.createElement('span');
            spanTxt[i].setAttribute('class', 'ct-label ct-legend-title');
            spanTxt[i].setAttribute('xmlns', Chartist.namespaces.xmlns);
            spanTxt[i].style.cssText = `display:inline-block; margin: 0 1em 0 0.25em;`;

            if (chart.data.series.name) {
              // Add text if available
              spanTxt[i].innerHTML = chart.data.series[i].name;
            } else {
              spanTxt[i].innerHTML = options.seriesName[i] || defaultOptions.seriesName[0];
            }

            // Construct legend components
            svgBox[i].append(rectBox[i]._node);
            divWrapItem[i].append(svgBox[i]);
            divWrapItem[i].append(spanTxt[i]);
            divWrap.append(divWrapItem[i]);
          }

          foreignObject._node.append(divWrap);
          gContainer.append(foreignObject, true);
          chart.svg.append(gContainer, false);

        });
      };
    };
  }(window, document, Chartist));

  return Chartist.plugins.ctLegendTitle;

}));
