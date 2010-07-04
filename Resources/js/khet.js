;(function(){
    var $ = function(id){ return document.getElementById(id); },
        pos = function(x,y,dir){ return 'translate3d('+x*cellSize+'px, '+y*cellSize+'px, 0px) rotateZ('+(dir || 0)*90+'deg)'; };
    
    var boardEl = $('board'),
        piecesEl = $('pieces');
    
    var cellSize = 40,
        width = 10,
        height = 8;
    
    var board = {
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
    
    var id;
    var pieces = [];
    var html = ['<table id="board"><tbody>'];
    for(var y = 0; y < height; y++){
        html.push('<tr>');
        for(var x = 0; x < width; x++){
            id = 'y'+y+'x'+x;
            html.push('<td id="'+id+'" class="'+(board[id] != undefined ? 'p' + board[id] : '')+'"></td>');
            
            if(classic[id]){
                classic[id].forEach(function(opts){
                    var piece = document.createElement('div');
                    piece.className = ['p'+opts.p, opts.type].join(" ");
                    piece.style.webkitTransform = pos(x,y,opts.dir);
                    piecesEl.appendChild(piece);        
                });
            }
        }
        html.push('</tr>');
    }
    html.push('</tbody></table>');
    
    
    boardEl.innerHTML = html.join("\n");
})();
