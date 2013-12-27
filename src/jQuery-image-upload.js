/*
 *  jQuery prioritize events
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

   /*
    * $("[jQuery selector]").imageUpload({...});
    * */
    $.fn.imageUpload = function(options) {

        // defaults
        var settings = $.extend( {

            wrapContent: "<div class='jQuery-imageUpload'>",

            inputFileName: "inputFile",
            inputFileClass: "inputFile",

            uploadButtonValue: "Upload",
            uploadButtonClass: "uploadButton",

            browseButtonClass: "browseButton",
            browseButtonValue: "Browse",

            formClass: "controlForm",

            hideFileInput: true,

            uploadIframe: ".uploadIframe"
        }, options);

        // selected jQuery objects
        var $self = this;

        // form action not provided
        if (!settings.formAction) {
            throw new Error ("Form action was not provided. Please provide it: $(...).imageUpload({formAction: '...'})");
        }

        // wrap
        $self.wrap(settings.wrapContent)

        // create the controls div
        var $controls       = $("<div>").addClass("controls")
          , $fileInput      = $("<input>")
                                .attr("type", "file")
                                .addClass(settings.inputFileClass)
                                .attr("name", settings.inputFileName)

          , $uploadButton   = $("<input>")
                                .attr("type", "submit")
                                .addClass()
                                .attr("value", settings.uploadButtonValue)

          , $browseButton   = $("<input>")
                                .attr("type", "button")
                                .addClass(settings.browseButtonClass)
                                .attr("value", settings.browseButtonValue)
                                .on("click", function () { $fileInput.click(); })
            
          , $uploadIframe   = $("<iframe>")
                                .attr("id", "uploadIframe-" + Math.random().toString(36).substring(5, 20).toUpperCase())
                                .hide()


          , $uploadForm     = $("<form>")
                                .addClass(settings.formClass)
                                .attr("target", $uploadIframe.attr("id"))
                                .attr("enctype", "multipart/form-data")
                                .attr("method", "post")
                                .attr("action", settings.formAction);


        // append controls to form
        $uploadForm.append([$browseButton, $fileInput, $uploadButton, $uploadIframe]);

        // hide file input
        if (settings.hideFileInput) {
            $fileInput.hide();
        } else {
            // hide browse button
            $browseButton.hide();
        }

        // append $form to $controls
        $controls.append($uploadForm);

        // append controls to image wrapper
        $self.parent().append($controls);

        // form on submit
        $uploadForm.on("submit", function () {

            // get submiited form
            var $form = $(this);

            // unset the load handler
            $uploadIframe.off("load");

            // set it again
            $uploadIframe.on("load", function () {

                // get text from the page
                var result = $(this.contentWindow.document).text();

                // if no result, return
                if (!result) { return; }

                // verify file input value
                if (!$fileInput.val()) {
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

                // upadte the image source
                $self.attr("src", result);

                // replace the file input
                $fileInput.replaceWith($fileInput.clone(true));
            });

        });
    };
})($);
