

    var canvas = document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");

    var numBugs = 64;
    var bugs = [];
    var bugLength = 3;
    var bugSize = 8;
    var dx = 1; // how much they move per draw?
    var dy = 1;


    function bugNumControl () {
        var value = document.getElementById('rg').value;
        numBugs = +value;   // + will convert the string to number
        initBugs();
      }

    function initBugs() {
        // adds to the bug list
        bugs=[];
        for (x=0; x<numBugs; x++){
            // make a bug!
            var dx = 2*(Math.random() - 0.5); // direction of travel
            var dy = 2*(Math.random() - 0.5);
            var norm = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
            var xi = canvas.width * Math.random(); // where the bug is
            var yi = canvas.height * Math.random();
            var col1 = '#'+Math.floor(Math.random()*16777215).toString(16);
            var col2 = '#'+Math.floor(Math.random()*16777215).toString(16);
            var col3 = '#'+Math.floor(Math.random()*16777215).toString(16);
            var bugcol = [col1, col2, col3];
            var bug = {'dx':dx/norm, 'dy':dy/norm, 'x':xi, 'y':yi, 'bugcol':bugcol};
            bugs.push(bug);
        }
    }

    function drawBugs() {
        for(i=0; i<bugs.length; ++i) {
            r = bugs[i]
            xc = r.bugcol;
            for (j=0; j<bugLength; j++) {
                ctx.beginPath();
                ctx.rect(r.x+ (-1*r.dx*j*bugSize), r.y+ (-1*r.dy*j*bugSize), bugSize, bugSize);
                ctx.fillStyle = xc[j];
                ctx.fill();
                ctx.closePath();
            }
            bugs[i].x += bugs[i].dx;
            bugs[i].y += bugs[i].dy;
            if (bugs[i].x < 1) {bugs[i].x = canvas.width;}
            if (bugs[i].x > canvas.width) {bugs[i].x = 1;}
            if (bugs[i].y < 1) {bugs[i].y = canvas.height;}
            if (bugs[i].y > canvas.width) {bugs[i].y = 1;}

        }
    }


    function dist(x1,y1,x2,y2) {
      var d = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
      return(d);
    }


    function bugsAction() {
      // each bug can see if there's a bug near by
      for(i=0; i<bugs.length; ++i) {
          thisx = bugs[i].x;
          thisy = bugs[i].y;
          if (Math.random() < 0.01) {
            // go crazy.
            var bugsdx = thisx + 2*(Math.random() - 0.5); // direction of travel
            var bugsdy = thisy + 2*(Math.random() - 0.5);
            var norm = Math.sqrt(Math.pow(bugsdx,2) + Math.pow(bugsdy,2));
            bugs[i].dx = bugsdx/norm;
            bugs[i].dy = bugsdy/norm;
          } else {
            // if there's a bug in this region, then course correct to follow
            for(j=0; j<bugs.length; ++j) {
              if (i != j) {
                thatx = bugs[j].x;
                thaty = bugs[j].y;
                if (dist(thisx,thisy,thatx,thaty) < 10) {
                  // make a course correction
                  bugsdx = bugs[i].dx + 0.2*bugs[j].dx;
                  bugsdy = bugs[i].dy + 0.2*bugs[j].dy;
                  norm   = Math.sqrt(Math.pow(bugsdx,2) + Math.pow(bugsdy,2));
                  bugs[i].dx = bugsdx/norm;
                  bugs[i].dy = bugsdy/norm;
                }
              }
            }
          }
        }
    }


    function draw() {        // -- //
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBugs();
        bugsAction();
        requestAnimationFrame(draw);
    }


    function start() {
      initBugs();
      draw();
    }

(function(){
    //requestAnimationFrame(draw);
    window.onload = function() { start(); };
})();
