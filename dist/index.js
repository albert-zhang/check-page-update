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