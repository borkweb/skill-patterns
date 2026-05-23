source "https://rubygems.org"

# Pin to GitHub Pages' Jekyll toolchain so local builds match production.
# Bundler selects the newest github-pages compatible with the local Ruby.
gem "github-pages", group: :jekyll_plugins

# webrick left Ruby's stdlib in 3.0; only needed for `jekyll serve` there.
gem "webrick", "~> 1.8" if RUBY_VERSION >= "3.0"
