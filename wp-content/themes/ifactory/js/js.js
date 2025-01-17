// Select all links with hashes


var swiper = new Swiper('.swiper-container.logos', {
    slidesPerView: 5,
    slidesPerColumn: 3,
    spaceBetween: 0,
    slidesPerGroup: 5,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        480: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
        },
        768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            slidesPerColumn: 1,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        }
    }
});

var aboutSwiper = new Swiper('.swiper-container.about-swiper', {
    slidesPerView: 4,
    slidesPerColumn: 2,
    spaceBetween: 0,
    slidesPerGroup: 4,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {

        480: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
        768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        }
    }
});


var swiper = new Swiper('.swiper-container.case-study-slider', {
    slidesPerView: 3,
    spaceBetween: 50,
    //slidesPerGroup: 4,
    navigation: {
        nextEl: '.swiper-button-next.v3',
        prevEl: '.swiper-button-prev.v3',
    },
    breakpoints: {
        1200: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
    }
});



var casingthejoint = new Swiper('.swiper-container.case-gallery', {
    navigation: {
        nextEl: '.swiper-button-next.v2',
        prevEl: '.swiper-button-prev.v2',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    }
});


function sliderGallery(parent, indexPrefix) {

    var sliders = [];
    if (!indexPrefix) indexPrefix = 's';

    jQuery('.gallery-thumbs', parent).each(function(index) {
        var cssClass = indexPrefix + index;
        jQuery(this).addClass(cssClass);
        var slider = new Swiper('.gallery-thumbs.' + cssClass, {
            spaceBetween: 10,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            pagination: {
                el: '.swiper-pagination'
            },
            loop: true
        });
        sliders.push(slider);
    });
    //var slidersTwo = [];
    var counter = 0;
    jQuery('.gallery-top', parent).each(function(index) {
        if (sliders[counter].$el) {
            var cssClass = indexPrefix + index;
            jQuery(this).addClass(cssClass);
            //var slider = new Swiper('.gallery-top.' + cssClass, {
            new Swiper('.gallery-top.' + cssClass, {
                spaceBetween: 10,
                thumbs: {
                    swiper: sliders[counter]
                },
                pagination: {
                    el: '.gallery-thumbs.' + cssClass + ' .swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                loop: true,
                navigation: {
                    nextEl: '.gallery-top.' + cssClass + ' .gallery-button-next'
                }
            });
            //slidersTwo.push(slider);
            counter++;
        }
    });
}
sliderGallery();

jQuery(".job-box").click(function() {
    jQuery(this).find('.content').slideToggle("fast", function() {});
    jQuery(this).toggleClass('active');
});

jQuery(".drop-btn").click(function() {
    jQuery('.drop-down').slideToggle("medium", function() {});
});


jQuery("#hamburgler").click(function() {
    jQuery(".mobile-nav").toggleClass("active");
    jQuery('#hamburgler').toggleClass('hamburgler-active');
});

AOS.init();