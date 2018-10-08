// HTML文字列のサニタイスを行う（XSS対策）
exports.escapeHTML = function(s) {
    return s.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;" )
            .replace(/'/g, "&#39;" )
            .replace(/\//g, "&frasl;" );
  };
  