"use strict";var CHECK_PAGE_UPDATE__LSK="CHECK_PAGE_UPDATE__LSK";var __CheckPageUpdate={run:function run(cfg){var _this=this;if(!cfg){cfg={}}if(!cfg.root){cfg.root="/"}var savedLastModifed=this.getSavedLastModified();axios.get(cfg.root,{headers:{"Cache-Control":"no-cache, no-store, must-revalidate"}}).then(function(r){var lastModified=new Date(r.headers["last-modified"]).getTime();if(isNaN(lastModified)){_this.log("header last-modified is NaN");return}if(savedLastModifed===null){_this.log("no savedLastModifed");_this.saveLastModified(lastModified);_this.log("lastModified saved: "+lastModified)}else{if(lastModified===savedLastModifed){_this.log("up to date")}else{_this.log("new version found, will reload");_this.saveLastModified(lastModified);_this.reload()}}})},getSavedLastModified:function getSavedLastModified(){var d=parseInt(localStorage.getItem(CHECK_PAGE_UPDATE__LSK),10);if(isNaN(d)){d=null}return d},saveLastModified:function saveLastModified(d){localStorage.setItem(CHECK_PAGE_UPDATE__LSK,d+"")},reload:function reload(){location.reload(true)},log:function log(str){if(window.CHECK_PAGE_UPDATE__DEBUG===true){console.log("[CHECK_PAGE_UPDATE] "+str)}}};window.checkPageUpdate=__CheckPageUpdate;