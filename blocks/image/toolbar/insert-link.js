const {
    createElement: el,
    useEffect,
    useState,
    useReducer,
    useRef
} = wp.element;

const {
    Popover,
    Button,
    __experimentalVStack: VStack,
    __experimentalSpacer: Spacer,
    VisuallyHidden,
    Dropdown,
    ColorPicker,
    SVG,
    Path,
    ToggleControl
} = wp.components;
const { __ } = wp.i18n;
const { MediaUpload, URLInputButton, URLPopover } = wp.blockEditor
const { useCallback } = wp.element;
const { useDispatch, useSelect } = wp.data;

const { debounce } = lodash;
import { STORE_DUOTONE } from './../reducers.js';


const InserLinkPanel = ({ props }) => {

    const { attributes, setAttributes } = props;

    const [ isOpen, setIsOpen ] = useState(false);
    const [ isLinkApplied, setIsLinkApplied ] = useState(false);
    const [ insertLink, setInsertLink ] = useState(() => {
        const initialValue = attributes.mediaInsertLink;

        if (typeof initialValue === 'string') {
            try {
                return JSON.parse(initialValue);
            } catch (error) {
                return initialValue;
            }
        }

        return initialValue;
    });
    const inputUrlRef = useRef(null);
    

    const dispatch = useDispatch(STORE_DUOTONE);

    useEffect(() => {
        if(insertLink.url)
            setIsLinkApplied(true)

        console.log(attributes);
            // testObj
    }, []);


    const handleInsertLinkChanges = () => {
        setAttributes({
            mediaInsertLink: insertLink
        });
    }

    useEffect(() => {  handleInsertLinkChanges }, [insertLink]);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkApplied = (event) => {
         setIsLinkApplied(!isLinkApplied);
        //TODO: handle appling link to url or post
    }

    const handleToggleChange = () => {
        setInsertLink({ ...insertLink, target: !insertLink.target });
    };

    const handleRelLinkChange = (newRelLinkValue) => {
        console.log(newRelLinkValue);
        setInsertLink({ ...insertLink, linkRel: newRelLinkValue });
    };

    const removeLink = () => { 
        setInsertLink({ url: "", target: false, linkRel: "" });
        setIsLinkApplied(false);
    }

    const validateUrlInput = (url) => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

        if (url.trim() === '') {
            return 'Please fill out this field.';
        } else if (!urlPattern.test(url)) {
            return 'Please enter a valid URL';
        } else {
            return ''; // Empty string indicates valid input
        }
    };

    const onSubmit = (event) => {
        let isAllValid

        const urlInput = inputUrlRef.current;
        const validationMessage = validateUrlInput(insertLink.url);
        urlInput.setCustomValidity(validationMessage);
        isAllValid = urlInput.reportValidity();

        if (isAllValid) {
            event.preventDefault();
            handleInsertLinkChanges(insertLink.url)
            setIsLinkApplied(true);
            setIsOpen(false);
        }
    };

    // "mediaInsertLink": '{ "url": "https://example-2nice.gg", "target": true, "linkRel": "noopener" }'
    //                     ['url' => 'https//...', 'target' => true, 'linkRel' => "noref"]


    return el(
        URLPopover, {
            onClose: toggleIsOpen,
            isOpen: isOpen,
            className: "components-popover__content",
            renderSettings: () => [
                el(
                    ToggleControl,
                    {
                        label: __('Open in new tab'),
                        checked: insertLink.target,
                        onChange: () => handleToggleChange(),
                    }
                ),
                el(
                    'input', {
                        label: __('Link Rel'),
                        defaultValue: insertLink.linkRel,
                        onChange: (event) => handleRelLinkChange(event.target.value),
                        placeholder: "noreferrer noopener",
                    },
                )
            ]
        },
        el(
            'div', {
                    className: "insert-link-popover block-editor-url-popover__row"
                },
                el(
                    'form', { 
                            onSubmit: onSubmit,
                            className: "block-editor-url-popover__link-editor"
                        },
                        !isLinkApplied && [
                            el(
                                'input', {
                                    defaultValue: insertLink.url,
                                    onChange: (e) => {
                                        setInsertLink({ ...insertLink, url: e.target.value });
                                        const validationMessage = validateUrlInput(e.target.value);
                                        e.target.setCustomValidity(validationMessage);
                                    },
                                    placeholder: "Paste URL",
                                    type: 'url',
                                    required: true,
                                    'aria-required': "true",
                                    ref: inputUrlRef,
                                    className: "insert-link-popover__url-input"
                                }
                            ),
                            el(
                                Button, {
                                    icon: 'editor-break',
                                    label: __('Apply'),
                                    type: 'submit',
                                    onClick: onSubmit,
                                }
                            )

                        ],
                ),

                isLinkApplied && [
                el(
                    'a', {
                        onClick: (event) => { console.log(event); },
                        href: insertLink.url,
                        'aria-role': "link",
                        target: insertLink.target,
                        className: "insert-link-popover__link"
                    },
                    insertLink.url
                ),
                el(
                    Button, {
                        icon: 'edit',
                        label: __('Edit'),
                        onClick: handleLinkApplied,
                    }
                ),
                el(
                    Button, {
                        label: __('Remove link'),
                        onClick: removeLink,
                        'aria-label': "Remove link",
                        className: "has-icon"
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
                            d: "M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"
                        }
                    )
                )
            )
        ])
    )
}

export { InserLinkPanel };