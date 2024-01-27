
export const stripHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, '');
}

export const htmlEntities = {
    /**
     * Converts a string to its HTML entities.
     *
     * @param {String} str String with unescaped HTML characters
     * @returns {String} String with HTML entities
     */
    encode: (str) => {
        try {
            return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
                return '&#' + i.charCodeAt(0) + ';';
            });
        } catch (error) {
            return "";
        }
    },
    /**
     * Converts HTML entities to their corresponding characters.
     *
     * @param {String} str String with HTML entities
     * @returns {String} String with decoded HTML entities
     */
    decode: (str) => {
        try {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        } catch (error) {
            return "";
        }
    }
};