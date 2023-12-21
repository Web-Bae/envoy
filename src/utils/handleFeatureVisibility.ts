// handles showing/hiding the feature blog component
// if the page is not the first page, it hides the feature blog component
function updateFeature(elementId = 'feature-blog-component', pageQueryParam = '0a0a5105_page') {
  const params = new URLSearchParams(window.location.search);
  const pageValue = params.get(pageQueryParam);
  const featureEl = document.querySelector<HTMLDivElement>(`#${elementId}`);
  if (!featureEl) {
    console.error('Error getting feature element');
    return;
  }
  if (pageValue && parseInt(pageValue, 10) > 1) {
    featureEl.style.display = 'none';
  } else {
    featureEl.style.display = 'block';
  }
}

export function handleFeatureVisibility(
  elementId = 'feature-blog-component',
  pageQueryParam = '0a0a5105_page'
) {
  // calls handleShowFeature() when list is paginated with CMS Load
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (listInstances: any[]) => {
      const [listInstance] = listInstances;
      updateFeature(elementId, pageQueryParam);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      listInstance.on('renderitems', (renderedItems: any[]) => {
        updateFeature(elementId, pageQueryParam);
        window.scrollTo(0, 0);
      });
    },
  ]);
}
