/*
 *  jQuery Image Upload
 *
 *  A jQuery plugin that adds controls to the selected jQuery
 *  elements with a simple call.
 *
 *  Example:
 *
 *      $("img").imageUpload();
 *
 *  Copyright (c) jillix GmbH
 *  License: MIT License
 *
 * */
(function ($) {

    // defaults
    var defaults = {
        wrapContent: "<div class='jQuery-imageUpload'>",

        inputFileName: "inputFile",
        inputFileClass: "inputFile",

        uploadButtonValue: "Upload",
        uploadButtonClass: "uploadButton",

        browseButtonValue: "Browse",
        browseButtonClass: "browseButton",

        deleteButtonValue: "Delete image",
        deleteButtonClass: "deleteButton",

        automaticUpload: false,

        formClass: "controlForm",

        hideFileInput: true,
        hideDeleteButton: false,

        hover: true,

        addClass: "jQuery-image-upload"
    };

   /*
    * $("[jQuery selector]").imageUpload({...});
    * */
    $.fn.imageUpload = function (options) {

        // selected jQuery objects
        var $self = this;

        // return if no elements
        if (!$self.length) { return $self; }

        // defaults
        var settings = $.extend(defaults, options);

        // call image upload for each element
        if ($self.length > 1) {
            $self.each(function () {
                $(this).imageUpload(settings);
            });
            return $self;
        }

        // reload imageUpload if it was already created
        if ($self.data("imageUpload")) {
            $self.trigger("imageUpload.reload");
            return $self;
        }

        // add class
        $self.addClass(settings.addClass);

        // set imageUpload data
        $self.data("imageUpload", options);

        // form action not provided
        if (!settings.formAction) {
            throw new Error ("Form action was not provided. Please provide it: $(...).imageUpload({formAction: '...'})");
        }

        // wrap
        if (!settings.hover) {
            $self.wrap(settings.wrapContent)
        }

        // create the control div
        var $controls = $("<div>").addClass("controls");

        // create the file input element
        var $fileInput = $("<input>")
                            .attr({
                                "type": "file",
                                "name": settings.inputFileName
                            })
                            .addClass(settings.inputFileClass)

        // create the upload button
        var $uploadButton = $("<button>")
                                .attr("type", "submit")
                                .addClass(settings.uploadButtonClass)
                                .html(settings.uploadButtonValue);

        // create the browse button
        var $browseButton = $("<button>")
                                .addClass(settings.browseButtonClass)
                                .html(settings.browseButtonValue)
                                .on("click", function () {

                                    // click the file input
                                    $fileInput.click();

                                    // prevent browser's default behavior
                                    return false;
                                });

        // create the delete button
        var $deleteButton = $("<button>")
                                .addClass(settings.deleteButtonClass)
                                .html(settings.deleteButtonValue)
                                .on("click", function () {
                                    // destroy the image upload
                                    $self.trigger("imageUpload.destroy");

                                    // trigger remove event
                                    $self.trigger("imageUpload.imageRemoved");

                                    // and remove the image from dom
                                    $self.remove();

                                    // prevent browser's default behavior
                                    return false;
                                });

        // generate the iframe id
        var iframeId =  "uploadIframe-" + Math
                                            .random()
                                            .toString(36)
                                            .substring(5, 20)
                                            .toLowerCase();

        // create the upload iframe
        var $uploadIframe   = $("<iframe>")
                                .attr({
                                    "id": iframeId,
                                    "name": iframeId
                                })
                                .hide();


        // create the upload form
        var $uploadForm     = $("<form>")
                                .addClass(settings.formClass)
                                .attr({
                                    "target": $uploadIframe.attr("id"),
                                    "enctype": "multipart/form-data",
                                    "method": "post",
                                    "action": settings.formAction
                                });


        // append controls to form
        $uploadForm.append([$browseButton, $fileInput, $uploadButton, $deleteButton, $uploadIframe]);

        // hide delete button
        if (settings.hideDeleteButton) {

            // we just remove it
            $deleteButton.remove();
        }

        // if automatic upload
        if (settings.automaticUpload) {

            // hide the upload button
            $uploadButton.hide();

            // file input change
            $fileInput.on("change", function () {

                // no file selected, do nothing
                if (!$(this).val()) { return; }

                // start upload
                $uploadButton.click();
            });
        }

        // hide file input
        if (settings.hideFileInput) {
            $fileInput.hide();
        } else {
            // hide browse button
            $browseButton.hide();
        }

        // append $form to $controls
        $controls.append($uploadForm);

        // form on submit
        $uploadForm.on("submit", function () {

            // get submiited form
            var $form = $(this);

            // unset the load handler
            $uploadIframe.off("load");

            // save the old image source in case of error
            var oldSrc = $self.attr("src");

            // Waiter image
            if (typeof settings.waiter === "string") {
                $self.attr("src", settings.waiter);
            }

            $self.addClass("loading");
            $controls.hide();

            // set it again
            $uploadIframe.on("load", function () {

                // get text from the page
                var result = $(this.contentWindow.document).text();

                // the selected file was not a valid image and `result` is not a URL
                if (!/^https?|^\//.test(result)) {
                    loadImage($self, oldSrc);
                    $self.trigger("imageUpload.uploadFailed");
                    return;
                }

                // if no result, return
                if (!result) {
                    loadImage($self, oldSrc);
                    $self.trigger("imageUpload.uploadFailed");
                    return;
                }

                // reload the image upload controls only if the file input is hidden
                if (settings.hideFileInput) {
                    $self.trigger("imageUpload.reload");
                }

                // verify file input value
                if (!$fileInput.val()) {
                    loadImage($self, oldSrc);
                    return;
                }

                // try to parse result
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // nothing to do
                }

                // set src of iframe
                $uploadIframe.attr("src", "");

                // update the image source
                loadImage($self, result, function () {
                    // trigger image changed event
                    $self.trigger("imageUpload.imageChanged");
                });

                // replace the file input
                $fileInput.replaceWith($fileInput.clone(true));
            });
        });

        // no hover
        if (!settings.hover) {

            // append controls to image wrapper
            $self.parent().append($controls);
        } else {

            // set absolute position to controls and set the offset
            $controls.css({ position: "absolute" });

            // add class to controls
            $controls.addClass("jQuery-image-upload-controls");

            // append controls to body
            $("body").append($controls.hide());

            // self on mouse enter
            $self.on("mouseenter", function () {

                if ($self.hasClass("loading")) {
                    return;
                }

                // get the self offset
                var offset = $self.offset();

                // set control possition
                $controls.css({
                    top: offset.top,
                    left: offset.left
                });

                // show controls
                $controls.show();
            });

            // on mouse leave
            $("body").on("mouseleave", "." + settings.addClass, function (e) {

                // get position, width and height
                var o = $self.offset();
                var w = $self.width();
                var h = $self.height();

                // hide controls
                if ((e.pageX < o.left || e.pageX > o.left + w) ||
                    (e.pageY < o.top || e.pageY > o.top + h)) {
                    $controls.hide();
                }
            });
        }

        // destroy
        $self.on("imageUpload.destroy", function () {

            // remove controls
            $controls.remove();

            // remove events
            $self.off("imageUpload.destroy");
            $self.off("imageUpload.reload");

            // remove data
            $self.data("imageUpload", null);
        });

        // reload
        $self.on("imageUpload.reload", function () {
            $self.trigger("imageUpload.destroy");
            $self.imageUpload(options);
        });

        // return selected element
        return $self;
    }

    /**
     * Load the image at the URL `newSource` in the `$imageElement` jQuery
     * element with a fade in/out animation, then call the `callback`.
     * @param {jQuery} $imageElement
     * @param {String} newSource
     * @param {Function} callback
     */
    function loadImage ($imageElement, newSource, callback) {
        $imageElement.fadeOut(function () {
            $imageElement.attr("src", newSource);
            imgLoad($imageElement, function () {
                $imageElement.removeClass("loading");
                $imageElement.fadeIn();
                if (typeof callback === "function") {
                    callback();
                }
            });
        });
    }

    /**
     * Trigger a callback when the selected images are loaded:
     * @param {String} selector
     * @param {Function} callback
     */
    function imgLoad (selector, callback) {
        $(selector).each(function () {
            if (this.complete || /*for IE 10-*/ $(this).height() > 0) {
                callback.apply(this);
            }
            else {
                $(this).on('load', function () {
                    callback.apply(this);
                });
            }
        });
    };

    // defaults
    $.imageUpload = $.fn.imageUpload;
    $.imageUpload.defaults = defaults;
})($);
