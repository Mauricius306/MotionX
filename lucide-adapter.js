// Lucide React adapter
// Creates React components from the vanilla `lucide` library (window.lucide),
// so we can use `<Home size={20} />` etc without a build step.

(function() {
  // lucide-icons library exposes `window.lucide.icons` (object: iconName → { toSvg() })
  // OR window.lucide.createIcons is the helper for data-lucide attributes.
  // We build React wrappers using the icon node data which is accessible via .icons

  function waitForLucide(cb, tries) {
    tries = tries || 0;
    if (window.lucide && (window.lucide.icons || window.lucide.createElement)) {
      cb();
    } else if (tries < 100) {
      setTimeout(() => waitForLucide(cb, tries + 1), 50);
    } else {
      console.error('Lucide failed to load');
    }
  }

  waitForLucide(function() {
    const React = window.React;
    const icons = window.lucide.icons || {};

    // Each icon node is an array/object describing SVG paths.
    // The structure in lucide@0.x is: icons.Home = [svgAttrs, [['path', {d: '...'}]]]
    // We render a generic SVG wrapper with the child elements.

    function makeIcon(iconName) {
      return function LucideIcon(props) {
        const { size = 24, color = 'currentColor', strokeWidth = 2, fill = 'none', className, style, ...rest } = props || {};
        const node = icons[iconName];
        if (!node) {
          // Missing icon — render a placeholder box so the app still works
          return React.createElement('svg', {
            width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color,
            strokeWidth: strokeWidth, className, style,
            ...rest
          }, React.createElement('rect', { x: 4, y: 4, width: 16, height: 16, rx: 2 }));
        }

        // node can be [attrs, children] or just children array depending on version
        let children;
        if (Array.isArray(node) && node.length === 2 && !Array.isArray(node[0])) {
          children = node[1];
        } else {
          children = node;
        }

        const elements = (children || []).map((child, i) => {
          if (!Array.isArray(child)) return null;
          const [tag, attrs] = child;
          return React.createElement(tag, { key: i, ...attrs });
        });

        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: fill,
          stroke: color,
          strokeWidth: strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className,
          style,
          ...rest
        }, elements);
      };
    }

    // Build the full dictionary dynamically, so every icon name works
    const LucideReact = new Proxy({}, {
      get(target, name) {
        if (typeof name !== 'string') return undefined;
        if (!target[name]) target[name] = makeIcon(name);
        return target[name];
      }
    });

    window.LucideReact = LucideReact;

    // Signal ready
    window.__LucideReactReady = true;
  });
})();
