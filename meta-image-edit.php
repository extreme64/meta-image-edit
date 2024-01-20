<?php
/**
 * Plugin Name: Meta Image Edit
 * Plugin URI: /
 * Description: Handles custom fields and saving for the media edit screen.
 * Version: 1.0.0
 * Author: Mast_G
 * Author URI: mastg.xyz
 */


// Register the block
function mie_register_block() {

    register_block_type('mie/image', array(
        'editor_script' => 'mie-block-editor-script',
        'editor_style'  => 'mie-block-editor-style', 
        'script'        => 'mie-block-script',
        'style'         => 'mie-block-styles',

        'render_callback' => 'mie_render_block',
        'attributes' => array(
            'mediaID' => array(
                'type' => 'number',
                'default' => '',
            ),
            'mediaURL' => array(
                'type' => 'string',
                'default' => '',
            ),
            'mediaSize' => array(
                'type' => 'string',
                'default' => '100%',
            ),
            'mediaDimensions' => array(
                'type' => 'object',
                'default' => json_encode(['width' => '300px', 'height' => '200px'])
            ),
            'mediaFlexWidth' => array(
                'type' => 'string',
                'default' => '50'
            ),
            'mediaDuoToneColorShadows' => array(
                'type' => 'string',
                'default' => '#eeeeee'
            ),
            'mediaDuoToneColorHighlights' => array(
                'type' => 'string',
                'default' => '#333333'
            ),
            'mediaInsertLink' => array(
                'type' => 'object',
                'default' => json_encode(['url' => 'https//...', 'target' => true, 'linkRel' => "noref"])
            ),
            'alt' => array(
                'type' => 'string',
                'default' => 'illustration',
            ),
            'author' => array(
                'type' => 'string',
                'default' => '',
            ),
            'license' => array(
                'type' => 'string',
                'default' => '',
            ),
            'source' => array(
                'type' => 'string',
                'default' => '',
            ),
        ),
    ));

    
    // Register block styles
    register_block_style('mie/image', array(
        'name' => 'mietest1',
        'label' => _x('MIE Test 1', 'mie-block'),
    ));

    // Register block script
    wp_register_script(
        'mie-block-editor-script',
        plugin_dir_url(__FILE__) . 'blocks/image/index.js',
        array('wp-blocks', 'wp-element', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'blocks/image/index.js'),
        true
    ); 

    if (!is_admin()) {
        wp_register_script(
            'mie-block-script',
            plugin_dir_url(__FILE__) . 'blocks/image/index-front.js',
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'blocks/image/index-front.js'),
            true
        ); 
    }
}
add_action('init', 'mie_register_block');

function enqueue_block_styles() {
    // Enqueue block styles for the editor
    wp_enqueue_style(
        'mie-block-editor-style',
        plugin_dir_url( __FILE__ ) . 'blocks/image/block-styles.css', // Path to your block styles file
        array(),
        '1.0',
        'all'
    );
    // Enqueue block styles for the frontend
    wp_enqueue_style(
        'mie-block-styles',
        plugin_dir_url( __FILE__ ) . 'blocks/image/block-styles.css', // Path to your block styles file
        array(),
        '1.0',
        'all'
    );
}
add_action('enqueue_block_assets', 'enqueue_block_styles');


// Enqueue the block assets
function mie_enqueue_block_assets() {
    // Enqueue block editor script
    wp_enqueue_script(
        'mie-block-editor-script'
    );
}
// Hook into the block editor assets enqueue action
add_action('enqueue_block_editor_assets', 'mie_enqueue_block_assets');

function add_module_attribute($tag, $handle, $src) {
    if ($handle === 'mie-block-editor-script') {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }    
    return $tag;
}    
add_filter('script_loader_tag', 'add_module_attribute', 10, 3);




// Callback function to render the block on the frontend
function mie_render_block($attributes) {
    
    
    $mediaID = isset($attributes['mediaID']) ? $attributes['mediaID'] : '';

    $caption = '';
    $description = '';
    $altText = '';

    $mie_media_serialized_data = get_post_meta($mediaID, 'mie_media_data', true);
    $mie_media_data = unserialize( $mie_media_serialized_data );
    $author = isset($mie_media_data['mie_author']) ? $mie_media_data['mie_author'] : '';
    $license = isset($mie_media_data['mie_license']) ? $mie_media_data['mie_license'] : '';
    $license_name = get_the_title( $license );
    $license_url = get_post_permalink( $license );
    $source = isset( $mie_media_data['mie_source'] ) ? $mie_media_data['mie_source'] : '';
    $mediaDimensions = $attributes['mediaDimensions'];
    if(is_array($attributes['mediaDimensions'])){
        $imgStyle = 'width: ' . $attributes['mediaDimensions']['width'] . 'px; height: ' . $attributes['mediaDimensions']['height'] . 'px';
    }

    $mediaInsertLink = $attributes['mediaInsertLink'];
    if(is_array($attributes['mediaInsertLink'])){
    //    TODO: conver inser link attrs.
    }


    if (!empty($mediaID)) {
        $attachment = get_post($mediaID);
        if ($attachment) {
            $caption = $attachment->post_excerpt;
            $description = $attachment->post_content;
            $altText = get_post_meta($mediaID, '_wp_attachment_image_alt', true);
        }
    }    

    ob_start();
    ?>
    

    <div class="mie-image-block <?php echo $attributes['className'] ?>" <?php echo get_block_wrapper_attributes(); ?> 
        style="font-size: 13px; width: <?= $attributes["mediaFlexWidth"] ?>%">
        
        <?php if (!empty($mediaID)) : ?>
            <img 
                src="<?php echo wp_get_attachment_image_src($mediaID, 'full')[0]; ?>" 
                alt="<?php echo $altText ?>" 
                title="<?php echo $caption ?>"
                style="<?= $imgStyle ?>" >
        <?php endif; ?>    
        <p style="padding: 0; margin: 8px 0"><?php echo esc_html($description); ?></p>
        <p style="padding: 0; margin: 8px 0">
            <span class="custom-image-author">Author: <?php echo esc_html($author); ?> </span>
            <span class="custom-image-license">
                | License: 
                <a href="<?php echo esc_html($license_url) ?>">
                    <?php echo trim(esc_html($license_name)); ?>
                </a>    
            </span>    
            <span class="custom-image-source">, Source: <?php echo esc_html($source); ?></span>
        </p>    
    </div>    
    
    <?php
    $html = ob_get_contents(); // read ob2 ("b")
    ob_clean();

    return $html;
}    



/**
 * Render callback for the custom Gutenberg block
 *
 * @param mixed $attributes
 * 
 * @return HTML
 * 
 */
// function render_mie_image_block($attributes)
// {
//     $imageId = $attributes['imageId'];
//     $editUrl = get_edit_post_link($imageId);
//     $linkHtml = sprintf('<a href="%s" target="_blank">%s</a>', esc_url($editUrl), __('Edit Image'));

//     return $linkHtml;
// }

/**
 * Adds custom fields for the Media Edit page in WordPress attachments.
 *
 * @param array    $form_fields An array of form fields for the attachment.
 * @param WP_Post  $post        The attachment post object.
 *
 * @return array   Modified array of form fields for the attachment.
 */
function add_mie_fields_in_attachment_edit($form_fields, $post)
{
    $tf_media_author = $tf_media_licence = $tf_media_source = '';

    $post_id = $post->ID;
    $mie_media_serialized_data = get_post_meta($post_id, 'mie_media_data', true);
    $mie_media_data = unserialize($mie_media_serialized_data);

    if($mie_media_data !== false) {
        $tf_media_author  = $mie_media_data['mie_author'];
        $tf_media_licence = $mie_media_data['mie_license'];
        $tf_media_source  = $mie_media_data['mie_source'];
    }
        
    // Formulate licenses select options
    $args = array(
        'post_type'      => 'license', 
        'posts_per_page' => -1,
    );

    $licenses = new WP_Query($args);
    $license_options = array();

    if ($licenses->have_posts()) {
        while ($licenses->have_posts()) {
            $licenses->the_post();
            $license_id   = get_the_ID();
            $license_name = get_the_title();
            $license_options[$license_id] = $license_name;
        }
    }
    wp_reset_postdata();

    // Add mie custom data fileds
    $form_fields['mie_author'] = array(
        'label' => __('Author'),
        'input' => 'text', // you may alos use 'textarea' field
        'value' => $tf_media_author,
        'helps' => __('Media original author')
    );

 
    $options_markup = '';
    foreach ($license_options as $option_value => $option_text) {
        $selected_attr = ((string)$option_value === (string)$tf_media_licence) ? "selected" : '';
        $options_markup .= sprintf('<option %s value="%s">%s</option>', esc_attr($selected_attr),  esc_attr($option_value), esc_html($option_text));
    }
    $options_markup_kses =  wp_kses($options_markup, array('option' => array('value' => array(), 'text' => array(), 'selected' => true)));

    $form_fields['mie_licence'] = array(
        'label' => __('Licence','mie-plg'),
        'input' => 'html', // you may alos use 'textarea' field
        'html'  => sprintf(
            '<select name="attachments[%d][mie_license]" class="custom-license-select">
                <option value="">Select License</option>
                %s
            </select>',
            $post->ID,
            $options_markup_kses
        ),
        'value' => $tf_media_licence,
        'helps' => __( 'Licensed under','mie-plg')
    );


    $form_fields['mie_source'] = array(
        'label' => __('Source','mie-plg'),
        'input' => 'text', // 'text'/'textarea'
        'value' => $tf_media_source,
        'helps' => __('Media downloaded from','mie-plg')
    );

    return $form_fields;
}
add_filter('attachment_fields_to_edit', 'add_mie_fields_in_attachment_edit', null, 2);

/**
 * Saves custom fields for the Media Edit page when the attachment is saved.
 *
 * @param WP_Post   $post       An array of post data.
 * @param array   $attachment An array of attachment data.
 *
 * @return WP_Post  The modified post data array.
 */
function save_mie_fields_in_attachment_save($post, $attachment)
{
    $post_id = $post['ID'];
 
    if(empty($post_id) || !is_array($attachment)) {
        return $post;
    }

    
    $mie_media_data = array(
        'mie_author'  => sanitize_text_field($attachment['mie_author']),
        'mie_license' => $attachment['mie_license'],
        'mie_source'  => sanitize_url($attachment['mie_source'])
    );

    $mie_media_serialized_data = serialize($mie_media_data);
    update_post_meta($post_id , 'mie_media_data', $mie_media_serialized_data);

    return $post;
}
add_filter('attachment_fields_to_save', 'save_mie_fields_in_attachment_save', null, 2);


/**
 * Include custom data in the REST API response for the media endpoint
 *
 * @param mixed $response
 * @param mixed $attachment
 * @param mixed $request
 * 
 * @return [type]
 * 
 */
function add_custom_data_to_rest_response($response, $attachment, $request) {
    // Get your custom data from the attachment's meta
    $mie_media_data = get_post_meta($attachment->ID, 'mie_media_data', true);

    // Add your custom data to the response
    $response->data['mie_media_data'] = $mie_media_data;

    return $response;
}
add_filter('rest_prepare_attachment', 'add_custom_data_to_rest_response', 10, 3);