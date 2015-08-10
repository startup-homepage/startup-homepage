var evaluate = require('eval');
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

function StaticSiteGeneratorWebpackPlugin(renderSourcePath, routes, locals) {
  this.renderSourcePath = renderSourcePath;
  this.routes = Array.isArray(routes) ? routes : [routes];
  this.locals = locals;
  this.options = {};
}

StaticSiteGeneratorWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('emit', function(compilation, done) {
    var renderPromises;

    try {

      var webpackStatsJson = compilation.getStats().toJson();
      var assets = self.htmlWebpackPluginAssets(compilation, webpackStatsJson);


      var source = compilation.assets[self.renderSourcePath].source();
      var render = evaluate(source, /* filename: */ undefined, /* scope: */ undefined, /* includeGlobals: */ true);

      renderPromises = self.routes.map(function(route) {

        var outputFileName = path.join(route, '/index.html');

        return Promise
          .fromNode(render.bind(null, route, {title:route}))
          .then(function(output) {
            output = injectAssetsIntoHtml(output, assets);
            compilation.assets[outputFileName] = createAssetFromContents(output);
          });
      });

      Promise.all(renderPromises).nodeify(done);
    } catch (err) {
      done(err);
    }
  });
};



var createAssetFromContents = function(contents) {
  return {
    source: function() {
      return contents;
    },
    size: function() {
      return contents.length;
    }
  };
};

var injectAssetsIntoHtml = function(html, assets) {

  var chunks = Object.keys(assets.chunks);

  // Gather all css and script files
  var styles = [];
  var scripts = [];
  chunks.forEach(function(chunkName) {
    styles = styles.concat(assets.chunks[chunkName].css);
    scripts.push(assets.chunks[chunkName].entry);
  });
  // Turn script files into script tags
  scripts = scripts.map(function(scriptPath) {
    return '<script src="' + scriptPath + '"></script>';
  });
  // Turn css files into link tags
  styles = styles.map(function(stylePath) {
    return '<link href="' + stylePath + '" rel="stylesheet">';
  });
  // Injections
  var head = [];
  var body = [];

  // If there is a favicon present, add it to the head
  if (assets.favicon) {
    head.push('<link rel="shortcut icon" href="' + assets.favicon + '">');
  }
  // Add styles to the head
  head = head.concat(styles);
  // Add scripts to body or head
  body = body.concat(scripts);
  // Append assets to head element
  html = html.replace(/(<\/head>)/i, function (match) {
    return head.join('') + match;
  });
  // Append assets to body element
    html = html.replace(/(<\/body>)/i, function (match) {
      return body.join('') + match;
    });
  // Inject manifest into the opening html tag
  if (assets.manifest) {
    html = html.replace(/(<html[^>]*)(>)/i, function (match, start, end) {
      // Append the manifest only if no manifest was specified
      if (/\smanifest\s*=/.test(match)) {
        return match;
      }
      return start + ' manifest="' + assets.manifest + '"' + end;
    });
  }
  return html;
};

StaticSiteGeneratorWebpackPlugin.prototype.htmlWebpackPluginAssets = function(compilation, webpackStatsJson) {

  var self = this;

  // Use the configured public path or build a relative path
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined' ?
      compilation.options.output.publicPath :
      path.relative(path.dirname(self.options.filename), '.');

  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
    publicPath += '/';
  }

  var assets = {
    // Will contain all js & css files by chunk
    chunks: {},
    // Will contain all js files
    js: [],
    // Will contain all css files
    css: [],
    // Will contain the path to the favicon if it exists
    favicon: self.options.favicon ? publicPath + path.basename(self.options.favicon): undefined,
    // Will contain the html5 appcache manifest files if it exists
    manifest: Object.keys(compilation.assets).filter(function(assetFile){
      return path.extname(assetFile) === '.appcache';
    })[0]
  };

  // Append a hash for cache busting
  if (this.options.hash) {
    assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
    assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
  }

  var chunks = webpackStatsJson.chunks.sort(function orderEntryLast(a, b) {
    if (a.entry !== b.entry) {
      return b.entry ? 1 : -1;
    } else {
      return b.id - a.id;
    }
  });

  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chunkName = chunk.names[0];

    // This chunk doesn't have a name. This script can't handled it.
    if(chunkName === undefined) {
      continue;
    }

    assets.chunks[chunkName] = {};

    // Prepend the public path to all chunk files
    var chunkFiles = [].concat(chunk.files).map(function(chunkFile) {
      return publicPath + chunkFile;
    });

    // Append a hash for cache busting
    if (this.options.hash) {
      chunkFiles = chunkFiles.map(function(chunkFile) {
        return self.appendHash(chunkFile, webpackStatsJson.hash);
      });
    }

    // Webpack outputs an array for each chunk when using sourcemaps
    // But we need only the entry file
    var entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.js.push(entry);

    // Gather all css files
    var css = chunkFiles.filter(function(chunkFile){
      // Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
      // We must proper handle such cases, so we use regexp testing here
      return /^.css($|\?)/.test(path.extname(chunkFile));
    });
    assets.chunks[chunkName].css = css;
    assets.css = assets.css.concat(css);
  }

  // Duplicate css assets can occur on occasion if more than one chunk
  // requires the same css.
  assets.css = _.uniq(assets.css);

  return assets;
};

module.exports = StaticSiteGeneratorWebpackPlugin;
