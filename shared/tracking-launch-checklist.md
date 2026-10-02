# Tracking launch checklist: Google Ads, GTM, GA4, offline sales

Version 2, 2026-10-01. Replaces the checklist given in chat on 2026-09-30. Every platform step below was checked against Google's own help pages by two independent reviews; the source page is listed as (answer/NNNN) = https://support.google.com/google-ads/answer/NNNN unless noted. Steps marked OPINION are business choices without a Google rule behind them.

## 0. Order of work

1. Owner runs `supabase db push` (migration 0019). Claude tests it.
2. Claude merges `staging` into `main` (site goes live with the new tracking code, the national-format phone number and the updated privacy policy).
3. Same day: Part A (Google Ads), then Part B (GTM), then Part C (test and publish).
4. GTM only loads on the live site (production), so Preview/testing happens on techrig.org after step 2, never on staging.

## Part A: Google Ads

### A0. Prerequisites
- Admin > Account settings > **Auto-tagging: On** (answer/3095550). Adds the click id the offline uploads depend on.
- **Call asset with call reporting** on the BOC-3 campaign, using a Google forwarding number. Required for BOTH "calls from your website" and phone-call imports: "Calls from your website: You'll need at least one call asset applied to the campaign you want to track." (answer/6275629, answer/6100664)
- Goals > Settings > **Enhanced conversions: On**, method **Google Tag Manager**, accept the Google Ads Data Processing Terms (answer/16884284). Leave "conversion-based customer lists" off unless wanted.

### A1. Conversion actions (Goals > Conversions > Summary)
Copy each new action's **Conversion label** (open action > Tag setup > Use Google Tag Manager) for Part B.

| # | Action | Create | Settings |
|---|---|---|---|
| 1 | Existing purchase action (label `On5s...`) | Edit | Rename **Quick-buy purchase**. Category Purchase. Value: use different values per conversion. Count **Every** (answer/3438531). **Primary**. |
| 2 | **USDOT lead** | New > Website > manual (GTM) | Category Submit lead form. Count **One** (answer/3438531). Primary (OPINION, owner choice: more lead signal while sales volume is low). |
| 3 | **Details submitted** | New > Website > manual (GTM) | Category Submit lead form. Count **One**. **Secondary**. |
| 4 | Calls from website (existing, label `zwzw...`) | Edit | Count **One**. Call length 60 seconds (default, answer/6100664). Primary (OPINION). |
| 5 | Calls from ads | Created by the call asset in A0 | Count One. 60 seconds. Primary (OPINION). |
| 6 | **Phone sale (offline)** (exact name) | New > Import > **Conversions from calls** | Category Purchase. Count Every. Click-through window **90 days** (max, answer/3123169, answer/7545087). Primary. |
| 7 | **Offline sale (follow-up)** (exact name) | New > Import > **Conversions from clicks** with **enhanced conversions for leads** | Goal **Converted lead** (Google best practice for EC for leads, answer/14274408). Count Every. Window 90 days, BUT EC-for-leads uploads more than **63 days** after the click are not imported (answer/15081888): upload weekly. Primary, and make sure the Converted lead goal is included in the campaign's goals (answer/11461796). |
| 8 | Old lead action (label `Lft6...`, old form.techrig.org form) | Edit | Secondary (and pause its tag in GTM). |

### A2. Bidding
- **Maximize conversions, no target** (answer/7381968). Targets (CPA/ROAS) only after there is enough data: Google evaluates Smart Bidding over periods with **at least 30 conversions** (answer/7065882).
- After launch, **no changes for 7-14 days**: "Smart Bidding strategies require a standard 7-14 day learning phase... Avoid frequent manual changes" (answer/11461796).
- OPINION for later: once volume allows, give lead actions a value and move to value-based bidding (Google describes Maximize conversion value for when values differ by conversion type, answer/7381968).

## Part B: GTM (container GTM-W7BD5J6W > Workspace)

### B1. Variables (User-Defined > New > Data Layer Variable, Version 2)
`ecommerce.value` (DLV - value) · `ecommerce.transaction_id` (DLV - transaction_id) · `ecommerce.currency` (DLV - currency) · `lead_id` (DLV - lead_id) · `service` (DLV - service) · `user_data` (DLV - user_data).
Then New > **User-Provided Data** > Manual configuration > **Code** > {{DLV - user_data}} (UPD - customer) (answer/13262500).

### B2. Triggers (New)
Custom Event `purchase` (CE - purchase) · Custom Event `quick_buy_lead` (CE - quick_buy_lead) · Custom Event `quick_buy_details_submitted` (CE - details_submitted) · **History Change** (support.google.com/tagmanager/answer/7679322, needed because the site changes pages without full reloads).

### B3. Tags
1. **Quick-buy purchase** (existing Google Ads Conversion Tracking, label `On5sCO3FxOgaENmZn-o_`): Conversion Value {{DLV - value}}, Transaction ID {{DLV - transaction_id}} (dedup, answer/6386790), Currency {{DLV - currency}}. **Restricted Data Processing: False** (it is currently bound to the user-data variable, which switches it on and blocks remarketing lists, answer/9614122). Tick **Include user-provided data** > UPD - customer. Triggering: remove the "thank-you" page-view trigger, add **CE - purchase**.
2. **USDOT lead** (new, Google Ads Conversion Tracking): Conversion ID `17134243033`, label from A1 #2, Transaction ID {{DLV - lead_id}}, trigger CE - quick_buy_lead.
3. **Details submitted** (new, Google Ads Conversion Tracking): ID `17134243033`, label from A1 #3, Transaction ID {{DLV - lead_id}}, Include user-provided data > UPD - customer, trigger CE - details_submitted.
4. **Enhanced conversions for leads** (new): tag type **Google Ads User-Provided Data Event**, Conversion ID `17134243033`, user-provided data UPD - customer, trigger **CE - details_submitted** (fires after the details form is submitted, as Google documents, answer/11347292). This lets Google match follow-up sales uploaded later.
5. **Calls from website** (existing, label `zwzwCKOcxOgaENmZn-o_`): phone number **`(917) 909-2257`**, the national format with no plus sign, exactly as the site now displays it ("use the national format of the number, without the plus sign"; "needs to have the exact digits it has on your website", answer/6095883). Triggering: remove the tel: click trigger; add **All Pages** and **History Change**.
6. GA4 `call_from_web` tag: leave as is (records Call taps on any page via GTM's link-click listener).
7. GA4 **BOC3 Purchase** tag: More settings > Ecommerce > **Send Ecommerce data**, Data source **Data Layer** (developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm).
8. **Pause**: GA4 "Compliance Form Submitted" (fires on every thank-you page view, including failed payments); GA4 `form_submit` (fires on element visibility and auto-collects user data); the old Google Ads lead tag `Lft6...`.
9. **Conversion Linker**: keep on All Pages (support.google.com/tagmanager/answer/7549390); remove the stale `*.vercel.app` hosts from its linker domains. Keep the Google Ads base tag and remarketing tag.
10. Ask whoever set up GTM whether the second GA4 property `G-20ZJTHQQP9` is still needed; all funnel events go to `G-F6N10XW3S1`.

## Part C: Test, then publish
1. GTM **Preview** (support.google.com/tagmanager/answer/6107056) on `https://techrig.org/lp/boc-3-filing/?gclid=TestClick_123456789`.
2. On page load: **Calls from website** and **Conversion Linker** fire.
3. Enter a USDOT number: under `quick_buy_lead`, **USDOT lead** fires.
4. Submit details (test email hussamdogar@gmail.com): under `quick_buy_details_submitted`, **Details submitted** and the **User-Provided Data Event** fire, with user data.
5. Pay $30 with a real card: under `purchase`, **Quick-buy purchase** fires with value 30, transaction id DGR-..., currency USD.
6. Submit > Publish ("Launch: accurate conversions + calls"). Refund the test order in Stripe.
7. 24-48 hours later: Goals > Conversions shows "Recording conversions"; check the enhanced conversions diagnostics. (A forwarding-number swap is only shown to visitors who came from an ad; Google's own pages don't document a debug switch, so judge it by "Calls from website" starting to record.)
8. GA4 (OPINION, recommended): Admin > Data streams > Define internal traffic for your office IP, and set data retention to 14 months (support.google.com/analytics/answer/10104470, /7667196).

## Part D: Weekly offline sales routine (Supabase)

Record each sale Google Ads couldn't see, the day it happens: Supabase > Table Editor > `offline_conversions` > Insert row.
- **Phone sale**: `sale_type` = phone_call, `caller_phone` and `call_started_eastern` from your phone's call log, `sold_eastern`, `value` (your fee, no government fees).
- **Follow-up sale of a website lead**: `sale_type` = website_lead, `reference_id` = the DGR-... number from the lead alert email, `sold_eastern`, `value`.
- Website orders that were paid online are NEVER entered (the database refuses them). Orders paid online whose payment settled later are added to the follow-up upload automatically.

Once a week, in Supabase > SQL Editor:
1. Phone sales: `select * from google_ads_upload_phone_sales();` > Download CSV > Google Ads > Goals > Uploads > upload as **Conversions from calls**.
2. Follow-up sales: `select * from google_ads_upload_followup_sales();` > Download CSV > Google Ads > Goals > Uploads (Data Manager) > upload as **Conversions from clicks, enhanced conversions for leads**, mapping the columns when asked. Google: "Enhanced conversions for leads only supports Google Ads Data Manager files" (answer/15081888). Check the column names against Google's current template the first time (Goals > Conversions > Uploads > View templates).
- Each function returns the file AND marks exactly those sales uploaded. It only includes sales recorded more than a day ago (Google rejects clicks under 6 hours old, answer/13321563, and may not have very recent calls, answer/6275629); newer sales wait for next week.
- To preview without marking anything: `select * from google_ads_phone_sales;` / `select * from google_ads_followup_sales;`.
- If Google rejects a row, fix it in the Table Editor and run `select retry_offline_sale('<id>');`.
- Wait at least 4 hours after creating a conversion action before its first upload (answer/6275629). Follow-up sales must be uploaded within 63 days of the ad click.
