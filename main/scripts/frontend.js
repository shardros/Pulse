var svg = require('svg-builder')
        .width(125)
        .height(125);

    var logo = svg
        .circle({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82
        }).circle({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#3B92BC',
            cx: 84,
            cy: 82
        }).text({
            x: 10,
            y: 20,
            'font-family': 'helvetica',
            'font-size': 15,
            stroke : '#fff',
            fill: '#fff'
        }, 'My logo').render();
    
    svg.reset(); //removes all elements from the internal DOM.
    
    svg.line({
        x1:0,
        y1:0,
        x2:125,
        y2:125,
        stroke:'#FF0000',
        'stroke-width': 10
    }).line({
        x1:0,
        y1:125,
        x2:125,
        y2:0,
        stroke:'#FF0000',
        'stroke-width': 10
    }).render();

