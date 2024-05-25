// TODO: read up on when to use _foo vs foo

let newTile;
let corner, cross, empty, lineImg, t;
let tiles = [];
let tile;
let displayTiles = [];
let manipulatedImages = [];
let tileDim = 10;
let sendImages;
let canvasDim = [10, 10];

function preload() {
  
  // newTile = loadImage("images/process-example.png");
  
  corner = loadImage("images/newtilestuff/corner.png");
  cross = loadImage("images/newtilestuff/cross.png");
  empty = loadImage("images/newtilestuff/empty.png");
  lineImg = loadImage("images/newtilestuff/line.png");
  t = loadImage("images/newtilestuff/t.png");
}

function setup() {
  
  createCanvas(400, 400);
  
  
  // createCanvas(w * dim, h * dim);
  noSmooth();
  noLoop();

  // initialise displayTiles
  for (let i = 0; i < canvasDim; i++) {
    displayTiles.push([]);
  }
  
  sendImages = [corner, cross, empty, lineImg, t];
  getImages(sendImages);

  // something_else();
  text("hi", 300, 300);
  noLoop();
  
}

function draw() {

  image(corner, 0, 0);
  // corner.loadPixels()
  // text(corner.pixels[0], 20, 20)
  text(corner.get(3, 3), 50, 50);
  

  // for (let i = 0; i < dim; i++) {
  //   for (let j = 0; j < dim; j++) {
  //     //randomly choose tiles
  //     y = floor(random(0, 60));
  //     image(tiles[y], i * w, j * h);
  //   }
  // }
}

function getImages(_images) {
  
  for (let img of _images) {
    let _imageSet = [];

    // can optimise by asking for how many variations (i.e. rotations) of each image is wanted (or needed) for more/less variations
    // can optimise right+bottom pixel code by getting all 4 sides first, then picking which one to give based on rotation
    // can further optimise by using loadPixels? idk if it is truly faster, can do a test by having imagesTest.push(image) x10000 times and see how long it takes to .loadPixels() and .pixels[0-4] all images 1 by 1 VERSUS same setup but .get instead
    for (let i=0; i<4; i++) {
      // img, right pixel, bottom pixel
      _imageSet.push([img, img.get(9, 4), img.get(4, 9), img.get(0, 4), img.get(4, 0)]);
      img = rotImg90deg(img);
    }

    manipulatedImages.push(_imageSet);
  }
}

function chooseTile(_img1, _img2=null, dir) {
  let possibles = [],
      possibles2 = [];
  if (dir == "right+bottom") {
    for (let img of manipulatedImages) {
      if (_img[1] == img[3]) {
        possibles.push(img);
      }
      if (_img2[2] == img[4]) {
        possibles2.push(img);
      }
    }
    possibles = findIntersection(possibles, possibles2);

  } else if (dir == "bottom") {
    for (let img of manipulatedImages) {
      if (_img[2] == img[4]) {
        possibles.push(img);
      }
    }
  } else if (dir == "right") {
    for (let img of manipulatedImages) {
      if (_img[1] == img[3]) {
        possibles.push(img);
      }
    }
  }

  let randint = random(possibles.length);
  return possibles[randint];
}

function something_else() {
  // can optimise by making a dictionary of which images can go to the right and bottom of each image instead of running through the whole loop again each time  

  for (let x = 0; x < dim[0]; x++) {
    for (let y = 0; y < dim[1]; y++) {
      if (x == 0 && y == 0) {
        let randint = random(manipulatedImages.length);
        image(manipulatedImages[randint][0], 0, 0);
        displayTiles[0][0] = manipulatedImages[randint];
        continue;
      }
      else if (y == 0) {
        tile = chooseTile(displayTiles[x-1][0], null, "right"); 
        image(tile, x*tileDim, 0);
        displayTiles[x][y] = tile;
        continue;
      } else if (x == 0) {
        tile = chooseTile(displayTiles[0][y-1], null, "bottom");
        image(tile, 0, y*tileDim);
        displayTiles[x][y] = tile;
        continue;
      }

      //change
      tile = chooseTile(displayTiles[x-1][y], displayTiles[x][y-1], "right+bottom");
      image(tile, x*tileDim, y*tileDim);
      displayTiles[x][y] = tile;
    }
  }
}

function rotImg90deg(image) {
  let width = image.width;
  let height = image.height;
  let newImage = createImage(width, height);

  // Load pixels of the original image
  image.loadPixels();
  newImage.loadPixels();

  // Iterate over the pixels of the original image
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Calculate the corresponding position in the rotated image
      let newX = y;
      let newY = width - 1 - x;

      // Copy the pixel from the original image to the new image
      newImage.set(newX, newY, image.get(x, y));
    }
  }

  // Update the pixels of both images
  image.updatePixels();
  newImage.updatePixels();

  return newImage;
}


function findIntersection(arr1, arr2) {
  return arr1.filter(element => arr2.includes(element));
}
