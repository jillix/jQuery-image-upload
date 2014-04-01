jQuery-image-upload
===================

A jQuery plugin that adds controls to the selected jQuery elements with a simple call.

## Example

```js
// initialize image upload
$(".image").imageUpload({
    formAction: "/upload"
}).on("imageChanged", function () {
    console.log("Changed the src");
});
```

## Documentation

### Options

<table>
    <thead>
        <tr>
            <th>Option Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>formAction</code></td>
            <td>The url that will compute the form data and upload the image on the server. This must respond with a string that represents the new image source.</td>
            <td>String</td>
            <td>Any string</td>
            <td>No default value, but required field</td>
        </tr>
        <tr>
            <td><code>wrapContent</code></td>
            <td>The element that must wrap the selected elements. Used only when <code>hover</code> is <code>false</code></td>
            <td>String</td>
            <td>HTML String or jQuery object</td>
            <td><code>"&lt;div class='jQuery-imageUpload'&gt;"</code></td>
        </tr>
        <tr>
            <td><code>inputFileName</code></td>
            <td>The name of the file input element.</td>
            <td>String</td>
            <td>Any string</td>
            <td>inputFile</td>
        </tr>
        <tr>
            <td><code>inputFileClass</code></td>
            <td>The class of the file input element</td>
            <td>String</td>
            <td>Any string</td>
            <td>inputFile</td>
        </tr>
        <tr>
            <td><code>uploadButtonValue</code></td>
            <td>The value (text) of the upload button.</td>
            <td>String</td>
            <td>Any string</td>
            <td>Upload</td>
        </tr>
        <tr>
            <td><code>uploadButtonClass</code></td>
            <td>The class of the upload button element</td>
            <td>String</td>
            <td>Any string</td>
            <td>uploadButton</td>
        </tr>
        <tr>
            <td><code>browseButtonValue</code></td>
            <td>The value (text) of the browse button element.</td>
            <td>String</td>
            <td>Any string</td>
            <td>Browse</td>
        </tr>
        <tr>
            <td><code>browseButtonClass</code></td>
            <td>The class of the browse button element</td>
            <td>String</td>
            <td>Any string</td>
            <td>browseButton</td>
        </tr>
        <tr>
            <td><code>deleteButtonValue</code></td>
            <td>The value (text) of the delete button element.</td>
            <td>String</td>
            <td>Any string</td>
            <td>Delete image</td>
        </tr>
        <tr>
            <td><code>deleteButtonClass</code></td>
            <td>The class of the delete button element</td>
            <td>String</td>
            <td>Any string</td>
            <td>deleteButton</td>
        </tr>
        <tr>
            <td><code>automaticUpload</code></td>
            <td>One click and the image is uploaded. If this is <code>true</code>, the upload button will be hidden.</td>
            <td>Boolean</td>
            <td>true/false</td>
            <td>false</td>
        </tr>
        <tr>
            <td><code>formClass</code></td>
            <td>The class of the form</td>
            <td>String</td>
            <td>Any string</td>
            <td>controlForm</td>
        </tr>
        <tr>
            <td><code>hideFileInput</code></td>
            <td>If this is <code>true</code> the Browse button will be used and the native file input will be hidden</td>
            <td>Boolean</td>
            <td>true/false</td>
            <td>true</td>
        </tr>
        <tr>
            <td><code>hideDeleteButton</code></td>
            <td>Hide or show the delete button.</td>
            <td>Boolean</td>
            <td>true/false</td>
            <td>false</td>
        </tr>
        <tr>
            <td><code>hover</code></td>
            <td>Show the controls only on hover.</td>
            <td>Boolean</td>
            <td>true/false</td>
            <td>true</td>
        </tr>
        <tr>
            <td><code>addClass</code></td>
            <td>The class that must be added to the wrapper.</td>
            <td>String</td>
            <td>Any string</td>
            <td>jQuery-image-upload</td>
        </tr>
    </tbody>
</table>


## Events

The plugin emits the following events:

<table>
    <thead>
        <tr>
            <th>Event Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>imageUpload.reload</td>
            <td>Destroy and init the plugin</td>
        </tr>
        <tr>
            <td>imageUpload.imageChanged</td>
            <td>Ocures after the source of the image was changed (the image was sucessfully uploaded)</td>
        </tr>
        <tr>
            <td>imageUpload.imageChanged</td>
            <td>Ocures after the source of the image was changed (the image was sucessfully uploaded)</td>
        </tr>
        <tr>
            <td>imageUpload.destroy</td>
            <td>Used to destroy an instance of the plugin</td>
        </tr>
    </tbody>
</table>


## Changelog

### v0.2.2
 - Compatibilty with Firefox (see [this bug](https://github.com/jillix/jQuery-image-upload/issues/6))
 - Documentation ([issue](https://github.com/jillix/jQuery-image-upload/issues/9))

### v0.2.1
 - Fixes, comments
 - Trigger `imageChanged` event when the image source was changed

### v0.2.0
 - Show controls only on `hover`.

### v0.1.0
 - Initial release

## License
See LICENSE file.
