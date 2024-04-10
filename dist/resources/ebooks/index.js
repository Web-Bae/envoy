"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/handleFeatureVisibility.ts
  function updateFeature(elementId = "feature-blog-component", pageQueryParam = "0a0a5105_page") {
    const params = new URLSearchParams(window.location.search);
    const pageValue = params.get(pageQueryParam);
    const featureEl = document.querySelector(`#${elementId}`);
    if (!featureEl) {
      console.error("Error getting feature element");
      return;
    }
    if (pageValue && parseInt(pageValue, 10) > 1) {
      featureEl.style.display = "none";
    } else {
      featureEl.style.display = "block";
    }
  }
  function handleFeatureVisibility(elementId = "feature-blog-component", pageQueryParam = "0a0a5105_page") {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsload",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listInstances) => {
        const [listInstance] = listInstances;
        updateFeature(elementId, pageQueryParam);
        listInstance.on("renderitems", (renderedItems) => {
          updateFeature(elementId, pageQueryParam);
          window.scrollTo(0, 0);
        });
      }
    ]);
  }

  // src/resources/ebooks/index.ts
  handleFeatureVisibility("feature-blog-component", "1b9f6564_page");
})();
//# sourceMappingURL=index.js.map
