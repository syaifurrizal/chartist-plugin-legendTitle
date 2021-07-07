(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['chartist'], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('chartist'));
  } else {
    root['Chartist.plugins.ctLegendTitle'] = factory(Chartist);
  }
})(this, function (Chartist) {
  /**
   * Chartist.js plugin to to display table legend
   * version 0.0.4
   * author: Syaifur Rizal
   * git username: syaifurrizal
   * licenses: MIT and all original Chartist's licenses.
   */

  (function (window, document, Chartist) {
    'use strict';

    var ctLegend = {
      version: '0.0.4',
    };

    var defaultOptions = {
      position: 'bottom',
      seriesName: ['Please add seriesName'],
      width: 'max-content',
      class: 'ct-legend',
    };

    // Find the font size of root for determine the font size and height of legend.
    var fontSize = parseFloat(window.getComputedStyle(document.querySelector('html'), null).fontSize);

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctLegendTitle = function (options) {
      options = Chartist.extend({}, defaultOptions, ctLegend, options);

      class legend {
        _initial = null;
        _node = null;
        version = ctLegend.version;
        svg(tag, nameSpace) {
          this._node = null;
          let svg;

          if (tag === 'svg') {
            svg = document.createElementNS(Chartist.namespaces[tag], tag);
            svg.setAttributeNS(Chartist.namespaces.svg, 'svg', Chartist.namespaces.svg);
          } else {
            try {
              // Declaring namespace
              svg = document.createElementNS(Chartist.namespaces['svg'], tag);
            } catch (err) {
              // if error cause from custom namespace 'xmlns', change it to 'xhtml' and vise versa.
              if (nameSpace === 'xmlns') {
                svg = document.createElementNS(Chartist.namespaces.xhtml, tag);
              } else {
                svg = document.createElementNS(Chartist.namespaces.xmlns, tag);
              }
            }
          }

          this._node = svg;

          return this;
        }
        html(tag) {
          var html = document.createElement(tag);

          this._node = html;

          return this;
        }
        addAtt(attributes) {
          let svg = this._node;

          if (typeof attributes === undefined) {
            return this._node;
          }

          for (var attrib in attributes) {
            var n;
            if (typeof attributes[attrib] === 'number') {
              if (attrib === 'x' || attrib === 'y') {
                n = attributes[attrib];
              } else {
                n = attributes[attrib] + 'px';
              }
            } else if (typeof attributes[attrib] === 'string') {
              n = attributes[attrib];
            }
            svg.setAttribute(attrib, n);
          }

          this._node = svg;

          return this;
        }
        addClass(classes) {
          let svg = this._node;

          if (typeof classes === undefined) {
            return this._node;
          }

          svg.setAttribute('class', classes);
          this._node = svg;

          return this;
        }
      }

      /**
       * Here a sample how to create an element. Element can be either svg tag type or html tag type.
       */
      // var newSvg = legend
      //   .svg('svg') // use .svg('tag') for svg or .html('tag') for reguler html tag.
      //   .addAtt({
      //     width: 100,
      //     height: 100,
      //     style: 'height: 100px',
      //   })
      //   .addClass('ct-legend');

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

          // Get series names
          function setSeriesClassNames() {
            chart.data.series = chart.data.series.map(function (series, seriesIndex) {
              if (typeof series !== 'object') {
                series = {
                  value: series,
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

          // Create g container for legend
          var gContainer = new legend();
          gContainer.svg('g').addClass('ct-legends');

          // Create foreignObject
          var foreignObject = new legend();
          foreignObject
            .svg('foreignObject')
            .addAtt({
              x: 0,
              y: 0,
              width: 100 + '%',
              height: 100 + '%',
            })
            .addClass('ct-legendContainer');

          // Create div wrapper as main container after creating foreignObject.
          var divWrap = new legend();
          divWrap.html('div').addClass('ct-legend-div-wrapper');

          // Create style element to control legend.
          var styleEl = document.createElement('style');
          const repetitiveCSS = `.${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{display:flex; flex-direction: row; flex-wrap: nowrap; align-items: baseline; margin-bottom: 0.5em;} .ct-legends svg{overflow: hidden} .ct-legendContainer{overflow: visible;} .ct-legends .ct-label.ct-legend-title{display:inline-block; width: max-content; margin: 0 1em 0 0.25em;}`;
          if (options.position === 'top') {
            styleEl.innerHTML = `.${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper{display: flex; flex-direction: row; justify-content: center; align-items: baseline; flex-wrap: wrap; padding-top: ${
              (chartPadding.top ? chartPadding.top : 0) - fontSize * 2
            }px; max-width: ${gridWidth ? gridWidth + 'px' : '100%'}; margin: 0 auto;} .${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${
              typeof options.width === 'string' ? options.width : options.width + 'px'
            };}`;
          } else if (options.position === 'right') {
            styleEl.innerHTML = `.${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper{display: flex; flex-direction: column; justify-content: flex-start; align-items: baseline; margin-left: auto; padding-left: ${
              (chartPadding.left ? chartPadding.left : 0) + (gridWidth ? gridWidth : 0) + fontSize >= width
                ? 0
                : (chartPadding.left ? chartPadding.left : 0) + (gridWidth ? gridWidth : 0) + fontSize
            }px; width: max-content; padding-top: ${(chartPadding.top ? chartPadding.top : 2 * fontSize) - 0.5 * fontSize}px} .${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${
              typeof options.width === 'string' ? options.width : options.width + 'px'
            };}`;
          } else if (options.position === 'bottom') {
            styleEl.innerHTML = `.${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper{display: flex; flex-direction: row; justify-content: center; flex-wrap: wrap; align-items: baseline; padding-top: ${
              (chartPadding.top ? chartPadding.top : height - fontSize) + (gridHeight ? gridHeight : 0) - fontSize
            }px; max-width: ${gridWidth ? gridWidth + 'px' : '100%'}; margin: 0 auto;} .${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${
              typeof options.width === 'string' ? options.width : options.width + 'px'
            };}`;
          } else if (options.position === 'left') {
            styleEl.innerHTML = `.${
              chart.container.attributes[0].textContent
            } .ct-legend-div-wrapper{display: flex; flex-direction: column; justify-content: flex-start; align-items: baseline; margin-right: auto; padding-right: ${
              (chartPadding.right ? chartPadding.right : width) +
                (gridWidth ? gridWidth : 0) -
                fontSize * 0.25 -
                (chart.defaultOptions.chartPadding.left ? chart.defaultOptions.chartPadding.left : 0) >=
              width
                ? 0
                : (chartPadding.right ? chartPadding.right : width) +
                  (gridWidth ? gridWidth : 0) -
                  fontSize * 0.25 -
                  (chart.defaultOptions.chartPadding.left ? chart.defaultOptions.chartPadding.left : 0)
            }px; margin-left: auto; width: max-content; padding-top: ${
              (chartPadding.top ? chartPadding.top : 2 * fontSize) - 0.5 * fontSize
            }px} .${chart.container.attributes[0].textContent} .ct-legend-div-wrapper .ct-legend-div-wrapper-item{width: ${
              typeof options.width === 'string' ? options.width : options.width + 'px'
            };}`;
          }
          // Add repetitive css to style tag.
          styleEl.innerHTML += ' ' + repetitiveCSS;

          // Append style tag to divWrap.
          foreignObject._node.append(styleEl);

          var divWrapItem = [];
          var svgBox = [];
          var rectBox = [];
          var spanTxt = [];
          for (var i = 0; i < seriesIndex; i++) {
            // Create div wrap for each legend item to control them.
            divWrapItem[i] = new legend();
            divWrapItem[i].html('div').addClass('ct-legend-div-wrapper-item');

            // Create svg element inside foreingObject for rectangle identifier of each legend.
            svgBox[i] = new legend();
            svgBox[i]
              .svg('svg')
              .addAtt({
                'xlmns:ct': Chartist.namespaces.ct,
                width: fontSize * 0.65 + 'px',
                height: fontSize * 0.65 + 'px',
                x: 0,
                y: 0,
              })
              .addClass('ct-series ' + seriesClassName[i].className);

            // Create rect.
            rectBox[i] = new legend();
            rectBox[i]
              .svg('rect')
              .addAtt({
                x: 0,
                y: 0,
                width: 100 + '%',
                height: 100 + '%',
                //style: 'fill: blue!important',
              })
              .addClass('ct-svg-rect ct-legend-box ct-point ct-line  ct-line ct-bar'); // ct-slice-donut

            // Create text span.
            spanTxt[i] = new legend();
            spanTxt[i].html('span').addClass('ct-label ct-legend-title');

            if (chart.data.series.name) {
              // Add text if available
              spanTxt[i]._node.innerHTML = chart.data.series[i].name;
            } else {
              spanTxt[i]._node.innerHTML = options.seriesName[i] || defaultOptions.seriesName[0];
            }

            // Construct legend components
            svgBox[i]._node.append(rectBox[i]._node);
            divWrapItem[i]._node.append(svgBox[i]._node);
            divWrapItem[i]._node.append(spanTxt[i]._node);
            divWrap._node.append(divWrapItem[i]._node);
          }

          foreignObject._node.append(divWrap._node);
          gContainer._node.append(foreignObject._node, true);
          chart.svg.append(gContainer, false);
        });
      };
    };
  })(window, document, Chartist);

  return Chartist.plugins.ctLegendTitle;
});
