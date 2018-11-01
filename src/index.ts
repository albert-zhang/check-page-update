import { AxiosResponse, AxiosInstance } from 'axios';

interface MyWindow extends Window {
  CHECK_PAGE_UPDATE__DEBUG: boolean;
  checkPageUpdate: any;
  axios?: AxiosInstance;
  checkPageUpdateClient: (url: string) => Promise<string | null>;
}

declare const window: MyWindow;

type Callback = () => boolean;

const CHECK_PAGE_UPDATE__LSK = 'CHECK_PAGE_UPDATE__LSK';

window.checkPageUpdateClient = (url: string) => {
  if (window.fetch) {
    return window.fetch(url).then((r: Response) => {
      if (r.status < 200 || r.status > 299) {
        return null;
      }
      return r.headers.get('last-modified');
    }).catch(() => {
      return null;
    });
  } else if (window.axios) {
    return window.axios!.get(url).then((r: AxiosResponse) => {
      return r.headers['last-modified'];
    }).catch(() => {
      return null;
    });
  } else {
    console.error('[check-page-update] no suitable HTTP client');
    return ({
      then(handler: (...args: any[]) => any) {
        setTimeout(() => {
          handler(null);
        });
      },
    }) as Promise<null>;
  }
};

window.checkPageUpdate = {
  run(callback: Callback = () => true) {
    const savedLastModifed = this.gLM();
    window.checkPageUpdateClient(location.href).then((dt: string | null) => {
      const lastModified = new Date(dt!).getTime();
      if (isNaN(lastModified)) {
        return;
      }
      if (savedLastModifed === null) {
        this.sLM(lastModified);
      } else {
        if (lastModified !== savedLastModifed) {
          this.sLM(lastModified);
          if (callback()) {
            this.r();
          }
        }
      }
    });
  },

  gLM() {
    let d: number | null = parseInt(localStorage.getItem(CHECK_PAGE_UPDATE__LSK)!, 10);
    if (isNaN(d)) {
      d = null;
    }
    return d;
  },

  sLM(d: number) {
    localStorage.setItem(CHECK_PAGE_UPDATE__LSK, d + '');
  },

  r() {
    location.reload(true);
  },
};
