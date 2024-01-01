const { registerBlockType } = wp.blocks;
const { MediaUpload, RichText, BlockControls, Icon, InspectorControls, InspectorAdvancedControls } = wp.blockEditor;

const { 
    PanelBody, 
    PanelRow,
    ResponsiveWrapper, 
    Toolbar, 
    ToolbarGroup,
    Dashicon, 
    TextControl,
    TextareaControl,
    TabPanel,
    ExternalLink,
    SelectControl,
    __experimentalNumberControl: NumberControl,
    BaseControl,
    ButtonGroup, 
    Button,
    useBaseControlProps,
    Icon: IconComp } = wp.components;

const { useEffect, useState, createElement:el } = wp.element;
const { useDispatch, useSelect } = wp.data;


wp.domReady( function() {
    console.log("domReady");
    wp.blocks.registerBlockStyle('mie/image', [
        {
            name: 'mietest1',
            label: 'The mietest1',
        }
    ]);
} );

registerBlockType("mie/image", {
    
    title: 'MIE Image',
    icon: 'format-image',
    category: 'common',
    supports: {
        align: ['wide', 'full'],
    },
    
    // const {
    //     url = '',
    //     alt,
    //     caption,
    //     align,
    //     id,
    //     href,
    //     rel,
    //     linkClass,
    //     linkDestination,
    //     title,
    //     width,
    //     height,
    //     aspectRatio,
    //     scale,
    //     linkTarget,
    //     sizeSlug,
    // } = attributes;


    // attributes: {
    //     mediaID: {
    //         type: 'number',
    //     },
    //     mediaURL: {
    //         type: 'string',
    //         source: 'attribute',
    //         attribute: 'src',
    //         selector: 'img',
    //     },
    //     author: {
    //         type: 'string',
    //         source: 'text',
    //         selector: '.custom-image-author',
    //     },
    //     license: {
    //         type: 'string',
    //         source: 'text',
    //         selector: '.custom-image-license',
    //     },
    //     source: {
    //         type: 'string',
    //         source: 'text',
    //         selector: '.custom-image-source',
    //     },
    // },

    
    // edit: ({ attributes, setAttributes, isSelected, className, onReplace, clientId }) => {
    //     const { caption, alt, mediaID, mediaURL, author, license, source } = attributes;
    //     const { mieData, setMieData } = useState(null);
    //     const {selectedTab, setSelectedTab} = useState('tab1');

    edit: (props) => {
        const { attributes, setAttributes } = props;
        // const { mieData, setMieData } = useState(null);

        useEffect(() => {
            if (attributes.mediaID) {
                wp.apiFetch({ path: `/wp/v2/media/${attributes.mediaID}` })
                    .then((response) => {
                        const imageUrl = response.source_url;
                        if (imageUrl) {
                            setAttributes({ mediaURL: imageUrl });
                        }

                        const serializedData = response.mie_media_data;

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


        useEffect(() => {
            console.log('isSelected', attributes.clientId);
           
            let sWrap = document.querySelector('.block-editor-block-inspector .block-editor-block-styles')
            console.log("selectedTab", sWrap);        

        }, [attributes.isSelected]);

        

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


        const onSelect = (tabName) => {
            console.log('Selecting tab', tabName);

            setAttributes({ selectedTab: tabName})
            // setSelectedTab(tabName);
            // let sWrap = document.querySelector('.block-editor-block-inspector .block-editor-block-styles')
            // console.log("sWrap", sWrap);        
        };



        /**
         * Block controls and toolbar.
         *
         * @var ReactNode
         */
        const controls = el(
            BlockControls,
            null,
            el( Toolbar,
                null,
                el( ToolbarGroup,
                    null,
                    el( "button",
                        {
                            onClick: replaceImage,
                            className: 'mei-no-sborder'
                        },
                        "Replace"
                    ),
                    el( "button",
                        {
                            onClick: replaceImage,
                            className: 'mei-no-sborder'
                        },
                        el( Dashicon,
                            {
                                onClick: replaceImage,
                                icon: "trash" // unlink
                            }
                        )
                    ),
                ),
                el( ToolbarGroup,
                    null,
                    el( "button",
                        {
                            onClick: replaceImage,
                            className: 'mei-no-sborder'
                        },
                        el( Dashicon,
                            {
                                onClick: replaceImage,
                                icon: "admin-links"
                            }
                        )
                    ),
                    el( "button",
                        {
                            onClick: replaceImage,
                            className: 'mei-no-sborder'
                        },
                        el( "svg",
                            {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                width: "24",
                                height: "24",
                                "aria-hidden": "true",
                                focusable: "false"
                            },
                            el( "path", {
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

        /**
         * Inspector Tabs array
         *
         * @var Array
         */
        const inspectorTabs = [
            {
                name: "tab1",
                title: el(IconComp, {
                    icon: el("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        width: "24",
                        height: "24",
                        "aria-hidden": "true",
                        focusable: "false"
                    },
                        el("path", {
                            "fill-rule": "evenodd",
                            d: "M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z",
                            "clip-rule": "evenodd"
                        })
                    )
                }
                ),
                className: "tab-one block-editor-block-inspector__tab-item has-icon",
            },
            {
                name: "tab2",
                title: el(IconComp, {
                    icon: el("svg", {
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "24",
                        height: "24",
                        "aria-hidden": "true",
                        focusable: "false"
                    },
                        el("path", {
                            d: "M12 4c-4.4 0-8 3.6-8 8v.1c0 4.1 3.2 7.5 7.2 7.9h.8c4.4 0 8-3.6 8-8s-3.6-8-8-8zm0 15V5c3.9 0 7 3.1 7 7s-3.1 7-7 7z"
                        })
                    )
                }
                ),
                className: "tab-two block-editor-block-inspector__tab-item has-icon"
            }
        ]

        /**
         * Block inspector
         *
         * @var ReactNode
         */
        const inspector = el(InspectorControls,
            {},
            el(TabPanel, {
                className: "block-editor-block-inspector__tabs",
                activeClass: "is-active",
                onSelect: onSelect,
                tabs: inspectorTabs
            },
                (tab) => el( "div",
                    {},
                    tab.name === 'tab1' && el(PanelBody,
                        {
                            title: "Settings",
                            initialOpen: true,
                            className: "tab-one",
                        },
                        el(BaseControl,
                            {
                                help: el('span', {
                                },
                                    el(ExternalLink, {
                                            href: "https://www.w3.org/WAI/tutorials/images/decision-tree/",
                                            className: ""
                                        },
                                        "Describe the purpose of the image."
                                    ),
                                    " Leave empty if the image is purely decorative.",
                                )
                            },
                            el(TextareaControl, {
                                label: "ALT TEXT (ALTERNATIVE TEXT)",
                                value: attributes.alt,
                                onChange: onChangeAlt
                            })
                        ),
                        el(BaseControl,
                            {},
                            el(SelectControl, {
                                label: "IMAGE SIZE",
                                value: null,
                                options: [
                                    { label: 'Thumbnail', value: '25%' },
                                    { label: 'Medium', value: '50%' },
                                    { label: 'Full Size', value: '100%' },
                                ]
                            }),
                            el("p", {},
                                "Image dimensions"
                            ),
                        ),
                        el(BaseControl, {
                            className: "mie__row--no-bottom-margin"
                        },
                            el(BaseControl, {
                                className: "mie__row mie__image-dimensions"
                            },
                                el(NumberControl, {
                                    name: "width",
                                    className: "mie__image-dimensions__width",
                                    label: 'Width',
                                    value: 130
                                }
                                ),

                                el(NumberControl, {
                                    name: "height",
                                    className: "mie__image-dimensions__height",
                                    label: 'Height',
                                    value: 100
                                }
                                )
                            )
                        ),
                        el(BaseControl, {
                            className: "mie__row--no-bottom-margin"
                        },
                            el(ButtonGroup, {
                                role: 'group'
                            },
                                el(Button, {
                                    "aria-pressed": "false",
                                    className: "is-small"
                                },
                                    "25%"
                                ),
                                el(Button, {
                                    "aria-pressed": "false",
                                    className: "is-small"
                                },
                                    "50%"
                                ),
                                el(Button, {
                                    "aria-pressed": "false",
                                    className: "is-small"
                                },
                                    "75%"
                                ),
                                el(Button, {
                                    "aria-pressed": "true",
                                    className: "is-small is-pressed"
                                },
                                    "100%"
                                )
                            ),
                            el(Button, {
                                className: "is-small"
                            },
                                "Reset"
                            )
                        )
                    ),
                    tab.name === 'tab2' && el(PanelBody, {
                        title: "Styles",
                        initialOpen: true,
                        className: "tab-two",
                    },
                        null
                    )
                )
            )
        )

        /**
         * Advanced panel inspector
         *
         * @var ReactNode
         */
        const advancedInspector = el(InspectorAdvancedControls, {
                className: "advance-panel",
                key: "inspector"
            },
            el(TextControl, {
                className: "html-anchor-control",
                label: "HTML ANCHOR",
                help: el('span', {},

                    el('p', {},
                        "Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.",

                        el(ExternalLink, {
                            children: "Learn more about anchors",
                            href: "https://wordpress.org/support/article/page-jumps/",
                            className: ""
                        })
                    )
                )
            })
        )




        return el( 'figure',
            {
                className: attributes.className
            },

            inspector,

            advancedInspector,
            
            pickMedia,

            controls,

            el( RichText, {
                tagName: 'p',
                placeholder: 'Enter author...',
                value: attributes.author,
                onChange: function (value) {
                    return setAttributes({ author: value });
                },
                className: 'custom-image-author'
            }),
        );
    },

    save() {
        return null;
    }

});