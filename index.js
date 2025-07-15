// #region draw event
function clear() //since objects are meant to move on the screen, 
                 // we need to redraw everyting first, 
                 // starting by clearing the screen
{
    c.width=w; //clear
    ctx.strokeStyle="#008b8b"; //reset storkeStyle
    ctx.fillStyle="#000000"; //set fillStyle for background
    ctx.rect(0,0,w,h); //draw background
    ctx.fill(); //fill backgorund
    ctx.fillStyle="#008b8b"; //reset fillStyle
}

function draw()
{
    for(var i=0;i<polygons.length;i++) //iterating through all polygons to be drawn
    {
        ctx.beginPath(); //beginning the outline of the tile diamond
        ctx.moveTo(centerX+polygons[i][0].x,centerY+polygons[i][0].y); //start at the first vertex
        for(var j=1;j<=4;j++) //iterating through vertices
        {
            ctx.lineTo(centerX+polygons[i][j % 4].x,centerY+polygons[i][j % 4].y); 
            //connect vertices 0-1,1-2,2-3,3-0 (n mod 4 is part of {0,1,2,3}))
        }
        ctx.closePath(); //end diamond
        ctx.fillStyle=polygons[i][4]; //get fill color
        ctx.fill(); //fill diamond
    }
}
// #endregion

function main() //game looő
{
    clear(); //clear screen
    draw(); //render
    t++; //track time
}

// #region load functions
function loadLevel(n) //level load function
{
    tmap=[]; //initalize tilempa
    var data=document.getElementById("levelData-"+String(n)).innerHTML; //get encoded data
    var ch=""; //initalize character to store
    var word=""; //initalize word storing characters
    var arr=[]; //initalize array storing words
    var i=1; //index, 1 to skip newline character at 0
    do //decode loop
    {
        ch=data[i]; //get character
        if(ch=="#") //if line finished
        {
            tmap.push(arr); //add row
            console.log(arr); //log row
            arr=[]; //reset row
            i+=2; //inceremnt by 2 to skip newline character
            continue; //skip to next iteration
        }
        if(ch==" ") // if word finished
        {
            arr.push(word); //add word to array
            console.log(word); //log word
            //console.log(arr);
            word=""; //reset word
            i++; //continue to next character
            continue; //skip to next iteration
        }
        if(ch!="*") //read character
        {
            word+=ch; //add character to word
            console.log(ch) //log character
            i++; //continue to next
            continue; //skip to next iteration
        }

    }while(ch!="*"); //end loop
    console.log(data); //log data
    console.log(tmap); //log tilemap
    //make polygons
    polygons=[]; //initalize polygons array
    for(var y=0;y<gw;y++) //iterate through tilemap y
        {
            for(var x=0;x<gw;x++) //iterate through tilemap x
            {
                polygons.push( //polygon connsisiting of 4 vertices (transformed) and a color
                    [                         
                        tf(new Vector((x-(gw/2))*tw,(y-(gw/2))*tw)), //0
                        tf(new Vector((x-(gw/2))*tw,(y+1-(gw/2))*tw)), //1
                        tf(new Vector((x+1-(gw/2))*tw,(y+1-(gw/2))*tw)), //2
                        tf(new Vector((x+1-(gw/2))*tw,(y-(gw/2))*tw)), //3
                        colors[Number(tmap[y][x])] //color
                    ]
                );
            }
        }
}

// #region transformation
function Vector(x,y) //vector class
{
    this.x=x;
    this.y=y;
}

function tf(v) //rotation matrix transformation function vector->vector
{
    /*
    (Xrot -60deg)(Zrot 45deg)(x,y):
    |1 0          ||cos(45deg)  sin(45deg)||x|   |(x-y)/sqrt(2)    |
    |0 cos(-60deg)||-sin(45deg) cos(45deg)||y| = |(x+y)/(2*sqrt(2))|
    */
    return(
        new Vector(
            (v.x+v.y)/1.41421356237, //=sqrt(2)
            (-v.x+v.y)/2.82842712475 //=2*sqrt(2)
        )
    );
}
// #endregion

// #region variables
const d=document.getElementById("game"); //abbreviating div element
const c=document.getElementById("canvas"); //abbreviating canvas element
const w=c.width; //abbreviating width
const h=c.height;//abbreviating height
const ctx=c.getContext("2d"); //abbreviating canvas context
const centerX=w/2; //abbreviating center x
const centerY=h/2; //abbreviating center y

const fps=60; //fps, manipulates the interval in the setInterval() function's call
let t=0; //track elapsed frames

let tmap=[]; //array containg the rows of the tilempa to render
const r=320; //manipulates the size of the drawn diamond
const gw=16; //abbreviating grid width (tiles) 
const tw=2*r/gw; //abbreviating tile width (pixels)
let polygons=[]; //array holding the polygons to be rendered

const colors=[ 
    "rgba(0,0,0,0)",
    "darkcyan",
    "aqua"
]; //array telling the tilemap which index means which color

loadLevel(0); //loads the inital level
//#endregion

setInterval(main,fps/1000); //game loop setInterval() call
//main()