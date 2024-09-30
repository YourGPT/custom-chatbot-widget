(function () {
  const cssUrl = getCssUrlfromParams();
  if (cssUrl) {
    const cssCode = `@import url(${cssUrl});`;
    appenCSSCodeToHead(cssCode);
  }
})();

function appenCSSCodeToHead(cssCode: any) {
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(cssCode));
  document.head.appendChild(styleElement);
}

function getCssUrlfromParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const cssUrl = urlParams.get("externalCss");
  return encodeURI(cssUrl || "");
}
