// Ref: ProPainter modified it to for video

(function ($) {

    $.fn.twentytwenty_aios = function (options) {
        var options = $.extend({
            default_offset_pct: 0.5,
            orientation: 'horizontal',
            before_label: 'WHAM',
            after_label: 'Ours',
            no_overlay: false,
            move_slider_on_hover: false,
            move_with_handle_only: true,
            click_to_move: false,
            ratio: 0.5
        }, options);

        return this.each(function () {
            var container = $(this);
            var sliderOrientation = options.orientation;
            var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
            var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';
            // var sliderPct = options.default_offset_pct;
            var this_Offset_Pct = $(container).attr("default_offset_pct");
            var sliderPct = this_Offset_Pct ? this_Offset_Pct : options.default_offset_pct;
            var thisRatio = $(container).attr("ratio");
            var ratio = thisRatio ? thisRatio : options.ratio;

            container.wrap("<div class='twentytwenty_aios-wrapper twentytwenty_aios-" + sliderOrientation + "'></div>");
            if (!options.no_overlay) {
                container.append("<div class='twentytwenty_aios-overlay'></div>");
                var overlay = container.find(".twentytwenty_aios-overlay");
                overlay.append("<div class='twentytwenty_aios-before-label' data-content='" + options.before_label + "'></div>");
                overlay.append("<div class='twentytwenty_aios-after-label' data-content='" + options.after_label + "'></div>");
            }
            var beforeImg = container.find(".video:first");
            var afterImg = container.find(".video:last");
            container.append("<div class='twentytwenty_aios-handle'></div>");
            var slider = container.find(".twentytwenty_aios-handle");
            slider.append("<span class='twentytwenty_aios-" + beforeDirection + "-arrow'></span>");
            slider.append("<span class='twentytwenty_aios-" + afterDirection + "-arrow'></span>");
            container.addClass("twentytwenty_aios-container");
            beforeImg.addClass("twentytwenty_aios-before");
            afterImg.addClass("twentytwenty_aios-after");

            var calcOffset = function (dimensionPct) {
                // var w = $("video", beforeImg).width();
                var w = $(container).width();
                // var h = beforeImg.height();
                var h = w * ratio;

                return {
                    w: w + "px",
                    h: h + "px",
                    cw: (dimensionPct * w) + "px",
                    ch: (dimensionPct * h) + "px"
                };
            };

            var adjustContainer = function (offset) {
                if (sliderOrientation === 'vertical') {
                    beforeImg.css("clip", "rect(0," + offset.w + "," + offset.ch + ",0)");
                    afterImg.css("clip", "rect(" + offset.ch + "," + offset.w + "," + offset.h + ",0)");
                }
                else {
                    beforeImg.css("clip", "rect(0," + offset.cw + "," + offset.h + ",0)");
                    afterImg.css("clip", "rect(0," + offset.w + "," + offset.h + "," + offset.cw + ")");
                }
                container.css("height", offset.h);
            };

            var adjustSlider = function (pct) {
                var offset = calcOffset(pct);
                slider.css((sliderOrientation === "vertical") ? "top" : "left", (sliderOrientation === "vertical") ? offset.ch : offset.cw);
                adjustContainer(offset);
            };

            // Return the number specified or the min/max number if it outside the range given.
            var minMaxNumber = function (num, min, max) {
                return Math.max(min, Math.min(max, num));
            };

            // Calculate the slider percentage based on the position.
            var getSliderPercentage = function (positionX, positionY) {
                var sliderPercentage = (sliderOrientation === 'vertical') ?
                    (positionY - offsetY) / imgHeight :
                    (positionX - offsetX) / imgWidth;

                return minMaxNumber(sliderPercentage, 0, 1);
            };


            $(window).on("resize.twentytwenty_aios", function (e) {
                adjustSlider(sliderPct);
            });

            var offsetX = 0;
            var offsetY = 0;
            var imgWidth = 0;
            var imgHeight = 0;
            var onMoveStart = function (e) {
                if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
                    e.preventDefault();
                }
                else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
                    e.preventDefault();
                }
                container.addClass("active");
                offsetX = container.offset().left;
                offsetY = container.offset().top;
                imgWidth = beforeImg.width();
                imgHeight = beforeImg.height();
            };
            var onMove = function (e) {
                if (container.hasClass("active")) {
                    sliderPct = getSliderPercentage(e.pageX, e.pageY);
                    adjustSlider(sliderPct);
                }
            };
            var onMoveEnd = function () {
                container.removeClass("active");
            };

            var moveTarget = options.move_with_handle_only ? slider : container;
            moveTarget.on("movestart", onMoveStart);
            moveTarget.on("move", onMove);
            moveTarget.on("moveend", onMoveEnd);

            if (options.move_slider_on_hover) {
                container.on("mouseenter", onMoveStart);
                container.on("mousemove", onMove);
                container.on("mouseleave", onMoveEnd);
            }

            slider.on("touchmove", function (e) {
                e.preventDefault();
            });

            container.find("video").on("mousedown", function (event) {
                event.preventDefault();
            });

            if (options.click_to_move) {
                container.on('click', function (e) {
                    offsetX = container.offset().left;
                    offsetY = container.offset().top;
                    imgWidth = beforeImg.width();
                    imgHeight = beforeImg.height();

                    sliderPct = getSliderPercentage(e.pageX, e.pageY);
                    adjustSlider(sliderPct);
                });
            }

            $(window).trigger("resize.twentytwenty_aios");
        });
    };

})(jQuery);