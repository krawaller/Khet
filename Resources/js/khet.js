;(function(){
    
    /**
     * Rotate and position an object in a tile 
     * @param {Object} el
     * @param {Object} x
     * @param {Object} y
     * @param {Object} dir
     */
    var pos = function(el, x, y, dir){ 
        dir = dir < 0 ? 4 + dir : dir > 3 ? dir%4 : dir;
        el.dir = dir; 
        el.style.webkitTransform = 'translate3d('+x*cellSize+'px, '+y*cellSize+'px, 0px) rotateZ('+(dir || 0)%4*90+'deg)'; 
    };
    
    /**
     * Helper funcs
     * @param {Object} cls
     */
    String.prototype.hasClass = function(cls){ return new RegExp("\\b" + cls + "\\b", "i").test(this); }
    String.prototype.addClass = function(cls){ return this.hasClass(cls) ? this : this + ' ' + cls; }
    String.prototype.removeClass = function(cls){ return this.replace(new RegExp("\\b" + cls + "\\b", "ig"), ""); }
    
    var tmp;
    
    // Cache DOM Elements
    var boardEl = $('board'),
        piecesEl = $('pieces'),
        laserEl = $('laser');
    
    // Board specific settings
    var cellSize = 40,
        width = 10,
        height = 8;
    
    // What tiles belongs to which user?
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
    var currentPlayer = 1;
    
    var id;
    var pieces = {};
    boardEl.innerHTML = "";
    var table = document.createElement('table'), tbody = document.createElement('tbody'), tr, td;
    table.appendChild(tbody);
    for(var y = 0; y < height; y++){
        tr = document.createElement('tr');
        pieces[y] = {};
        board[y] = {};
        for(var x = 0; x < width; x++){
            pieces[y][x] = [];
            
            id = 'y'+y+'x'+x;
            td = document.createElement('td');
            td.id = id;
            var p = boardSetup[id];
            td.p = p;
            td.className = (p != undefined ? 'p' + p : '');
            board[y][x] = td;
            
            if(classic[id]){
                classic[id].forEach(function(opts){
                    var piece = document.createElement('div');
                    piece.className = ['piece p'+opts.p, opts.type].join(" ");
                    pos(piece, x, y, opts.dir);
                    piece.type = opts.type;
                    piece.p = opts.p;
                    piecesEl.appendChild(piece);
                    pieces[y][x].push(piece);        
                });
            }
            
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        boardEl.appendChild(table);
    }
    
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
    
    
    
    var units = {
        pyramid: {
            reflects: {
                0: { 0: 1, 3: 2 },
                1: { 0: 3, 1: 2 },
                2: { 1: 0, 2: 3 },
                3: { 2: 1, 3: 0 }
            }
        },
        
        djed: {
            reflects: {
                0: { 0: 1, 1: 0, 2: 3, 3: 2 },
                1: { 0: 3, 1: 2, 2: 1, 3: 0 },
                2: { 0: 1, 1: 0, 2: 3, 3: 2 },
                3: { 0: 3, 1: 2, 2: 1, 3: 0 }
            }
        }
    };
    
    $.sub('/laser', function(){
        var opts;
        switch (currentPlayer) {
            case 0:
                opts = { x: 0, y: -1, dir: 2 };
                break;
                
            case 1:
                opts = { x: 9, y: 8, dir: 0 };
                break;
        }
        laserEl.innerHTML = "";
        laser(opts);   
    });
    
    var reflects;
    function laser(opts){
        var at = { x: opts.x, y: opts.y };
        var el, els;

        while((opts.y+=dirs[opts.dir].dy), (opts.x+=dirs[opts.dir].dx), (els = (pieces[opts.y] || {})[opts.x])){
            if(els.length){
                el = els[0];
                var ray = document.createElement('div');
                    
                ray.className = 'ray';
                ray.style.height = (Math.abs(opts.x-at.x) + Math.abs(opts.y-at.y)) * cellSize + 'px';
                pos(ray, 0.5+at.x, 0.5+at.y, remap[opts.dir]);
                laserEl.appendChild(ray);
                
                reflects = units[el.type].reflects;
                if(reflects){
                    opts.dir = reflects[el.dir][opts.dir];
                } else {
                    opts.dir = undefined;
                }
                
                if(typeof opts.dir != 'undefined'){
                    laser(opts);    
                } else {
                    var target = document.createElement('div');
                    target.className = 'target';
                    pos(target, opts.x, opts.y, 0);
                    laserEl.appendChild(target);
                }

                break;    
            }
        }
        if(el == undefined){
            var ray = document.createElement('div');
  
            ray.className = 'ray';
            ray.style.height = (Math.abs(opts.x-at.x) + Math.abs(opts.y-at.y)) * cellSize + 'px';
            pos(ray, 0.5+at.x, 0.5+at.y, remap[opts.dir]);
            laserEl.appendChild(ray);
        }
    }
    
    var dirtyCells = [], dirtyAt;
    function cleanOngoing(){
        dirtyCells.forEach(function(cell){
            cell.className = cell.className.removeClass('potential');
        });
        dirtyCells = [];
        
        if (dirtyAt) {
            dirtyAt.className = dirtyAt.className.removeClass('at');
            dirtyAt = null;
        }
        
        if (move) {
            move.el.style.webkitTransform = pos(move.el, move.orig.x, move.orig.y, move.orig.dir);
            move.el.dir = move.orig.dir;
            move.el.className = move.el.className.removeClass('active');
            
            move = false;
            $.pub('/laser');
        }
    }
    
    var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown',
        touchmove = 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove',
        touchend = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
    
    var move, dragging, down;
    var toggles = [0, 1,-1];
    var touches = 0;
        
    document.addEventListener(touchstart, function(e){
        e.preventDefault();
        touches++;
        down = true;
        
        var t = e.changedTouches ? e.changedTouches[0] : e,
            x = Math.floor(t.pageX / cellSize),
            y = Math.floor(t.pageY / cellSize),
            el = ((pieces[y] || {})[x] || [])[0];
            
            
        if(el && /\bpiece\b/.test(el.className) && el.p == currentPlayer){
            if(!move || el != move.el){
                cleanOngoing();
                
                move = {
                    toggle: 0,
                    el: el,
                    orig: {
                        x: x,
                        y: y,
                        dir: el.dir
                    },
                    offset: {
                        x: t.pageX % cellSize,
                        y: t.pageY % cellSize
                    },
                    touch: touches
                };
    
                el.className += ' active';
                for(var iy = Math.max(y - 1, 0), iyMax = Math.min(y+1, height-1); iy <= iyMax; iy++){
                    for(var ix = Math.max(x - 1, 0), ixMax = Math.min(x+1, width-1); ix <= ixMax; ix++){
                        var candidate = board[iy][ix];
                        if(!(y == iy && x == ix) ){
                            if(typeof candidate.p == 'undefined' || candidate.p == currentPlayer){
                                dirtyCells.push(candidate);
                                candidate.className += ' potential';     
                            }             
                        } else {
                            candidate.className += ' at';
                            dirtyAt = candidate;
                        }
                    }    
                }                
            } else {
                move.offset = {
                    x: t.pageX % cellSize,
                    y: t.pageY % cellSize
                };
            }

        } else if(move && move.el){
            //cleanOngoing();
        }
    }, false);
    
    document.addEventListener(touchmove, function(e){
        e.preventDefault();
        if (move && down) {
            if(!dragging){
                document.body.className = 'dragging';
                dragging = true;
            }
            var t = e.changedTouches ? e.changedTouches[0] : e;
            pos(move.el, (t.pageX - move.offset.x ) / cellSize, (t.pageY - move.offset.y) / cellSize, move.orig.dir);
        }
            
    }, false);
    
    document.addEventListener(touchend, function(e){
        e.preventDefault();
        
        if (move) {
            var t = e.changedTouches ? e.changedTouches[0] : e, 
                x = Math.floor(t.pageX / cellSize), 
                y = Math.floor(t.pageY / cellSize),
                el = ((pieces[y] || {})[x] || [])[0];
                
            if (dragging) {
                document.body.className = '';
                if (board[y][x].className.hasClass('potential')) {
                    pos(move.el, x, y, move.orig.dir);
                    pieces[y][x].unshift(move.el);
                    pieces[move.orig.y][move.orig.x].splice(pieces[move.orig.y][move.orig.x].indexOf(move.el));
                }
                else {
                    pieces[y][x].splice(pieces[y][x].indexOf(move.el));
                    pieces[move.orig.y][move.orig.x].unshift(move.el);
                    pos(move.el, move.orig.x, move.orig.y, move.orig.dir);
                }
                $.pub('/laser');
                dragging = false;
            } else if(el == move.el && touches != move.touch) {
                var dir = parseInt(move.orig.dir)+toggles[++move.toggle%3];
                dir = dir < 0 ? 4 + dir : dir;
                el.style.webkitTransform = pos(el, x, y, dir);
                $.pub('/laser');
            }
        }
        
        down = dragging = false;
    }, false);
    
    $('done').addEventListener(touchend, function(e){
        e.preventDefault();
        e.stopPropagation();
        currentPlayer = (currentPlayer + 1) % 2;
        move.el.className = move.el.className.removeClass('active');
        move = false;
        cleanOngoing();
        $.pub('/laser');
    }, false);
    
    $.sub('/**', function(){ console.log('Listening'); console.log.apply(console, arguments); });
    $.pub('/laser');
})();
