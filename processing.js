google.charts.load('current', { 'packages': ['corechart', 'controls', 'sankey'] });
google.charts.setOnLoadCallback(drawSheetName);

function drawSheetName() {
    var queryString = encodeURIComponent('SELECT *');

    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1_TcArXlDaLo_MxxWk7N3uxktsdicm9hCjbPPKfOW7SQ/gviz/tq?sheet=Sankey&headers=1&tq=' + queryString);
    query.send(handleSampleDataQueryResponse);
}

function handleSampleDataQueryResponse(response) {
    if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }

    // Sets chart options.

    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];
    var piecolors = ['#F66D44','#FEAE65','#E6F69D','#AADEA7','#64C2A6','#2D87BB','#E0E0E0'];
    var options = {
        width: 700,
        height: 600,
        sankey: {
            link: {
                colorMode: 'source', // 'gradient'
                interactivity: true
            },
            node: {
                //interactivity: true
            }
        }
    };
    var pieoptions = {
        //title: 'My Daily Activities',
        pieHole: 0.3,
        colors: piecolors,
        pieSliceText: 'none'
      };

    var data = response.getDataTable();

    var dashboard = new google.visualization.Dashboard(
        document.getElementById('dashboard_div'));

    var programmaticFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'filter_div',
        'options': {
            'filterColumnLabel': 'Filter',
            'ui': {
                'label': 'Organization',
                'caption': 'Zalando Organization...',
                'labelStacking': 'vertical',
                'allowTyping': false,
                'allowMultiple': false,
                'allowNone': false
            }
        }
    });

    var nFilter = new google.visualization.ControlWrapper({
        'controlType': 'NumberRangeFilter',
        'containerId': 'filter_n_div',
        'options': {
            'filterColumnLabel': 'n_users',
            'ui': {
                'label': '# Users',
                'labelStacking': 'vertical',
                'allowTyping': false,
                'allowMultiple': false,
                'allowNone': false
            }
        }
    });


    var viewRows = [];
    var view;
    var view_sankey;

    //   var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    /*      var chart = new google.visualization.ChartWrapper({
           'chartType': 'Sankey',
           'containerId': 'sankey_basic',
           'options': options,
           // The pie chart will use the columns 'Name' and 'Donuts eaten'
           // out of all the available ones.
           'view': {
               'columns': [1, 2, 3],
               //                      'rows': viewRows
           }
       });  */

    var dummy = new google.visualization.ChartWrapper({
        chartType: 'Table',
        containerId: 'DummyTable',
        options: {
            sort: 'disable' // disable sorting on the dummy table to reduce the number of event handlers spawned
        },
        view: {
           columns: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12] // remove all rows from the view so it doesn't waste time rendering them in HTML
        }
    });

    google.visualization.events.addOneTimeListener(dashboard, 'ready', function () {
        // create a "ready" event handler for the dummy
        // this fires whenever the user interacts with the controls
        google.visualization.events.addListener(dummy, 'ready', function () {

            document.getElementById("piechart").style.visibility='hidden';

            var dt = dummy.getDataTable();
            //nFilter.options.minValue = dt.getColumnRange(4).max;
            //alert("Min: " + dt.getColumnRange(4).min);

            viewRows = []
            var limit = dt.getNumberOfRows();
            if (dt.getNumberOfRows() > 100) limit = 100;
            for (var i = 0; i < limit; i++) {
                viewRows.push(i);
            }

            // get the data for the table

            // do any manipulation/aggregation here
            // set the table's data

            //var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));

            view = new google.visualization.DataView(dt);
            view_sankey = new google.visualization.DataView(dt);
            //view.setRows(data.getFilteredRows([
            //    { column: 3, minValue: 3 }
            //]));
            if (dt.getNumberOfRows() > 100) {
                view.setRows(viewRows);
                view_sankey.setRows(viewRows);
            }
            //view.setColumns([1, 2, 4]);
            view.setColumns([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            view_sankey.setColumns([1, 2, 4]);

            //chart.setDataTable(dt);
            //chart.view.rows = viewRows;
            // draw the table
            chart.draw(view_sankey, options);
        });

        var dt = dummy.getDataTable();

        viewRows = []
        var limit = dt.getNumberOfRows();
        if (dt.getNumberOfRows() > 100) limit = 100;
        for (var i = 0; i < limit; i++) {
            viewRows.push(i);
        }
        // get the data for the table

        // do any manipulation/aggregation here
        // set the table's data
        var piechart = new google.visualization.PieChart(document.getElementById('piechart'));
        var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
        google.visualization.events.addListener(chart, 'select', usefulHandler);
        function usefulHandler() {
            var sel = chart.getSelection()[0];
            if (sel) {
                document.getElementById("piechart").style.visibility='visible';
/*                 alert(' ROW ' + chart.getSelection()[0].row
                + ' / ' + view.getValue(chart.getSelection()[0].row,0)
                + ' / ' + view.getValue(chart.getSelection()[0].row,1)
                + ' / ' + view.getValue(chart.getSelection()[0].row,2)
                + ' Q ' + view.getValue(chart.getSelection()[0].row,3)
                + ' R ' + view.getValue(chart.getSelection()[0].row,4)
                + ' A ' + view.getValue(chart.getSelection()[0].row,8)
                ); */
                var piedata = new google.visualization.DataTable();
                piedata.addColumn('string', 'Segment');
                piedata.addColumn('number', '#users');
                piedata.addRows([
                    ['Robot User', view.getValue(chart.getSelection()[0].row,4)],
                    ['Data Scietists', view.getValue(chart.getSelection()[0].row,5)],
                    ['Data Engineer', view.getValue(chart.getSelection()[0].row,6)],
                    ['Engineer', view.getValue(chart.getSelection()[0].row,7)],
                    ['Analyst', view.getValue(chart.getSelection()[0].row,8)],
                    ['Product Manager', view.getValue(chart.getSelection()[0].row,9)],
                    ['Others', view.getValue(chart.getSelection()[0].row,10)],
                ]);
                piechart.draw(piedata,pieoptions);
            } else {
                document.getElementById("piechart").style.visibility='hidden';
            }
        } 

        view = new google.visualization.DataView(dt);
        view_sankey = new google.visualization.DataView(dt);
        //view.setRows(data.getFilteredRows([
        //    { column: 3, minValue: 3 }
        //]));
        if (dt.getNumberOfRows() > 100) {
            view.setRows(viewRows);
            view_sankey.setRows(viewRows);
        }
        //view.setColumns([1, 2, 4]);
        view.setColumns([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        view_sankey.setColumns([1, 2, 4]);

        //chart.setDataTable(dt);
        //chart.view.rows = viewRows;
        // draw the table
        chart.draw(view_sankey, options);
    });

    /*    var view = new google.visualization.DataView(data);
       view.setRows(data.getFilteredRows([
           { column: 3, minValue: 3 }
       ])); */



    dashboard.bind(programmaticFilter, dummy);
    dashboard.bind(nFilter, dummy);
    dashboard.draw(data);

    //      var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    //      chart.draw(data, options);
}