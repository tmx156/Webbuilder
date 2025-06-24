declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: any) => void;
    snaptr?: (
      action: 'init' | 'track',
      eventName?: string,
      params?: {
        'sign_up_method'?: string;
        'uuid_c1'?: string;
        'user_email'?: string;
        'user_phone_number'?: string;
        'user_hashed_email'?: string;
        'user_hashed_phone_number'?: string;
        'firstname'?: string;
        'lastname'?: string;
        'age'?: string;
        'geo_postal_code'?: string;
      }
    ) => void;
    gtag?: any;
    dataLayer?: any[];
    visualViewport?: any;
    resizeTimeoutId?: ReturnType<typeof setTimeout>;
  }
}

export {}; 