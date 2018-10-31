import { AxiosResponse, AxiosInstance } from 'axios';

declare const axios: AxiosInstance;

interface MyWindow extends Window {
  CHECK_PAGE_UPDATE__DEBUG: boolean;
  checkPageUpdate: (typeof __CheckPageUpdate);
}

declare const window: MyWindow;

const CHECK_PAGE_UPDATE__LSK = 'CHECK_PAGE_UPDATE__LSK';

interface CheckPageUpdateConfig {
  root?: string;
}

const __CheckPageUpdate = {
  run(cfg?: CheckPageUpdateConfig) {
    if (!cfg) {
      cfg = {};
    }
    if (!cfg.root) {
      cfg.root = '/';
    }
    const savedLastModifed = this.getSavedLastModified();
    axios.get(cfg.root, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }).then((r: AxiosResponse) => {
      const lastModified = new Date(r.headers['last-modified']).getTime();
      if (isNaN(lastModified)) {
        this.log('header last-modified is NaN');
        return;
      }
      if (savedLastModifed === null) {
        this.log('no savedLastModifed');
        this.saveLastModified(lastModified);
        this.log('lastModified saved: ' + lastModified);
      } else {
        if (lastModified === savedLastModifed) {
          this.log('up to date');
        } else {
          this.log('new version found, will reload');
          this.saveLastModified(lastModified);
          this.reload();
        }
      }
    });
  },

  getSavedLastModified() {
    let d: number | null = parseInt(localStorage.getItem(CHECK_PAGE_UPDATE__LSK)!, 10);
    if (isNaN(d)) {
      d = null;
    }
    return d;
  },

  saveLastModified(d: number) {
    localStorage.setItem(CHECK_PAGE_UPDATE__LSK, d + '');
  },

  reload() {
    location.reload(true);
  },

  log(str: string) {
    if (window.CHECK_PAGE_UPDATE__DEBUG === true) {
      console.log('[CHECK_PAGE_UPDATE] ' + str);
    }
  },
};

window.checkPageUpdate = __CheckPageUpdate;
