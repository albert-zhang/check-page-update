# check-page-update

In some Single Page Application, the entry page is generally served by a web server such as nginx, which will be cached by the browser, so the clients will not receive the update in time. But it is not good to just totally disable the cache by setting some HTTP headers because every time the client have to download the page from server.

And the `check-page-update` is to trying to make things better. It will start a HTTP get request to current page, then by checking the `last-modified` header with the value saved in localStorage, it will know whether there is an update. And if there is, reload the page. Before reloading, it will call the `callback` (which is optional) passed to `run()`, and will continue reloading only if the callback return true, so you have a chance to cancel the reloading in some special situation.

## Usage

Download `dist/index.js`, and paste to your entry page (`index.html` for example), then invoke `window.checkPageUpdate.run()`.

The script is compressed to keep the payload low.

Actually the script will try to use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) then [axios](https://github.com/axios/axios) to start a HTTP request. If your app have to work on old browsers, you need to include the axios in right place. If you are using moduling tool such as webpack, you can set the axios like this:

```javascript
import axios from 'axios';
window.axios = axios;
```

Full demo:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<script>
// NOTE: the following code may will change, check dist/index.js for the latest code
var CHECK_PAGE_UPDATE__LSK="CHECK_PAGE_UPDATE__LSK";window.checkPageUpdateClient=function(n){
return window.fetch?window.fetch(n).then(function(n){
return n.status<200||299<n.status?null:n.headers.get("last-modified")}).catch(function(){return null
}):window.axios?window.axios.get(n).then(function(n){return n.headers["last-modified"]}).catch(
function(){return null}):(console.error("[check-page-update] no suitable HTTP client"),{
then:function(n){setTimeout(function(){n(null)})}})},window.checkPageUpdate={run:function(){
var e=this,i=0<arguments.length&&void 0!==arguments[0]?arguments[0]:function(){return!0},o=this.gLM(
);window.checkPageUpdateClient(location.href).then(function(n){var t=new Date(n).getTime();isNaN(t
)||(null===o?e.sLM(t):t!==o&&(e.sLM(t),i()&&e.r()))})},gLM:function(){var n=parseInt(
localStorage.getItem(CHECK_PAGE_UPDATE__LSK),10);return isNaN(n)&&(n=null),n},sLM:function(n){
localStorage.setItem(CHECK_PAGE_UPDATE__LSK,n+"")},r:function(){location.reload(!0)}};

window.checkPageUpdate.run(function() { // the callback argument is optional
  return true; // reture false if you like to cancel the reloading
});
</script>
</body>
</html>
```
