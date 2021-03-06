## [Demo] YouTube embedded video inside Chrome extension page appears as back rectangle in Chrome 56. How can we fix it?

Issue in Chrome tracker: https://bugs.chromium.org/p/chromium/issues/detail?id=698545

## This is a [research code](https://meiert.com/en/blog/20140716/research-and-production/).


### How to reproduce:

1. Load unpacked extension in chrome://extensions/
1. Open new tab
1. Video won't load, check developer tools for logged requests

#### Request displays as cancelled in Network tab:
![request-shown-as-cancelled-in-network-panel](https://cloud.githubusercontent.com/assets/1920639/23737642/037779e0-049d-11e7-8934-9dc33a2bbd98.PNG)

#### But there is no problems if we look at request with WebRequest API:
![request-completes](https://cloud.githubusercontent.com/assets/1920639/23737663/25d8f6e4-049d-11e7-91f0-7bca6135cb67.PNG)

#### Found issue root in net-internal logs:

```
error_204
Unknown error
Error: Failed to construct 'IntersectionObserver': Unable to get root node in main frame to track.
    at new AZ (https://www.youtube.com/yts/jsbin/player-en_US-vflg9Wu9U/base.js:3691:122)
    at new V1 (https://www.youtube.com/yts/jsbin/player-en_US-vflg9Wu9U/base.js:3972:112)
    at V1.create (https://www.youtube.com/yts/jsbin/player-en_US-vflg9Wu9U/base.js:6964:333)
    at Bh.<anonymous> (https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:431:269)
    at Bh.k.mb (https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:431:308)
    at Fh (https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:429:143)
    at Bh.k.qa (https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:422:176)
    at https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:464:420
    at https://www.youtube.com/yts/jsbin/www-embed-player-vflzkmSYc/www-embed-player.js:69:63
line=Not available
level=ERROR
```

Code for embedding:
```html
<iframe width="853" height="480"
    src="https://www.youtube.com/embed/dm57RF1l0Cs?rel=0&showinfo=0" 
    frameborder="0" allowfullscreen></iframe>
```

Manifest:
```json
{
  "name": "Youtube won't play embeded videos in crome-extension [Demo]",
  "version": "1.0.0",
  "manifest_version": 2,
  "description": "Demo for encountered problem with cancelled request",
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "permissions": [
    "webRequest",
    "<all_urls>"
  ],
  "content_security_policy": "default-src 'self' https://s.ytimg.com; frame-src https://www.youtube.com;"
}
```

### Checked:
* content security policy — should be ok, worked fine month ago
* disabled all other extensions — checked on empty chrome v56 profile
* sharing url is from Share → Embed text box rom youtube
* video is loading and playing without any problems even if running from local html file
* documentation for extension don't have any info about restricting iframes inside extension pages
* protocol explicitly defined, so it isn't [an error with a protocol-relative URL](http://stackoverflow.com/q/37140814/1363799)
* build iframe with API — the same result

### Chrome versions:
* 56.0.2924.87 (64-bit) — won't play a video, request displayed as cancelled,
* 59.0.3035.0 canary (64-bit) — **will play a video**, but request displayed as cancelled

### Chromium:
* 59.0.3036.0 (Developer Build) (32-bit) — **will play a video**, but request displayed as cancelled

**Operating system:** Windows 10 Pro
