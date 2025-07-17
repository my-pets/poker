const fs = require('fs');
const path = require('path');

const svgColors = {
    yellow: '#FFD700',
    red: '#FF0000',
    blue: '#1E90FF',
    green: '#32CD32',
    purple: '#9370DB',
};

const positions = {
    1: [[50, 50]],
    2: [
        [30, 30],
        [70, 70],
    ],
    3: [
        [30, 30],
        [50, 50],
        [70, 70],
    ],
    4: [
        [30, 30],
        [70, 30],
        [30, 70],
        [70, 70],
    ],
    5: [
        [30, 30],
        [70, 30],
        [50, 50],
        [30, 70],
        [70, 70],
    ],
    6: [
        [30, 25],
        [70, 25],
        [30, 50],
        [70, 50],
        [30, 75],
        [70, 75],
    ],
};

function createDieSvg(color, number, size = 100) {
    const xmlns = 'http://www.w3.org/2000/svg';

    const svg = createElement('svg', {
        xmlns,
        width: size.toString(),
        height: size.toString(),
        viewBox: '0 0 100 100',
    });

    svg.appendChild(
        createElement('rect', {
            x: '5',
            y: '5',
            width: '90',
            height: '90',
            rx: '15',
            ry: '15',
            fill: color,
            stroke: 'black',
            'stroke-width': '5',
        }),
    );

    positions[number].forEach(([cx, cy]) => {
        svg.appendChild(
            createElement('circle', {
                cx: cx.toString(),
                cy: cy.toString(),
                r: '7',
                fill: 'black',
            }),
        );
    });

    const serializer = new XMLSerializer();
    return `<?xml version="1.0"?>\n${serializer.serializeToString(svg)}`;
}

function createElement(tag, attributes) {
    const doc = document.implementation.createDocument(null, tag, null);
    const el = doc.documentElement;
    for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
    }
    return el;
}

const outputDir = './output';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.document = window.document;
global.XMLSerializer = window.XMLSerializer;

const svgOutputPaths = [];

for (const [colorName, hexColor] of Object.entries(svgColors)) {
    for (let num = 1; num <= 6; num++) {
        const svgCode = createDieSvg(hexColor, num);
        const filename = `${colorName}-${num}.svg`;
        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, svgCode);
        svgOutputPaths.push(filepath);
    }
}
