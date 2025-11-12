# PayPal automated approval for tests

This document explains how to enable the automated PayPal approval step used by the backend tests.

## Overview

The repository contains a small helper `paypal_approver.py` that uses Playwright to open the PayPal approval URL, log in with a sandbox buyer account, and click the approval button so the server-side capture call can succeed.

## Prerequisites

- Python 3.8+
- Install Playwright and browsers:

  pip install playwright
  playwright install

- Environment variables (set these in your shell before running tests):

  export PAYPAL_TEST_BUYER_EMAIL="your-sandbox-buyer@example.com"
  export PAYPAL_TEST_BUYER_PASSWORD="buyer-password"

Optional:

- To run the browser visibly for debugging, set PAYPAL_PLAYWRIGHT_HEADLESS=0

## How it works in tests

The `test_paypal.py` test will:

1. Call `/api/create-order` and obtain the `approve` link from the order response.
2. Call `approve_paypal_approve_url(approve_url, buyer_email, buyer_password)` to open a headless Chromium, log in, and approve the order.
3. Wait a short moment and call `/api/capture-order/<order_id>` expecting a successful capture.

## Running the test

With the environment variables set and Playwright installed, run the PayPal tests only:

pytest backend/tests/tests-backend/test_paypal.py -q

## Troubleshooting

- PayPal changes its page structure sometimes. If the helper fails to find email/password fields or the approve button, update the selectors in `paypal_approver.py`.
- If your sandbox buyer needs additional steps (2FA, phone verification), create a fresh sandbox buyer in the PayPal Developer Dashboard without extra verification.

## Security note

Store sandbox credentials only in your local environment and avoid committing them to source control.
