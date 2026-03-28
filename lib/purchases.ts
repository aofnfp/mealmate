import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

// Replace with real keys from RevenueCat dashboard before production builds
const REVENUECAT_IOS_KEY = 'appl_REPLACE_WITH_REAL_KEY';
const REVENUECAT_ANDROID_KEY = 'goog_REPLACE_WITH_REAL_KEY';

// Product identifiers configured in RevenueCat
export const ENTITLEMENT_ID = 'premium';
export const MONTHLY_PRODUCT_ID = 'focusflow_premium_monthly';
export const ANNUAL_PRODUCT_ID = 'focusflow_premium_annual';

let isConfigured = false;

export async function initPurchases(): Promise<void> {
  if (isConfigured || Platform.OS === 'web') return;

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
    await Purchases.configure({ apiKey });
    isConfigured = true;
  } catch (e) {
    console.warn('RevenueCat init failed:', e);
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!isConfigured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function purchaseMonthly(): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const offerings = await Purchases.getOfferings();
    const monthly = offerings.current?.monthly;
    if (!monthly) return false;
    const { customerInfo } = await Purchases.purchasePackage(monthly);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function purchaseAnnual(): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const offerings = await Purchases.getOfferings();
    const annual = offerings.current?.annual;
    if (!annual) return false;
    const { customerInfo } = await Purchases.purchasePackage(annual);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export function addPurchaseListener(
  callback: (info: CustomerInfo) => void
): void {
  if (!isConfigured) return;
  Purchases.addCustomerInfoUpdateListener(callback);
}
