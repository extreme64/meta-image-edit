const { MediaUpload, RichText, BlockControls } = wp.blockEditor;

const {
    Toolbar,
    ToolbarGroup,
    Dashicon,
} = wp.components;

const { useEffect, useState, useReducer, createElement: el } = wp.element;
const { dispatch, useDispatch, subscribe, select, useSelect, useSelector } = wp.data;

import { inspector, advancedInspector } from './inspector.js'
import { hideRegisteredStylesWrap } from './../register-style-relocate/index.js';
import { ReplacePanel } from  './toolbar/replace.js'
import { DuotonePanel } from './toolbar/duotone.js';

import { STORE_DUOTONE, modalReducer } from './reducers.js';



export const editBlock = (props, styles) => { 
    
    const { attributes, setAttributes, clientId, isSelected } = props;
    const [ selectedTab, setSelectedTab ] = useState('tab1');
    const [ replacePopoverShow, setReplacePopoverShow ] = useState(false);
    const [state, dispatchModal] = useReducer(modalReducer, { isModalOpen: false });

    const [duotoneColorePopoverShow, setDuotoneColorePopoverShow] = useState(false);


    // FIXME: jsut test, remove
    const value = useSelect((select) => select(STORE_DUOTONE).getDuoColor());
    useEffect(() => {
        console.log('@EDIT.JS >> Color changed:', value);
    }, [value]); 


    useEffect(() => {
        setReplacePopoverShow(state.isModalOpen);
    }, [state])


    useEffect(() => {
        if(!isSelected) {
            toolbarActionHandle(null);
        }
    }, [isSelected])

    useEffect(() => {
        let blockWrap = document.querySelector('[data-type="mie/image"]');
        blockWrap.style.width = `${attributes.mediaFlexWidth}%`;

        let media = blockWrap.querySelector('.mie-image__media');
        media.style.width = `${attributes.mediaDimensions.width}px`;
        media.style.height = `${attributes.mediaDimensions.height}px`;
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
        const reqStyleWrap = document.querySelector('.block-editor-block-inspector .block-editor-block-styles')
        if (reqStyleWrap) {
            hideRegisteredStylesWrap(reqStyleWrap);
        }
    };

    useEffect(() => {
        if (selectedTab == 'tab2') {
        }
    },
    [selectedTab]);


    const toolbarActionHandle = (action) => {
        switch (action) {
            case 'replaceimage':
                setReplacePopoverShow(true);
                break;
            case 'dualtone':
                setDuotoneColorePopoverShow(true);
                break;
            default:
                setReplacePopoverShow(false); 
                setDuotoneColorePopoverShow(false)
                break;
        }
    };

    const onSelectMedia = (media) => {
        setAttributes({
            mediaURL: media.url,
            mediaID: media.id,
        });
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
            {
                className: "mie-image-toolbar"
            },           
            el(ToolbarGroup,
                null,
                el("button",
                    {
                        onClick: () => toolbarActionHandle('link'),
                        className: 'mei-no-sborder'
                    },
                    el(Dashicon,
                        {
                            icon: "admin-links"
                        }
                    )
                ),
                el("button",
                    {
                        onClick: () => toolbarActionHandle('dualtone'),
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
                ),
                isSelected && duotoneColorePopoverShow && el(DuotonePanel,{props:props})
            ),
            el(ToolbarGroup,
                null,
                el("button",
                    {
                        onClick: () => toolbarActionHandle('replaceimage'),
                        className: ''
                    },
                    "Replace"
                ),
                isSelected && replacePopoverShow && ReplacePanel(props, dispatchModal)
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
        render: (uploadProps) => {
            return !attributes.mediaURL
                ? el('button', { onClick: uploadProps.open }, 'Select Image')
                : el('img', {
                    src: attributes.mediaURL,
                    alt: 'Custom Image',
                    className: 'mie-image__media',
                });
        }
    });

    return el('figure',
        {
            className: attributes.className,
        },
        inspector(props, onSelect, styles), 
        advancedInspector,

        controls, 
        
        pickMedia,
        
        el(RichText, {
            tagName: 'p',
            placeholder: 'Enter author...',
            value: attributes.author,
            onChange: (value) => setAttributes({ author: value }),
            className: 'custom-image-author'
        }),
    );
}
