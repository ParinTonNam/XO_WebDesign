// Get the modal
var modal = document.getElementById("myModal");

// Get the first image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var img2 = document.getElementById("myImg2");
var img3 = document.getElementById("myImg3");
var img4 = document.getElementById("myImg4"); // รับองค์ประกอบของภาพที่สอง
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

var img_1 = document.createElement('img');
img_1.src = ("images/skill/des_skill1.png");
var img_2 = document.createElement('img');
img_2.src = ("images/skill/des_skill2.png");
var img_3 = document.createElement('img');
img_3.src = ("images/skill/des_skill3.png");
var img_4 = document.createElement('img');
img_4.src = ("images/skill/des_skill4.png");


img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = img_1.src; // รูปแรก
  captionText.innerHTML = this.alt;
}

img2.onclick = function(){
  modal.style.display = "block";
  modalImg.src = img_2.src; // รูปที่สอง
  captionText.innerHTML = this.alt;
}

img3.onclick = function(){
    modal.style.display = "block";
    modalImg.src = img_3.src; // รูปที่สาม
    captionText.innerHTML = this.alt;
  }

img4.onclick = function(){
    modal.style.display = "block";
    modalImg.src = img_4.src; // รูปที่สี่
    captionText.innerHTML = this.alt;
  }

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}

// Get all images to replace the current one in the modal
// var allImages = document.querySelectorAll("#myImg, #myImg2, #myImg3, #myImg4");

// allImages.forEach(function(imgElement) {
//   imgElement.onclick = function() {
//     modal.style.display = "block";
//     modalImg.src = this.src;
//     captionText.innerHTML = this.alt;
//   };
// });