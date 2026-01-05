/**
 * bKash Payment Gateway API Utilities
 * Handles token management and payment operations
 */

const BKASH_BASE_URL = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

// Token cache (in production, use Redis or similar)
let tokenCache = {
    id_token: null,
    refresh_token: null,
    expires_at: null
};

/**
 * Get authentication headers for bKash API
 */
function getHeaders(includeToken = false) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'username': process.env.BKASH_USERNAME,
        'password': process.env.BKASH_PASSWORD
    };

    if (includeToken && tokenCache.id_token) {
        headers['Authorization'] = tokenCache.id_token;
        headers['X-APP-Key'] = process.env.BKASH_APP_KEY;
    }

    return headers;
}

/**
 * Grant Token - Get access token from bKash
 */
export async function getToken() {
    // Check if we have a valid cached token
    if (tokenCache.id_token && tokenCache.expires_at && Date.now() < tokenCache.expires_at) {
        return tokenCache.id_token;
    }

    const response = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'username': process.env.BKASH_USERNAME,
            'password': process.env.BKASH_PASSWORD
        },
        body: JSON.stringify({
            app_key: process.env.BKASH_APP_KEY,
            app_secret: process.env.BKASH_APP_SECRET
        })
    });

    const data = await response.json();

    if (data.statusCode === '0000') {
        tokenCache = {
            id_token: data.id_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + (data.expires_in * 1000) - 60000 // 1 min buffer
        };
        return data.id_token;
    }

    throw new Error(`bKash Token Error: ${data.statusMessage || 'Failed to get token'}`);
}

/**
 * Create Payment - Initiate a payment request
 * @param {Object} params Payment parameters
 * @param {number} params.amount Amount in BDT
 * @param {string} params.invoiceNumber Unique invoice ID
 * @param {string} params.callbackURL URL for bKash to redirect after payment
 */
export async function createPayment({ amount, invoiceNumber, callbackURL }) {
    const token = await getToken();

    const response = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token,
            'X-APP-Key': process.env.BKASH_APP_KEY
        },
        body: JSON.stringify({
            mode: '0011', // Checkout URL mode
            payerReference: invoiceNumber,
            callbackURL: callbackURL,
            amount: amount.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: invoiceNumber
        })
    });

    const data = await response.json();

    if (data.statusCode === '0000') {
        return {
            paymentID: data.paymentID,
            bkashURL: data.bkashURL,
            invoiceNumber: invoiceNumber
        };
    }

    throw new Error(`bKash Create Payment Error: ${data.statusMessage || 'Failed to create payment'}`);
}

/**
 * Execute Payment - Confirm payment after user authorization
 * @param {string} paymentID The payment ID from create payment
 */
export async function executePayment(paymentID) {
    const token = await getToken();

    const response = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/execute`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token,
            'X-APP-Key': process.env.BKASH_APP_KEY
        },
        body: JSON.stringify({ paymentID })
    });

    const data = await response.json();

    if (data.statusCode === '0000') {
        return {
            trxID: data.trxID,
            paymentID: data.paymentID,
            amount: data.amount,
            payerReference: data.payerReference,
            customerMsisdn: data.customerMsisdn,
            transactionStatus: data.transactionStatus
        };
    }

    throw new Error(`bKash Execute Payment Error: ${data.statusMessage || 'Failed to execute payment'}`);
}

/**
 * Query Payment - Check payment status
 * @param {string} paymentID The payment ID to query
 */
export async function queryPayment(paymentID) {
    const token = await getToken();

    const response = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/payment/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token,
            'X-APP-Key': process.env.BKASH_APP_KEY
        },
        body: JSON.stringify({ paymentID })
    });

    const data = await response.json();
    return data;
}

/**
 * Refund Transaction
 * @param {Object} params Refund parameters
 * @param {string} params.paymentID Original payment ID
 * @param {string} params.trxID Transaction ID
 * @param {number} params.amount Amount to refund
 * @param {string} params.reason Refund reason
 */
export async function refundPayment({ paymentID, trxID, amount, reason = 'Customer Request' }) {
    const token = await getToken();

    const response = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/payment/refund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token,
            'X-APP-Key': process.env.BKASH_APP_KEY
        },
        body: JSON.stringify({
            paymentID,
            trxID,
            amount: amount.toString(),
            reason,
            sku: 'CVBanai-Refund'
        })
    });

    const data = await response.json();

    if (data.statusCode === '0000') {
        return {
            refundTrxID: data.refundTrxID,
            transactionStatus: data.transactionStatus,
            completedTime: data.completedTime
        };
    }

    throw new Error(`bKash Refund Error: ${data.statusMessage || 'Failed to process refund'}`);
}
