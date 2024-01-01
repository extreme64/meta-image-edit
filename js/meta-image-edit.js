jQuery(document).ready(function ($) {
    // console.log("mie", $('.compat-attachment-fields'));
    // Extend the media details modal
    // wp.media.view.Attachment.Details.prototype.createCustomFields = function() {
    //     var $el = this.$el;
        
    //     // Add your custom dropdown field
    //     var $licenceDropdown = $('<select id="licence-dropdown" name="licence"></select>');
        
    //     // Retrieve custom posts (Licence) using AJAX
    //     $.ajax({
    //         url: ajaxurl, // Use the appropriate AJAX URL
    //         type: 'POST',
    //         data: {
    //             action: 'get_licence_posts' // Create a custom AJAX action to fetch the Licence posts
    //         },
    //         success: function(response) {
    //             // Populate the dropdown with the retrieved Licence posts
    //             var licences = JSON.parse(response);
                
    //             licences.forEach(function(licence) {
    //                 var option = $('<option></option>').attr('value', licence.ID).text(licence.post_title);
    //                 $licenceDropdown.append(option);
    //             });
    //         }
    //     });
        
    //     $el.find('.details').append($licenceDropdown);
        
    //     // Add event listener to handle dropdown change
    //     $licenceDropdown.on('change', function() {
    //         // Handle dropdown change
    //     });
    // };
});