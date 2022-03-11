/* eslint-disable @typescript-eslint/no-empty-function */

type EmptyFunction = (event: void | Event) => void;
type NotificationPermission = "default" | "denied" | "granted";
type NotificationReturn = void | NotificationPermission | Notification | Error;

interface NotificationErrorFunctions {
    onerror: EmptyFunction;
    onclick: EmptyFunction;
    onclose: EmptyFunction;
    onshow: EmptyFunction;
}

export const defaultEvents = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onerror: (): void => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onclick: (): void => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onclose: (): void => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onshow: (): void => {},
};

export function notificationsSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
}

export function getPermission(): NotificationPermission {
    return notificationsSupported() ? Notification.permission : "denied";
}

export function requestPermission(): Promise<NotificationPermission> {
    return notificationsSupported()
        ? Notification.requestPermission()
        : Promise.resolve().then(() => "denied");
}

export function showNotification(
    title: string,
    options: globalThis.NotificationOptions,
    requestOnNotify = true,
    e: NotificationErrorFunctions
): Promise<NotificationReturn> {
    if (!e.onerror) e.onerror = function() {};
    if (!e.onclick) e.onclick = function() {};
    if (!e.onclose) e.onclose = function() {};
    if (!e.onshow) e.onshow = function() {};

    return Promise.resolve()
        .then(() => {
            if (requestOnNotify && getPermission() !== "granted") {
                return requestPermission();
            }

            return getPermission();
        })
        .then((permission: NotificationPermission) => {
            if (permission === "denied") {
                return new Error("No permission to show the notification");
            }

            const bindOnError = function(event: Event | void) {
                "use strict";
                e.onerror(event);
            };
            const bindOnClick = function(event: Event) {
                "use strict";
                event.preventDefault();
                window.focus();
                e.onclick(event);
            };
            const bindOnClose = function(event: Event) {
                "use strict";
                e.onclose(event);
            };
            const bindOnShow = function(event: Event | void) {
                "use strict";
                e.onshow(event);
            };

            try {
                const notification = new Notification(title, options);
                notification.onerror = bindOnError;
                notification.onclick = bindOnClick;
                notification.onclose = bindOnClose;
                notification.onshow = bindOnShow;
                return notification;
            } catch (e) {
                if (e.name !== "TypeError") {
                    return e;
                }

                return notificationsSupported()
                    ? navigator.serviceWorker.ready
                          .then((registration) =>
                              registration.showNotification(title, options)
                          )
                          .then(bindOnShow, bindOnError)
                    : "denied";
            }
        });
}
