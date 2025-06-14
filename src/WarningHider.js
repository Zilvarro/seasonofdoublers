const warnbackup = console.warn;
console.warn = function filterWarnings(warning) {
    // If the warning includes any of the following text, let's hide it.
    const supressedWarnings = [
        "Warning: componentWillMount has been renamed, and is not recommended for use.",
        "Warning: componentWillReceiveProps has been renamed, and is not recommended for use.",
        "Warning: componentWillUpdate has been renamed, and is not recommended for use.",
    ];

    if (warning.length && !supressedWarnings.some(entry => warning.includes(entry))) {
        warnbackup.apply(console, arguments);
    }
};

const infobackup = console.info;
console.info = function filterInfos(info) {
    // If the info includes any of the following text, let's hide it.
    const supressedInfos = [
        "Download the React DevTools",
    ];

    if (info.length && !supressedInfos.some(entry => info.includes(entry))) {
        infobackup.apply(console, arguments);
    }
};