# chartist-plugin-legendTitle

Plugin to create Chartist legend.

Here the [demo](https://syaifurrizal.github.io/chartist-plugin-legendTitle/).

## Installation

Please read Chartist official page [here](https://gionkunz.github.io/chartist-js/plugins.html) on how to add plugin.

And then add this plugin to your code.

## Available Options

```javascript
var options = {
      position: 'top', // Available options: 'top', 'right', 'bottom', 'left'. All options should be `string`
      seriesName: ['Add first seriesName', 'Add second seriesName'], // This options to naming the series in case the series name didn't declared in main chart options.
      width: 'max-content', // This option (optional) determine the width of legends when placed on left or right of the chart.
    };
```
<br/>

## Important:

Especially when set the legend position on `right` or `left`, we should add `chartPadding.right` or `chartPadding.left` accordingly where the legend will be positioned in the chart.

Here the example:

```javascript
<script>
        var data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            series: [
                [1, 2, 3, 5, 30],
                [0, 1, 4, 3, 6],
                [0, 3, 2, 3, 4]
            ]
        };

        var options = {
            chartPadding: {
                right: 130 // We set the right padding to give a space for the legend. For this case we give 130 on the right because we want to place the legend on right position.
            },
            plugins: [
                Chartist.plugins.ctLegendTitle({
                    position: 'right', // Legend will be placed on the right of chart.
                    seriesName: ['First series', 'Second series','Third series']
                })
            ]
        };

        new Chartist.Line('.ct-chart', data, options);
</script>
```

By default, the colors of box legend will follow colors of Chartist series. 

## LICENSE

For this plugin are licensed under [MIT](https://github.com/syaifurrizal/chartist-plugin-legendTitle/blob/main/LICENSE.md).

For Chartist it self, please refer to Chartist's license here: [go to Chartist's license page](https://github.com/gionkunz/chartist-js/blob/develop/LICENSE-MIT).
