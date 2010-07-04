;(function(){
    var $ = function(id){ return document.getElementById(id); },
        pos = function(x,y,dir){ return 'translate3d('+x*cellSize+'px, '+y*cellSize+'px, 0px) rotateZ('+(dir || 0)*90+'deg)'; };
    
    var boardEl = $('board'),
        piecesEl = $('pieces'),
        laserEl = $('laser');
    
    var cellSize = 40,
        width = 10,
        height = 8;
    
    var boardSetup = {
        y0x0: 0,
        y0x1: 1,
        y0x8: 0,
        y0x9: 1,
        y1x0: 0,
        y1x9: 1,
        y2x0: 0,
        y2x9: 1,
        y3x0: 0,
        y3x9: 1,
        y4x0: 0,
        y4x9: 1,
        y5x0: 0,
        y5x9: 1,
        y6x0: 0,
        y6x9: 1,
        y7x0: 0,
        y7x1: 1,
        y7x8: 0,
        y7x9: 1
    };
    
    var units = {
        obelisk: { reflects: 0 },
        pharao: { reflects: 0 },
        pyramid: { reflects: 1 },
        djed: { reflects: 2 }
    };
    
    var classic = {
        y0x4: [{ type: "obelisk", p: 0 }, { type: "obelisk", p: 0 }],
        y0x5: [{ type: "pharao", p: 0, dir: 0 }],
        y0x6: [{ type: "obelisk", p: 0 }, { type: "obelisk", p: 0 }],
        y0x7: [{ type: "pyramid", p: 0, dir: 0 }],
        y1x2: [{ type: "pyramid", p: 0, dir: 1 }],
        y2x3: [{ type: "pyramid", p: 1, dir: 2}],
        y3x0: [{ type: "pyramid", p: 0, dir: 3}],
        y3x2: [{ type: "pyramid", p: 1, dir: 1}],
        y3x4: [{ type: "djed", p: 0, dir: 1}],
        y3x5: [{ type: "djed", p: 0, dir: 0}],
        y3x7: [{ type: "pyramid", p: 0, dir: 0}],
        y3x9: [{ type: "pyramid", p: 1, dir: 2}],
        
        y4x0: [{ type: "pyramid", p: 0, dir: 0}],
        y4x2: [{ type: "pyramid", p: 1, dir: 2}],
        y4x4: [{ type: "djed", p: 1, dir: 0}],
        y4x5: [{ type: "djed", p: 1, dir: 1}],
        y4x7: [{ type: "pyramid", p: 0, dir: 3}],
        y4x9: [{ type: "pyramid", p: 1, dir: 1}],
        y5x6: [{ type: "pyramid", p: 0, dir: 0}],
        y6x7: [{ type: "pyramid", p: 1, dir: 3 }],
        y7x2: [{ type: "pyramid", p: 1, dir: 2 }],
        y7x3: [{ type: "obelisk", p: 1 }, { type: "obelisk", p: 1 }],
        y7x4: [{ type: "pharao", p: 1, dir: 2 }],
        y7x5: [{ type: "obelisk", p: 1 }, { type: "obelisk", p: 1 }],
    };
    
    var board = {};
    
    var id;
    var pieces = [];
    var html = ['<table id="board"><tbody>'];
    for(var y = 0; y < height; y++){
        html.push('<tr>');
        for(var x = 0; x < width; x++){
            id = 'y'+y+'x'+x;
            html.push('<td id="'+id+'" class="'+(boardSetup[id] != undefined ? 'p' + boardSetup[id] : '')+'"></td>');
            
            if(classic[id]){
                classic[id].forEach(function(opts){
                    var piece = document.createElement('div');
                    piece.className = ['p'+opts.p, opts.type].join(" ");
                    piece.style.webkitTransform = pos(x,y,opts.dir);
                    piece.type = opts.type;
                    piece.dir = opts.dir;
                    piecesEl.appendChild(piece);
                    board[id] = piece;        
                });
            } else {
                board[id] = 0;
            }
        }
        html.push('</tr>');
    }
    html.push('</tbody></table>');
    boardEl.innerHTML = html.join("\n");
    
    var dirs = {
        0: { dx: 0, dy: -1 },
        1: { dx: 1, dy: 0 },
        2: { dx: 0, dy: 1 },
        3: { dx: -1, dy: 0 }
    };
    
    var remap = {
        0: 2,
        1: 3,
        2: 0,
        3: 1
    };
    
    var pyramid = {
        0: { 0: 1, 3: 2 },
        1: { 0: 3, 1: 2  },
        2: { 1: 0, 2: 3 },
        3: { 2: 1, 3: 0 }
    };
    
    laser({
        x: 0,
        y: -1,
        dir: 2
    });
    
    function laser(opts){
        var at = { x: opts.x, y: opts.y };
        var el;
        while((opts.y+=dirs[opts.dir].dy),(opts.x+=dirs[opts.dir].dx), (el = board['y'+opts.y+'x'+opts.x]), el != undefined){
            if(el){
                console.log(el);
                var ray = document.createElement('div'),
                    rayDir = remap[opts.dir];
                    
                ray.className = 'ray';
                ray.style.height = (Math.abs(opts.x-at.x) + Math.abs(opts.y-at.y)) * cellSize + 'px';
                ray.style.webkitTransform = pos(0.5+at.x, 0.5+at.y, rayDir);
                laserEl.appendChild(ray);
                
                switch(el.type){
                    case 'pyramid':
                    opts.dir = pyramid[el.dir][opts.dir];
                    break;
                }
                
                laser(opts);
                break;    
            }
        }
        //document.createElement('div');
    }
})();
