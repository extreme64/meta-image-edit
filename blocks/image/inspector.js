const { InspectorControls, InspectorAdvancedControls } = wp.blockEditor;

const {
    PanelBody,
    PanelRow,
    TextControl,
    TextareaControl,
    TabPanel,
    ExternalLink,
    SelectControl,
    __experimentalNumberControl: NumberControl,
    BaseControl,
    ButtonGroup,
    Button,
    Icon: IconComp 
} = wp.components;

const { createElement: el, useMemo, useState, useEffect } = wp.element;
const { useSelect } = wp.data


import { RegisteredStyles, EnhancedRegisteredStyles } from './../register-style-relocate/index.js';


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
const inspector = (props, onSelect, styles ) => {
   

    //FIXME: get styles select('core/block-editor').getBlockStyles('core/paragraph');

    const { attributes, setAttributes, clientId } = props;

    const [mediaWrapWidth, setMediaWrapWidth] = useState(attributes.mediaFlexWidth);
    const [mediaDimensions, setMediaDimensions] = useState(attributes.mediaDimensions);


    function MediaSizeSelect({ value }) {

        let mediaSizes
        let options = [{
            label: 'Pick',
            value: -1,
        }];

        mediaSizes = useSelect((select) => {
            return select('core').getMedia(attributes.mediaID);
        }, []);
         
        options = useMemo(() => {
            let sizes = mediaSizes?.media_details.sizes;
            let sizesMissing = mediaSizes?.missing_image_sizes;
            if (mediaSizes && sizes) {
                return [
                    {
                        label: 'Default',
                        value: -1,
                    },
                    ...Object.keys(sizes).map((value, index) => ({
                        label: sizes[index],
                        value: value,
                    })),
                    ...Object.keys(sizesMissing).map((value, index) => ({
                        label: sizesMissing[index],
                        value: value,
                        disabled: true,
                    })),
                ];
            }
            return [];
        }, [mediaSizes]);

        
        return el(
            SelectControl, {
                label: "IMAGE SIZE",
                value: value,
                options: options,
                onChange: (newPick) => {
                    return setAttributes({ mediaSize: newPick });
                }
            }
        );
    }

    const handleButtonClick = (value) => {
        setMediaWrapWidth(value);
        setAttributes({
            mediaFlexWidth: value
        })

        let blockWrap = document.querySelector('[data-type="mie/image"]');
        blockWrap.style.width = `${value}%`;
    };

    useEffect(() => {
        setAttributes({
            mediaDimensions: mediaDimensions
        })

        let media = document.querySelector('[data-type="mie/image"] .mie-image__media');
        media.style.width = `${mediaDimensions.width}px`;
        media.style.height = `${mediaDimensions.height}px`;

    }, [mediaDimensions]);


    return el(InspectorControls,
        {},
        el(TabPanel, {
            className: "block-editor-block-inspector__tabs",
            activeClass: "is-active",
            onSelect: onSelect,
            tabs: inspectorTabs
        },
        (tab) => el("div",
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
                        onChange: (value) => {
                            return setAttributes({ alt: value });
                        }
                    })
                ),
                el(BaseControl,
                    {},
                    el(MediaSizeSelect, {
                        label: "IMAGE SIZE",
                        value: attributes.mediaSize, 
                        onChange: (value) => {
                            return setAttributes({ mediaSize: value });
                        } 
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
                            value: mediaDimensions.width,
                            onChange: (newWidthNumber) => { 
                                setMediaDimensions({ ...mediaDimensions, width: newWidthNumber });
                            }
                        }),
                        el(NumberControl, {
                            name: "height",
                            className: "mie__image-dimensions__height",
                            label: 'Height',
                            value: mediaDimensions.height,
                            onChange: (newHeightNumber) => {
                                setMediaDimensions({ ...mediaDimensions, height: newHeightNumber});
                            }
                        })
                    )
                ),
                // Rendered component
                el(BaseControl, {
                        className: "mie__row--no-bottom-margin"
                    },
                        el(ButtonGroup, {
                                role: 'group'
                            },
                            el(Button, {
                                "aria-pressed": mediaWrapWidth === "25", // Check if this button should be pressed
                                className: "is-small " + ((mediaWrapWidth === "25") ? "is-pressed" : ''),
                                onClick: () => handleButtonClick("25") // Pass the value to set
                            },
                                "25%"
                            ),
                            el(Button, {
                                "aria-pressed": mediaWrapWidth === "50",
                                className: "is-small " + ((mediaWrapWidth === "50") ? "is-pressed" : ''),
                                onClick: () => handleButtonClick("50")
                            },
                                "50%"
                            ),
                            el(Button, {
                                "aria-pressed": mediaWrapWidth === "75",
                                className: "is-small " + ((mediaWrapWidth === "75") ? "is-pressed" : ''),
                                onClick: () => handleButtonClick("75")
                            },
                                "75%"
                            ),
                            el(Button, {
                                "aria-pressed": mediaWrapWidth === "100",
                                className: "is-small " + ((mediaWrapWidth === "100") ? "is-pressed" : ''),
                                onClick: () => handleButtonClick("100")
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
                el(PanelRow, { className: 'tab-two__styles' },
                    el(EnhancedRegisteredStyles, { styles, ...props })
                ),
            )
        )
    )
)};

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

export { inspector, advancedInspector };