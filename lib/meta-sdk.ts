/**
 * Meta Facebook JavaScript SDK Wrapper for WhatsApp Embedded Signup
 * Supports official Login for Business Popup and WA_EMBEDDED_SIGNUP session message capture.
 */

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

export interface MetaSignupResult {
  code?: string;
  waba_id?: string;
  phone_number_id?: string;
}

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID || "1538356980456108";
const META_CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID || "";

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
        window.FB.init({
          appId: META_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: "v19.0",
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
export async function launchWhatsAppEmbeddedSignup(): Promise<MetaSignupResult> {
  await initMetaSDK();

  if (!window.FB) {
    throw new Error("Meta Facebook SDK is not loaded.");
  }

  return new Promise((resolve, reject) => {
    let capturedWabaId: string | undefined;
    let capturedPhoneId: string | undefined;

    // Listen for Meta Embedded Signup postMessage event
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from facebook domain or valid origins
      if (
        event.origin.includes("facebook.com") ||
        event.origin.includes("meta.com") ||
        event.origin.includes("localhost")
      ) {
        try {
          const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          if (data && data.type === "WA_EMBEDDED_SIGNUP") {
            if (data.event === "FINISH") {
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

    const loginOptions: Record<string, any> = {
      response_type: "code",
      override_default_response_type: true,
      extras: {
        feature: "whatsapp_embedded_signup",
        version: 2,
      },
    };

    if (META_CONFIG_ID) {
      loginOptions.config_id = META_CONFIG_ID;
    } else {
      // Fallback permissions if config_id is not preset
      loginOptions.scope = "whatsapp_business_management,whatsapp_business_messaging";
    }

    try {
      window.FB.login((response: any) => {
        window.removeEventListener("message", handleMessage);

        if (response?.authResponse?.code) {
          resolve({
            code: response.authResponse.code,
            waba_id: capturedWabaId,
            phone_number_id: capturedPhoneId,
          });
        } else if (response?.status === "connected" && response?.authResponse?.accessToken) {
          // In case of access token return
          resolve({
            code: response.authResponse.accessToken,
            waba_id: capturedWabaId,
            phone_number_id: capturedPhoneId,
          });
        } else {
          // User closed the popup or didn't authorize
          const errorMsg =
            response?.status === "unknown"
              ? "Login window closed before authorization."
              : "WhatsApp authorization was not granted.";
          reject(new Error(errorMsg));
        }
      }, loginOptions);
    } catch (err: any) {
      window.removeEventListener("message", handleMessage);
      reject(new Error(err?.message || "Failed to trigger Meta Login popup."));
    }
  });
}
