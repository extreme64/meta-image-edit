const { MediaUpload, RichText, BlockControls } = wp.blockEditor;

const {
    Toolbar,
    ToolbarGroup,
    Dashicon,
} = wp.components;

const { useEffect, useState, createElement: el } = wp.element;
const { useDispatch, select, useSelect } = wp.data;


import { inspector, advancedInspector } from './inspector.js'
import { hideRegisteredStylesWrap } from './../register-style-relocate/index.js';

export const editBlock = (props, styles) => { 
    
    const { attributes, setAttributes, clientId } = props;
    const [ selectedTab, setSelectedTab ] = useState('tab1')

    useEffect(() => {
    }, [])

    useEffect(() => {

        if (attributes.mediaID) {
            wp.apiFetch({ path: `/wp/v2/media/${attributes.mediaID}` })
                .then((response) => {
                    const imageUrl = response.source_url;
                    if (imageUrl) {
                        setAttributes({ mediaURL: imageUrl });
                    }

                    const serializedData = response.mie_media_data;
            
                    // TODO: Use author, lisense and source

                    // Extracting the author value
                    const authorRegex = /"mie_author";s:(\d+):"([^"]+)";/;
                    const authorMatch = serializedData.match(authorRegex);
                    const author = authorMatch ? authorMatch[2] : '';

                    // Extracting the license value
                    const licenseRegex = /"mie_license";s:(\d+):"([^"]+)";/;
                    const licenseMatch = serializedData.match(licenseRegex);
                    const license = licenseMatch ? licenseMatch[2] : '';

                    // Extracting the source value
                    const sourceRegex = /"mie_source";s:(\d+):"([^"]+)";/;
                    const sourceMatch = serializedData.match(sourceRegex);
                    const source = sourceMatch ? sourceMatch[2] : '';

                })
                .catch((error) => {
                    // Handle error if necessary
                    console.error(error);
                });
        }
    }, [attributes.mediaID]);

    const onSelect = (tabName) => {

        setSelectedTab(tabName)

        const reqSylWrap = document.querySelector('.block-editor-block-inspector .block-editor-block-styles')
        if (reqSylWrap) {
            hideRegisteredStylesWrap(reqSylWrap);
        } else {
            console.error("No 'regestered styles' panel, to hide!");
        }
    };

    useEffect(() => {

        if (selectedTab == 'tab2') {
           
        }
    },
    [selectedTab]);


    const replaceImage = () => {
        // Replace image logic goes here
        console.log('Replace image clicked!');
    };

    const onSelectMedia = (media) => {
        setAttributes({
            mediaURL: media.url,
            mediaID: media.id,
        });
    };

    // Handler for updating the alt attribute
    const onChangeAlt = (newAlt) => {
        setAttributes({ alt: newAlt });
    };


    // FIXME: deprecated.min.js?ver=6c963cb9494ba26b77eb:2 Using Toolbar without label prop is deprecated since version 5.6. Please use ToolbarGroup component instead. See: https://developer.wordpress.org/block-editor/components/toolbar/
    /**
     * Block controls and toolbar.
     *
     * @var ReactNode
     */
    const controls = el(
        BlockControls,
        null,
        el(Toolbar,
            null,
            el(ToolbarGroup,
                null,
                el("button",
                    {
                        onClick: replaceImage,
                        className: 'mei-no-sborder'
                    },
                    "Replace"
                ),
                el("button",
                    {
                        onClick: replaceImage,
                        className: 'mei-no-sborder'
                    },
                    el(Dashicon,
                        {
                            onClick: replaceImage,
                            icon: "trash" // unlink
                        }
                    )
                ),
            ),
            el(ToolbarGroup,
                null,
                el("button",
                    {
                        onClick: replaceImage,
                        className: 'mei-no-sborder'
                    },
                    el(Dashicon,
                        {
                            onClick: replaceImage,
                            icon: "admin-links"
                        }
                    )
                ),
                el("button",
                    {
                        onClick: replaceImage,
                        className: 'mei-no-sborder'
                    },
                    el("svg",
                        {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            width: "24",
                            height: "24",
                            "aria-hidden": "true",
                            focusable: "false"
                        },
                        el("path", {
                            d: "M12 4 4 19h16L12 4zm0 3.2 5.5 10.3H12V7.2z"
                        })
                    )
                )
            )
        )
    );

    /**
     * Select media or upload file for blocks's image
     *
     * @var ReactNode
     */
    const pickMedia = el(MediaUpload, {
        onSelect: onSelectMedia,
        allowedTypes: ['image'],
        value: attributes.mediaID,
        render: function (props) {
            return !attributes.mediaURL
                ? el('button', {
                    onClick: props.open
                },
                    'Select Image'
                )
                : el('img', {
                    src: attributes.mediaURL,
                    alt: 'Custom Image'
                }
                )
        }
    });


    return el('figure',
        {
            className: attributes.className
        },
        inspector(props, attributes, onSelect, onChangeAlt, styles), advancedInspector,
        controls, pickMedia,
        el(RichText, {
            tagName: 'p',
            placeholder: 'Enter author...',
            value: attributes.author,
            onChange: function (value) {
                return setAttributes({ author: value });
            },
            className: 'custom-image-author'
        }),
    );
}