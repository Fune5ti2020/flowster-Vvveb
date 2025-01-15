// implementation js testimonialSection section
let current = 0; // Index of the first testimonialSection to be displayed
const testimonialSection = document.querySelectorAll('.testimonialSection');
const gallerySection = document.querySelectorAll('.gallerySection');
 const prevButton = document.getElementById('prevButton');
 const nextButton = document.getElementById('nextButton');
const dotsContainer = document.getElementById('dotsContainer');
const prevGallery = document.getElementById('prevGallery');
const nextGallery = document.getElementById('nextGallery');
// Function to update the visibility of testimonialSection
function updateTestimonialSection() {
    testimonialSection.forEach((para, index) => {
        para.classList.remove('active'); // Removes the 'active' class from all testimonialSection
        // Displays the four testimonialSection starting from the current index
        if (index >= current && index < current + 2) {
            para.classList.add('active'); // Displays the testimonialSection
        }
    });
    // Updates the dots
    updateDots();
}

// Navigate to the next set of testimonialSection
 nextButton.addEventListener('click', () => {
    if (current + 4 < testimonialSection.length) {
        current++; // Advances to the next testimonialSection
    }
     updateTestimonialSection(); // Updates the visibility of the testimonialSection
});

// // Go back to the previous set of testimonialSection
 prevButton.addEventListener('click', () => {
     if (current > 0) {
         current--; // Goes back to the previous testimonialSection
    }
     updateTestimonialSection(); // Updates the visibility of the testimonialSection
 });

// Initializes with the first four testimonialSection
updateTestimonialSection();

// Function to update the dots
 function updateDots() {
     dotsContainer.innerHTML = ''; // Clears the existing dots

    // Creates the dots, with one dot for each testimonialSection
    for (let i = 0; i < testimonialSection.length; i++) {
         const dot = document.createElement('span');
         dot.classList.add('dot');
         if (i === current) {
            dot.classList.add('active'); // Marks the dot corresponding to the active testimonialSection
         }
         dot.addEventListener('click', () => goToDot(i)); // Adds the click event
         dotsContainer.appendChild(dot);
     }
 }

// // Function to navigate to a specific dot (testimonialSection)
 function goToDot(index) {
     current = index; // Sets the index to the testimonialSection of the clicked dot
     updateTestimonialSection(); // Updates the visibility of the testimonialSection
 }

// Initializes with the first testimonialSection
updateTestimonialSection();

// end implementation js testimonialSection section

//--------------------------------------------------------------------

function updateGallerySection() {
    gallerySection.forEach((para, index) => {
        para.classList.remove('active'); // Removes the 'active' class from all testimonialSection
        // Displays the four testimonialSection starting from the current index
        if (index >= current && index < current + 3) {
            para.classList.add('active'); // Displays the testimonialSection
        }
    });
   
}

// Navigate to the next set of testimonialSection
nextGallery.addEventListener('click', () => {
    if (current + 3 < gallerySection.length) {
        current++; // Advances to the next testimonialSection
    }
    updateGallerySection(); // Updates the visibility of the testimonialSection
});

// Go back to the previous set of testimonialSection
prevGallery.addEventListener('click', () => {
    if (current > 0) {
        current--; // Goes back to the previous testimonialSection
    }
    updateGallerySection(); // Updates the visibility of the testimonialSection
});

// Initializes with the first four testimonialSection
updateGallerySection();



