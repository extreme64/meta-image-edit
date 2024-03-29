
const {
    createElement: el,
    useEffect,
    useState,
    useReducer
} =  wp.element;

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
} = wp.components;
const { MediaUpload } = wp.blockEditor
const { useCallback } = wp.element;
const { useDispatch, useSelect } = wp.data;

const { debounce } = lodash;
import { STORE_DUOTONE } from './../reducers.js';


const DuotonePanel = ({ props }) => {

    const { attributes, setAttributes } = props;
    const [ colorPickerShadowsHex, setColorPickerShadowsHex ] = useState(attributes.mediaDuoToneColorShadows);
    const [ colorPickerHighlightsHex, setColorPickerHighlightsHex] = useState(attributes.mediaDuoToneColorHighlights);

    const [ showColorPicker, setShowColorPicker] = useState(false);
    const [ isColorPickerDragging, setIsShowColorPickerDragging] = useState(false);
    const [ startValue, setStartValue ] = useState('#333333');

    const [ editingCurrentColor, setEditingCurrentColor] = useState(null);

    const dispatch = useDispatch(STORE_DUOTONE);
    

    useEffect(() => {
        if (startValue.hex){
            handleColorChange(startValue.hex)
        }
    }, [startValue]);


    useEffect(() => {
        dispatch.setDuoColor(attributes.mediaDuoToneColorShadows);
        dispatch.setDuoColor(attributes.mediaDuoToneColorHighlights);
    }, [dispatch, attributes.mediaDuoToneColorShadows, attributes.mediaDuoToneColorHighlights]);


    useEffect(() => {
        updateColorpickerStartColor(editingCurrentColor)
    }, [editingCurrentColor]); 


    function handleColorPickerPanel(status, pickingFor) {

        if(pickingFor){
            setEditingCurrentColor(pickingFor);
        }
        
        if (status === 'open'){
            setShowColorPicker(true);
        } else if (status === 'toggle' && showColorPicker === true){
            setShowColorPicker(false);
        } else if (status === 'close') {
            setShowColorPicker(false);
        }

        updateColorpickerStartColor(editingCurrentColor)
    }
    
    const debouncedHandleColorChange = useCallback(
        
        debounce((newColor, editingCurrentColor) => {
            if (editingCurrentColor){
                if (editingCurrentColor === 'shadows' ) {
                    setAttributes({
                        mediaDuoToneColorShadows: newColor,
                    });
                    setColorPickerShadowsHex(newColor); 
                } else if (editingCurrentColor === 'highlights') {
                    setAttributes({
                        mediaDuoToneColorHighlights: newColor,
                    });
                    setColorPickerHighlightsHex(newColor)
                }
            }
            if (!isColorPickerDragging){
                // setShowColorPicker(false);
            }

        }, 300), 
        [isColorPickerDragging]
    );


    const handleColorChange = (newColor) => {
        dispatch.setDuoColor(newColor);
        debouncedHandleColorChange(newColor, editingCurrentColor);
    };

    const updateColorpickerStartColor = (pickingString) => {
        if (pickingString === 'shadows') {
            setStartValue(colorPickerShadowsHex);
        } else if (pickingString === 'highlights') {
            setStartValue(colorPickerHighlightsHex);
        }
    }

    const unsetColors = () => {
        setColorPickerShadowsHex('')
        setColorPickerHighlightsHex('')
    }

    const clearColors = () => {
        unsetColors();
        setShowColorPicker(false);
        dispatch.setIsDuoColorPanel(false);
    }

    return [
        el(Popover, {
            onClick: () => { handleColorPickerPanel('toggle')},
            className: 'duotone-popover components-popover components-dropdown__content block-editor-duotone-control__popover is-positioned is-alternate',
               
            }, [

                    el('div', { className: 'components-menu-group' }, [
                        el('div', { className: 'components-menu-group__label', id: 'components-menu-group-label-0', 'aria-hidden': 'true' }, 'Duotone'),
                        el('div', { role: 'group', 'aria-labelledby': 'components-menu-group-label-0' }, [
                            el('div', { className: 'block-editor-duotone-control__description' }, 'Create a two-tone color effect without losing your original image.'), 

                            el('div', { className: 'components-circular-option-picker__swatches' }, [
                                el('div', { className: 'components-duotone-picker__color-indicator components-circular-option-picker__option-wrapper' }, [
                                    el(
                                        Button, { 
                                            onClick: () => unsetColors(),
                                            type: 'button', 'aria-pressed': 'false', value: 'unset', className: 'components-button components-circular-option-picker__option' }
                                        ),
                                ]),
                            ]),

                            el(Spacer, { 'data-wp-c16t': 'true', 'data-wp-component': 'Spacer', className: 'components-spacer dd-f-a-a-de-y2b16m e19lxcc00' }),
                            el(VStack, { 'data-wp-c16t': 'true', 'data-wp-component': 'VStack', className: 'components-flex components-h-stack components-v-stack dd-f-a-a-de-1xpbaan e19lxcc00' }, [
                            
                                // Gradient bar 
                                el('div', {
                                    className: 'components-custom-gradient-picker__gradient-bar has-gradient', 
                                    style: { 
                                        background: 'linear-gradient(90deg,  ' + colorPickerShadowsHex + ' 0%, ' + colorPickerShadowsHex + ' 50%, ' + colorPickerHighlightsHex + ' 50%, ' + colorPickerHighlightsHex + ' 100%)' 
                                        } 
                                    }, [

                                    // Circle btns
                                    el('div', { className: 'components-custom-gradient-picker__markers-container' }, [
                                        el('div', { 
                                            onClick: () => handleColorPickerPanel('open', 'shadows'),
                                            className: 'components-dropdown components-custom-gradient-picker__control-point-dropdown', tabIndex: '-1', style: { left: '0%', transform: 'translateX(-50%)' } }, [
                                            el(Button, { type: 'button', 'aria-label': 'Gradient control point at position 0% with color code #333.', 'aria-describedby': 'components-custom-gradient-picker__control-point-button-description-0', 'aria-haspopup': 'true', 'aria-expanded': 'false', className: 'components-button components-custom-gradient-picker__control-point-button' }),
                                            el(VisuallyHidden, { 'data-wp-c16t': 'true', 'data-wp-component': 'VisuallyHidden', id: 'components-custom-gradient-picker__control-point-button-description-0', className: 'components-visually-hidden dd-f-a-a-de-0 e19lxcc00', style: { border: '0px', clip: 'rect(1px, 1px, 1px, 1px)', clipPath: 'inset(50%)', height: '1px', margin: '-1px', overflow: 'hidden', padding: '0px', position: 'absolute', width: '1px', overflowWrap: 'normal' } }, 'Use your left or right arrow keys or drag and drop with the mouse to change the gradient position. Press the button to change the color or remove the control point.'),
                                        ]),
                                        el('div', { 
                                            onClick: () => handleColorPickerPanel('open', 'highlights'),
                                            className: 'components-dropdown components-custom-gradient-picker__control-point-dropdown', tabIndex: '-1', style: { left: '100%', transform: 'translateX(-50%)' } }, [
                                            el(Button, { type: 'button', 'aria-label': 'Gradient control point at position 100% with color code #CCC.', 'aria-describedby': 'components-custom-gradient-picker__control-point-button-description-1', 'aria-haspopup': 'true', 'aria-expanded': 'false', className: 'components-button components-custom-gradient-picker__control-point-button' }),
                                            el(VisuallyHidden, { 'data-wp-c16t': 'true', 'data-wp-component': 'VisuallyHidden', id: 'components-custom-gradient-picker__control-point-button-description-1', className: 'components-visually-hidden dd-f-a-a-de-0 e19lxcc00', style: { border: '0px', clip: 'rect(1px, 1px, 1px, 1px)', clipPath: 'inset(50%)', height: '1px', margin: '-1px', overflow: 'hidden', padding: '0px', position: 'absolute', width: '1px', overflowWrap: 'normal' } }, 'Use your left or right arrow keys or drag and drop with the mouse to change the gradient position. Press the button to change the color or remove the control point.'),
                                        ]),
                                    ]),
                                ]),
                                el('div', { className: 'components-color-list-picker' }, [
                                    el(Button, { 
                                        onClick: () => handleColorPickerPanel('open', 'shadows'),
                                        type: 'button', 
                                        className: 'ss components-button components-color-list-picker__swatch-button' }, [
                                        el(VStack, { 'data-wp-c16t': 'true', 'data-wp-component': 'VStack', className: 'components-flex components-h-stack dd-f-a-a-de-1f9s4va e19lxcc00' }, [
                                            el(SVG, { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24', 'aria-hidden': 'true', focusable: 'false' }, [
                                                el(Path, { d: 'M5 17.7c.4.5.8.9 1.2 1.2l1.1-1.4c-.4-.3-.7-.6-1-1L5 17.7zM5 6.3l1.4 1.1c.3-.4.6-.7 1-1L6.3 5c-.5.4-.9.8-1.3 1.3zm.1 7.8l-1.7.5c.2.6.4 1.1.7 1.6l1.5-.8c-.2-.4-.4-.8-.5-1.3zM4.8 12v-.7L3 11.1v1.8l1.7-.2c.1-.2.1-.5.1-.7zm3 7.9c.5.3 1.1.5 1.6.7l.5-1.7c-.5-.1-.9-.3-1.3-.5l-.8 1.5zM19 6.3c-.4-.5-.8-.9-1.2-1.2l-1.1 1.4c.4.3.7.6 1 1L19 6.3zm-.1 3.6l1.7-.5c-.2-.6-.4-1.1-.7-1.6l-1.5.8c.2.4.4.8.5 1.3zM5.6 8.6l-1.5-.8c-.3.5-.5 1-.7 1.6l1.7.5c.1-.5.3-.9.5-1.3zm2.2-4.5l.8 1.5c.4-.2.8-.4 1.3-.5l-.5-1.7c-.6.2-1.1.4-1.6.7zm8.8 13.5l1.1 1.4c.5-.4.9-.8 1.2-1.2l-1.4-1.1c-.2.3-.5.6-.9.9zm1.8-2.2l1.5.8c.3-.5.5-1.1.7-1.6l-1.7-.5c-.1.5-.3.9-.5 1.3zm2.6-4.3l-1.7.2v1.4l1.7.2V12v-.9zM11.1 3l.2 1.7h1.4l.2-1.7h-1.8zm3 2.1c.5.1.9.3 1.3.5l.8-1.5c-.5-.3-1.1-.5-1.6-.7l-.5 1.7zM12 19.2h-.7l-.2 1.8h1.8l-.2-1.7c-.2-.1-.5-.1-.7-.1zm2.1-.3l.5 1.7c.6-.2 1.1-.4 1.6-.7l-.8-1.5c-.4.2-.8.4-1.3.5z' }),
                                            ]),
                                            el('span', {}, 'Shadows'),
                                        ]),
                                    ]),
                                    el(VStack, { 'data-wp-c16t': 'true', 'data-wp-component': 'VStack', className: 'components-flex components-h-stack components-v-stack components-color-list-picker__color-picker fc-ddd--bc-ccaf-1xpbaan e19lxcc00' }, [

                                        el(Dropdown, {
                                            className: 'my-container-class-name',
                                            contentClassName: 'my-popover-content-classname',
                                            popoverProps: { placement: 'bottom-start' },
                                            renderToggle: ({ isOpen, onToggle }) => (
                            
                                                el(Button, {
                                                    onClick: onToggle,
                                                    'data-wp-c16t': "true", 
                                                    'data-wp-component': "Flex", 
                                                    'aria-expanded': isOpen, 
                                                    'aria-haspopup': "true", 
                                                    'aria-label': "Custom color picker.", 
                                                    className: 'components-flex components-color-palette__custom-color ce-f-a-aee-dfcebbe-1ws0j2m e19lxcc00',
                                                    style: { background: colorPickerShadowsHex }
                                                    },
                                                    [
                                                        el(Button, {
                                                            'data-wp-c16t': "true",
                                                            'data-wp-component': "FlexItem", 
                                                            className: "components-truncate components-flex-item components-color-palette__custom-color-name e19lxcc00 ce-f-a-aee-dfcebbe-tq6p1q e19lxcc00"
                                                        },
                                                        "Custom"
                                                        ),
                                                        el(Button, {
                                                                'data-wp-c16t': "true", 
                                                                'data-wp-component': "FlexItem", 
                                                                className: "components-flex-item components-color-palette__custom-color-value ce-f-a-aee-dfcebbe-qcm38l e19lxcc00"
                                                        },
                                                            colorPickerShadowsHex
                                                        )
                                                    ]
                                                )
                                                
                                            ),
                                            renderContent: () => el(Popover, null,
                                            ),
                                        })
                                    ]),








                                    el(Button, { 
                                        onClick: () => handleColorPickerPanel('open', 'highlights'), 
                                        type: 'button', className: 'components-button components-color-list-picker__swatch-button' }, [
                                        el(VStack, { 'data-wp-c16t': 'true', 'data-wp-component': 'HStack', className: 'components-flex components-h-stack dd-f-a-a-de-1f9s4va e19lxcc00' }, [
                                            el(SVG, { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24', 'aria-hidden': 'true', focusable: 'false' }, [
                                                el(Path, { d: 'M5 17.7c.4.5.8.9 1.2 1.2l1.1-1.4c-.4-.3-.7-.6-1-1L5 17.7zM5 6.3l1.4 1.1c.3-.4.6-.7 1-1L6.3 5c-.5.4-.9.8-1.3 1.3zm.1 7.8l-1.7.5c.2.6.4 1.1.7 1.6l1.5-.8c-.2-.4-.4-.8-.5-1.3zM4.8 12v-.7L3 11.1v1.8l1.7-.2c.1-.2.1-.5.1-.7zm3 7.9c.5.3 1.1.5 1.6.7l.5-1.7c-.5-.1-.9-.3-1.3-.5l-.8 1.5zM19 6.3c-.4-.5-.8-.9-1.2-1.2l-1.1 1.4c.4.3.7.6 1 1L19 6.3zm-.1 3.6l1.7-.5c-.2-.6-.4-1.1-.7-1.6l-1.5.8c.2.4.4.8.5 1.3zM5.6 8.6l-1.5-.8c-.3.5-.5 1-.7 1.6l1.7.5c.1-.5.3-.9.5-1.3zm2.2-4.5l.8 1.5c.4-.2.8-.4 1.3-.5l-.5-1.7c-.6.2-1.1.4-1.6.7zm8.8 13.5l1.1 1.4c.5-.4.9-.8 1.2-1.2l-1.4-1.1c-.2.3-.5.6-.9.9zm1.8-2.2l1.5.8c.3-.5.5-1.1.7-1.6l-1.7-.5c-.1.5-.3.9-.5 1.3zm2.6-4.3l-1.7.2v1.4l1.7.2V12v-.9zM11.1 3l.2 1.7h1.4l.2-1.7h-1.8zm3 2.1c.5.1.9.3 1.3.5l.8-1.5c-.5-.3-1.1-.5-1.6-.7l-.5 1.7zM12 19.2h-.7l-.2 1.8h1.8l-.2-1.7c-.2-.1-.5-.1-.7-.1zm2.1-.3l.5 1.7c.6-.2 1.1-.4 1.6-.7l-.8-1.5c-.4.2-.8.4-1.3.5z' }),
                                            ]),
                                            el('span', {}, 'Highlights'),
                                        ]),
                                    ]),
                                    el(VStack, { 'data-wp-c16t': 'true', 'data-wp-component': 'VStack', className: 'components-flex components-h-stack components-v-stack components-color-list-picker__color-picker fc-ddd--bc-ccaf-1xpbaan e19lxcc00' }, [

                                        el(Dropdown, {
                                            className: 'my-container-class-name',
                                            contentClassName: 'my-popover-content-classname',
                                            popoverProps: { placement: 'bottom-start' },
                                            renderToggle: ({ isOpen, onToggle }) => (

                                                el(Button, {
                                                    onClick: onToggle,
                                                    'data-wp-c16t': "true",
                                                    'data-wp-component': "Flex",
                                                    'aria-expanded': isOpen,
                                                    'aria-haspopup': "true",
                                                    'aria-label': "Custom color picker.",
                                                    className: 'components-flex components-color-palette__custom-color ce-f-a-aee-dfcebbe-1ws0j2m e19lxcc00',
                                                    style: { background: colorPickerHighlightsHex }
                                                },
                                                    [
                                                        el(Button, {
                                                            'data-wp-c16t': "true",
                                                            'data-wp-component': "FlexItem",
                                                            className: "components-truncate components-flex-item components-color-palette__custom-color-name e19lxcc00 ce-f-a-aee-dfcebbe-tq6p1q e19lxcc00"
                                                        },
                                                            "Custom"
                                                        ),
                                                        el(Button, {
                                                            'data-wp-c16t': "true",
                                                            'data-wp-component': "FlexItem",
                                                            className: "components-flex-item components-color-palette__custom-color-value ce-f-a-aee-dfcebbe-qcm38l e19lxcc00"
                                                        },
                                                            colorPickerHighlightsHex
                                                        )
                                                    ]
                                                )

                                            ),
                                            renderContent: () => el(Popover, null,
                                            ),
                                        })
                                    ]),
                                ]),
                            
                            
                            ]),

                            el('div', { className: 'components-circular-option-picker__custom-clear-wrapper' }, [
                                el(Button, { 
                                    onClick: () => clearColors(),
                                    type: 'button', className: 'components-button components-circular-option-picker__clear is-tertiary' }, 
                                    'Clear'
                                ),
                            ]),       
                        ]),
                    ]),
            // )
            ]
        ),
        showColorPicker && el(Popover, {
            className: 'components-popover components-dropdown__content components-color-palette__custom-color-dropdown-content is-positioned is-alternate',
                'tabindex': "-1",

            },
                
                el(
                    'div',
                    {
                        'data-wp-c16t': true,
                        'data-wp-component': 'DropdownContentWrapper',
                        className: 'components-dropdown-content-wrapper fdb-a--f-ece-srx5m3 eovvns30',
                    }, 
                    el(
                        ColorPicker,
                        {
                            color: startValue,
                            onChangeComplete: (val) => setStartValue(val),
                            'data-wp-c16t': true,
                            'data-wp-component': 'ColorPicker',
                            className: 'components-color-picker fdb-a--f-ece-w3025k ez9hsf41',
                        },
                    
                    )
                )
            
        )
    ]                            
}

export { DuotonePanel }