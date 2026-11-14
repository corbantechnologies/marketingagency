/**
 * Meta Facebook JavaScript SDK Wrapper for WhatsApp Embedded Signup
 * Supports official Login for Business Popup and WA_EMBEDDED_SIGNUP session message capture.
 */

type FacebookLoginResponse = {
  authResponse?: { code?: string; accessToken?: string; [key: string]: unknown } | null;
  status?: string;
  [key: string]: unknown;
};

type FacebookSdk = {
  init: (options: Record<string, unknown>) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options?: Record<string, unknown>) => void;
  [key: string]: unknown;
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

export interface MetaSignupResult {
  code?: string;
  waba_id?: string;
  phone_number_id?: string;
  /** FINISH, FINISH_ONLY_WABA or FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING (coexistence) */
  event?: string;
}

export interface MetaSignupOptions {
  /** Keep the number on the WhatsApp Business app as well (Meta "coexistence"). */
  coexistence?: boolean;
}

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID || "28124165710618776";
const META_CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID || "";
const META_GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION || "v23.0";

/** Only accept Embedded Signup messages from Meta's own domains. */
function isMetaOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return (
      host === "facebook.com" ||
      host.endsWith(".facebook.com") ||
      host === "meta.com" ||
      host.endsWith(".meta.com")
    );
  } catch {
    return false;
  }
}

let sdkLoadingPromise: Promise<void> | null = null;

/**
 * Loads and initializes the Meta Facebook JavaScript SDK
 */
export function initMetaSDK(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Meta SDK cannot be initialized on the server."));
  }

  if (window.FB) {
    return Promise.resolve();
  }

  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      try {
        window.FB?.init({
          appId: META_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: META_GRAPH_VERSION,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    const existingScript = document.getElementById("facebook-jssdk");
    if (existingScript) {
      // Script tag exists, wait for fbAsyncInit
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      sdkLoadingPromise = null;
      reject(new Error("Failed to load Meta Facebook JavaScript SDK. Check ad-blocker or internet connection."));
    };

    document.body.appendChild(script);
  });

  return sdkLoadingPromise;
}

/**
 * Launches the Meta WhatsApp Embedded Signup modal dialog.
 * Listens for window postMessage for WABA IDs and captures the OAuth authorization code.
 */
export async function launchWhatsAppEmbeddedSignup(
  options: MetaSignupOptions = {}
): Promise<MetaSignupResult> {
  await initMetaSDK();

  if (!window.FB) {
    throw new Error("Meta Facebook SDK is not loaded.");
  }

  return new Promise((resolve, reject) => {
    let capturedWabaId: string | undefined;
    let capturedPhoneId: string | undefined;
    let capturedEvent: string | undefined;

    // Listen for Meta Embedded Signup postMessage event
    const handleMessage = (event: MessageEvent) => {
      if (isMetaOrigin(event.origin)) {
        try {
          const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          if (data && data.type === "WA_EMBEDDED_SIGNUP") {
            if (typeof data.event === "string" && data.event.startsWith("FINISH")) {
              capturedEvent = data.event;
              capturedWabaId = data.data?.waba_id;
              capturedPhoneId = data.data?.phone_number_id;
            } else if (data.event === "CANCEL") {
              window.removeEventListener("message", handleMessage);
              reject(new Error("WhatsApp Embedded Signup was cancelled by user."));
            } else if (data.event === "ERROR") {
              window.removeEventListener("message", handleMessage);
              reject(new Error(data.data?.error_message || "Meta Embedded Signup encountered an error."));
            }
          }
        } catch {
          // Ignore non-JSON postMessages
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const loginOptions: Record<string, unknown> = {
      response_type: "code",
      override_default_response_type: true,
      return_scopes: true,
    };

    const extras: Record<string, unknown> = {
      feature: "whatsapp_embedded_signup",
      version: 2,
      sessionInfoVersion: "3",
    };
    if (options.coexistence) {
      extras.featureType = "whatsapp_business_app_onboarding";
    }
    loginOptions.extras = extras;
    if (META_CONFIG_ID) {
      loginOptions.config_id = META_CONFIG_ID;
    } else {
      loginOptions.scope = "whatsapp_business_management,whatsapp_business_messaging";
    }

    // Meta can call the login callback just before the FINISH message arrives,
    // so wait briefly for the account IDs before resolving.
    const finish = (code: string) => {
      const started = Date.now();
      const check = () => {
        if (capturedWabaId || Date.now() - started > 2500) {
          window.removeEventListener("message", handleMessage);
          resolve({
            code,
            waba_id: capturedWabaId,
            phone_number_id: capturedPhoneId,
            event: capturedEvent || (options.coexistence ? "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING" : undefined),
          });
        } else {
          setTimeout(check, 150);
        }
      };
      check();
    };

    try {
      window.FB?.login((response: FacebookLoginResponse) => {
        if (response?.authResponse?.code) {
          finish(response.authResponse.code);
        } else {
          window.removeEventListener("message", handleMessage);
          // User closed the popup or didn't authorize
          const errorMsg =
            response?.status === "unknown"
              ? "Login window closed before authorization."
              : "WhatsApp authorization was not granted.";
          reject(new Error(errorMsg));
        }
      }, loginOptions);
    } catch (err) {
      window.removeEventListener("message", handleMessage);
      reject(new Error((err as Error)?.message || "Failed to trigger Meta Login popup."));
    }
  });
}
