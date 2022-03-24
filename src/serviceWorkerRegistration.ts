// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

declare global {
  interface Window {
    // a hook that will trigger UI events.
    onSWUpdate?: (registration: ServiceWorkerRegistration) => void;
    // only populated IF the registration has a waiting update.
    registrationWithUpdate?: ServiceWorkerRegistration;
  }
}

const SW_UPDATE_INTERVAL = 15 * 60 * 1000;

export function register() {
  if (
    /*process.env.NODE_ENV === "production" &&*/ "serviceWorker" in navigator
  ) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    const setupServiceWorker = () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkAndRegisterValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://cra.link/PWA"
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl);
      }
    };

    window.addEventListener("load", setupServiceWorker);
  }
}

export function addUpdateHook(hookFn: NonNullable<typeof window.onSWUpdate>) {
  // put the hook on
  window.onSWUpdate = hookFn;
  // and execute the hook if there's already a updateable registration!
  if (window.registrationWithUpdate) hookFn(window.registrationWithUpdate);
}

function checkAndRegisterValidServiceWorker(swUrl: string) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        console.log("Registered localhost service worker [OK]");
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

async function registerValidSW(swUrl: string) {
  // register the service worker from the file specified
  const registration = await navigator.serviceWorker.register(swUrl);

  // ensure the case when the updatefound event was missed is also handled
  // by re-invoking the prompt when there's a waiting Service Worker
  if (registration.waiting) {
    window.registrationWithUpdate = registration;
    if (window.onSWUpdate) window.onSWUpdate(registration);
  }

  // detect Service Worker update available and wait for it to become installed
  registration.addEventListener("updatefound", () => {
    if (registration.installing) {
      // wait until the new Service worker is actually installed (ready to take over)
      registration.installing.addEventListener("statechange", () => {
        if (registration.waiting) {
          // if there's an existing controller (previous Service Worker), show the prompt
          if (navigator.serviceWorker.controller) {
            window.registrationWithUpdate = registration;
            if (window.onSWUpdate) window.onSWUpdate(registration);
          } else {
            // otherwise it's the first install, nothing to do
            console.log("Service Worker initialized for the first time");
          }
        }
      });
    }
  });

  registration &&
    setInterval(() => {
      registration.update();
    }, SW_UPDATE_INTERVAL);

  let refreshing = false;

  // detect controller change and refresh the page
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
