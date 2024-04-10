window.FsCC = window.FsCC || [];
window.FsCC.push((FsCC) => {
  if (FsCC?.store?.confirmed) {
    return;
  }

  let count = 0;
  // Function to check if preferences are ready
  const checkPreferences = () => {
    if (FsCC?.preferences?.isReady()) {
      // Preferences are ready, proceed with your logic
      const { checkboxes } = FsCC.preferences.form;
      const { confirmed } = FsCC.store;
      if (!confirmed && checkboxes.size > 0) {
        for (let [_, value] of checkboxes) {
          // set default state to checked
          value.click();
        }
      }
    } else {
      // Preferences are not ready, check again after 1 second
      if (count < 10) {
        count += 1;
        setTimeout(checkPreferences, 1000);
      }
    }
  };

  // Start checking for preferences readiness
  setTimeout(checkPreferences, 0);
});
