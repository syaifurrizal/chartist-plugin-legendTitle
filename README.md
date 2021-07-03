# chartist-plugin-legendTitle

Plugin to create Chartist legend. 

## Available Options

```javascript
var options = {
      position: 'top', // Available options: 'top', 'right', 'bottom', 'left'. All options should be `string`
      seriesName: ['Add first seriesName', 'Add second seriesName'], // This options to naming the series in case the series name didn't declared in main chart options.
      legendPadding: { // This option is optional. Paramater available same as when we declare padding in css.
        top: 15,
        right: 15,
        bottom: 5,
        left: 15
      },
      width: 'max-content', // This option determine the width of legends when placed on left or right of the chart.
    };
```
<br/>

## Important:

Especially when set the legend on `right` or `left`, we should add `chartPadding` to the Chartist main options.

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
                right: 130 // This parameter will help your char be more awesomes!
            },
            plugins: [
                Chartist.plugins.ctLegendTitle({
                    position: 'right',
                    seriesName: ['First series', 'Second series','Third series']
                })
            ]
        };

        new Chartist.Line('.ct-chart', data, options);
    </script>
```
