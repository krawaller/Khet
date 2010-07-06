;(function(){
    
    /**
     * Rotate and position an object in a tile 
     * @param {Object} el
     * @param {Object} x
     * @param {Object} y
     * @param {Object} dir
     */
    var pos = function(el, x, y, dir, drag){ 
        dir = dir < 0 ? 4 + dir : dir > 3 ? dir%4 : dir;
        if(!drag && typeof el.x != 'undefined' && typeof el.y != 'undefined'){
            if ((idx = pieces[el.y][el.x].indexOf(el)) != -1) {
                pieces[el.y][el.x].splice(pieces[el.y][el.x].indexOf(el), 1);
            }
            pieces[y][x].push(el);
            
            el.x = x;
            el.y = y;
        }

        el.dir = dir; 
        el.style.webkitTransform = 'translate3d('+x*cellSize+'px, '+y*cellSize+'px, 0px) rotateZ('+(dir || 0)%4*90+'deg)'; 
    };
    
    var slice = Array.prototype.slice;
    
    /**
     * Helper funcs
     * @param {Object} cls
     */

    var tmp, idx;
    
    // Cache DOM Elements
    var boardEl = $('board'),
        piecesEl = $('pieces'),
        laserEl = $('laser');
    
    // Board specific settings
    var cellSize = window.innerWidth > 480 ? 96: 40,
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
    
    // Classic board setup
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
    
    var board = {},
        currentPlayer = 1,
        id,
        pieces = {};
    
    // Create board and units
    boardEl.innerHTML = "";
    var table = document.createElement('table'), tbody = document.createElement('tbody'), tr, td;
    table.appendChild(tbody);
    for(var y = 0; y < height; y++){
        tr = document.createElement('tr');
        
        // Keep object maps of pieces and tiles
        pieces[y] = {};
        board[y] = {};
        
        for(var x = 0; x < width; x++){
            pieces[y][x] = [];
            
            id = 'y'+y+'x'+x;
            td = document.createElement('td');
            td.id = id;
            
            // Tile belongs to which player?
            var p = boardSetup[id];
            td.p = p;
            td.className = (p != undefined ? 'p' + p : '');
            
            board[y][x] = td;

            (classic[id] || []).forEach(function(opts, i){
                var piece = document.createElement('div');
                piece.className = ['piece p'+opts.p, opts.type].join(" ");
                piece.x = x;
                piece.y = y;
                
                piece.type = opts.type;
                piece.p = opts.p;
                piece.id = ['p', opts.p, '_', opts.type, '_y' + y + 'x' + x + '_' + i].join("");
                pos(piece, x, y, opts.dir || 0);
                
                piecesEl.appendChild(piece);
                //pieces[y][x].push(piece);        
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        boardEl.appendChild(table);
    }
    
    // What dx and dy values represent a certain direction?
    var dirs = {
        0: { dx: 0, dy: -1 },
        1: { dx: 1, dy: 0 },
        2: { dx: 0, dy: 1 },
        3: { dx: -1, dy: 0 }
    };
    
    // Reflections
    var remap = {
        0: 2,
        1: 3,
        2: 0,
        3: 1
    };
    
    // Unit definitions
    var units = {
        pyramid: {
            reflects: {
                0: { 0: 1, 3: 2 },
                1: { 0: 3, 1: 2 },
                2: { 1: 0, 2: 3 },
                3: { 2: 1, 3: 0 }
            },
            replaceable: true
        },
        
        djed: {
            reflects: {
                0: { 0: 1, 1: 0, 2: 3, 3: 2 },
                1: { 0: 3, 1: 2, 2: 1, 3: 0 },
                2: { 0: 1, 1: 0, 2: 3, 3: 2 },
                3: { 0: 3, 1: 2, 2: 1, 3: 0 }
            },
            replacer: true,
            replaceable: false
        },
        
        pharao: {
            replaceable: false
        },
        
        obelisk: {
            replaceable: true,
            stackable: 2
        }
    };
    
    /**
     * Subscribe to laser shooter
     */
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
        targets = [];
        laser(opts);   
    });
    
    var reflects;
    function laser(opts){
        var at = { x: opts.x, y: opts.y };
        var el, els;

        // Loop through tiles
        while((opts.y+=dirs[opts.dir].dy), (opts.x+=dirs[opts.dir].dx), (els = (pieces[opts.y] || {})[opts.x])){
            if(els.length){
                el = els[0];
                
                // Create a ray
                var ray = document.createElement('div');
                ray.className = 'ray';
                ray.style.height = (Math.abs(opts.x-at.x) + Math.abs(opts.y-at.y)) * cellSize + 'px';
                pos(ray, 0.5+at.x, 0.5+at.y, remap[opts.dir]);
                laserEl.appendChild(ray);
                
                // Reflecting unit?
                reflects = units[el.type].reflects;
                if(reflects){
                    opts.dir = reflects[el.dir][opts.dir];
                } else {
                    opts.dir = undefined;
                }
                
                // Hit or reflect?
                if(typeof opts.dir != 'undefined'){
                    laser(opts);    
                } else {
                    var target = document.createElement('div');
                    target.className = 'target';
                    target.appendChild(document.createElement('div'));
                    pos(target, opts.x, opts.y, 0);
                    laserEl.appendChild(target);
                    targets.push({y: opts.y, x: opts.x});
                }

                break;    
            }
        }
        // Create end of ray if applicable
        if(el == undefined){
            var ray = document.createElement('div');
  
            ray.className = 'ray';
            ray.style.height = (Math.abs(opts.x-at.x) + Math.abs(opts.y-at.y)) * cellSize + 'px';
            pos(ray, 0.5+at.x, 0.5+at.y, remap[opts.dir]);
            laserEl.appendChild(ray);
        }
    }
    
    /**
     * Clean board from current selection
     */
    var dirtyCells = [], dirtyAt;
    function cleanOngoing(noRevert){
        dirtyCells.forEach(function(cell){
            $.removeClass(cell, 'potential');
        });
        dirtyCells = [];
        
        if (dirtyAt) {
            $.removeClass(dirtyAt, 'at');
            dirtyAt = null;
        }
        
        move.forEach(function(m){
            if (!noRevert) {
                pos(m.el, m.orig.x, m.orig.y, m.orig.dir);
            }
            $.removeClass(m.el, 'active');
        });
            
        if (!noRevert) {
            move = [];
        }
        $.pub('/laser');
        
    }
    
    function revert(arr){
        arr.forEach(function(m){
            pos(m.el, m.orig.x, m.orig.y, m.orig.dir);    
        });
    }
    
    /**
     * Event bridge
     */
    var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown',
        touchmove = 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove',
        touchend = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
    
    var move = [], dragging, down, replacements = [], targets = [], moved = false;
    var toggles = [0, 1,-1];
    var touches = 0;
    var touch;
    var stacking = false;
    var active;
    var hover, lastHover;
    
    /**
     * Touchdown
     * @param {Object} e
     */
    document.addEventListener(touchstart, function(e){
        e.preventDefault();
        touches++;
        down = true;
        
        var t = e.changedTouches ? e.changedTouches[0] : e,
            x = Math.floor(t.pageX / cellSize),
            y = Math.floor(t.pageY / cellSize),
            els = ((pieces[y] || {})[x] || []),
            el = els[0]; // Any element there?
            
        touch = { at: new Date().getTime(), x: t.pageX, y: t.pageY };
            
        // Is it a piece belonging to the currentPlayer?    
        if(el && /\bpiece\b/.test(el.className) && el.p == currentPlayer){
            if(!move.length || move.pluck('el').indexOf(el) == -1){
                if(!move.length || (move.length && !move.pluck('el').map(function(el){ return units[el.type].stackable }).compact().length) ){
                    cleanOngoing();    
                } else {
                    cleanOngoing(1);
                }
                
                // Initiate movement obejct
                var m = {
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
                move.push(m);
    
                unit = units[el.type];
                el.className += ' active'; // Mark active unit
                active = m;
                
                var candidate;
                // Mark potential tile candidates
                for(var iy = Math.max(y - 1, 0), iyMax = Math.min(y+1, height-1); iy <= iyMax; iy++){
                    for(var ix = Math.max(x - 1, 0), ixMax = Math.min(x+1, width-1); ix <= ixMax; ix++){
                        candidate = board[iy][ix];
                        if( !(y == iy && x == ix) ){
                            if (
                                (typeof candidate.p == 'undefined' || candidate.p == currentPlayer) &&
                                (pieces[iy][ix].length == 0 || (unit.replacer && units[pieces[iy][ix][0].type].replaceable) || (unit.stackable && pieces[iy][ix][0].type == el.type))
                            ) {
                                dirtyCells.push(candidate);
                                candidate.className += ' potential';
                            }
                        } else {
                            candidate.className += ' at';
                            dirtyAt = candidate;
                        }
                    }    
                }               
            }
        }
    }, false);
    
    /**
     * The drag in drag'n'drop
     * @param {Object} e
     */
    document.addEventListener(touchmove, function(e){
        e.preventDefault();
        if (move.length && down) {
            var t = e.changedTouches ? e.changedTouches[0] : e,
                x = Math.floor(t.pageX / cellSize), 
                y = Math.floor(t.pageY / cellSize);
            
            hover = (board[y] || [])[x];    
            if (hover && hover != lastHover) {
                if (lastHover) {
                    $.removeClass(lastHover, 'hover disallowed');
                    //lastHover.style.border = 'inherit';
                }
                if ($.hasClass(hover, 'potential at')) {
                    $.addClass(hover, 'hover');
                    //hover.style.border = '1px solid #0f0';
                }
                else {
                    $.addClass(hover, 'disallowed');
                    //hover.style.border = '1px solid #f00';
                }
            }
            lastHover = hover;
                   
                
            if(!dragging){
                document.body.className = 'dragging';
                dragging = true;
            }
            //setTimeout(function(){
                pos(active.el, (t.pageX - active.offset.x ) / cellSize, (t.pageY - active.offset.y) / cellSize, active.orig.dir, true);
            //}, 0);
        }
            
    }, false);
    
    window.pieces = pieces;

    
    /**
     * And the drop in drag'n'drop
     * @param {Object} e
     */
    document.addEventListener(touchend, function(e){
        e.preventDefault();
        if(hover){
            $.removeClass(hover, 'hover disallowed');
        }
        
        if (move.length) {
            var t = e.changedTouches ? e.changedTouches[0] : e, 
                x = Math.floor(t.pageX / cellSize), 
                y = Math.floor(t.pageY / cellSize),
                el = ((pieces[y] || {})[x] || [])[0];
            
            // Are we dragging?    
            if (dragging || (el != active.el && touches != active.touch)) {
                document.body.className = '';

                // Allowed move?
                if ((board[y] || [])[x] && $.hasClass(board[y][x], 'potential')) {
                    if(
                        units[active.el.type].stackable && 
                        move.without(active).filter(function(m){ return m.orig.x == active.orig.x && m.orig.y == active.orig.y; }).length == move.without(active).length &&
                        move.pluck('el').filter(function(el){ return !!units[el.type].stackable }).length == move.length && 
                        move.without(active).filter(function(m){ return m.el.x == x && m.el.y == y; }).length == move.without(active).length
                    ){
                        //console.log('stack me!')
                    } else {
                        revert(move.without(active));
                    }
                    
                    if(pieces[y][x].length && units[active.el.type].replacer && units[pieces[y][x][0].type].replaceable){
                        move.push({
                            el: el,
                            orig: {
                                x: x,
                                y: y,
                                dir: el.dir
                            }
                        });
                        pos(pieces[y][x][0], active.orig.x, active.orig.y, pieces[y][x][0].dir);
                    }                    
                    pos(active.el, x, y, active.orig.dir);
                }
                else { // Otherwise float back
                    pos(active.el, active.orig.x, active.orig.y, active.orig.dir);
                    
                    if(touches != active.touch){
                        cleanOngoing();       
                    }
                }
                $.pub('/laser');
                dragging = false;

            } else if(el == active.el && touches != active.touch) {
                // Rotate unit
                revert(move.without(active));
                move = [active];
                var dir = parseInt(active.orig.dir)+toggles[++active.toggle%3];
                dir = dir < 0 ? 4 + dir : dir;
                pos(el, active.orig.x, active.orig.y, dir);
                $.pub('/laser');
            }
        }
        
        down = dragging = false;
    }, false);
    
    /**
     * Move completed
     * @param {Object} e
     */
    $('done').addEventListener(touchend, function(e){
        e.preventDefault();
        e.stopPropagation();
        if (move.length > 0 && ( (tmp = move[0]), (tmp.el.x != tmp.orig.x || tmp.el.y != tmp.orig.y || tmp.el.dir != tmp.orig.dir) ) ) {
            
            targets.forEach(function(target){
                var el = pieces[target.y][target.x][0];
                el.style.zIndex = 1377;
                el.style.webkitTransform += ' scale(0.1)';
                el.addEventListener('webkitTransitionEnd', function(e){ el.parentNode.removeChild(el); pieces[target.y][target.x] = pieces[target.y][target.x].without(el); });   
                if(el.type == 'pharao'){
                    alert('Player ' + currentPlayer + ' win!');
                }
            });
            
            currentPlayer = (currentPlayer + 1) % 2;
            cleanOngoing(1);
            move = [];
            
            $.pub('/laser');
        } else {
            alert('Must move!');
        }
    }, false);
    
    $.sub('/**', function(){ 
        //console.log('Listening'); 
        console.log.apply(console, arguments); 
    });
    $.pub('/laser');
})();
