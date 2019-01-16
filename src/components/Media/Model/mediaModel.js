const mediaQueries = [
    {
        name: 'mobile',
        minWidth: '320px',
    },
    {
        name: 'mobileNew',
        minWidth: '360px',
    },
    {
        name: 'mobileMedium',
        minWidth: '415px',
    },
    {
        name: 'mobileLarge',
        minWidth: '568px',
    },
    {
        name: 'smallPortrait',
        minWidth: '768px',
    },
    {
        name: 'small',
        minWidth: '960px',
    },
    {
        name: 'medium',
        minWidth: '1200px',
    },
    {
        name: 'large',
        minWidth: '1500px',
    },
];

const queries = {};

function addMediaQuery(name, minWidth) {
    const mq = window.matchMedia('(min-width: ' + minWidth + ')');

    setQuery(name, mq.matches);

    mq.addListener(function(mql) {
        setQuery(name, mql.matches);
    });
}

function loadMatchMedia() {
    mediaQueries.forEach(query => {
        addMediaQuery(query.name, query.minWidth);
    });
}

function setQuery(name, isValid) {
    queries[name] = isValid;
}

export function fixIosRotation() {
    if (navigator.userAgent.match(/(iPad|iPhone)/i) !== null) {
        window.addEventListener('orientationchange', function() {
            loadMatchMedia();

            const element = document.createElement('div');
            document.body.appendChild(element);
            window.setTimeout(function() {
                element.parentNode.removeChild(element);
            }, 0);
        });
    }
}

function getCurrentBreakpoint(queriesArray) {
    queriesArray = queriesArray || mediaQueries;
    return queriesArray.reduce((largestQuery, currentMediaQuery) => {
        if (
            queries[currentMediaQuery.name] &&
            (!largestQuery ||
                parseInt(currentMediaQuery.minWidth, 10) >
                    parseInt(largestQuery.minWidth, 10))
        ) {
            largestQuery = currentMediaQuery;
        }
        return largestQuery;
    }).name;
}

export function getCurrentAvailableBreakpoint(mediaSizesArray) {
    const queriesArray = mediaQueries.filter(
        query => mediaSizesArray.indexOf(query.name) > -1
    );
    return getCurrentBreakpoint(queriesArray);
}

export default function mediaModel() {
    loadMatchMedia();
    return {
        queries,
        isDesktop: queries.small,
        isMobile: !queries.smallPortrait,
        isTablet: queries.smallPortrait,
    };
}
