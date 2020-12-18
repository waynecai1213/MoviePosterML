const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(app.view);

const infoContainer = document.getElementById('poster-info');
let container = document.getElementById("container");

let progressBg=document.getElementById("progressBg")
let progressBar = document.getElementById("progressBar");
let enterBtn = document.getElementById('enterBtn');

let posterDict = {};
const unitArray = [];
const imageArray = [];


for(let i = 0; i < positions.length; i ++) {
  // const filename = positions[i].filename.replace(/\//g, '_');
  // const filename = positions[i].filename.replace('resizedPoster/','');
  const name = positions[i].filename.replace('.jpg', '').replace('resizedPoster/','');
  // const name = positions[i].title;
  app.loader.add(name,  positions[i].filename);
  posterDict[name] = positions[i];
}

//loading progress
const showProgress=(e)=>{
  console.log(e.progress);
  progressBar.style.width=e.progress+'%';
}

const reportError=(e)=>{
  console.log('Error: '+e.message);
}

const doneLoading =()=>{
  console.log('DoneLoading');
  console.log('resources:'+app.loader.resources);
  
  progressBg.classList.add("m-fadeOut");
  progressBg.style.transitionDelay='0s';
  enterBtn.classList.add("m-fadeIn");
}

app.loader.onProgress.add(showProgress);
app.loader.onComplete.add(doneLoading);
app.loader.onError.add(reportError);
app.loader.load(()=>{
  console.log('loadingya');
});


//Viewport
const viewport = new Viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,

    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

// add the viewport to the stage
app.stage.addChild(viewport)

// activate plugins
viewport
    .drag()
    .pinch()
    .wheel({ smooth: 3 })
    .decelerate()
    .clampZoom({ minWidth: 500, minHeight: 500,maxWidth:50000,maxHeight:50000})


//call a function  when the image has finished loading:
app.loader.load((loader, resources) => {
  
  //see javascript object syntax & for/in Statement:  https://www.w3schools.com/jsref/jsref_forin.asp
  //loops through the properties of an object
  for(key in resources) {

    const clusterPos = posterDict[key].cluster_pos;
    const xPos = 5 * app.renderer.width * (clusterPos[0] * 2 - 1);
    const yPos = 5 * app.renderer.width * (clusterPos[1] * 2 - 1);
    const toxPos=5 * app.renderer.width * (posterDict[key].grid_pos[0] * 2/40 - 1);
    const toyPos=5 * app.renderer.width * (posterDict[key].grid_pos[1] * 2/40 - 1);
    //load poster images
     const imageSprite = new PIXI.Sprite(resources[key].texture)
    imageSprite.x = 5 * app.renderer.width * (clusterPos[0] * 2 - 1);
    imageSprite.y = 5 * app.renderer.width * (clusterPos[1] * 2 - 1);
    imageSprite.anchor.x = 0.5;
    imageSprite.anchor.y = 0.5;
    imageSprite.height = imageSprite.height * 2;
    imageSprite.width = imageSprite.width * 2;
    imageSprite.umapXpos=xPos;
    imageSprite.umapYpos=yPos;
    imageSprite.targetXpos=toxPos;
    imageSprite.targetYpos=toyPos;
    //hide image
    // gsap.to(imageSprite, 0, {alpha: 0});
    // gsap.set(imageSprite, {visible: false});  
  

    imageSprite.interactive = true;
    imageArray.push(imageSprite);
    viewport.addChild(imageSprite);
    gsap.to(imageArray, 0.5, {alpha: 0});
    gsap.set(imageArray, {visible: false});   

    //draw color circles
    const circle = new PIXI.Graphics();
    
    const radius = 160;
    circle.hitArea = new PIXI.Circle(xPos, yPos, radius);
    // circle.interactive = true;
    // circle.beginFill(0xffffff, 1);
    // circle.drawCircle(xPos, yPos, 104);
    // circle.endFill();
    circle.beginFill(PIXI.utils.string2hex(posterDict[key].color1), 1);
    circle.drawCircle(xPos, yPos, 160);
    circle.endFill();
    circle.beginFill(PIXI.utils.string2hex(posterDict[key].color2), 1);
    circle.drawCircle(xPos, yPos,100);
    circle.beginFill(PIXI.utils.string2hex(posterDict[key].color3), 1);
    circle.drawCircle(xPos, yPos, 60);
    circle.endFill();

    //convert circles to sprite
    const texture = app.renderer.generateTexture(circle);
    const circleSprite = new PIXI.Sprite(texture);

    circleSprite.x = xPos;
    circleSprite.y = yPos;
    circleSprite.anchor.x = 0.5;
    circleSprite.anchor.y = 0.5;
    circleSprite.interactive = true;

     // create some extra properties that will control movement
     circleSprite.direction = Math.random() * Math.PI * 2;

     // this number will be used to modify the direction of the dude over time
     circleSprite.turningSpeed = Math.random() - 0.8;
 
     // create a random speed for the dude between 0 - 2
     circleSprite.speed = 2 + Math.random() * 2;

     //save some values 
     circleSprite.umapXpos=xPos;
     circleSprite.umapYpos=yPos;
     circleSprite.targetXpos=toxPos;
     circleSprite.targetYpos=toyPos;

     circleSprite.year =posterDict[key].year;
    // console.log('year:'+circleSprite.year);
    unitArray.push(circleSprite);
    
    viewport.addChild(circleSprite);

    const thisKey=key;

    circleSprite.on('mouseover', () => {
      infoContainer.innerHTML = `<img src=${posterDict[thisKey].filename} /><h3>${posterDict[thisKey].title}</h3><p> ${posterDict[thisKey].year}<p>`;
      // infoContainer.style.opacity = "1";
      circleSprite.anchor.x = 0.5;
      circleSprite.anchor.y = 0.5;
      circleSprite.width=circleSprite.width*2;
      circleSprite.height=circleSprite.height*2;
      // infoContainer.style.top= yPos+'px';
      // infoContainer.style.left= xPos+'px';
      console.log('circle over');
      console.log(`xPos:`+xPos);
      console.log(`yPos:`+yPos);
      // imageSprite.height = imageSprite.height * 2;
      // imageSprite.width = imageSprite.width * 2;
      // imageSprite.zOrder= 99;
      infoContainer.classList.add("m-fadeIn");
      infoContainer.classList.remove("m-fadeOut");
    });

    circleSprite.on('mouseout', () => {
      // infoContainer.style.opacity = "0";

      console.log('mouse out');
      circleSprite.width=circleSprite.width*0.5;
      circleSprite.height=circleSprite.height*0.5;
      infoContainer.classList.remove("m-fadeIn");
      infoContainer.classList.add("m-fadeOut");

    
      });

    // imageSprite.on('click', () => {
    //   infoContainer.innerHTML = `<h1>${posterDict[key].title}</h1><img src="./resizedPoster/${filename}.jpg" />`;
    //   infoContainer.style.opacity = "1";

    // });

    // imageSprite.on('mouseover', () => {
    //   imageSprite.height = imageSprite.height * 2;
    //   imageSprite.width = imageSprite.width * 2;
    //   imageSprite.zOrder= 99;
    // });

    // imageSprite.on('mouseout', () => {
    //   imageSprite.height = imageSprite.height * .5;
    //   imageSprite.width = imageSprite.width * .5;
    //   imageSprite.zOrder= 0;
    // });



    // circle.on('click', () => {
    //   infoContainer.innerHTML = `<p>click</p>`;
    //   infoContainer.style.opacity = "1";
    // });

 

    // viewport.addChild(imageSprite);
    // viewport.addChild(circle);
  }
});


const checkbox = document.getElementById('checkbox');
let toggleLayout=false;
checkbox.addEventListener('change', () => {
  toggleLayout= !toggleLayout;
  console.log(toggleLayout);
    // iterate through the units and update the positions
    for (let i = 0; i < unitArray.length; i++) {
        const unit = unitArray[i];
        const image = imageArray[i];
        if(toggleLayout){
           gsap.to(unit, {x: unit.targetXpos,y:unit.targetYpos, duration: 6});
           gsap.to(image, {x: image.targetXpos,y:image.targetYpos, duration: 6});
          // tween.play();
          console.log('move');
        }
        else{
          gsap.to(unit, {x: unit.umapXpos, y:unit.umapYpos, duration: 6});
          gsap.to(image, {x: image.umapXpos, y:image.umapYpos, duration: 6});
          // tween.reverse();
          console.log('return');
        }
    }
 
});


// document.addEventListener('keypress', animateUnit);

// function animateUnit(e) {
//   console.log(e.code);
  
  
// }


//Frontpage
function enterpage(){
  var page;
  page=document.getElementsByClassName("frontpage");
  page[0].style.opacity=0;
  setTimeout ( ()=>page[0].style.display='none',500 )
}

//Yearslider
let wholeSlider=document.getElementById('yearSlider');
let silder = document.querySelector('input[type="range"]');
let yearVal =document.getElementById('yearVal');

let rangeValue = function(){
  let selectedYear = parseInt(silder.value);
  console.log('selectedYear:'+selectedYear);
  switch(selectedYear) {
    case 1930:
      for (let i = 0; i < unitArray.length; i++) {
        const unit = unitArray[i];
        gsap.set(unit, {visible: true});
        gsap.to(unit, 1, {alpha: 1.0});
        
      }
      yearVal.innerText='Slide to filter by decades';
      break;
    case 1940:
      for (let i = 0; i < unitArray.length; i++) {
        const unit = unitArray[i];
        if(unit.year<(1940+10)){
                gsap.set(unit, {visible: true});
                gsap.to(unit,1, {alpha: 1.0});
              }else{
                gsap.to(unit, 1, {alpha: 0});
                gsap.set(unit, {visible: false});   
          }
      }
      yearVal.innerText='1940s and before';
      break;
    default:
      for (let i = 0; i < unitArray.length; i++) {
        const unit = unitArray[i];
        // console.log(`range:${selectedYear+10}`);
        if(unit.year>=selectedYear && unit.year<selectedYear +10){

                  gsap.set(unit, {visible: true});
                  gsap.to(unit, 1, {alpha: 1.0});
                  // console.log('unit.year:'+unit.year);
              }
              else{
                gsap.to(unit, 1, {alpha: 0});
                gsap.set(unit, {visible: false});  
                // console.log('----------unit.year:'+unit.year); 
              }
      }
      yearVal.innerText=selectedYear+'s';
      
  }
}

    // for (let i = 0; i < unitArray.length; i++) {
    //   const unit = unitArray[i];

    //   if(selectedYear==2030){
    //     gsap.set(unit, {visible: true});
    //     gsap.to(unit, 0.5, {alpha: 1.0});
    //   }else if(selectedYear==1940){
    //     if(unit.year<(1940+10)){
    //       gsap.set(unit, {visible: true});
    //       gsap.to(unit, 0.5, {alpha: 1.0});
    //     }else{
    //       gsap.to(unit, 0.5, {alpha: 0});
    //       gsap.set(unit, {visible: false});   
    //     }
    //   }else{
    //     if(unit.year>=selectedYear && unit.year<(selectedYear+10)){
    //         gsap.set(unit, {visible: true});
    //         gsap.to(unit, 0.5, {alpha: 1.0});
    //     }
    //     else{
    //       gsap.to(unit, 0.5, {alpha: 0});
    //       gsap.set(unit, {visible: false});   
    //     }

    //   }
    

silder.addEventListener("input", rangeValue);

let viewVal=true;
//ToggleView
function toggleView(){
  
  console.log('toggleView');
  if(viewVal){
    // for (let i = 0; i < imageArray.length; i++) {
    //   const image = imageArray[i];
    //   gsap.set(image, {visible: true});
    //   gsap.to(image, 0.5, {alpha: 1.0});
    // }
    gsap.set(imageArray, {visible: true});
    gsap.to(imageArray, 0.5, {alpha: 1.0});

     gsap.to(unitArray, 0.5, {alpha: 0});
     gsap.set(unitArray, {visible: false});  
     wholeSlider.classList.remove('m-fadeIn');
     wholeSlider.classList.add("m-fadeOut");
     wholeSlider.style.transitionDelay='0s';
  }else{
    gsap.set(unitArray, {visible: true});
    gsap.to(unitArray, 0.5, {alpha: 1.0});

    gsap.to(imageArray, 0.5, {alpha: 0});
     gsap.set(imageArray, {visible: false});  
     wholeSlider.classList.remove('m-fadeOut');
     wholeSlider.classList.add("m-fadeIn");
     silder.value=1930;
     yearVal.innerText='Slide to filter by decades';
    //  silder.style.transitionDelay='0s'; 
  }
  viewVal=!viewVal;
}

//card perspective view
// https://codepen.io/waynecai1213/pen/abmwzRM
(function() {
  // Init
  var inner = document.getElementById("poster-info");
 var body=document.body;
  // Mouse
  var mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function(event) {
      var e = event || window.event;
      this.x = e.clientX - this._x;
      this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function(e) {
      this._x = e.offsetLeft + Math.floor(e.offsetWidth / 3);
      this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
    },
    show: function() {
      return "(" + this.x + ", " + this.y + ")";
    }
  };

  // Track the mouse position relative to the center of the container.
  mouse.setOrigin(body);

  //-----------------------------------------

  var counter = 0;
  var updateRate = 10;
  var isTimeToUpdate = function() {
    return counter++ % updateRate === 0;
  };

  //-----------------------------------------

  var onMouseEnterHandler = function(event) {
    update(event);
  };

  // var onMouseLeaveHandler = function() {
  //   inner.style = "";
  // };

  var onMouseMoveHandler = function(event) {
    if (isTimeToUpdate()) {
      update(event);
    }
  };

  //-----------------------------------------

  var update = function(event) {
    mouse.updatePosition(event);
    updateTransformStyle(
      (mouse.y / inner.offsetHeight / 2).toFixed(2),
      (mouse.x / inner.offsetWidth / 2).toFixed(2)
    );
  };

  var updateTransformStyle = function(x, y) {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    inner.style.transform = style;
    // inner.style.webkitTransform = style;
    inner.style.mozTransform = style;
    inner.style.msTransform = style;
    inner.style.oTransform = style;
  };

  //-----------------------------------------

  body.onmouseenter = onMouseEnterHandler;
  // body.onmouseleave = onMouseLeaveHandler;
  body.onmousemove = onMouseMoveHandler;
})();

